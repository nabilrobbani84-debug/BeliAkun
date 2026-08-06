import React from 'react';
import { getAdminOrderKPIs, getAdminOrders } from '@/lib/data/orders';
import { OrderListClient } from './OrderListClient';

export const metadata = {
  title: 'Manajemen Pesanan - Beliakun.com Admin',
};

// Disable caching for admin dashboard
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';
  const status = resolvedParams.status || 'all';

  // Fetch KPI
  const kpi = await getAdminOrderKPIs();

  // Fetch Orders
  const { data: orders, count } = await getAdminOrders(currentPage, 20, search, status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Daftar Pesanan</h1>
          <p className="text-slate-500 font-medium">Pantau pesanan pelanggan dan status reservasi stok.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Menunggu Pembayaran</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{kpi.pendingPayment}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Kedaluwarsa</p>
          <p className="text-2xl font-black text-red-600 mt-1">{kpi.expired}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Dibatalkan</p>
          <p className="text-2xl font-black text-slate-600 mt-1">{kpi.cancelled}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Total Pesanan</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{kpi.totalOrders}</p>
        </div>
      </div>

      <OrderListClient 
        initialOrders={orders} 
        totalCount={count}
        currentPage={currentPage}
        search={search}
        status={status}
      />
    </div>
  );
}
