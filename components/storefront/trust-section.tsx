'use client';

import React from 'react';
import { Zap, Info, ShieldCheck, Headphones } from 'lucide-react';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { Card } from '@/components/ui/card';

export function TrustSection() {
  const trustPoints = [
    {
      title: 'Proses Cepat',
      desc: 'Pesanan diproses sesuai informasi yang tertera pada setiap produk.',
      icon: Zap,
      color: 'bg-amber-400 text-slate-950',
    },
    {
      title: 'Informasi Produk Jelas',
      desc: 'Harga, durasi, dan ketentuan produk ditampilkan sebelum pembelian.',
      icon: Info,
      color: 'bg-blue-400 text-slate-950',
    },
    {
      title: 'Pembayaran Aman',
      desc: 'Gunakan metode pembayaran yang tersedia dengan proses yang praktis.',
      icon: ShieldCheck,
      color: 'bg-emerald-400 text-slate-950',
    },
    {
      title: 'Bantuan Pelanggan',
      desc: 'Tim bantuan siap membantu jika terdapat kendala pada pesanan.',
      icon: Headphones,
      color: 'bg-purple-400 text-slate-950',
    },
  ];

  return (
    <SectionContainer className="py-3 sm:py-4">
      <PageContainer>
        <Card variant="cartoon" className="p-5 sm:p-8 md:p-10 bg-blue-50/70 dark:bg-blue-950/30 border-[var(--border)]">
          <SectionHeading
            badge="DIJAMIN TERPERCAYA"
            title="Mengapa Pilih Beliakun.com?"
            subtitle="Kenyamanan dan keamanan transaksimu adalah prioritas utama kami."
            align="center"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point, idx) => {
              const Icon = point.icon;
              return (
                <Card
                  key={idx}
                  variant="interactive"
                  className="p-4 sm:p-5 bg-[var(--card)] border-[var(--border)] space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-2xl ${point.color} border-2 border-slate-900 flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000] shrink-0 mb-3`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">
                      {point.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed mt-1">
                      {point.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
