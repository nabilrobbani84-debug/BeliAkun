'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateCategory } from '@/lib/actions/categories'
import { ArrowLeft, Save } from 'lucide-react'
import { Category } from '@/lib/supabase/types'

export default function EditCategoryForm({ category }: { category: Category }) {
  const router = useRouter()

  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)
  const [description, setDescription] = useState(category.description || '')
  const [status, setStatus] = useState<'active' | 'inactive' | 'archived'>(category.status)
  const [sortOrder, setSortOrder] = useState(category.sort_order)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    const res = await updateCategory(category.id, {
      name,
      slug,
      description,
      status,
      sort_order: sortOrder,
    })

    if (!res.success) {
      setErrorMsg(res.error || 'Gagal memperbarui kategori.')
      setIsSubmitting(false)
    } else {
      router.push('/admin/categories')
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs / Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#000]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-black text-2xl sm:text-3xl text-slate-900">Ubah Kategori</h1>
          <p className="font-semibold text-slate-500 text-xs sm:text-sm">
            Ubah rincian kategori {category.name}.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 border-2 border-red-900 rounded-xl text-red-950 font-bold text-xs">
          {errorMsg}
        </div>
      )}

      {/* Form Card */}
      <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Nama Kategori</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
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
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              >
                <option value="active">Aktif (Tampil di Storefront)</option>
                <option value="inactive">Non-aktif (Draf)</option>
                <option value="archived">Diarsipkan (Arsip)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Urutan Tampil</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-slate-100 flex justify-end gap-3">
            <Link
              href="/admin/categories"
              className="py-2.5 px-4 rounded-xl border-2 border-slate-900 bg-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all text-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Menyimpan...' : 'Perbarui Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
