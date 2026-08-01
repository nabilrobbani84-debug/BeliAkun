import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PlusCircle, Search, Edit2, Eye, AlertCircle, HelpCircle } from 'lucide-react'

export const revalidate = 0

// Helper to format Rupiah
function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>
}) {
  const params = await props.searchParams
  const q = params.q || ''
  const categoryFilter = params.category || ''
  const statusFilter = params.status || ''

  const supabase = await createClient()

  // 1. Fetch categories for filter dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('sort_order', { ascending: true })

  // 2. Fetch products with category details and variant prices
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (name),
      product_variants (price)
    `)
    .order('sort_order', { ascending: true })

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }
  if (categoryFilter) {
    query = query.eq('category_id', categoryFilter)
  }
  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data: products, error } = await query

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-black text-3xl text-slate-900">Produk</h1>
          <p className="font-semibold text-slate-500 text-xs sm:text-sm mt-1">
            Kelola katalog produk digital Anda.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all text-sm w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Tambah Produk
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="cartoon-card p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex flex-col lg:flex-row gap-4 items-center justify-between">
        <form method="GET" className="w-full lg:max-w-xs relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama produk..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </form>

        <form method="GET" className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
          {/* Preserve search string */}
          {q && <input type="hidden" name="q" value={q} />}

          <select
            name="category"
            defaultValue={categoryFilter}
            className="flex-1 lg:flex-initial px-3 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs bg-white focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={statusFilter}
            className="flex-1 lg:flex-initial px-3 py-2 rounded-xl border-2 border-slate-900 font-bold text-xs bg-white focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="draft">Draf</option>
            <option value="inactive">Non-aktif</option>
            <option value="archived">Diarsipkan</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl border-2 border-slate-900 bg-slate-950 text-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800 transition-all"
          >
            Filter
          </button>
          {(categoryFilter || statusFilter || q) && (
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl border-2 border-slate-900 bg-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all text-slate-700"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* List / Table */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-900 rounded-xl text-red-950 font-bold text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Gagal memuat data produk.
        </div>
      )}

      {!products || products.length === 0 ? (
        <div className="cartoon-card p-12 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] text-center">
          <p className="font-bold text-slate-500">Belum ada produk yang tersedia.</p>
        </div>
      ) : (
        <div className="cartoon-card border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b-3 border-slate-900 text-slate-800 font-black uppercase text-xs tracking-wider">
                  <th className="p-4">Nama Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Pengiriman</th>
                  <th className="p-4">Harga Terendah</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-semibold text-slate-700">
                {products.map((prod: any) => {
                  const prices = prod.product_variants?.map((v: any) => v.price) || []
                  const minPrice = prices.length > 0 ? Math.min(...prices) : null

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-slate-950 block">{prod.name}</span>
                          <span className="text-xs text-slate-400 font-mono">{prod.slug}</span>
                        </div>
                      </td>
                      <td className="p-4">{prod.categories?.name || '-'}</td>
                      <td className="p-4">
                        <span className="text-xs font-bold px-2 py-0.5 border border-slate-900 bg-slate-100 rounded">
                          {prod.delivery_method === 'instant' ? 'Instan' : 'Manual'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-950">
                        {minPrice !== null ? formatRupiah(minPrice) : <span className="text-xs text-slate-400 font-normal">Belum ada varian</span>}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000]
                            ${prod.status === 'active' ? 'bg-emerald-100 text-emerald-950' : ''}
                            ${prod.status === 'draft' ? 'bg-slate-100 text-slate-650' : ''}
                            ${prod.status === 'inactive' ? 'bg-red-100 text-red-950' : ''}
                            ${prod.status === 'archived' ? 'bg-amber-100 text-amber-950' : ''}
                          `}
                        >
                          {prod.status === 'active' && 'Aktif'}
                          {prod.status === 'draft' && 'Draf'}
                          {prod.status === 'inactive' && 'Non-aktif'}
                          {prod.status === 'archived' && 'Arsip'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/admin/products/${prod.id}`}
                            className="p-2 rounded-lg border-2 border-slate-900 bg-blue-50 hover:bg-blue-100 shadow-[1.5px_1.5px_0px_0px_#000]"
                            title="Detail & Kelola"
                          >
                            <Eye className="w-4 h-4 text-blue-700" />
                          </Link>
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_0px_#000]"
                            title="Edit Info Dasar"
                          >
                            <Edit2 className="w-4 h-4 text-slate-700" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
