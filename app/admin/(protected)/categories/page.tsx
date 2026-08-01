import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FolderPlus, Search, Edit2, Archive, AlertCircle } from 'lucide-react'

export const revalidate = 0

export default async function CategoriesPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const params = await props.searchParams
  const q = params.q || ''
  const status = params.status || ''

  const supabase = await createClient()

  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: categories, error } = await query

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-black text-3xl text-slate-900">Kategori</h1>
          <p className="font-semibold text-slate-500 text-xs sm:text-sm mt-1">
            Kelola grup produk untuk Beliakun.com.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all text-sm w-fit"
        >
          <FolderPlus className="w-4 h-4" /> Tambah Kategori
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="cartoon-card p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex flex-col md:flex-row gap-4 items-center justify-between">
        <form method="GET" className="w-full md:max-w-md relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama kategori..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
        </form>

        <div className="flex gap-2 w-full md:w-auto">
          <Link
            href="/admin/categories"
            className={`flex-1 md:flex-initial text-center px-4 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all ${!status ? 'bg-slate-100' : 'bg-white'}`}
          >
            Semua
          </Link>
          <Link
            href="/admin/categories?status=active"
            className={`flex-1 md:flex-initial text-center px-4 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all ${status === 'active' ? 'bg-emerald-100 text-emerald-950' : 'bg-white'}`}
          >
            Aktif
          </Link>
          <Link
            href="/admin/categories?status=archived"
            className={`flex-1 md:flex-initial text-center px-4 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all ${status === 'archived' ? 'bg-amber-100 text-amber-950' : 'bg-white'}`}
          >
            Diarsipkan
          </Link>
        </div>
      </div>

      {/* List / Table */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-900 rounded-xl text-red-950 font-bold text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Gagal memuat data kategori.
        </div>
      )}

      {!categories || categories.length === 0 ? (
        <div className="cartoon-card p-12 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] text-center">
          <p className="font-bold text-slate-500">Belum ada kategori yang tersedia.</p>
        </div>
      ) : (
        <div className="cartoon-card border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-3 border-slate-900 text-slate-800 font-black uppercase text-xs tracking-wider">
                  <th className="p-4">Nama</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Urutan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-semibold text-slate-700">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-950">{cat.name}</td>
                    <td className="p-4 text-xs font-mono">{cat.slug}</td>
                    <td className="p-4">{cat.sort_order}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000]
                          ${cat.status === 'active' ? 'bg-emerald-100 text-emerald-950' : ''}
                          ${cat.status === 'inactive' ? 'bg-slate-100 text-slate-650' : ''}
                          ${cat.status === 'archived' ? 'bg-amber-100 text-amber-950' : ''}
                        `}
                      >
                        {cat.status === 'active' && 'Aktif'}
                        {cat.status === 'inactive' && 'Non-aktif'}
                        {cat.status === 'archived' && 'Diarsipkan'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#000]"
                        >
                          <Edit2 className="w-4 h-4 text-slate-700" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
