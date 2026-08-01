'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createVariant, updateVariant, saveDeliveryFields } from '@/lib/actions/products'
import { ArrowLeft, Save, Plus, Trash2, Edit2, Settings, ListPlus, Sliders } from 'lucide-react'
import { Product, ProductVariant, Category } from '@/lib/supabase/types'

// Helper to format Rupiah
function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ProductDetailManager({
  product,
  categoryName,
  initialVariants,
  initialFields,
}: {
  product: Product
  categoryName: string
  initialVariants: ProductVariant[]
  initialFields: any[]
}) {
  const [activeTab, setActiveTab] = useState<'variants' | 'fields'>('variants')

  // --- Variants State ---
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants)
  const [isEditingVariant, setIsEditingVariant] = useState(false)
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null)
  
  // Variant form fields
  const [vName, setVName] = useState('')
  const [vSku, setVSku] = useState('')
  const [vPrice, setVPrice] = useState(0)
  const [vComparePrice, setVComparePrice] = useState<number | null>(null)
  const [vDurValue, setVDurValue] = useState<number | null>(1)
  const [vDurUnit, setVDurUnit] = useState<'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom'>('month')
  const [vDurLabel, setVDurLabel] = useState('1 Bulan')
  const [vPackLabel, setVPackLabel] = useState('')
  const [vStockType, setVStockType] = useState<'limited' | 'unlimited'>('unlimited')
  const [vAccType, setVAccType] = useState<'invite' | 'sharing' | 'private' | 'license' | 'link_access' | 'custom'>('sharing')
  const [vStatus, setVStatus] = useState<'active' | 'inactive' | 'archived'>('active')
  const [vSortOrder, setVSortOrder] = useState(0)

  const [vError, setVError] = useState('')
  const [vSubmitting, setVSubmitting] = useState(false)

  // --- Fields State ---
  const [deliveryFields, setDeliveryFields] = useState<any[]>(
    initialFields.map((f) => ({ ...f, isNew: false }))
  )
  const [fError, setFError] = useState('')
  const [fSubmitting, setFSubmitting] = useState(false)

  // --- Actions ---

  // Handle click Edit Variant
  const handleEditVariantClick = (v: ProductVariant) => {
    setEditingVariantId(v.id)
    setVName(v.name)
    setVSku(v.sku)
    setVPrice(v.price)
    setVComparePrice(v.compare_at_price)
    setVDurValue(v.duration_value)
    setVDurUnit(v.duration_unit as any)
    setVDurLabel(v.duration_label || '')
    setVPackLabel(v.package_label || '')
    setVStockType(v.stock_type as any)
    setVAccType(v.account_type as any)
    setVStatus(v.status as any)
    setVSortOrder(v.sort_order)
    setIsEditingVariant(true)
    setVError('')
  }

  // Handle Click Add Variant
  const handleAddVariantClick = () => {
    setEditingVariantId(null)
    setVName('')
    setVSku('')
    setVPrice(0)
    setVComparePrice(null)
    setVDurValue(1)
    setVDurUnit('month')
    setVDurLabel('1 Bulan')
    setVPackLabel('')
    setVStockType('unlimited')
    setVAccType('sharing')
    setVStatus('active')
    setVSortOrder(variants.length)
    setIsEditingVariant(true)
    setVError('')
  }

  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault()
    setVSubmitting(true)
    setVError('')

    if (vPrice < 0 || (vComparePrice !== null && vComparePrice < 0)) {
      setVError('Harga tidak boleh negatif.')
      setVSubmitting(false)
      return
    }

    if (vComparePrice !== null && vComparePrice <= vPrice) {
      setVError('Harga coret harus lebih besar dari harga jual.')
      setVSubmitting(false)
      return
    }

    const payload = {
      name: vName,
      sku: vSku,
      price: vPrice,
      compare_at_price: vComparePrice,
      duration_value: vDurValue,
      duration_unit: vDurUnit,
      duration_label: vDurLabel,
      package_label: vPackLabel,
      stock_type: vStockType,
      account_type: vAccType,
      status: vStatus,
      sort_order: vSortOrder,
    }

    let res
    if (editingVariantId) {
      res = await updateVariant(editingVariantId, product.id, payload)
    } else {
      res = await createVariant(product.id, payload)
    }

    if (!res.success) {
      setVError(res.error || 'Gagal menyimpan varian.')
      setVSubmitting(false)
    } else {
      // Refresh local list
      if (editingVariantId) {
        setVariants(variants.map((v) => (v.id === editingVariantId ? (res.data as ProductVariant) : v)))
      } else {
        setVariants([...variants, res.data as ProductVariant])
      }
      setIsEditingVariant(false)
      setVSubmitting(false)
    }
  }

  // Delivery Fields handlers
  const handleAddField = () => {
    setDeliveryFields([
      ...deliveryFields,
      {
        field_key: '',
        label: '',
        field_type: 'text',
        is_required: true,
        is_secret: false,
        sort_order: deliveryFields.length,
        isNew: true,
      },
    ])
  }

  const handleRemoveField = (idx: number) => {
    setDeliveryFields(deliveryFields.filter((_, i) => i !== idx))
  }

  const handleFieldChange = (idx: number, key: string, value: any) => {
    const updated = [...deliveryFields]
    updated[idx] = { ...updated[idx], [key]: value }
    setDeliveryFields(updated)
  }

  const handleSaveFields = async () => {
    setFSubmitting(true)
    setFError('')

    // Validate duplicate keys
    const keys = deliveryFields.map((f) => f.field_key.trim().toLowerCase()).filter(Boolean)
    const uniqueKeys = new Set(keys)
    if (keys.length !== uniqueKeys.size) {
      setFError('Setiap field wajib memiliki key unik.')
      setFSubmitting(false)
      return
    }

    const payload = deliveryFields.map((f) => ({
      id: f.isNew ? undefined : f.id,
      field_key: f.field_key,
      label: f.label,
      field_type: f.field_type,
      is_required: f.is_required,
      is_secret: f.is_secret,
      sort_order: f.sort_order,
    }))

    const res = await saveDeliveryFields(product.id, payload)

    if (!res.success) {
      setFError(res.error || 'Gagal menyimpan konfigurasi field.')
    } else {
      // Reload page state
      window.location.reload()
    }
    setFSubmitting(false)
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
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-black text-2xl sm:text-3xl text-slate-900">{product.name}</h1>
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] rounded-full
                ${product.status === 'active' ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-100'}
              `}
            >
              {product.status === 'active' ? 'Aktif' : 'Draf'}
            </span>
          </div>
          <p className="font-semibold text-slate-500 text-xs sm:text-sm mt-0.5">
            Kategori: {categoryName} • Metode: {product.delivery_method === 'instant' ? 'Instan' : 'Manual'}
          </p>
        </div>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all"
        >
          Edit Info Dasar
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('variants')}
          className={`pb-2 px-1 font-black text-sm flex items-center gap-1.5 border-b-3 transition-all
            ${activeTab === 'variants' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          <Sliders className="w-4 h-4" /> Variasi Paket ({variants.length})
        </button>
        <button
          onClick={() => setActiveTab('fields')}
          className={`pb-2 px-1 font-black text-sm flex items-center gap-1.5 border-b-3 transition-all
            ${activeTab === 'fields' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          <ListPlus className="w-4 h-4" /> Konfigurasi Data Pembeli ({deliveryFields.length})
        </button>
      </div>

      {/* --- TAB 1: VARIANTS --- */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          {!isEditingVariant ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={handleAddVariantClick}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-blue-700 transition-all text-xs"
                >
                  <Plus className="w-4 h-4" /> Tambah Variasi
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="cartoon-card p-12 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] text-center">
                  <p className="font-bold text-slate-500">Belum ada variasi paket untuk produk ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="cartoon-card p-5 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex justify-between items-start"
                    >
                      <div className="space-y-2">
                        <div>
                          <span className="font-black text-lg text-slate-950 block">{v.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">{v.sku}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold uppercase">
                          <span className="px-2 py-0.5 border border-slate-900 bg-blue-50 text-blue-950 rounded">
                            {v.account_type === 'sharing' ? 'Sharing' : 'Private'}
                          </span>
                          <span className="px-2 py-0.5 border border-slate-900 bg-amber-50 text-amber-950 rounded">
                            {v.duration_label || 'Lifetime'}
                          </span>
                          {v.package_label && (
                            <span className="px-2 py-0.5 border border-slate-900 bg-purple-50 text-purple-950 rounded">
                              {v.package_label}
                            </span>
                          )}
                        </div>
                        <div className="pt-2">
                          <span className="font-black text-slate-950 text-lg">{formatRupiah(v.price)}</span>
                          {v.compare_at_price && (
                            <span className="text-xs font-bold text-slate-450 line-through ml-2">
                              {formatRupiah(v.compare_at_price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between h-full gap-8">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 border border-slate-900 rounded
                            ${v.status === 'active' ? 'bg-emerald-100 text-emerald-950' : 'bg-slate-100'}
                          `}
                        >
                          {v.status === 'active' ? 'Aktif' : 'Non-aktif'}
                        </span>
                        <button
                          onClick={() => handleEditVariantClick(v)}
                          className="p-1.5 rounded-lg border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // VARIANT FORM
            <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] max-w-2xl">
              <h3 className="font-black text-lg border-b-2 border-slate-100 pb-2 mb-4">
                {editingVariantId ? 'Edit Varian' : 'Tambah Varian Baru'}
              </h3>

              {vError && (
                <div className="p-3 bg-red-100 border-2 border-red-900 rounded-xl text-red-950 font-bold text-xs mb-4">
                  {vError}
                </div>
              )}

              <form onSubmit={handleSaveVariant} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Nama Varian (Paket)</label>
                    <input
                      type="text"
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                      placeholder="1 Bulan (Sharing)"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">SKU (Unik)</label>
                    <input
                      type="text"
                      value={vSku}
                      onChange={(e) => setVSku(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50 font-mono"
                      placeholder="CGPT-1M-SHR"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Harga (Rp)</label>
                    <input
                      type="number"
                      value={vPrice || ''}
                      onChange={(e) => setVPrice(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                      placeholder="49000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Harga Sebelum Diskon (Coret) (Opsional)</label>
                    <input
                      type="number"
                      value={vComparePrice || ''}
                      onChange={(e) => setVComparePrice(parseInt(e.target.value) || null)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                      placeholder="69000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Nilai Durasi</label>
                    <input
                      type="number"
                      value={vDurValue || ''}
                      onChange={(e) => setVDurValue(parseInt(e.target.value) || null)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Satuan Durasi</label>
                    <select
                      value={vDurUnit}
                      onChange={(e) => setVDurUnit(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold text-xs bg-slate-50"
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
                    <label className="text-[10px] font-bold uppercase text-slate-600">Label Durasi (UI)</label>
                    <input
                      type="text"
                      value={vDurLabel}
                      onChange={(e) => setVDurLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                      placeholder="1 Bulan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Label Paket (mis. Hemat)</label>
                    <input
                      type="text"
                      value={vPackLabel}
                      onChange={(e) => setVPackLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                      placeholder="Paling Populer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Tipe Stok</label>
                    <select
                      value={vStockType}
                      onChange={(e) => setVStockType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold text-xs bg-slate-50"
                    >
                      <option value="unlimited">Tak Terbatas (Unlimited)</option>
                      <option value="limited">Terbatas (Limited)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Tipe Akun</label>
                    <select
                      value={vAccType}
                      onChange={(e) => setVAccType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold text-xs bg-slate-50"
                    >
                      <option value="sharing">Sharing (Bersama)</option>
                      <option value="private">Private (Pribadi)</option>
                      <option value="invite">Invite</option>
                      <option value="license">Lisensi</option>
                      <option value="link_access">Link Akses</option>
                      <option value="custom">Kustom</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Status</label>
                    <select
                      value={vStatus}
                      onChange={(e) => setVStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-bold text-xs bg-slate-50"
                    >
                      <option value="active">Aktif (Tampil)</option>
                      <option value="inactive">Non-aktif</option>
                      <option value="archived">Diarsipkan (Arsip)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600">Urutan Tampil</label>
                    <input
                      type="number"
                      value={vSortOrder}
                      onChange={(e) => setVSortOrder(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingVariant(false)}
                    className="py-2 px-4 rounded-xl border-2 border-slate-900 bg-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={vSubmitting}
                    className="inline-flex items-center gap-2 py-2 px-5 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all text-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {vSubmitting ? 'Menyimpan...' : 'Simpan Varian'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: FIELDS --- */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg text-slate-950">Data Pengiriman (Diterima Pembeli)</h3>
            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-blue-700 transition-all text-xs"
            >
              <Plus className="w-4 h-4" /> Tambah Field Data
            </button>
          </div>

          {fError && (
            <div className="p-3 bg-red-100 border-2 border-red-900 rounded-xl text-red-950 font-bold text-xs">
              {fError}
            </div>
          )}

          {deliveryFields.length === 0 ? (
            <div className="cartoon-card p-12 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] text-center">
              <p className="font-bold text-slate-500">Belum ada kolom data pengiriman yang dikonfigurasi.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
                {deliveryFields.map((field, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveField(idx)}
                      className="absolute top-4 right-4 p-1.5 border-2 border-red-950 bg-red-50 text-red-750 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-600">Label (Tampil di Admin/Nota)</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-white"
                          placeholder="Email Akun"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-600">Key (Database slug)</label>
                        <input
                          type="text"
                          value={field.field_key}
                          onChange={(e) => handleFieldChange(idx, 'field_key', e.target.value)}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-white font-mono"
                          placeholder="email_akun"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-600">Tipe Input</label>
                        <select
                          value={field.field_type}
                          onChange={(e) => handleFieldChange(idx, 'field_type', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-900 font-bold text-xs bg-white"
                        >
                          <option value="text">Text (Teks Biasa)</option>
                          <option value="email">Email</option>
                          <option value="password">Password (Disembunyikan)</option>
                          <option value="url">URL Link</option>
                          <option value="code">Kode Aktivasi</option>
                          <option value="pin">PIN</option>
                          <option value="textarea">Textarea (Panjang)</option>
                          <option value="number">Nomor Angka</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.is_required}
                          onChange={(e) => handleFieldChange(idx, 'is_required', e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded border-2 border-slate-900"
                        />
                        Wajib Diisi
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.is_secret}
                          onChange={(e) => handleFieldChange(idx, 'is_secret', e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded border-2 border-slate-900"
                        />
                        Sensitif (Enkripsi/Tutup)
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase text-slate-600">Urutan</label>
                        <input
                          type="number"
                          value={field.sort_order}
                          onChange={(e) => handleFieldChange(idx, 'sort_order', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 rounded-lg border-2 border-slate-900 font-semibold text-xs bg-white text-center"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t-2 border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleSaveFields}
                    disabled={fSubmitting}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all text-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {fSubmitting ? 'Menyimpan...' : 'Simpan Konfigurasi Data'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
