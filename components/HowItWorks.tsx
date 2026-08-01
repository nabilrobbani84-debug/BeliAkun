import React from 'react';
import { MousePointerClick, Tag, CreditCard, Send } from 'lucide-react';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';
import { Card } from '@/components/ui/card';

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
    <SectionContainer id="how-it-works" className="py-8 sm:py-10 md:py-12">
      <PageContainer>
        <Card variant="cartoon" className="p-5 sm:p-8 md:p-10 bg-[var(--card)] border-[var(--border)]">
          {/* Header */}
          <SectionHeading
            badge="PRAKTIS & ANTI RIBET"
            title="Cara Belanja di Beliakun.com"
            subtitle="Hanya butuh 4 langkah mudah untuk menikmati akun digital favoritmu."
            align="center"
          />

          {/* Steps Grid */}
          <ResponsiveGrid variant="step">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.num}
                  variant="interactive"
                  className="p-4 sm:p-5 bg-[var(--background)] border-[var(--border)] relative flex flex-col justify-between"
                >
                  {/* Number Badge */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${step.color} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-xs sm:text-sm shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <span className="font-mono font-black text-xl sm:text-2xl text-[var(--muted-foreground)]/50">
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </ResponsiveGrid>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
