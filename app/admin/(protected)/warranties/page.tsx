import React from 'react';
import { getAdminWarrantyClaims } from '@/lib/data/warranties';
import { WarrantyListClient } from './WarrantyListClient';

export const metadata = {
  title: 'Manajemen Garansi - Admin',
};

// Next.js config for admin dashboard (always dynamic)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminWarrantiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.q || '';
  const status = resolvedSearchParams.status || 'all';

  const { data, count } = await getAdminWarrantyClaims(page, 20, search, status);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Klaim Garansi</h1>
          <p className="text-slate-600 mt-1">Kelola klaim garansi produk pelanggan</p>
        </div>
      </div>

      <WarrantyListClient 
        initialData={data || []} 
        totalCount={count} 
        currentPage={page}
        searchQuery={search}
        statusFilter={status}
      />
    </div>
  );
}
