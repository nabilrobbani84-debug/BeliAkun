import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getAdminFulfillments(
  page: number = 1,
  limit: number = 20,
  search?: string,
  status?: string
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('fulfillments')
    .select(`
      *,
      orders (
        order_number,
        recipient_email,
        grand_total,
        order_items (
          product_name,
          variant_name,
          stock_type,
          quantity
        )
      )
    `, { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  query = query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching fulfillments:', error);
    throw new Error('Gagal mengambil data pengiriman');
  }

  // Filter in memory for search if needed
  let filteredData = data;
  if (search) {
    const s = search.toLowerCase();
    filteredData = data.filter((f: any) => 
      f.orders?.order_number?.toLowerCase().includes(s) || 
      f.orders?.recipient_email?.toLowerCase().includes(s)
    );
  }

  return {
    data: filteredData,
    count: search ? filteredData.length : (count || 0)
  };
}

export async function processManualFulfillment(
  fulfillmentId: string, 
  credentialData: any, 
  notes?: string
) {
  const adminDb = createAdminClient();
  
  // 1. Get fulfillment
  const { data: fulfillment, error: fError } = await adminDb
    .from('fulfillments')
    .select('*, orders(*, order_items(*))')
    .eq('id', fulfillmentId)
    .single();
    
  if (fError || !fulfillment) throw new Error('Fulfillment not found');
  
  if (fulfillment.status === 'completed') {
    throw new Error('Fulfillment is already completed');
  }
  
  const orderItem = fulfillment.orders.order_items[0];

  // 2. Insert fulfillment_item
  const { error: fiError } = await adminDb
    .from('fulfillment_items')
    .insert({
      fulfillment_id: fulfillmentId,
      order_item_id: orderItem.id,
      credential_snapshot: credentialData,
      is_delivered: true
    });
    
  if (fiError) throw new Error('Failed to create fulfillment item');

  // 3. Update fulfillment status
  const { error: updateError } = await adminDb
    .from('fulfillments')
    .update({ 
      status: 'completed',
      notes: notes || null
    })
    .eq('id', fulfillmentId);
    
  if (updateError) throw new Error('Failed to update fulfillment status');

  // 4. Update order status to completed
  await adminDb
    .from('orders')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', fulfillment.order_id);

  // 5. Add order event
  await adminDb
    .from('order_events')
    .insert({
      order_id: fulfillment.order_id,
      event_type: 'fulfilled',
      new_status: 'completed',
      summary: 'Pesanan telah selesai dan kredensial telah dikirimkan secara manual.'
    });

  return true;
}

export async function queueTransactionalEmail(
  orderId: string,
  toEmail: string,
  subject: string,
  bodyHtml: string
) {
  const adminDb = createAdminClient();
  
  const { error } = await adminDb
    .from('email_outbox')
    .insert({
      order_id: orderId,
      to_email: toEmail,
      subject,
      body_html: bodyHtml,
      status: 'pending'
    });
    
  if (error) {
    console.error('Failed to queue email:', error);
    throw new Error('Failed to queue email');
  }
  
  return true;
}

export async function getEmailOutboxAdmin(page = 1, limit = 20) {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from('email_outbox')
    .select('*, orders(order_number)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
    
  if (error) throw error;
  
  return { data, count: count || 0 };
}
