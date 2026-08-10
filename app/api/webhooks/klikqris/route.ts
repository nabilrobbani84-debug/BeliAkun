import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPaymentByOrderId, recordPaymentEvent, isEventFingerprintProcessed, settlePaidPaymentRPC, settleExpiredPaymentRPC, updatePaymentRecord } from '@/lib/data/payments';
import { triggerAutoFulfillment } from '@/lib/data/fulfillments';
import { getPaymentProvider } from '@/lib/payments/provider';
import { hashSignature, verifySignatureHash } from '@/lib/payments/klikqris/signature';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let payload: any = null;
  let providerOrderId = 'UNKNOWN';
  let eventFingerprint = 'UNKNOWN';
  
  try {
    // 1. Basic request checks
    if (!env.KLIKQRIS_ENABLED) {
      return NextResponse.json({ error: 'Webhook disabled' }, { status: 400 });
    }

    // Limit body size (NextJS handles JSON body parsing safely, but we can verify text length)
    const textBody = await req.text();
    if (textBody.length > 50000) { // 50KB limit for webhook payload
      return NextResponse.json({ error: 'Payload too large' }, { status: 400 });
    }
    
    try {
      payload = JSON.parse(textBody);
    } catch (_) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // 2. Parse payload using adapter
    const provider = getPaymentProvider('klikqris');
    let parsedEvent;
    try {
      parsedEvent = provider.parseWebhook(payload);
    } catch (parseErr: any) {
      console.error('Failed to parse KlikQRIS webhook payload:', parseErr);
      return NextResponse.json({ error: parseErr.message || 'Payload validation failed' }, { status: 400 });
    }

    providerOrderId = parsedEvent.providerOrderId;

    // 3. Find existing payment record in DB
    const adminClient = createAdminClient();
    const { data: payment, error: paymentError } = await adminClient
      .from('payments')
      .select('*')
      .eq('provider_order_id', providerOrderId)
      .maybeSingle();

    if (paymentError || !payment) {
      // Record failed event for unknown order
      eventFingerprint = await hashSignature(`unknown_order_${providerOrderId}_${parsedEvent.status}_${startTime}`);
      await recordPaymentEvent({
        paymentId: null,
        orderId: null,
        provider: 'klikqris',
        providerOrderId,
        source: 'webhook',
        eventType: 'unknown_order_received',
        eventFingerprint,
        processingStatus: 'rejected',
        providerStatus: parsedEvent.status,
        sanitizedPayload: payload,
        errorCode: 'ORDER_NOT_FOUND',
      });
      
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // 4. Create event fingerprint for idempotency
    // SHA256 of provider + providerOrderId + normalizedStatus + signatureHash + amountPayable
    const callbackSigHash = await hashSignature(parsedEvent.signature);
    eventFingerprint = await hashSignature(
      `klikqris_${providerOrderId}_${parsedEvent.status}_${callbackSigHash}_${parsedEvent.amountPaid}`
    );

    // Check if duplicate fingerprint already processed
    const isProcessed = await isEventFingerprintProcessed('klikqris', eventFingerprint);
    if (isProcessed) {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    // 5. Signature validation
    const isSignatureValid = verifySignatureHash(payment.provider_signature_hash, callbackSigHash);
    if (!isSignatureValid) {
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId: payment.order_id,
        provider: 'klikqris',
        providerOrderId,
        source: 'webhook',
        eventType: 'signature_mismatch',
        eventFingerprint,
        processingStatus: 'rejected',
        providerStatus: parsedEvent.status,
        sanitizedPayload: payload,
        errorCode: 'SIGNATURE_MISMATCH',
      });
      return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
    }

    // 6. Merchant ID validation (if available in webhook)
    if (parsedEvent.merchantId && parsedEvent.merchantId !== env.KLIKQRIS_MERCHANT_ID) {
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId: payment.order_id,
        provider: 'klikqris',
        providerOrderId,
        source: 'webhook',
        eventType: 'merchant_mismatch',
        eventFingerprint,
        processingStatus: 'rejected',
        providerStatus: parsedEvent.status,
        sanitizedPayload: payload,
        errorCode: 'MERCHANT_MISMATCH',
      });
      return NextResponse.json({ error: 'Merchant ID mismatch' }, { status: 400 });
    }

    // 7. Get associated order
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*')
      .eq('id', payment.order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 400 });
    }

    // 8. Processing status transitions
    if (parsedEvent.status === 'paid') {
      
      // Amount validation
      if (parsedEvent.amountPaid !== payment.amount_payable) {
        // Mismatch! Move to review.
        await updatePaymentRecord(payment.id, { status: 'review' });
        
        await adminClient
          .from('orders')
          .update({
            status: 'payment_review',
            requires_payment_review: true,
            payment_review_reason: `Nominal callback berbeda. Pembayar membayar Rp ${parsedEvent.amountPaid.toLocaleString('id-ID')} sedangkan tagihan sebesar Rp ${payment.amount_payable.toLocaleString('id-ID')}.`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        await adminClient.from('order_events').insert({
          order_id: order.id,
          event_type: 'payment_review_triggered',
          previous_status: order.status,
          new_status: 'payment_review',
          summary: 'Review dipicu karena ketidaksesuaian nominal pembayaran.',
        });

        await recordPaymentEvent({
          paymentId: payment.id,
          orderId: order.id,
          provider: 'klikqris',
          providerOrderId,
          source: 'webhook',
          eventType: 'payment_amount_mismatch',
          eventFingerprint,
          processingStatus: 'processed',
          providerStatus: 'PAID',
          sanitizedPayload: payload,
        });

        revalidatePath(`/pesanan/${order.order_number}`);
        return NextResponse.json({ received: true, reviewRequired: true }, { status: 200 });
      }

      // Check if order is already cancelled/expired
      if (order.status === 'expired' || order.status === 'cancelled') {
        // Late payment! Move to review.
        await updatePaymentRecord(payment.id, { status: 'review' });
        
        await adminClient
          .from('orders')
          .update({
            status: 'payment_review',
            requires_payment_review: true,
            payment_review_reason: 'Pembayaran sukses diterima setelah pesanan dibatalkan/kedaluwarsa.',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        await adminClient.from('order_events').insert({
          order_id: order.id,
          event_type: 'payment_review_triggered',
          previous_status: order.status,
          new_status: 'payment_review',
          summary: 'Review dipicu karena pembayaran terlambat (order tidak lagi aktif).',
        });

        await recordPaymentEvent({
          paymentId: payment.id,
          orderId: order.id,
          provider: 'klikqris',
          providerOrderId,
          source: 'webhook',
          eventType: 'payment_late_received',
          eventFingerprint,
          processingStatus: 'processed',
          providerStatus: 'PAID',
          sanitizedPayload: payload,
        });

        revalidatePath(`/pesanan/${order.order_number}`);
        return NextResponse.json({ received: true, reviewRequired: true }, { status: 200 });
      }

      // Atomic settlement
      const settled = await settlePaidPaymentRPC(payment.id, eventFingerprint);
      
      if (settled) {
        // Trigger auto-fulfillment if applicable (async)
        // Wait, actually I imported triggerAutoFulfillment
        await triggerAutoFulfillment(order.id).catch(e => console.error('Auto fulfillment error:', e));
      }

      await recordPaymentEvent({
        paymentId: payment.id,
        orderId: order.id,
        provider: 'klikqris',
        providerOrderId,
        source: 'webhook',
        eventType: 'payment_settled_success',
        eventFingerprint,
        processingStatus: settled ? 'processed' : 'failed',
        providerStatus: 'PAID',
        sanitizedPayload: payload,
      });

      revalidatePath(`/pesanan/${order.order_number}`);
      revalidatePath(`/admin/orders/${order.id}`);
      revalidatePath(`/admin/fulfillments`);
      
    } else if (parsedEvent.status === 'expired') {
      const settled = await settleExpiredPaymentRPC(payment.id);
      
      await recordPaymentEvent({
        paymentId: payment.id,
        orderId: order.id,
        provider: 'klikqris',
        providerOrderId,
        source: 'webhook',
        eventType: 'payment_settled_expired',
        eventFingerprint,
        processingStatus: settled ? 'processed' : 'failed',
        providerStatus: 'EXPIRED',
        sanitizedPayload: payload,
      });

      revalidatePath(`/pesanan/${order.order_number}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (err: any) {
    console.error('Error in Webhook processor:', err);
    // Try to record error event if we have IDs
    try {
      if (providerOrderId !== 'UNKNOWN') {
        const errorFingerprint = await hashSignature(`err_${providerOrderId}_${startTime}_${err.message}`);
        await recordPaymentEvent({
          paymentId: null,
          orderId: null,
          provider: 'klikqris',
          providerOrderId,
          source: 'webhook',
          eventType: 'webhook_processing_error',
          eventFingerprint: errorFingerprint,
          processingStatus: 'failed',
          providerStatus: 'ERROR',
          sanitizedPayload: { error: err.message },
          errorCode: 'PROCESSING_ERROR',
        });
      }
    } catch (_) {}
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
