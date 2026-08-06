import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashOrderAccessToken } from '@/lib/security/order-access-token';
import { cookies } from 'next/headers';
import { getPaymentByOrderId } from '@/lib/data/payments';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;
  
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(`beliakun_guest_order_${orderNumber}`)?.value;

  if (!rawToken) {
    return NextResponse.json({ error: 'Akses ditolak. Token tidak ditemukan.' }, { status: 401 });
  }

  const tokenHash = await hashOrderAccessToken(rawToken);
  const supabase = createAdminClient();

  // Fetch token validation
  const { data: tokenRecord, error: tokenError } = await supabase
    .from('order_access_tokens')
    .select('order_id')
    .eq('token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .is('revoked_at', null)
    .single();

  if (tokenError || !tokenRecord) {
    return NextResponse.json({ error: 'Akses ditolak. Token tidak valid.' }, { status: 401 });
  }

  // Fetch order status and payment
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, status, paid_at')
    .eq('id', tokenRecord.order_id)
    .eq('order_number', orderNumber)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
  }

  const payment = await getPaymentByOrderId(order.id);

  return NextResponse.json({
    status: payment?.status || 'unknown',
    orderStatus: order.status,
    expiresAt: payment?.provider_expires_at || null,
    paidAt: order.paid_at || null,
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    }
  });
}
