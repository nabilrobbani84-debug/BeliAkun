import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { redactSensitiveData } from '@/lib/payments/klikqris/redact';

export async function getPaymentByOrderId(orderId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116 is single no rows found
    throw error;
  }
  return data || null;
}

export async function getPaymentEvents(paymentId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payment_events')
    .select('*')
    .eq('payment_id', paymentId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createPaymentRecord(params: {
  orderId: string;
  provider: 'klikqris';
  providerMode: string;
  providerOrderId: string;
  amountRequested: number;
  amountPayable: number;
  uniqueAmount: number;
  providerSignatureHash: string;
  qrisUrl: string;
  directUrl?: string;
  providerExpiresAt?: string;
}) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      order_id: params.orderId,
      provider: params.provider,
      provider_mode: params.providerMode,
      provider_order_id: params.providerOrderId,
      amount_requested: params.amountRequested,
      amount_payable: params.amountPayable,
      unique_amount: params.uniqueAmount,
      provider_signature_hash: params.providerSignatureHash,
      qris_url: params.qrisUrl,
      direct_url: params.directUrl || null,
      provider_expires_at: params.providerExpiresAt || null,
      status: 'pending', // Starts in pending once successfully created on provider
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updatePaymentRecord(
  paymentId: string,
  updates: {
    status?: string;
    provider_paid_at?: string;
    last_synced_at?: string;
    last_error_code?: string;
    metadata?: any;
  }
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function recordPaymentEvent(params: {
  paymentId: string | null;
  orderId: string | null;
  provider: 'klikqris';
  providerOrderId: string;
  source: 'create' | 'webhook' | 'status_sync' | 'admin_sync' | 'system';
  eventType: string;
  eventFingerprint: string;
  processingStatus: 'received' | 'processed' | 'ignored' | 'rejected' | 'failed';
  providerStatus?: string;
  sanitizedPayload?: any;
  errorCode?: string;
}) {
  const supabase = createAdminClient();
  
  // Redact payload
  const redactedPayload = redactSensitiveData(params.sanitizedPayload || {});
  
  const { data, error } = await supabase
    .from('payment_events')
    .insert({
      payment_id: params.paymentId,
      order_id: params.orderId,
      provider: params.provider,
      provider_order_id: params.providerOrderId,
      source: params.source,
      event_type: params.eventType,
      event_fingerprint: params.eventFingerprint,
      processing_status: params.processingStatus,
      provider_status: params.providerStatus || null,
      sanitized_payload: redactedPayload,
      error_code: params.errorCode || null,
      processed_at: params.processingStatus === 'processed' ? new Date().toISOString() : null,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function isEventFingerprintProcessed(provider: 'klikqris', fingerprint: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payment_events')
    .select('id')
    .eq('provider', provider)
    .eq('event_fingerprint', fingerprint)
    .eq('processing_status', 'processed')
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
}

export async function settlePaidPaymentRPC(
  paymentId: string,
  eventFingerprint: string,
  actorId?: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('settle_paid_payment', {
    p_payment_id: paymentId,
    p_event_fingerprint: eventFingerprint,
    p_actor_id: actorId || null,
  });
  
  if (error) throw error;
  return data;
}

export async function settleExpiredPaymentRPC(
  paymentId: string,
  actorId?: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('settle_expired_payment', {
    p_payment_id: paymentId,
    p_actor_id: actorId || null,
  });
  
  if (error) throw error;
  return data;
}
