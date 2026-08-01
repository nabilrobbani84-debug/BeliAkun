import React from 'react';
import { FileText, CreditCard, Headphones, ShieldCheck } from 'lucide-react';

export function FooterTrustBar() {
  const trustPoints = [
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Informasi Produk Jelas',
      description: 'Harga, durasi, dan ketentuan produk ditampilkan sebelum pembayaran.',
    },
    {
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Pembayaran Praktis',
      description: 'Tersedia berbagai metode pembayaran yang mudah digunakan.',
    },
    {
      icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />,
      title: 'Bantuan Pesanan',
      description: 'Ada kendala? Hubungi tim bantuan melalui kanal resmi Beliakun.com.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Garansi Sesuai Produk',
      description: 'Ketentuan garansi mengikuti informasi pada masing-masing produk.',
    },
  ];

  return (
    <div className="w-full pb-6 sm:pb-8 border-b border-[var(--border)]/20">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustPoints.map((point, idx) => (
          <div
            key={idx}
            className="cartoon-card p-3 sm:p-3.5 bg-[var(--card)] border-[var(--border)] flex items-start gap-2.5 sm:gap-3 rounded-2xl"
          >
            <div className="p-2 rounded-xl bg-[var(--muted)] border border-[var(--border)]/40 shrink-0 mt-0.5">
              {point.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] leading-tight">
                {point.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] font-medium mt-1 leading-snug">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
