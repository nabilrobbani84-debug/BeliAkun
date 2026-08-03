'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInventoryItemAction } from '@/lib/actions/inventory';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  delivery_fields: any[];
  variants: any[];
};

export default function NewStockForm({ products }: { products: Product[] }) {
  const router = useRouter();
  
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  
  const [credentialData, setCredentialData] = useState<Record<string, string>>({});
  const [internalNote, setInternalNote] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedVariant = selectedProduct?.variants.find((v) => v.id === selectedVariantId);

  const handleSubmit = async (e: React.FormEvent, stay: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!selectedVariant) {
      setError('Pilih produk dan varian terlebih dahulu.');
      setIsSubmitting(false);
      return;
    }

    // Validate fields
    for (const field of selectedProduct!.delivery_fields) {
      if (field.is_required && !credentialData[field.field_key]) {
        setError(`Field ${field.label} wajib diisi.`);
        setIsSubmitting(false);
        return;
      }
    }

    const res = await createInventoryItemAction(selectedVariantId, credentialData, {
      internalNote,
      usageInstructions,
      deliveryNote,
      expiresAt: expiresAt || undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      if (stay) {
        setCredentialData({}); // Reset just credential data
        setInternalNote('');
        setUsageInstructions('');
        setDeliveryNote('');
        setExpiresAt('');
        alert('Stok berhasil ditambahkan!');
      } else {
        router.push('/admin/stock');
      }
    } else {
      setError(res.error || 'Gagal menambahkan stok.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/stock"
          className="p-2 border-2 border-slate-900 rounded-lg hover:bg-slate-100 shadow-[2px_2px_0px_0px_#0f172a] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Tambah Stok Baru</h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">Masukkan kredensial yang akan dikirim ke pembeli secara aman.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-900 text-red-900 p-4 rounded-xl font-bold shadow-[2px_2px_0px_0px_#7f1d1d]">
          {error}
        </div>
      )}

      <form className="space-y-6">
        {/* Pilihan Produk */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
          <h2 className="font-black text-lg border-b-2 border-slate-100 pb-2">1. Pilih Produk & Varian</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Produk</label>
              <select
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 focus:ring-0 outline-none"
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setSelectedVariantId('');
                  setCredentialData({});
                }}
              >
                <option value="">-- Pilih Produk --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Varian (Limited)</label>
              <select
                className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 focus:ring-0 outline-none disabled:bg-slate-100"
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                disabled={!selectedProductId}
              >
                <option value="">-- Pilih Varian --</option>
                {selectedProduct?.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.stock_type === 'unlimited'}>
                    {v.name} {v.stock_type === 'unlimited' ? '(Unlimited - Tdk bisa dipilih)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Credential Dinamis */}
        {selectedProduct && selectedVariant && (
          <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h2 className="font-black text-lg border-b-2 border-slate-100 pb-2">2. Data Credential Pembeli</h2>
            <p className="text-xs font-semibold text-slate-500 pb-2">Field di bawah ini dihasilkan secara otomatis berdasarkan konfigurasi produk. Data ini akan dienkripsi sebelum disimpan ke database.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProduct.delivery_fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">
                    {field.label} {field.is_required && <span className="text-red-500">*</span>}
                  </label>
                  {field.field_type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder || ''}
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none min-h-[100px]"
                      value={credentialData[field.field_key] || ''}
                      onChange={(e) => setCredentialData({ ...credentialData, [field.field_key]: e.target.value })}
                    />
                  ) : (
                    <input
                      type={field.field_type === 'password' || field.field_type === 'pin' || field.field_type === 'code' ? 'text' : field.field_type}
                      placeholder={field.placeholder || ''}
                      className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none"
                      value={credentialData[field.field_key] || ''}
                      onChange={(e) => setCredentialData({ ...credentialData, [field.field_key]: e.target.value })}
                    />
                  )}
                  {field.description && <p className="text-[10px] font-semibold text-slate-400">{field.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Tambahan */}
        {selectedVariant && (
          <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h2 className="font-black text-lg border-b-2 border-slate-100 pb-2">3. Informasi Tambahan (Metadata)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Tanggal Kedaluwarsa (Opsional)</label>
                <input
                  type="date"
                  className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Catatan Internal (Admin Only)</label>
                <input
                  type="text"
                  placeholder="Misal: Beli dari supplier A"
                  className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Instruksi Penggunaan Tambahan (Opsional)</label>
                <textarea
                  placeholder="Instruksi spesifik untuk stok ini (akan dikirim ke pembeli bersama dengan credential)."
                  className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-semibold focus:border-blue-600 outline-none min-h-[80px]"
                  value={usageInstructions}
                  onChange={(e) => setUsageInstructions(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/stock"
            className="px-6 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Batal
          </Link>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting || !selectedVariant}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-900 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] disabled:opacity-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Simpan & Tambah Lagi
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting || !selectedVariant}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-900 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#0f172a] disabled:opacity-50 transition-all"
          >
            <Save className="w-5 h-5" />
            Simpan Stok
          </button>
        </div>
      </form>
    </div>
  );
}
