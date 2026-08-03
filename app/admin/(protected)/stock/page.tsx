import Link from 'next/link';
import { getInventoryKPIs, getInventoryItems } from '@/lib/data/inventory';
import { Plus, Search, ShieldCheck } from 'lucide-react';

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page as string) || 1;
  const statusFilter = resolvedParams.status as any;
  const searchFilter = resolvedParams.search as string;
  const from = (page - 1) * 20;

  const [kpis, { data: items, count }] = await Promise.all([
    getInventoryKPIs(),
    getInventoryItems(page, 20, { status: statusFilter, search: searchFilter }),
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'invalid': return 'bg-red-100 text-red-800 border-red-300';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'replaced': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Tersedia',
      reserved: 'Direservasi',
      sold: 'Terjual',
      invalid: 'Tidak Valid',
      expired: 'Kedaluwarsa',
      replaced: 'Diganti'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" /> Manajemen Stok
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">Kelola ketersediaan akun dan license key aman terenkripsi</p>
        </div>
        <Link
          href="/admin/stock/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] border-2 border-slate-900 transition-all hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_#0f172a]"
        >
          <Plus className="w-5 h-5" />
          Tambah Stok
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Tersedia', value: kpis.available, color: 'text-green-600' },
          { label: 'Direservasi', value: kpis.reserved, color: 'text-yellow-600' },
          { label: 'Terjual', value: kpis.sold, color: 'text-blue-600' },
          { label: 'Lainnya', value: kpis.other, color: 'text-slate-600' },
          { label: 'Total Stok', value: kpis.total, color: 'text-slate-900' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[2px_2px_0px_0px_#000]">
            <p className="text-xs font-bold text-slate-500 uppercase">{kpi.label}</p>
            <p className={`text-2xl font-black mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        <div className="p-4 border-b-2 border-slate-900 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Daftar Inventory</h2>
          
          <form className="relative flex-1 max-w-sm ml-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              name="search"
              defaultValue={searchFilter}
              type="text" 
              placeholder="Cari SKU varian atau produk..." 
              className="w-full pl-9 pr-4 py-2 text-sm font-semibold border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:ring-0 outline-none"
            />
          </form>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-600 font-bold text-xs uppercase">
                <th className="p-4 w-16 text-center">No</th>
                <th className="p-4">Produk & Varian</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Status</th>
                <th className="p-4">Kedaluwarsa</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                    Tidak ada data stok ditemukan.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4 text-center font-bold text-slate-400">{from + index + 1}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <p className="text-xs font-semibold text-slate-500">{item.variant_name}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-300 font-semibold">{item.variant_sku}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.expires_at ? new Date(item.expires_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        href={`/admin/stock/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm underline underline-offset-2"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
