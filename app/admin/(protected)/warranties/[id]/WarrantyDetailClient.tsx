'use client';

import React, { useState } from 'react';
import { adminProcessWarrantyClaim } from '@/lib/actions/warranties';
import { CheckCircle2, XCircle, Clock, AlertCircle, Save } from 'lucide-react';

export function WarrantyDetailClient({ claim }: { claim: any }) {
  const [status, setStatus] = useState(claim.status);
  const [adminNotes, setAdminNotes] = useState(claim.admin_notes || '');
  const [replacementCredential, setReplacementCredential] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (status === 'resolved' && !replacementCredential.trim()) {
      setError('Mohon masukkan kredensial pengganti untuk status Selesai (Resolved).');
      return;
    }
    
    if (status === 'rejected' && !adminNotes.trim()) {
      setError('Catatan admin wajib diisi untuk status Ditolak.');
      return;
    }

    setIsSubmitting(true);
    let credentialObj = null;

    if (status === 'resolved' && replacementCredential.trim()) {
      try {
        // Assume input could be JSON or plain text. If plain text, wrap in an object for consistency.
        try {
          credentialObj = JSON.parse(replacementCredential);
        } catch (_) {
          credentialObj = { text: replacementCredential };
        }
      } catch (err) {
        setError('Gagal memproses kredensial.');
        setIsSubmitting(false);
        return;
      }
    }

    const res = await adminProcessWarrantyClaim(claim.id, status, adminNotes, credentialObj);
    
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Terjadi kesalahan saat memproses klaim.');
    }
    
    setIsSubmitting(false);
  };

  const isResolved = claim.status === 'resolved';

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 border-b-2 border-slate-100 pb-4">Proses Klaim Garansi</h2>

      <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2">Kendala Pelanggan:</h3>
        <p className="text-slate-600 whitespace-pre-wrap">{claim.reason}</p>
      </div>

      {isResolved ? (
        <div className="bg-emerald-50 text-emerald-800 p-5 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-emerald-900">Klaim Telah Diselesaikan</h3>
          </div>
          <p className="text-sm font-medium">Catatan: {claim.admin_notes}</p>
          {claim.warranty_replacements?.[0] && (
            <div className="mt-4 bg-emerald-900 text-emerald-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify(claim.warranty_replacements[0].credential_snapshot, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Status Proses</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="radio" name="status" value="processing" checked={status === 'processing'} onChange={() => setStatus('processing')} className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4"/> Diproses</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="radio" name="status" value="resolved" checked={status === 'resolved'} onChange={() => setStatus('resolved')} className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Selesai (Ganti Akun)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="radio" name="status" value="rejected" checked={status === 'rejected'} onChange={() => setStatus('rejected')} className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-red-700 flex items-center gap-2"><XCircle className="w-4 h-4"/> Ditolak</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {status === 'resolved' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kredensial Pengganti (JSON / Teks)</label>
                  <textarea
                    value={replacementCredential}
                    onChange={(e) => setReplacementCredential(e.target.value)}
                    className="w-full h-24 p-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none font-mono text-sm bg-emerald-50 resize-none"
                    placeholder='{"email": "...", "password": "..."}'
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Admin (Untuk Pelanggan)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full h-24 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Penjelasan status klaim..."
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Klaim berhasil diperbarui!
            </div>
          )}

          <div className="pt-4 border-t-2 border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Save className="w-5 h-5" />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
