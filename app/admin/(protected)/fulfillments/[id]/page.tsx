import React from 'react';
import { getAdminFulfillmentDetails } from '@/lib/data/fulfillments';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, ShieldCheck, Mail } from 'lucide-react';
import { notFound } from 'next/navigation';
import { FulfillmentDetailClient } from './FulfillmentDetailClient';

export const metadata = {
  title: 'Detail Pengiriman - Beliakun.com Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminFulfillmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const fulfillmentId = resolvedParams.id;
  
  let fulfillment;
  
  try {
    fulfillment = await getAdminFulfillmentDetails(fulfillmentId);
    if (!fulfillment) notFound();
  } catch (error) {
    notFound();
  }

  const order = fulfillment.orders;
  const item = order?.order_items?.[0];
  const fulfillmentItem = fulfillment.fulfillment_items?.[0];

  const getStatusBadge = (fulfillmentStatus: string) => {
    switch (fulfillmentStatus) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Menunggu (Manual)</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Memproses</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 border border-green-200">Selesai</span>;
      case 'failed':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">Gagal</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">{fulfillmentStatus}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/fulfillments" className="p-2 -ml-2 rounded-lg hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Detail Pengiriman</h1>
          <p className="text-slate-500 font-medium">Informasi pengiriman kredensial produk untuk pesanan {order?.order_number}.</p>
        </div>
      </div>

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
              {item ? (
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
                  </div>
                  <div className="flex-1 space-y-3 text-sm border-t-2 border-slate-100 pt-4 md:border-t-0 md:pt-0 md:border-l-2 md:pl-6">
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
              ) : (
                <p className="text-slate-500 text-sm">Data produk tidak ditemukan.</p>
              )}
            </div>
          </div>

          {/* Rincian Kredensial */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Data Kredensial (Snapshot)
              </h2>
            </div>
            <div className="p-5">
              {fulfillmentItem ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-500">Data kredensial yang telah dikirimkan ke pelanggan:</p>
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm overflow-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(fulfillmentItem.credential_snapshot, null, 2)}
                  </pre>
                  <p className="text-xs text-slate-400">Terkirim pada: {new Date(fulfillmentItem.created_at).toLocaleString('id-ID')}</p>
                </div>
              ) : (
                <div className="text-sm text-slate-500 text-center p-4">
                  Kredensial belum dikirim atau data tidak tersedia.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Action & Info Status */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50">
              <h2 className="font-bold text-lg">Tindakan Admin</h2>
            </div>
            <div className="p-5">
              <FulfillmentDetailClient fulfillment={fulfillment} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden text-sm">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              <h2 className="font-bold text-lg">Status Pengiriman</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-slate-500 font-semibold mb-1">Status</p>
                {getStatusBadge(fulfillment.status)}
              </div>
              <hr className="border-slate-100" />
              <div>
                <p className="text-slate-500 font-semibold mb-1">Tipe Pengiriman</p>
                <p className="font-bold text-slate-900">{fulfillment.fulfillment_type === 'auto' ? 'Otomatis' : 'Manual'}</p>
              </div>
              <div>
                <p className="text-slate-500 font-semibold mb-1">Dibuat Pada</p>
                <p className="font-bold text-slate-900">{new Date(fulfillment.created_at).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden text-sm">
            <div className="p-5 border-b-2 border-slate-100 bg-slate-50 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-500" />
              <h2 className="font-bold text-lg">Info Penerima</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-slate-500 font-semibold mb-1">Nomor Pesanan</p>
                <Link href={`/admin/orders/${order?.id}`} className="font-bold text-blue-600 hover:underline">
                  {order?.order_number}
                </Link>
              </div>
              <div>
                <p className="text-slate-500 font-semibold mb-1">Email</p>
                <p className="font-bold text-slate-900">{order?.recipient_email}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
