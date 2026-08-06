import React from 'react';
import { getAdminOrderById, getOrderEvents } from '@/lib/data/orders';
import { getPaymentByOrderId, getPaymentEvents } from '@/lib/data/payments';
import { OrderDetailClient } from './OrderDetailClient';
import Link from 'next/link';
import { ArrowLeft, User, Package, Calendar, Clock, CreditCard, AlertTriangle, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Detail Pesanan - Beliakun.com Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  
  let order;
  let orderEvents;
  let payment = null;
  let paymentEvents: any[] = [];
  
  try {
    order = await getAdminOrderById(orderId);
    orderEvents = await getOrderEvents(orderId);
    payment = await getPaymentByOrderId(orderId);
    if (payment) {
      paymentEvents = await getPaymentEvents(payment.id);
    }
  } catch (error) {
    notFound();
  }

  const item = order.order_items[0];

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending_payment': return 'Menunggu Pembayaran';
      case 'paid': return 'Sudah Dibayar';
      case 'processing': return 'Sedang Diproses';
      case 'delivered': return 'Sudah Dikirim';
      case 'completed': return 'Selesai';
      case 'expired': return 'Kedaluwarsa';
      case 'cancelled': return 'Dibatalkan';
      case 'payment_review': return 'Butuh Review';
      default: return status;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Paid</span>;
      case 'pending':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
      case 'expired':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200">Expired</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">Review</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 -ml-2 rounded-lg hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Detail Pesanan {order.order_number}</h1>
          <p className="text-slate-500 font-medium">Informasi lengkap transaksi pelanggan.</p>
        </div>
      </div>

      {order.requires_payment_review && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex gap-3 text-red-900">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-extrabold">Perhatian: Membutuhkan Ulasan Pembayaran (Payment Review)</p>
            <p className="text-sm font-medium mt-1">Alasan: {order.payment_review_reason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri - Info Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Rincian Produk
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Nama Produk</p>
                    <p className="font-bold text-slate-900 text-base">{item.product_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Paket / Varian</p>
                    <p className="font-bold text-blue-600">{item.variant_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Durasi</p>
                      <p className="font-bold text-slate-900">{item.duration_label || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Tipe Akun</p>
                      <p className="font-bold text-slate-900">{item.account_type || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-3 text-sm border-t-2 border-slate-100 pt-4 md:border-t-0 md:pt-0 md:border-l-2 md:pl-6">
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Harga Satuan</p>
                    <p className="font-bold text-slate-900">Rp {item.unit_price.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Kuantitas</p>
                    <p className="font-bold text-slate-900">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold mb-1">Tipe Stok</p>
                    <p className="font-bold text-slate-900 capitalize">{item.stock_type || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian KlikQRIS (Jika Ada) */}
          {payment && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" /> Detail Pembayaran KlikQRIS
                </h2>
                {getPaymentStatusBadge(payment.status)}
              </div>
              <div className="p-5 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Provider ID Transaksi</p>
                      <p className="font-bold text-slate-900">{payment.provider_order_id}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Mode & Driver</p>
                      <p className="font-bold text-slate-900 capitalize">{payment.provider_mode} ({payment.provider})</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">QRIS URL</p>
                      <a href={payment.qris_url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline block truncate max-w-xs">
                        {payment.qris_url}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-3 border-t-2 border-slate-100 pt-4 md:border-t-0 md:pt-0 md:border-l-2 md:pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 font-semibold mb-1">Tagihan Produk</p>
                        <p className="font-bold text-slate-950">Rp {payment.amount_requested.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-semibold mb-1">Kode Unik</p>
                        <p className="font-bold text-blue-600">Rp {payment.unique_amount}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Total Wajib Bayar</p>
                      <p className="font-black text-blue-600 text-lg">Rp {payment.amount_payable.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 font-semibold mb-1">Dibuat Pada</p>
                        <p className="font-bold text-slate-700">{new Date(payment.created_at).toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-semibold mb-1">Waktu Bayar Provider</p>
                        <p className="font-bold text-slate-700">
                          {payment.provider_paid_at ? new Date(payment.provider_paid_at).toLocaleString('id-ID') : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Trails / Events */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" /> Riwayat Status & Event Log
              </h2>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {/* Payment Events */}
                {paymentEvents.map((ev: any) => (
                  <div key={ev.id} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></div>
                    </div>
                    <div>
                      <p className="font-black text-sm text-indigo-950 flex items-center gap-2">
                        PAYMENT EVENT: {ev.event_type.replace(/_/g, ' ').toUpperCase()}
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Source: {ev.source} | Process: {ev.processing_status}
                        </span>
                      </p>
                      {ev.error_code && (
                        <p className="text-xs font-bold text-red-600">Error: [{ev.error_code}]</p>
                      )}
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(ev.created_at).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
                
                {/* Order Events */}
                {orderEvents.map((ev: any) => (
                  <div key={ev.id} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-slate-100"></div>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{ev.event_type.replace(/_/g, ' ').toUpperCase()}</p>
                      <p className="text-sm text-slate-600">{ev.summary}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(ev.created_at).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
                {orderEvents.length === 0 && paymentEvents.length === 0 && (
                  <p className="text-slate-500 text-sm">Belum ada riwayat aktivitas.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Action & Info Pelanggan */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50">
              <h2 className="font-bold text-lg">Tindakan Admin</h2>
            </div>
            <div className="p-5">
              <OrderDetailClient order={order} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden text-sm">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-500" />
              <h2 className="font-bold text-lg">Pembeli & Status</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-slate-500 font-semibold mb-1">Email Penerima</p>
                <p className="font-bold text-slate-900">{order.recipient_email}</p>
              </div>
              <hr className="border-slate-100" />
              <div>
                <p className="text-slate-500 font-semibold mb-1">Status Pesanan</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 border text-slate-800">
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-semibold mb-1">Status Pembayaran</p>
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 border text-slate-800 uppercase">
                  {order.payment_status}
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-semibold mb-1">Total Transaksi</p>
                <p className="font-black text-blue-600 text-xl">Rp {order.grand_total.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden text-sm">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              <h2 className="font-bold text-lg">Waktu</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-slate-500 font-semibold mb-1">Dibuat Pada</p>
                <p className="font-bold text-slate-900">{new Date(order.created_at).toLocaleString('id-ID')}</p>
              </div>
              {order.reservation_expires_at && order.status === 'pending_payment' && (
                <div>
                  <p className="text-slate-500 font-semibold mb-1">Batas Waktu Pembayaran</p>
                  <p className="font-bold text-red-600">{new Date(order.reservation_expires_at).toLocaleString('id-ID')}</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
