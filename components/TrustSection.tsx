import React from 'react';
import { ShieldCheck, Lock, Headphones, CreditCard, Sparkles, Star, Users, CheckCircle2 } from 'lucide-react';

export function TrustSection() {
  const stats = [
    { label: 'Pesanan Diproses', value: '10.000+', icon: Users, color: 'bg-blue-400' },
    { label: 'Rating Pelanggan', value: '4.9 / 5.0', icon: Star, color: 'bg-amber-400' },
    { label: 'Produk Digital', value: '50+ pilihan', icon: Sparkles, color: 'bg-purple-400' },
    { label: 'Dukungan CS Hari Ini', value: '08:00 - 23:00', icon: Headphones, color: 'bg-emerald-400' },
  ];

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="cartoon-card p-4 bg-white border-slate-900 flex items-center gap-3.5"
            >
              <div className={`p-3 rounded-2xl ${stat.color} text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg sm:text-xl text-slate-900 block leading-none">
                  {stat.value}
                </span>
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide block mt-1">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Details Container */}
      <div className="cartoon-card p-6 sm:p-8 bg-blue-50/70 border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-blue-800 bg-blue-200 px-3 py-1 rounded-full border border-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" /> DIJAMIN TERPERCAYA
          </span>
          <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
            Mengapa Pilih Beliakun.com?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            Kenyamanan dan keamanan transaksimu adalah prioritas utama kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="cartoon-card p-5 bg-white border-slate-900 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-[2px_2px_0px_0px_#0F172A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Garansi Penuh Sesuai Produk</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Jika terjadi kendala pada masa aktif langganan, kami siap membantu perbaikan atau penggantian akun baru tanpa biaya tambahan.
            </p>
          </div>

          <div className="cartoon-card p-5 bg-white border-slate-900 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-[2px_2px_0px_0px_#0F172A]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Harga Transparan & Jelas</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Tidak ada biaya tersembunyi. Semua fitur, tipe paket (Shared/Private/Invite), dan durasi dijelaskan secara terbuka sebelum membeli.
            </p>
          </div>

          <div className="cartoon-card p-5 bg-white border-slate-900 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-[2px_2px_0px_0px_#0F172A]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Dukungan QRIS & E-Wallet</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Bayar serba mudah dari GoPay, OVO, Dana, ShopeePay hingga M-Banking favoritmu dengan konfirmasi otomatis cepat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
