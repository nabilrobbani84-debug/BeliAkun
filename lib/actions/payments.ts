'use server';

import { env } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPaymentByOrderId, createPaymentRecord, updatePaymentRecord, recordPaymentEvent, settlePaidPaymentRPC, settleExpiredPaymentRPC } from '@/lib/data/payments';
import { getPaymentProvider } from '@/lib/payments/provider';
import { hashSignature } from '@/lib/payments/klikqris/signature';
import { hashOrderAccessToken } from '@/lib/security/order-access-token';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Verifikasi apakah client memiliki hak akses guest ke order tertentu
 */
async function verifyGuestAccess(orderId: string, orderNumber: string): Promise<boolean> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(`beliakun_guest_order_${orderNumber}`)?.value;
  if (!rawToken) return false;
  
  const tokenHash = await hashOrderAccessToken(rawToken);
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('order_access_tokens')
    .select('id')
    .eq('order_id', orderId)
    .eq('token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .is('revoked_at', null)
    .single();
    
  return !error && !!data;
}

export interface InitPaymentResult {
  success: boolean;
  qrisUrl?: string;
  amountPayable?: number;
  uniqueAmount?: number;
  expiresAt?: string;
  signature?: string;
  error?: string;
}

/**
 * Inisialisasi transaksi pembayaran KlikQRIS untuk suatu pesanan
 */
export async function initializeKlikQrisPayment(orderId: string): Promise<InitPaymentResult> {
  try {
    if (!env.CHECKOUT_ENABLED) {
      return { success: false, error: 'Checkout sedang dinonaktifkan.' };
    }
    if (!env.KLIKQRIS_ENABLED) {
      return { success: false, error: 'Sistem pembayaran KlikQRIS sedang dinonaktifkan.' };
    }

    const adminClient = createAdminClient();

    // 1. Fetch order data
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }

    // 2. Authorization check
    const isGuestAuthorized = await verifyGuestAccess(order.id, order.order_number);
    // Kita juga bisa izinkan jika admin yang memicu (untuk sync dll, tapi init hanya oleh guest)
    if (!isGuestAuthorized) {
      return { success: false, error: 'Akses ditolak. Anda tidak berwenang atas pesanan ini.' };
    }

    if (order.status !== 'pending_payment') {
      return { success: false, error: `Pesanan sudah tidak berada dalam status menunggu pembayaran (status: ${order.status}).` };
    }

    // Check if order internal reservation is expired
    if (order.reservation_expires_at && new Date(order.reservation_expires_at) <= new Date()) {
      return { success: false, error: 'Batas waktu pembayaran pesanan ini telah habis. Silakan buat pesanan baru.' };
    }

    // 3. Check for existing payment
    const existingPayment = await getPaymentByOrderId(orderId);
    if (existingPayment) {
      if (existingPayment.status === 'pending') {
        return {
          success: true,
          qrisUrl: existingPayment.qris_url,
          amountPayable: existingPayment.amount_payable,
          uniqueAmount: existingPayment.unique_amount,
          expiresAt: existingPayment.provider_expires_at || undefined,
        };
      } else if (existingPayment.status === 'paid') {
        return { success: false, error: 'Pesanan sudah lunas terbayar.' };
      } else if (existingPayment.status === 'expired') {
        return { success: false, error: 'Pembayaran tagihan ini sudah kedaluwarsa.' };
      }
    }

    // 4. Call KlikQRIS API
    const provider = getPaymentProvider('klikqris');
    
    // Create description
    const keterangan = `Pembayaran Pesanan ${order.order_number}`;

    const createRes = await provider.createTransaction({
      orderId: order.id,
      orderNumber: order.order_number,
      amount: order.grand_total,
      keterangan,
    });

    if (!createRes.success) {
      return { success: false, error: createRes.error || 'Gagal menghasilkan tagihan QRIS.' };
    }

    // 5. Hash signature for security verification on webhook
    const providerSignatureHash = await hashSignature(createRes.signature);

    // 6. Record payment in local DB
    const payment = await createPaymentRecord({
      orderId: order.id,
      provider: 'klikqris',
      providerMode: env.KLIKQRIS_DRIVER,
      providerOrderId: createRes.providerOrderId,
      amountRequested: order.grand_total,
      amountPayable: createRes.amountPayable,
      uniqueAmount: createRes.uniqueAmount,
      providerSignatureHash,
      qrisUrl: createRes.qrisUrl,
      directUrl: createRes.directUrl,
      providerExpiresAt: createRes.expiresAt,
    });

    // 7. Sync order and inventory expiration to provider expiration
    if (createRes.expiresAt) {
      const providerExpiryIso = new Date(createRes.expiresAt).toISOString();
      
      // Update order
      await adminClient
        .from('orders')
        .update({ reservation_expires_at: providerExpiryIso })
        .eq('id', order.id);
        
      // Update inventory_items reserved until
      await adminClient
        .from('inventory_items')
        .update({ reserved_until: providerExpiryIso })
        .eq('reserved_order_id', order.id);
    }

    // 8. Log Event
    const eventFingerprint = await hashSignature(`create_${payment.id}_${createRes.amountPayable}`);
    await recordPaymentEvent({
      paymentId: payment.id,
      orderId: order.id,
      provider: 'klikqris',
      providerOrderId: createRes.providerOrderId,
      source: 'create',
      eventType: 'payment_initialized',
      eventFingerprint,
      processingStatus: 'processed',
      providerStatus: 'PENDING',
      sanitizedPayload: createRes,
    });

    revalidatePath(`/pesanan/${order.order_number}`);

    return {
      success: true,
      qrisUrl: createRes.qrisUrl,
      amountPayable: createRes.amountPayable,
      uniqueAmount: createRes.uniqueAmount,
      expiresAt: createRes.expiresAt,
      signature: createRes.signature,
    };
  } catch (error: any) {
    console.error('Inisialisasi pembayaran gagal:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan sistem.' };
  }
}

/**
 * Sinkronisasi status pembayaran dari KlikQRIS API (diinisiasi oleh Tamu/Guest)
 */
export async function syncGuestPaymentStatus(orderNumber: string): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    const adminClient = createAdminClient();
    
    // Fetch order
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();
      
    if (orderError || !order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }
    
    // Auth check
    const isGuestAuthorized = await verifyGuestAccess(order.id, order.order_number);
    if (!isGuestAuthorized) {
      return { success: false, error: 'Akses ditolak.' };
    }

    const payment = await getPaymentByOrderId(order.id);
    if (!payment) {
      return { success: false, error: 'Belum ada data pembayaran untuk pesanan ini.' };
    }

    // Rate limit check: PAYMENT_STATUS_SYNC_INTERVAL_SECONDS
    const now = new Date();
    if (payment.last_synced_at) {
      const lastSync = new Date(payment.last_synced_at);
      const diffSec = (now.getTime() - lastSync.getTime()) / 1000;
      if (diffSec < env.PAYMENT_STATUS_SYNC_INTERVAL_SECONDS) {
        return { success: true, status: payment.status }; // Return current status without sync to prevent rate limit
      }
    }

    // Fetch status from provider
    const provider = getPaymentProvider('klikqris');
    const statusRes = await provider.getTransactionStatus(payment.provider_order_id);
    
    if (!statusRes.success) {
      return { success: false, error: statusRes.error || 'Gagal memverifikasi status ke KlikQRIS.' };
    }

    // Generate fingerprint for sync event
    const fingerprint = await hashSignature(`sync_${payment.id}_${statusRes.status}_${now.getTime()}`);

    // Update sync timestamp
    await updatePaymentRecord(payment.id, { last_synced_at: now.toISOString() });

    // Handle transition
    if (statusRes.status === 'paid') {
      // Settle
      const settled = await settlePaidPaymentRPC(payment.id, fingerprint);
      
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId: order.id,
        provider: 'klikqris',
        providerOrderId: payment.provider_order_id,
        source: 'status_sync',
        eventType: 'payment_sync_paid',
        eventFingerprint: fingerprint,
        processingStatus: settled ? 'processed' : 'failed',
        providerStatus: 'PAID',
        sanitizedPayload: statusRes.rawResponse,
      });
      
    } else if (statusRes.status === 'expired') {
      await settleExpiredPaymentRPC(payment.id);
      
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId: order.id,
        provider: 'klikqris',
        providerOrderId: payment.provider_order_id,
        source: 'status_sync',
        eventType: 'payment_sync_expired',
        eventFingerprint: fingerprint,
        processingStatus: 'processed',
        providerStatus: 'EXPIRED',
        sanitizedPayload: statusRes.rawResponse,
      });
    }

    revalidatePath(`/pesanan/${orderNumber}`);
    
    // Re-fetch current payment status
    const updatedPayment = await getPaymentByOrderId(order.id);
    return { success: true, status: updatedPayment?.status };
    
  } catch (error: any) {
    console.error('Sinkronisasi status pembayaran gagal:', error);
    return { success: false, error: error.message || 'Gagal menyinkronkan status.' };
  }
}

/**
 * Sinkronisasi status pembayaran yang diinisiasi oleh Admin
 */
export async function syncAdminPaymentStatus(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    
    // Auth check - Server Action automatically has session in headers
    // We will verify if requester is admin
    const { data: { user } } = await adminClient.auth.getUser();
    if (!user) {
      return { success: false, error: 'Akses ditolak.' };
    }
    
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      return { success: false, error: 'Akses khusus administrator.' };
    }

    const payment = await getPaymentByOrderId(orderId);
    if (!payment) {
      return { success: false, error: 'Belum ada data pembayaran.' };
    }

    const provider = getPaymentProvider('klikqris');
    const statusRes = await provider.getTransactionStatus(payment.provider_order_id);
    
    if (!statusRes.success) {
      return { success: false, error: statusRes.error };
    }

    const now = new Date();
    const fingerprint = await hashSignature(`admin_sync_${payment.id}_${statusRes.status}_${now.getTime()}`);

    await updatePaymentRecord(payment.id, { last_synced_at: now.toISOString() });

    if (statusRes.status === 'paid') {
      const settled = await settlePaidPaymentRPC(payment.id, fingerprint, user.id);
      
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId,
        provider: 'klikqris',
        providerOrderId: payment.provider_order_id,
        source: 'admin_sync',
        eventType: 'payment_admin_sync_paid',
        eventFingerprint: fingerprint,
        processingStatus: settled ? 'processed' : 'failed',
        providerStatus: 'PAID',
        sanitizedPayload: statusRes.rawResponse,
      });
    } else if (statusRes.status === 'expired') {
      await settleExpiredPaymentRPC(payment.id, user.id);
      
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId,
        provider: 'klikqris',
        providerOrderId: payment.provider_order_id,
        source: 'admin_sync',
        eventType: 'payment_admin_sync_expired',
        eventFingerprint: fingerprint,
        processingStatus: 'processed',
        providerStatus: 'EXPIRED',
        sanitizedPayload: statusRes.rawResponse,
      });
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
    
  } catch (error: any) {
    console.error('Admin status sync error:', error);
    return { success: false, error: error.message || 'Gagal menyinkronkan status.' };
  }
}
