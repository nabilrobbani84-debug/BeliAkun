'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';
import { adminReleaseExpiredReservations } from '@/lib/actions/orders';

export function OrderListClient({ 
  initialOrders, 
  totalCount,
  currentPage,
  search,
  status 
}: { 
  initialOrders: any[],
  totalCount: number,
  currentPage: number,
  search: string,
  status: string
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/orders?page=1&search=${encodeURIComponent(searchInput)}&status=${statusFilter}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusFilter(val);
    router.push(`/admin/orders?page=1&search=${encodeURIComponent(searchInput)}&status=${val}`);
  };

  const handleCleanup = async () => {
    if (confirm('Bersihkan semua reservasi stok dari pesanan yang telah kedaluwarsa?')) {
      setIsCleaning(true);
      try {
        const res = await adminReleaseExpiredReservations();
        if (res.success) {
          alert(`Berhasil membersihkan ${res.count} pesanan kedaluwarsa.`);
          router.refresh();
        } else {
          alert(res.error || 'Gagal membersihkan reservasi.');
        }
      } catch (err) {
        alert('Gagal membersihkan reservasi.');
      }
      setIsCleaning(false);
    }
  };

  const getStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case 'pending_payment':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Menunggu Pembayaran</span>;
      case 'expired':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">Kedaluwarsa</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">{orderStatus}</span>;
    }
  };

  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    return parts[0].substring(0, 2) + '***@' + parts[1];
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
            <option value="pending_payment">Menunggu Pembayaran</option>
            <option value="expired">Kedaluwarsa</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <Button type="submit" variant="secondary" size="sm" className="h-10">Cari</Button>
        </form>

        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleCleanup}
          disabled={isCleaning}
          className="h-10 shrink-0 text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isCleaning ? 'animate-spin' : ''}`} />
          Bersihkan Reservasi
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b-2 border-slate-100 text-slate-600 font-bold">
            <tr>
              <th className="p-4">No. Pesanan</th>
              <th className="p-4">Pembeli</th>
              <th className="p-4">Produk</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Waktu</th>
              <th className="p-4 w-10">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100 font-medium text-slate-800">
            {initialOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Tidak ada data pesanan ditemukan.
                </td>
              </tr>
            ) : (
              initialOrders.map((order) => {
                const item = order.order_items[0];
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{order.order_number}</td>
                    <td className="p-4">{maskEmail(order.recipient_email)}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{item?.product_name}</span>
                        <span className="text-xs text-blue-600">{item?.variant_name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-600">Rp {order.grand_total.toLocaleString('id-ID')}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(order.created_at).toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`}>
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
