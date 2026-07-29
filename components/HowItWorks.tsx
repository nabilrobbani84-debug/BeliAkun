import React from 'react';
import { MousePointerClick, Tag, CreditCard, Send, CheckCircle2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Pilih Produk',
      desc: 'Cari dan pilih akun digital premium yang kamu butuhkan.',
      icon: MousePointerClick,
      color: 'bg-blue-400 text-slate-950',
    },
    {
      num: '02',
      title: 'Pilih Paket',
      desc: 'Tentukan durasi langganan (1 bulan, 3 bulan, atau 1 tahun).',
      icon: Tag,
      color: 'bg-amber-400 text-slate-950',
    },
    {
      num: '03',
      title: 'Lakukan Pembayaran',
      desc: 'Bayar dengan mudah via QRIS, E-Wallet, atau Transfer Bank.',
      icon: CreditCard,
      color: 'bg-emerald-400 text-slate-950',
    },
    {
      num: '04',
      title: 'Terima Detail Pesanan',
      desc: 'Akses akun / undangan akan dikirim langsung via WhatsApp.',
      icon: Send,
      color: 'bg-purple-400 text-slate-950',
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
      <div className="cartoon-card p-6 sm:p-10 bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0F172A]">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> PRAKTIS & ANTI RIBET
          </span>
          <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
            Cara Belanja di Beliakun.com
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            Hanya butuh 4 langkah mudah untuk menikmati akun digital favoritmu.
          </p>
        </div>

        {/* Steps Grid / Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="cartoon-card p-5 bg-[#FAF8F5] border-slate-900 relative flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl ${step.color} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center font-black text-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="font-mono font-black text-2xl text-slate-300">
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
