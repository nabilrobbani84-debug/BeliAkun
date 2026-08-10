import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminWarrantyClaimDetails } from '@/lib/data/warranties';
import { WarrantyDetailClient } from './WarrantyDetailClient';
import { ArrowLeft, Package, Clock, ShieldCheck, Mail, Calendar, Hash } from 'lucide-react';

export const metadata = {
  title: 'Detail Klaim Garansi - Admin',
};

// Admin dashboard is dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminWarrantyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const claimId = resolvedParams.id;
  
  const claim = await getAdminWarrantyClaimDetails(claimId);

  if (!claim) {
    notFound();
  }

  const order = claim.warranties?.orders;
  const item = claim.warranties?.order_items;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/warranties" 
          className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Detail Klaim Garansi</h1>
          <p className="text-slate-600 font-medium mt-1">Status: <span className="font-bold uppercase tracking-wider">{claim.status}</span></p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <Package className="w-5 h-5 text-blue-600" /> Informasi Pesanan
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-semibold mb-0.5">Nomor Pesanan</p>
                <Link href={`/admin/orders/${order?.id}`} className="font-bold text-blue-600 hover:underline">
                  {order?.order_number}
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-semibold mb-0.5">Email Pembeli</p>
                <p className="font-bold text-slate-800">{order?.recipient_email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-semibold mb-0.5">Produk</p>
                <p className="font-bold text-slate-800">{item?.product_name}</p>
                <p className="text-slate-600">{item?.variant_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Info */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Informasi Garansi
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-semibold mb-0.5">Berlaku Sampai</p>
                <p className="font-bold text-slate-800">
                  {claim.warranties?.valid_until ? new Date(claim.warranties.valid_until).toLocaleString('id-ID') : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-semibold mb-0.5">Tanggal Klaim Diajukan</p>
                <p className="font-bold text-slate-800">
                  {new Date(claim.created_at).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-semibold mb-0.5">Ketentuan Garansi</p>
                <p className="font-bold text-slate-800">{claim.warranties?.terms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Form */}
      <WarrantyDetailClient claim={claim} />
    </div>
  );
}
