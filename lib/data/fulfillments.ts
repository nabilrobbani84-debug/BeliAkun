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

export async function getAdminFulfillmentDetails(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('fulfillments')
    .select(`
      *,
      orders (
        id,
        order_number,
        recipient_email,
        grand_total,
        status,
        created_at,
        order_items (
          id,
          product_name,
          variant_name,
          stock_type,
          quantity,
          price
        )
      ),
      fulfillment_items (
        id,
        credential_snapshot,
        is_delivered,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching fulfillment details:', error);
    return null;
  }

  return data;
}

export async function getFulfillmentByOrderId(orderId: string) {
  const adminDb = createAdminClient();
  
  const { data, error } = await adminDb
    .from('fulfillments')
    .select(`
      *,
      fulfillment_items (
        id,
        credential_snapshot,
        is_delivered,
        created_at
      )
    `)
    .eq('order_id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching fulfillment by order id:', error);
  }

  return data;
}

export async function triggerAutoFulfillment(orderId: string) {
  const adminDb = createAdminClient();
  
  // 1. Get order and items
  const { data: order, error: orderError } = await adminDb
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();
    
  if (orderError || !order) return false;
  
  const item = order.order_items[0];
  
  // Only process if stock_type is instan
  if (item.stock_type !== 'instan' && item.stock_type !== 'limited') {
    return false;
  }
  
  // 2. Find pending fulfillment
  const { data: fulfillment } = await adminDb
    .from('fulfillments')
    .select('*')
    .eq('order_id', orderId)
    .eq('status', 'pending')
    .single();
    
  if (!fulfillment) return false;
  
  // 3. Find sold inventory items
  const { data: inventoryItems } = await adminDb
    .from('inventory_items')
    .select('*')
    .eq('sold_order_id', orderId);
    
  if (!inventoryItems || inventoryItems.length === 0) return false;
  
  // 4. Decrypt credentials and create fulfillment item
  // For MVP, we assume encrypted_payload is just a JSON string or we parse it
  // In a real app, you would decrypt it with AES here
  
  try {
    for (const inv of inventoryItems) {
      // Dummy decryption for now (assuming it's just JSON stringified in encrypted_payload)
      let credentialData = inv.encrypted_payload;
      
      await adminDb
        .from('fulfillment_items')
        .insert({
          fulfillment_id: fulfillment.id,
          order_item_id: item.id,
          inventory_item_id: inv.id,
          credential_snapshot: credentialData,
          is_delivered: true
        });
    }
    
    // 5. Update fulfillment status
    await adminDb
      .from('fulfillments')
      .update({ status: 'completed' }) // Actually I didn't add fulfillment_type in DB, so just completed
      .eq('id', fulfillment.id);
      
    // Update order status to completed
    await adminDb
      .from('orders')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', orderId);
      
    // Add order event
    await adminDb
      .from('order_events')
      .insert({
        order_id: orderId,
        event_type: 'fulfilled',
        new_status: 'completed',
        summary: 'Pesanan telah selesai dan kredensial telah dikirimkan secara otomatis.'
      });
      
    // 6. Queue email
    const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/pesanan/${order.order_number}`;
    const emailHtml = `
      <h2>Pesanan Anda Telah Dikirim!</h2>
      <p>Halo, pesanan Anda dengan nomor <strong>${order.order_number}</strong> telah berhasil diproses secara otomatis.</p>
      <p>Silakan klik tautan di bawah ini untuk melihat detail kredensial produk Anda:</p>
      <a href="${orderUrl}" style="display:inline-block;padding:10px 20px;background-color:#0070f3;color:#ffffff;text-decoration:none;border-radius:5px;">Lihat Pesanan & Kredensial</a>
      <br/><br/>
      <p>Terima kasih telah berbelanja di Beliakun!</p>
    `;
    
    await queueTransactionalEmail(
      order.id, 
      order.recipient_email, 
      `Pesanan ${order.order_number} Selesai - Beliakun`, 
      emailHtml
    );
    
    return true;
  } catch (err) {
    console.error('Auto fulfillment failed:', err);
    return false;
  }
}
