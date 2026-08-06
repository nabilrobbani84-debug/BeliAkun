import React from 'react';
import { cookies } from 'next/headers';
import { getGuestOrderByAccessToken } from '@/lib/data/orders';
import { getPaymentByOrderId } from '@/lib/data/payments';
import { hashOrderAccessToken } from '@/lib/security/order-access-token';
import { env } from '@/lib/env';
import { ShieldCheck, Clock, CheckCircle2, XCircle, FileText, ArrowLeft, Package, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { PaymentClient } from './PaymentClient';

export const metadata = {
  title: 'Status Pesanan - Beliakun.com',
};

// No cache for order status
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;
  
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(`beliakun_guest_order_${orderNumber}`)?.value;

  if (!rawToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Tidak Valid</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Akses pesanan tidak valid atau telah kedaluwarsa. 
            <br/><br/>
            <span className="bg-blue-50 text-blue-800 p-2 rounded block text-xs border border-blue-100">
              [Development Mode] Untuk sementara, akses pesanan hanya tersedia dari browser yang digunakan saat checkout.
            </span>
          </p>
          <Link href="/" className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 w-full transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const tokenHash = await hashOrderAccessToken(rawToken);
  const order = await getGuestOrderByAccessToken(tokenHash);

  if (!order || order.order_number !== orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6 text-sm">Token keamanan tidak valid untuk pesanan ini. Buka kembali tautan pesanan yang dikirim melalui kanal resmi Beliakun.com.</p>
          <Link href="/" className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 w-full transition-colors">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  // Fetch payment record
  const payment = await getPaymentByOrderId(order.id);

  const item = order.order_items[0];
  const isPending = order.status === 'pending_payment';
  const isPaid = order.status === 'paid';
  const isExpired = order.status === 'expired' || order.status === 'cancelled';
  const isReview = order.status === 'payment_review';
  
  // Mask email
  const emailParts = order.recipient_email.split('@');
  const maskedEmail = emailParts[0].length > 2 
    ? emailParts[0].substring(0, 2) + '***@' + emailParts[1]
    : emailParts[0] + '***@' + emailParts[1];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-16">
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <span className="font-bold text-lg">Status Pesanan</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8 space-y-6">
        
        {/* Status Card */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 text-center shadow-sm">
          {isPending ? (
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <Clock className="w-10 h-10" />
            </div>
          ) : isExpired ? (
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-10 h-10" />
            </div>
          ) : isReview ? (
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <HelpCircle className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}
          
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            {isPending 
              ? 'Menunggu Pembayaran' 
              : isExpired 
                ? 'Pesanan Dibatalkan/Expired' 
                : isReview 
                  ? 'Pembayaran Sedang Diperiksa' 
                  : 'Pembayaran Berhasil'}
          </h1>
          <p className="text-slate-600 font-medium mb-1">Nomor Pesanan: <span className="font-bold text-slate-900">{order.order_number}</span></p>
          <p className="text-slate-500 text-sm">Dikirim ke: {maskedEmail}</p>
        </div>

        {/* QRIS / Payment Widget */}
        <PaymentClient 
          order={order}
          initialPayment={payment}
          checkoutEnabled={env.CHECKOUT_ENABLED}
          klikqrisEnabled={env.KLIKQRIS_ENABLED}
        />

        {/* Order Details */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 sm:p-5 border-b-2 border-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-lg">Rincian Pembelian</h3>
          </div>
          
          <div className="p-4 sm:p-5">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-xl shrink-0 bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-900 truncate">{item.product_name}</h4>
                <p className="text-blue-600 font-bold text-sm">{item.variant_name}</p>
                <div className="mt-2 text-xs font-semibold text-slate-500 flex flex-wrap gap-2">
                  <span className="bg-slate-100 px-2 py-1 rounded">Durasi: {item.duration_label || '-'}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">Tipe: {item.account_type || '-'}</span>
                </div>
              </div>
            </div>

            <hr className="my-5 border-slate-100" />

            <div className="space-y-3 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Total Pesanan</span>
                <span className="text-slate-900 font-bold">
                  Rp {order.grand_total.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Waktu Dibuat</span>
                <span className="text-slate-900 font-bold">
                  {new Date(order.created_at).toLocaleString('id-ID')}
                </span>
              </div>
              {order.reservation_expires_at && isPending && (
                <div className="flex justify-between">
                  <span>Batas Waktu Pembayaran</span>
                  <span className="text-red-600 font-bold">
                    {new Date(order.reservation_expires_at).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
