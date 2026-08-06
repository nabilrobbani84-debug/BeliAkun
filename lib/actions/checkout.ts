'use server';

import { env } from '@/lib/env';
import { createGuestOrder } from '@/lib/data/orders';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateOrderAccessToken, hashOrderAccessToken } from '@/lib/security/order-access-token';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface CheckoutResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
}

export async function submitGuestCheckout(
  variantId: string,
  recipientEmail: string,
  confirmEmail: string,
  idempotencyKey: string,
  acceptedTerms: boolean
): Promise<CheckoutResult> {
  try {
    // 1. Feature flag check
    if (!env.CHECKOUT_ENABLED) {
      return { success: false, error: 'Checkout sedang dipersiapkan. Silakan kembali lagi nanti.' };
    }

    // 2. Input validation
    if (!variantId) {
      return { success: false, error: 'Produk/Paket tidak valid.' };
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

    // 3. Create Order via Data Access Layer
    const orderResult = await createGuestOrder(
      variantId,
      emailTrimmed,
      idempotencyKey,
      env.ORDER_RESERVATION_MINUTES
    );
    
    if (!orderResult.success || !orderResult.order_id) {
      return { success: false, error: 'Gagal membuat pesanan. Silakan coba kembali.' };
    }

    const orderId = orderResult.order_id;
    const orderNumber = orderResult.order_number;

    // 4. Generate Order Access Token
    const rawToken = generateOrderAccessToken();
    const tokenHash = await hashOrderAccessToken(rawToken);
    
    const tokenTtlDays = env.ORDER_ACCESS_TOKEN_TTL_DAYS || 90;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tokenTtlDays);

    // 5. Save Token Hash to database (using admin client to bypass RLS)
    const adminClient = createAdminClient();
    const { error: tokenError } = await adminClient.from('order_access_tokens').insert({
      order_id: orderId,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString()
    });
    
    if (tokenError) {
      // In a real scenario we might want to log this or cancel the order.
      // But let's fail gracefully and ask user to retry, because they won't be able to access the order without cookie.
      return { success: false, error: 'Gagal menghasilkan token akses pesanan. Silakan coba kembali.' };
    }

    // 6. Set HttpOnly Cookie for guest access
    const cookieStore = await cookies();
    // Save in format: orderNumber:rawToken (this format helps client to know which order it can access)
    // Actually, storing just rawToken is better, the server checks the hash.
    // If we want multiple orders, we might need a JSON array. But for Step 4, let's keep it simple.
    cookieStore.set(`beliakun_guest_order_${orderNumber}`, rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: `/pesanan/${orderNumber}`,
      maxAge: tokenTtlDays * 24 * 60 * 60 // seconds
    });
    
    // We will do redirect on client side so we return success true
    return { success: true, orderNumber };
    
  } catch (error: any) {
    console.error('Checkout error:', error);
    
    // Determine safe error message
    let errorMessage = 'Pesanan belum dapat dibuat. Silakan coba kembali beberapa saat lagi.';
    
    if (error.message?.includes('Out of stock')) {
      errorMessage = 'Stok untuk paket ini baru saja habis. Silakan pilih paket lain atau coba kembali nanti.';
    } else if (error.message?.includes('Variant not found')) {
      errorMessage = 'Paket ini sudah tidak tersedia.';
    }
    
    return { success: false, error: errorMessage };
  }
}
