'use client';

import React, { useState } from 'react';
import { submitWarrantyClaim } from '@/lib/actions/warranties';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface WarrantyClaimClientProps {
  warranty: any;
  orderNumber: string;
}

export function WarrantyClaimClient({ warranty, orderNumber }: WarrantyClaimClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const activeClaim = warranty.warranty_claims?.find((c: any) => c.status === 'pending' || c.status === 'processing');
  const isWarrantyExpired = new Date(warranty.valid_until) < new Date();
  
  if (success || activeClaim) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 flex gap-4">
        <ShieldAlert className="w-6 h-6 text-blue-600 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900">Klaim Garansi Sedang Diproses</h4>
          <p className="text-sm text-blue-800 mt-1">Kami sedang meninjau klaim Anda. Harap tunggu pembaruan dari admin.</p>
        </div>
      </div>
    );
  }

  if (isWarrantyExpired && warranty.status === 'active') {
    return (
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 mb-6 flex gap-4 opacity-75">
        <AlertCircle className="w-6 h-6 text-slate-500 shrink-0" />
        <div>
          <h4 className="font-bold text-slate-700">Garansi Habis</h4>
          <p className="text-sm text-slate-600 mt-1">Masa garansi untuk produk ini telah berakhir pada {new Date(warranty.valid_until).toLocaleDateString('id-ID')}.</p>
        </div>
      </div>
    );
  }

  if (warranty.status !== 'active' && warranty.status !== 'rejected') {
    return null; // Don't show if already claimed/replaced
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Mohon jelaskan kendala yang Anda alami.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const res = await submitWarrantyClaim(warranty.id, reason, orderNumber);
    if (res.success) {
      setSuccess(true);
      setIsOpen(false);
    } else {
      setError(res.error || 'Terjadi kesalahan saat mengajukan klaim.');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            Garansi Aktif
          </h4>
          <p className="text-sm text-slate-600 mt-1">
            Berlaku s.d. <span className="font-bold text-slate-800">{new Date(warranty.valid_until).toLocaleDateString('id-ID')}</span>
          </p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors whitespace-nowrap w-full sm:w-auto text-sm"
        >
          Ajukan Klaim
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 sm:p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ajukan Klaim Garansi</h3>
              <p className="text-sm text-slate-600 mb-6">
                Silakan jelaskan kendala yang Anda alami dengan kredensial produk Anda. Admin kami akan segera meninjau klaim Anda.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Penjelasan Kendala</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-32 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-sm"
                    placeholder="Contoh: Password salah, atau layar penuh..."
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Kirim Klaim'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
