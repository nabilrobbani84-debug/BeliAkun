import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Order, OrderItem, OrderEvent, OrderStatus, PaymentStatus } from '@/lib/supabase/types';

export interface OrderKPIs {
  pendingPayment: number;
  expired: number;
  cancelled: number;
  totalOrders: number;
}

export async function getAdminOrderKPIs(): Promise<OrderKPIs> {
  const supabase = await createClient();
  
  // Aggregate using RPC or count queries
  // Since we don't have a complex RPC, we can just do parallel counts
  const [
    { count: pendingCount },
    { count: expiredCount },
    { count: cancelledCount },
    { count: totalCount }
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending_payment'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.from('orders').select('*', { count: 'exact', head: true })
  ]);
  
  return {
    pendingPayment: pendingCount || 0,
    expired: expiredCount || 0,
    cancelled: cancelledCount || 0,
    totalOrders: totalCount || 0,
  };
}

export async function getAdminOrders(
  page: number = 1,
  limit: number = 20,
  search?: string,
  status?: string
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `, { count: 'exact' });
    
  if (search) {
    // Search by order_number or recipient_email
    query = query.or(`order_number.ilike.%${search}%,recipient_email.ilike.%${search}%`);
  }
  
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) throw error;
  
  return { data: data as (Order & { order_items: OrderItem[] })[], count: count || 0 };
}

export async function getAdminOrderById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      inventory_items(id, status, reserved_at, reserved_until)
    `)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  
  return data; // Return with related data
}

export async function getOrderEvents(orderId: string): Promise<OrderEvent[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('order_events')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data as OrderEvent[];
}

export async function getGuestOrderByAccessToken(tokenHash: string) {
  // Use admin client because public has no read access to orders by default
  // Wait, RLS for orders is strictly admin. Guest can only read via backend route using admin client.
  const supabase = createAdminClient();
  
  // Find valid token
  const { data: tokenRecord, error: tokenError } = await supabase
    .from('order_access_tokens')
    .select('order_id')
    .eq('token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .is('revoked_at', null)
    .single();
    
  if (tokenError || !tokenRecord) {
    return null; // Token not found or expired
  }
  
  // Update last_used_at async
  supabase.from('order_access_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('token_hash', tokenHash)
    .then();
  
  // Fetch order and item
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('id', tokenRecord.order_id)
    .single();
    
  if (orderError) throw orderError;
  
  return orderData as (Order & { order_items: OrderItem[] });
}

export async function createGuestOrder(
  variantId: string, 
  recipientEmail: string, 
  idempotencyKey: string,
  reservationMinutes: number = 30
) {
  const supabase = createAdminClient();
  
  // Call RPC
  const { data, error } = await supabase.rpc('create_guest_order', {
    p_payload: {
      variantId,
      recipientEmail,
      idempotencyKey,
      reservationMinutes
    }
  });
  
  if (error) throw error;
  
  return data;
}

export async function cancelPendingOrder(orderId: string) {
  const supabase = await createClient(); // Admin action
  
  // Just update status, trigger release from application layer?
  // Actually we should write a function or just update and then call release
  // Wait, expire_order_and_release_inventory works for expired.
  // For cancelled, we should just release inventory as well. 
  // Let's implement a manual cancel in RPC or here.
  
  // In Step 4, we use `expire_order_and_release_inventory` but change status to cancelled.
  // We can just execute the raw SQL logic or use admin client.
  // For simplicity, let's just use admin client to do the updates.
  const adminClient = createAdminClient();
  
  // Update order to cancelled
  const { error: updateError } = await adminClient
    .from('orders')
    .update({ 
      status: 'cancelled', 
      cancelled_at: new Date().toISOString() 
    })
    .eq('id', orderId)
    .eq('status', 'pending_payment');
    
  if (updateError) throw updateError;
  
  // Log event
  await adminClient.from('order_events').insert({
    order_id: orderId,
    event_type: 'cancelled',
    previous_status: 'pending_payment',
    new_status: 'cancelled',
    summary: 'Order cancelled by admin'
  });
  
  // Find inventory and release
  const { data: inventories } = await adminClient
    .from('inventory_items')
    .select('id, expires_at')
    .eq('reserved_order_id', orderId);
    
  if (inventories && inventories.length > 0) {
    for (const inv of inventories) {
      const isExpired = inv.expires_at && new Date(inv.expires_at) <= new Date();
      const newStatus = isExpired ? 'expired' : 'available';
      
      await adminClient.from('inventory_items')
        .update({
          status: newStatus,
          reserved_order_id: null,
          reserved_order_item_id: null,
          reserved_at: null,
          reserved_until: null
        })
        .eq('id', inv.id);
        
      await adminClient.from('inventory_events').insert({
        inventory_item_id: inv.id,
        event_type: 'reservation_released',
        previous_status: 'reserved',
        new_status: newStatus,
        summary: 'Reservation released due to order cancellation'
      });
    }
  }
  
  return true;
}

export async function expirePendingOrder(orderId: string) {
  const supabase = createAdminClient();
  
  // Get user session to pass actor_id if needed, but adminClient bypasses it anyway.
  // We can just call the RPC
  const { data, error } = await supabase.rpc('expire_order_and_release_inventory', {
    p_order_id: orderId
  });
  
  if (error) throw error;
  
  return data; // boolean
}

export async function releaseExpiredReservations() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase.rpc('release_expired_order_reservations', {
    p_limit: 50
  });
  
  if (error) throw error;
  
  return data; // count
}
