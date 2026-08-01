import React from 'react';
import { ShieldCheck, Lock, Headphones, CreditCard, Sparkles, Star, Users } from 'lucide-react';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';
import { Card } from '@/components/ui/card';

export function TrustSection() {
  const stats = [
    { label: 'Pesanan Diproses', value: '10.000+', icon: Users, color: 'bg-blue-400' },
    { label: 'Rating Pelanggan', value: '4.9 / 5.0', icon: Star, color: 'bg-amber-400' },
    { label: 'Produk Digital', value: '50+ pilihan', icon: Sparkles, color: 'bg-purple-400' },
    { label: 'Dukungan CS Hari Ini', value: '08:00 - 23:00', icon: Headphones, color: 'bg-emerald-400' },
  ];

  return (
    <SectionContainer className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        {/* Stats Counter Bar */}
        <ResponsiveGrid variant="stat" className="mb-6 sm:mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="p-3.5 sm:p-4 bg-[var(--card)] border-[var(--border)] flex items-center gap-2.5 sm:gap-3.5"
              >
                <div className={`p-2.5 sm:p-3 rounded-2xl ${stat.color} text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-black text-base sm:text-lg md:text-xl text-[var(--foreground)] block leading-none truncate">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wide block mt-1 truncate">
                    {stat.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </ResponsiveGrid>

        {/* Trust Details Container */}
        <Card className="p-5 sm:p-8 bg-blue-50/70 dark:bg-blue-950/30 border-[var(--border)]">
          <SectionHeading
            badge="DIJAMIN TERPERCAYA"
            title="Mengapa Pilih Beliakun.com?"
            subtitle="Kenyamanan dan keamanan transaksimu adalah prioritas utama kami."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <Card className="p-4 sm:p-5 bg-[var(--card)] border-[var(--border)] space-y-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">Garansi Penuh Sesuai Produk</h3>
              <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
                Jika terjadi kendala pada masa aktif langganan, kami siap membantu perbaikan atau penggantian akun baru tanpa biaya tambahan.
              </p>
            </Card>

            <Card className="p-4 sm:p-5 bg-[var(--card)] border-[var(--border)] space-y-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">Harga Transparan & Jelas</h3>
              <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
                Tidak ada biaya tersembunyi. Semua fitur, tipe paket (Shared/Private/Invite), dan durasi dijelaskan secara terbuka sebelum membeli.
              </p>
            </Card>

            <Card className="p-4 sm:p-5 bg-[var(--card)] border-[var(--border)] space-y-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">Dukungan QRIS & E-Wallet</h3>
              <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
                Bayar serba mudah dari GoPay, OVO, Dana, ShopeePay hingga M-Banking favoritmu dengan konfirmasi otomatis cepat.
              </p>
            </Card>
          </div>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
