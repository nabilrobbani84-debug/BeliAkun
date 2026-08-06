import { NextRequest, NextResponse } from 'next/server';
import { syncGuestPaymentStatus } from '@/lib/actions/payments';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;
  
  // Rate limiting or basic protection can go here, but syncGuestPaymentStatus itself does
  // the guest token verification.
  const syncResult = await syncGuestPaymentStatus(orderNumber);
  
  if (!syncResult.success) {
    return NextResponse.json({ error: syncResult.error || 'Gagal menyinkronkan status' }, { status: 400 });
  }
  
  return NextResponse.json({
    success: true,
    status: syncResult.status
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    }
  });
}
