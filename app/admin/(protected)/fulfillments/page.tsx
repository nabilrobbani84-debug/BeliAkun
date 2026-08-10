import React from 'react';
import { getAdminFulfillments } from '@/lib/data/fulfillments';
import { FulfillmentListClient } from './FulfillmentListClient';

export const metadata = {
  title: 'Manajemen Pengiriman - Beliakun.com Admin',
};

// Disable caching for admin dashboard
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminFulfillmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const search = resolvedParams.search || '';
  const status = resolvedParams.status || 'all';

  // Fetch Fulfillments
  const { data: fulfillments, count } = await getAdminFulfillments(currentPage, 20, search, status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Daftar Pengiriman (Fulfillment)</h1>
          <p className="text-slate-500 font-medium">Pantau status pengiriman kredensial produk ke pelanggan.</p>
        </div>
      </div>

      <FulfillmentListClient 
        initialFulfillments={fulfillments} 
        totalCount={count}
        currentPage={currentPage}
        search={search}
        status={status}
      />
    </div>
  );
}
