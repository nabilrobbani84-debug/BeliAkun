import React from 'react';
import { Badge } from '@/components/ui/badge';

export function FooterPaymentMethods() {
  const paymentMethods = [
    { name: 'QRIS', alt: 'Metode Pembayaran QRIS Instant' },
    { name: 'GoPay', alt: 'Metode Pembayaran GoPay' },
    { name: 'OVO', alt: 'Metode Pembayaran OVO' },
    { name: 'DANA', alt: 'Metode Pembayaran DANA' },
    { name: 'ShopeePay', alt: 'Metode Pembayaran ShopeePay' },
    { name: 'BCA', alt: 'Transfer Bank BCA' },
    { name: 'Mandiri', alt: 'Transfer Bank Mandiri' },
    { name: 'BRI', alt: 'Transfer Bank BRI' },
  ];

  return (
    <div className="py-4 sm:py-5 border-t border-b border-[var(--border)]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <span className="text-xs font-extrabold text-[var(--foreground)] shrink-0">
        Metode Pembayaran:
      </span>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {paymentMethods.map((method, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-[var(--border)]/40 bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--card)] transition-colors shadow-none"
            aria-label={method.alt}
          >
            {method.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
