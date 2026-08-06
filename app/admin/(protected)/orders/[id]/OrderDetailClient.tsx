'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { adminCancelOrder, adminExpireOrder } from '@/lib/actions/orders';
import { syncAdminPaymentStatus } from '@/lib/actions/payments';
import { Ban, Clock, Loader2, RefreshCw } from 'lucide-react';

export function OrderDetailClient({ order }: { order: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan.')) {
      setIsProcessing(true);
      const res = await adminCancelOrder(order.id);
      if (res.success) {
        alert('Pesanan berhasil dibatalkan.');
        router.refresh();
      } else {
        alert(res.error);
      }
      setIsProcessing(false);
    }
  };

  const handleExpire = async () => {
    if (confirm('Apakah Anda yakin ingin mengatur pesanan ini menjadi kedaluwarsa?')) {
      setIsProcessing(true);
      const res = await adminExpireOrder(order.id);
      if (res.success) {
        alert('Pesanan telah dikedaluwarsakan.');
        router.refresh();
      } else {
        alert(res.error);
      }
      setIsProcessing(false);
    }
  };

  const handleSync = async () => {
    setIsProcessing(true);
    try {
      const res = await syncAdminPaymentStatus(order.id);
      if (res.success) {
        alert('Status pembayaran berhasil disinkronkan.');
        router.refresh();
      } else {
        alert(res.error || 'Gagal menyinkronkan status.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = order.status === 'pending_payment';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button 
          onClick={handleCancel} 
          disabled={!isPending || isProcessing}
          variant="secondary"
          className="flex-1 text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
          Batalkan
        </Button>
        
        <Button 
          onClick={handleExpire} 
          disabled={!isPending || isProcessing}
          variant="secondary"
          className="flex-1 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
          Expired
        </Button>
      </div>

      <Button
        onClick={handleSync}
        disabled={isProcessing}
        variant="secondary"
        className="w-full text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
        Sinkronkan Status
      </Button>
    </div>
  );
}

