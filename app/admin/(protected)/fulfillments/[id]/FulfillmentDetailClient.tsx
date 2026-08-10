'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Send, FileText } from 'lucide-react';
import { adminProcessFulfillment } from '@/lib/actions/fulfillments';

export function FulfillmentDetailClient({ fulfillment }: { fulfillment: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data kredensial (JSON form)
  const [credentialData, setCredentialData] = useState<string>('{\n  "email": "",\n  "password": ""\n}');
  const [notes, setNotes] = useState('');

  const handleProcess = async () => {
    let parsedData = null;
    try {
      parsedData = JSON.parse(credentialData);
    } catch (e) {
      alert('Format Data Kredensial tidak valid. Harap gunakan format JSON yang benar.');
      return;
    }

    if (confirm('Proses pengiriman kredensial ini secara manual? Data kredensial akan disimpan dalam snapshot aman dan pesanan akan ditandai selesai.')) {
      setIsProcessing(true);
      try {
        const res = await adminProcessFulfillment(fulfillment.id, parsedData, notes);
        if (res.success) {
          alert('Berhasil memproses pengiriman kredensial dan mengirim email ke pelanggan.');
          router.refresh();
        } else {
          alert(res.error || 'Gagal memproses pengiriman.');
        }
      } catch (err) {
        alert('Gagal memproses pengiriman.');
      }
      setIsProcessing(false);
    }
  };

  if (fulfillment.status === 'completed') {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
        <CheckCircle className="w-10 h-10 text-emerald-600" />
        <div>
          <p className="font-extrabold text-emerald-900">Pengiriman Selesai</p>
          <p className="text-sm font-medium text-emerald-700 mt-1">Kredensial produk telah terkirim ke pelanggan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fulfillment.status === 'pending' && (
        <>
          <p className="text-sm font-semibold text-slate-500">Masukkan data kredensial (dalam format JSON) untuk dikirimkan secara manual.</p>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Data Kredensial (JSON)
            </label>
            <textarea
              className="w-full h-40 p-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none font-mono text-sm resize-y"
              value={credentialData}
              onChange={(e) => setCredentialData(e.target.value)}
              placeholder="Masukkan data JSON..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Catatan Internal (Opsional)</label>
            <textarea
              className="w-full p-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 outline-none text-sm"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk admin..."
            />
          </div>

          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
            onClick={handleProcess}
            disabled={isProcessing}
          >
            <Send className="w-4 h-4 mr-2" />
            {isProcessing ? 'Memproses...' : 'Proses & Kirim Kredensial'}
          </Button>
        </>
      )}

      {fulfillment.status !== 'pending' && fulfillment.status !== 'completed' && (
        <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">
          Tidak ada tindakan tersedia untuk status ini.
        </div>
      )}
    </div>
  );
}
