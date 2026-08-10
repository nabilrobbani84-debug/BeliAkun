'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function FulfillmentListClient({ 
  initialFulfillments, 
  totalCount,
  currentPage,
  search,
  status 
}: { 
  initialFulfillments: any[],
  totalCount: number,
  currentPage: number,
  search: string,
  status: string
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/fulfillments?page=1&search=${encodeURIComponent(searchInput)}&status=${statusFilter}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusFilter(val);
    router.push(`/admin/fulfillments?page=1&search=${encodeURIComponent(searchInput)}&status=${val}`);
  };

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
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b-2 border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari pesanan / email..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-0 text-sm outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={handleStatusChange}
            className="h-10 px-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold bg-white cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu (Manual)</option>
            <option value="processing">Memproses</option>
            <option value="completed">Selesai</option>
            <option value="failed">Gagal</option>
          </select>
          <Button type="submit" variant="secondary" size="sm" className="h-10">Cari</Button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b-2 border-slate-100 text-slate-600 font-bold">
            <tr>
              <th className="p-4">No. Pesanan</th>
              <th className="p-4">Tipe Pengiriman</th>
              <th className="p-4">Status</th>
              <th className="p-4">Waktu</th>
              <th className="p-4 w-10">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100 font-medium text-slate-800">
            {initialFulfillments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Tidak ada data pengiriman ditemukan.
                </td>
              </tr>
            ) : (
              initialFulfillments.map((f) => {
                const order = f.orders;
                return (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{order?.order_number}</div>
                      <div className="text-xs text-slate-500">{order?.recipient_email}</div>
                    </td>
                    <td className="p-4 font-bold">{f.fulfillment_type === 'auto' ? 'Otomatis' : 'Manual'}</td>
                    <td className="p-4">{getStatusBadge(f.status)}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(f.created_at).toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <Link href={`/admin/fulfillments/${f.id}`}>
                        <Button variant="icon" size="sm" className="h-8 w-8 text-slate-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
