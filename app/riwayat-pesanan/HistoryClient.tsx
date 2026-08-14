'use client';

import React from 'react';
import { Package, Search, ExternalLink, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderItem } from '@/lib/supabase/types';
import { PageContainer } from '@/components/patterns/page-container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Empty } from '@/components/beliakun-ui/empty';

interface HistoryClientProps {
  initialOrders: (Order & { order_items: OrderItem[] })[];
  userEmail: string;
  userName: string;
}

export function HistoryClient({ initialOrders, userEmail, userName }: HistoryClientProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 shadow-none"><CheckCircle2 className="w-3 h-3 mr-1"/> Dibayar</Badge>;
      case 'pending_payment':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 shadow-none"><Clock className="w-3 h-3 mr-1"/> Menunggu Pembayaran</Badge>;
      case 'expired':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300 shadow-none"><AlertCircle className="w-3 h-3 mr-1"/> Kedaluwarsa</Badge>;
      case 'cancelled':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300 shadow-none"><AlertCircle className="w-3 h-3 mr-1"/> Dibatalkan</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 shadow-none">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-12">
      {/* Header Sederhana */}
      <header className="bg-white border-b-2 border-slate-200 py-4 sticky top-0 z-30">
        <PageContainer className="flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <h1 className="text-lg font-black text-slate-900">Riwayat Pesanan</h1>
          </div>
          <div className="text-sm font-bold text-slate-600 hidden sm:block">
            {userName} ({userEmail})
          </div>
        </PageContainer>
      </header>

      <PageContainer className="px-4 sm:px-6 pt-6 sm:pt-8 max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Daftar Pesanan Anda</h2>
        </div>

        {initialOrders.length === 0 ? (
          <Empty 
            variant="search" 
            title="Belum Ada Pesanan" 
            description="Anda belum pernah melakukan pemesanan di Beliakun.com."
            actionLabel="Kembali Belanja"
            onAction={() => window.location.href = '/'}
          />
        ) : (
          <div className="space-y-4">
            {initialOrders.map((order) => (
              <Card key={order.id} className="p-0 overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-50 border-b-2 border-slate-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order ID</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                      #{order.order_number} {getStatusBadge(order.status)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                      {new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                <div className="px-4 py-4 space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]">
                        {item.product_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 flex justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">{item.product_name}</h4>
                          <p className="text-xs font-bold text-blue-600 truncate">{item.variant_name}</p>
                          {item.warranty_enabled && (
                            <p className="text-[10px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3"/> Garansi Aktif
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-slate-500">{item.quantity}x</p>
                          <p className="text-sm font-black text-slate-900">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 border-t-2 border-slate-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Pembayaran</span>
                    <span className="text-base sm:text-lg font-black text-blue-600">
                      Rp {order.grand_total.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <Link href={`/pesanan/${order.order_number}`}>
                    <Button variant="outline" size="sm" className="font-bold flex items-center gap-1.5 h-9 bg-white hover:bg-slate-50">
                      Detail <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
