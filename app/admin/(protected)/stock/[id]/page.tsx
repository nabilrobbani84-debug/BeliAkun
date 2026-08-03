import { getInventoryItemById, getInventoryEvents } from '@/lib/data/inventory';
import Link from 'next/link';
import { ArrowLeft, Box, Calendar, Clock, FileText, Activity } from 'lucide-react';
import StockDetailClient from './StockDetailClient';
import { notFound } from 'next/navigation';

export default async function StockDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const [item, events] = await Promise.all([
    getInventoryItemById(id),
    getInventoryEvents(id),
  ]);

  if (!item) {
    notFound();
  }

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
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Detail Stok
          </h1>
          <p className="text-sm text-slate-600 font-semibold mt-1">ID: {item.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 border-2 border-blue-900 flex items-center justify-center text-blue-700">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{item.product_name}</h2>
                  <p className="text-slate-600 font-semibold">{item.variant_name}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 shadow-[2px_2px_0px_0px_#0f172a] uppercase tracking-wider ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y-2 border-slate-100">
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">SKU Varian</p>
                 <p className="font-bold text-slate-900 mt-1 font-mono">{item.variant_sku}</p>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">Encryption Ver.</p>
                 <p className="font-bold text-slate-900 mt-1">v{item.encryption_version}</p>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">Dibuat Pada</p>
                 <p className="font-bold text-slate-900 mt-1">
                   {new Date(item.created_at).toLocaleDateString('id-ID')}
                 </p>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">Kedaluwarsa</p>
                 <p className="font-bold text-slate-900 mt-1">
                   {item.expires_at ? new Date(item.expires_at).toLocaleDateString('id-ID') : '-'}
                 </p>
               </div>
            </div>

            <div className="mt-4 space-y-4">
              {item.internal_note && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-1">
                    <FileText className="w-3 h-3" /> Catatan Internal
                  </p>
                  <p className="text-sm text-slate-700 font-semibold bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {item.internal_note}
                  </p>
                </div>
              )}
              {item.usage_instructions && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-1">
                    <FileText className="w-3 h-3" /> Instruksi Penggunaan (Bisa dilihat pembeli)
                  </p>
                  <p className="text-sm text-slate-700 font-semibold bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {item.usage_instructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          <StockDetailClient inventoryId={item.id} currentStatus={item.status as any} />
        </div>

        {/* Sidebar Log Event */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
            <h2 className="font-black text-lg flex items-center gap-2 border-b-2 border-slate-100 pb-4 mb-4">
              <Activity className="w-5 h-5 text-blue-600" /> Riwayat Aktivitas
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {events.map((event, i) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Clock className="w-4 h-4" />
                  </div>
                  
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-slate-50 p-3 rounded-lg border-2 border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 text-sm capitalize">{event.event_type.replace('_', ' ')}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">
                      {new Date(event.created_at).toLocaleString('id-ID')}
                    </div>
                    <div className="text-sm text-slate-700 font-medium leading-tight">
                      {event.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {events.length === 0 && (
              <p className="text-center text-sm font-semibold text-slate-500 py-4">Belum ada aktivitas tercatat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
