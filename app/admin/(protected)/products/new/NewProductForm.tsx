'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProduct } from '@/lib/actions/products'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { Category } from '@/lib/supabase/types'

export default function NewProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState<string[]>([''])
  const [badge, setBadge] = useState<'none' | 'bestseller' | 'saving' | 'new' | 'limited_stock'>('none')
  const [deliveryMethod, setDeliveryMethod] = useState<'instant' | 'manual'>('manual')
  const [warrantyEnabled, setWarrantyEnabled] = useState(false)
  const [warrantyDuration, setWarrantyDuration] = useState<number | null>(7)
  const [warrantyUnit, setWarrantyUnit] = useState<'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom' | null>('day')
  const [warrantyLabel, setWarrantyLabel] = useState('7 Hari Garansi')
  const [status, setStatus] = useState<'draft' | 'active' | 'inactive' | 'archived'>('draft')
  const [sortOrder, setSortOrder] = useState(0)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleNameChange = (val: string) => {
    setName(val)
    const slugified = val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setSlug(slugified)
  }

  const handleAddFeature = () => {
    setFeatures([...features, ''])
  }

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx))
  }

  const handleFeatureChange = (idx: number, val: string) => {
    const updated = [...features]
    updated[idx] = val
    setFeatures(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    // Filter empty features
    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean)

    const res = await createProduct({
      category_id: categoryId,
      name,
      slug,
      short_description: shortDescription,
      description,
      features: cleanFeatures,
      badge,
      delivery_method: deliveryMethod,
      warranty_enabled: warrantyEnabled,
      warranty_duration: warrantyEnabled ? warrantyDuration : null,
      warranty_unit: warrantyEnabled ? warrantyUnit : null,
      warranty_label: warrantyEnabled ? warrantyLabel : '',
      status,
      sort_order: sortOrder,
    })

    if (!res.success) {
      setErrorMsg(res.error || 'Gagal membuat produk.')
      setIsSubmitting(false)
    } else {
      router.push(`/admin/products/${res.data.id}`) // Go to detail page to configure variants
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#000]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-black text-2xl sm:text-3xl text-slate-900">Tambah Produk Baru</h1>
          <p className="font-semibold text-slate-500 text-xs sm:text-sm">
            Isi detail dasar produk sebelum menambahkan variasi paket.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 border-2 border-red-900 rounded-xl text-red-955 font-bold text-xs">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Section 1: Info Dasar */}
        <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
          <h2 className="font-black text-lg border-b-2 border-slate-100 pb-2 text-slate-950">1. Informasi Dasar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Nama Produk</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
                placeholder="ChatGPT Plus"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-mono"
                placeholder="chatgpt-plus"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              >
                <option value="none">Tanpa Badge</option>
                <option value="bestseller">Terlaris (Bestseller)</option>
                <option value="saving">Hemat (Saving)</option>
                <option value="new">Produk Baru (New)</option>
                <option value="limited_stock">Stok Terbatas (Limited Stock)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Deskripsi Singkat (Tampil di Grid)</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              placeholder="Akses GPT-4 yang lebih cerdas dan cepat."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Deskripsi Lengkap (Detail Halaman)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              placeholder="Berikan detail lengkap produk..."
            />
          </div>
        </div>

        {/* Section 2: Fitur Dinamis */}
        <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
          <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2">
            <h2 className="font-black text-lg text-slate-950">2. Fitur & Keunggulan</h2>
            <button
              type="button"
              onClick={handleAddFeature}
              className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg border-2 border-slate-900 bg-slate-100 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Fitur
            </button>
          </div>

          <div className="space-y-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-slate-900 font-semibold text-sm"
                  placeholder={`Fitur #${idx + 1}`}
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-2 border-2 border-red-950 bg-red-50 text-red-700 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Garansi & Pengiriman */}
        <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
          <h2 className="font-black text-lg border-b-2 border-slate-100 pb-2 text-slate-950">3. Pengiriman & Garansi</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">Metode Pengiriman</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="manual"
                    checked={deliveryMethod === 'manual'}
                    onChange={() => setDeliveryMethod('manual')}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Manual oleh Admin
                </label>
                <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="instant"
                    checked={deliveryMethod === 'instant'}
                    onChange={() => setDeliveryMethod('instant')}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Instan (Otomatis dari Stok)
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">Status Garansi</label>
              <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={warrantyEnabled}
                  onChange={(e) => setWarrantyEnabled(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded border-2 border-slate-900"
                />
                Produk Memiliki Garansi
              </label>
            </div>
          </div>

          {warrantyEnabled && (
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in-50 duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">Durasi Garansi</label>
                <input
                  type="number"
                  value={warrantyDuration || ''}
                  onChange={(e) => setWarrantyDuration(parseInt(e.target.value) || null)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">Satuan Durasi</label>
                <select
                  value={warrantyUnit || 'day'}
                  onChange={(e) => setWarrantyUnit(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold text-xs"
                >
                  <option value="day">Hari</option>
                  <option value="week">Minggu</option>
                  <option value="month">Bulan</option>
                  <option value="year">Tahun</option>
                  <option value="lifetime">Selamanya (Lifetime)</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600">Label Garansi (UI)</label>
                <input
                  type="text"
                  value={warrantyLabel}
                  onChange={(e) => setWarrantyLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Status Katalog */}
        <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
          <h2 className="font-black text-lg border-b-2 border-slate-100 pb-2 text-slate-950">4. Publikasi & Urutan</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              >
                <option value="draft">Draf (Tidak Tampil di Toko)</option>
                <option value="active">Aktif (Langsung Tampil)</option>
                <option value="inactive">Non-aktif</option>
                <option value="archived">Diarsipkan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Urutan Tampil</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-100 flex justify-end gap-3">
            <Link
              href="/admin/products"
              className="py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all text-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Memproses...' : 'Lanjutkan ke Varian'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
