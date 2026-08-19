'use server';

import { env } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateOrderAccessToken, hashOrderAccessToken } from '@/lib/security/order-access-token';
import { cookies } from 'next/headers';

export interface CheckoutResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
}

export async function submitMultiCartCheckout(
  items: { variant_id: string; quantity: number }[],
  recipientEmail: string,
  confirmEmail: string,
  idempotencyKey: string,
  acceptedTerms: boolean,
  voucherCode?: string
): Promise<CheckoutResult> {
  try {
    // 1. Feature flag check
    if (!env.CHECKOUT_ENABLED) {
      return { success: false, error: 'Checkout sedang dipersiapkan. Silakan kembali lagi nanti.' };
    }

    // 2. Input validation
    if (!items || items.length === 0) {
      return { success: false, error: 'Keranjang belanja kosong.' };
    }
    if (!recipientEmail || !confirmEmail) {
      return { success: false, error: 'Email harus diisi.' };
    }
    const emailTrimmed = recipientEmail.trim().toLowerCase();
    const confirmTrimmed = confirmEmail.trim().toLowerCase();
    
    if (emailTrimmed !== confirmTrimmed) {
      return { success: false, error: 'Konfirmasi email belum sama.' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return { success: false, error: 'Format email tidak valid.' };
    }
    
    if (!acceptedTerms) {
      return { success: false, error: 'Anda harus menyetujui syarat & ketentuan.' };
    }

    // 3. Create Order via RPC (bypass RLS for guest order creation)
    const adminClient = createAdminClient();
    
    // Attempt to get current user if logged in
    const { data: { user } } = await adminClient.auth.getUser();
    
    const payload = {
      items,
      customer_id: user?.id || null,
      recipient_email: emailTrimmed,
      idempotency_key: idempotencyKey,
      reservation_minutes: env.ORDER_RESERVATION_MINUTES,
      voucher_code: voucherCode || null
    };

    const { data: rpcData, error: rpcError } = await adminClient.rpc('create_multi_item_order', {
      p_payload: payload
    });

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      throw new Error(rpcError.message);
    }

    if (!rpcData || !rpcData.success) {
      return { success: false, error: 'Gagal membuat pesanan. Silakan coba kembali.' };
    }

    const orderId = rpcData.order_id;
    const orderNumber = rpcData.order_number;
    const isExisting = rpcData.is_existing;

    // 4. Generate Order Access Token (only if not existing order idempotency hit)
    if (!isExisting) {
      const rawToken = generateOrderAccessToken();
      const tokenHash = await hashOrderAccessToken(rawToken);
      
      const tokenTtlDays = env.ORDER_ACCESS_TOKEN_TTL_DAYS || 90;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + tokenTtlDays);

      // 5. Save Token Hash to database
      const { error: tokenError } = await adminClient.from('order_access_tokens').insert({
        order_id: orderId,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString()
      });
      
      if (tokenError) {
        return { success: false, error: 'Gagal menghasilkan token akses pesanan. Silakan coba kembali.' };
      }

      // 6. Set HttpOnly Cookie for guest access
      const cookieStore = await cookies();
      cookieStore.set(`beliakun_guest_order_${orderNumber}`, rawToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: `/pesanan/${orderNumber}`,
        maxAge: tokenTtlDays * 24 * 60 * 60 // seconds
      });
    }
    
    return { success: true, orderNumber };
    
  } catch (error: any) {
    console.error('Checkout error:', error);
    
    // Determine safe error message
    let errorMessage = 'Pesanan belum dapat dibuat. Silakan coba kembali beberapa saat lagi.';
    
    if (error.message?.includes('Out of stock')) {
      errorMessage = 'Sebagian stok paket baru saja habis. Silakan periksa kembali keranjang Anda.';
    } else if (error.message?.includes('Variant not found')) {
      errorMessage = 'Sebagian paket sudah tidak tersedia.';
    }
    
    return { success: false, error: errorMessage };
  }
}
