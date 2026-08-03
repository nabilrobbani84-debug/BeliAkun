'use client';

import { useState } from 'react';
import { revealInventoryCredentialAction, changeInventoryStatusAction } from '@/lib/actions/inventory';
import { Eye, EyeOff, Save, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { InventoryStatus } from '@/lib/supabase/types';

export default function StockDetailClient({
  inventoryId,
  currentStatus,
}: {
  inventoryId: string;
  currentStatus: InventoryStatus;
}) {
  const [credentialData, setCredentialData] = useState<Record<string, string> | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState('');
  
  const [status, setStatus] = useState<InventoryStatus>(currentStatus);
  const [statusReason, setStatusReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleReveal = async () => {
    setIsRevealing(true);
    setError('');
    
    const res = await revealInventoryCredentialAction(inventoryId);
    if (res.success && res.data) {
      setCredentialData(res.data);
      // Auto hide after 60 seconds
      setTimeout(() => setCredentialData(null), 60000);
    } else {
      setError(res.error || 'Gagal membuka credential');
    }
    setIsRevealing(false);
  };

  const handleChangeStatus = async () => {
    if (!statusReason) {
      alert('Mohon isi alasan perubahan status');
      return;
    }
    setIsUpdatingStatus(true);
    const res = await changeInventoryStatusAction(inventoryId, status, statusReason);
    if (res.success) {
      alert('Status berhasil diubah!');
      setStatusReason('');
    } else {
      alert(res.error || 'Gagal mengubah status');
    }
    setIsUpdatingStatus(false);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Credential Card */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
          <h2 className="font-black text-lg flex items-center gap-2">
            Data Kredensial Stok
          </h2>
          <button
            onClick={() => {
              if (credentialData) setCredentialData(null);
              else handleReveal();
            }}
            disabled={isRevealing}
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-900 rounded-lg text-sm font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:bg-slate-50 transition-all hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a]"
          >
            {credentialData ? (
              <><EyeOff className="w-4 h-4" /> Sembunyikan</>
            ) : (
              <><Eye className="w-4 h-4" /> Tampilkan Data</>
            )}
          </button>
        </div>

        {error && <p className="text-sm font-bold text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credentialData ? (
            Object.entries(credentialData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">{key}</span>
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg font-mono text-sm break-all">
                  {value}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-8">
              <p className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                Data kredensial dienkripsi. Klik Tampilkan Data untuk melihat.
              </p>
            </div>
          )}
        </div>
        
        {credentialData && (
          <p className="text-xs font-semibold text-amber-600 mt-4 bg-amber-50 p-2 rounded border border-amber-200">
            Peringatan: Data akan disembunyikan otomatis dalam 60 detik untuk keamanan. Pastikan Anda berada di tempat yang aman saat menampilkan kredensial.
          </p>
        )}
      </div>

      {/* Change Status Card */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
         <h2 className="font-black text-lg border-b-2 border-slate-100 pb-4 mb-4">
            Ubah Status Stok
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Status Baru</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InventoryStatus)}
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none"
              >
                <option value="available">Tersedia (Available)</option>
                <option value="invalid">Tidak Valid (Invalid)</option>
                <option value="expired">Kedaluwarsa (Expired)</option>
                <option value="replaced">Diganti (Replaced)</option>
                {/* Note: reserved and sold are handled by order logic usually, not manually */}
              </select>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-700 block mb-1">Alasan Perubahan</label>
               <input
                 type="text"
                 value={statusReason}
                 onChange={(e) => setStatusReason(e.target.value)}
                 placeholder="Misal: Kredensial tidak bisa login"
                 className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none"
               />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
             <button
                onClick={handleChangeStatus}
                disabled={isUpdatingStatus || status === currentStatus}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-900 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[3px_3px_0px_0px_#0f172a] disabled:opacity-50 transition-all"
             >
                <Save className="w-5 h-5" />
                Simpan Perubahan Status
             </button>
          </div>
      </div>
    </div>
  );
}
