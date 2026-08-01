import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PlusCircle, ShoppingBag, FolderOpen, ArrowUpRight, HelpCircle } from 'lucide-react'

export const revalidate = 0 // Disable cache for admin pages

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch KPI data
  const [
    { count: totalCategories },
    { count: totalProducts },
    { count: activeProducts },
    { count: draftProducts },
  ] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
  ])

  const kpis = [
    { name: 'Total Kategori', value: totalCategories || 0, color: 'border-blue-500 bg-blue-50' },
    { name: 'Total Produk', value: totalProducts || 0, color: 'border-purple-500 bg-purple-50' },
    { name: 'Produk Aktif', value: activeProducts || 0, color: 'border-emerald-500 bg-emerald-50' },
    { name: 'Produk Draf', value: draftProducts || 0, color: 'border-amber-500 bg-amber-50' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-black text-3xl sm:text-4xl text-slate-900">Dasbor Admin</h1>
        <p className="font-semibold text-slate-500 text-xs sm:text-sm mt-1">
          Pantau status katalog toko dan kelola aset digital Anda.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] ${kpi.color} flex flex-col justify-between`}
          >
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              {kpi.name}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-950 mt-4">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions & Short Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="cartoon-card p-6 bg-white border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
          <h2 className="font-black text-xl flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" /> Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 font-bold text-sm shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              <span>Tambah Produk</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-900 bg-slate-50 hover:bg-slate-100 font-bold text-sm shadow-[2px_2px_0px_0px_#000] transition-all"
            >
              <span>Tambah Kategori</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Short Guide Card */}
        <div className="cartoon-card p-6 bg-blue-50 border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="font-black text-xl flex items-center gap-2 text-blue-950">
              <HelpCircle className="w-5 h-5 text-blue-600" /> Panduan Cepat
            </h2>
            <p className="text-xs font-semibold text-blue-900 leading-relaxed">
              Katalog produk Beliakun.com menggunakan Supabase untuk penyimpanan data. Perubahan kategori, produk, dan varian yang Anda simpan di sini akan langsung disinkronkan ke halaman utama toko secara instan.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 text-white font-bold border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800 transition-all text-xs"
          >
            Kelola Katalog Produk
          </Link>
        </div>
      </div>
    </div>
  )
}
