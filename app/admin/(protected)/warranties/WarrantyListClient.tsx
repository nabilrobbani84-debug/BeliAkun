'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, ShieldAlert, CheckCircle2, FileText, ChevronRight, AlertCircle, XCircle } from 'lucide-react';

interface WarrantyListClientProps {
  initialData: any[];
  totalCount: number;
  currentPage: number;
  searchQuery: string;
  statusFilter: string;
}

export function WarrantyListClient({ 
  initialData, 
  totalCount, 
  currentPage, 
  searchQuery,
  statusFilter 
}: WarrantyListClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    router.push(`/admin/warranties?${params.toString()}`);
  };

  const handleFilter = (status: string) => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (status !== 'all') params.set('status', status);
    router.push(`/admin/warranties?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Pending</span>;
      case 'processing':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Diproses</span>;
      case 'resolved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Selesai</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Ditolak</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Cari email atau nomor pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
          {['all', 'pending', 'processing', 'resolved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap text-sm transition-colors ${
                statusFilter === status 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {status === 'all' ? 'Semua' : 
               status === 'pending' ? 'Pending' :
               status === 'processing' ? 'Diproses' :
               status === 'resolved' ? 'Selesai' : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="p-4 font-bold text-slate-600">ID / Pesanan</th>
                <th className="p-4 font-bold text-slate-600">Produk</th>
                <th className="p-4 font-bold text-slate-600">Email</th>
                <th className="p-4 font-bold text-slate-600">Status</th>
                <th className="p-4 font-bold text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    Belum ada klaim garansi
                  </td>
                </tr>
              ) : (
                initialData.map((claim) => (
                  <tr key={claim.id} className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{claim.warranties?.orders?.order_number}</div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(claim.created_at).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{claim.warranties?.order_items?.product_name}</div>
                      <div className="text-sm text-slate-500">{claim.warranties?.order_items?.variant_name}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {claim.warranties?.orders?.recipient_email}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(claim.status)}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/warranties/${claim.id}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalCount > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set('page', (currentPage - 1).toString());
              router.push(`/admin/warranties?${params.toString()}`);
            }}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold disabled:opacity-50"
          >
            Prev
          </button>
          <button 
            disabled={initialData.length < 20}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set('page', (currentPage + 1).toString());
              router.push(`/admin/warranties?${params.toString()}`);
            }}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
