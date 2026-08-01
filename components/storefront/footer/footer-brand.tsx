import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

export function FooterBrand() {
  return (
    <div className="space-y-4 max-w-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-black text-xl shrink-0">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="10" r="4" />
            <path d="M12 14v6m0-3h3" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[9px] shadow-[1px_1px_0px_0px_#000]">
            ✨
          </span>
        </div>
        <span className="font-black text-xl sm:text-2xl text-[var(--foreground)] tracking-tight">
          Beliakun<span className="text-blue-600">.com</span>
        </span>
      </div>

      {/* Brand Description */}
      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-medium leading-relaxed">
        Beliakun.com menyediakan produk dan layanan digital dengan informasi harga, durasi, serta ketentuan yang ditampilkan secara jelas sebelum pembelian.
      </p>

      {/* Small Security Alert */}
      <Alert variant="info" icon={<ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />} className="p-3 text-xs rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border-blue-600/60 shadow-none">
        <p className="text-[11px] sm:text-xs font-semibold leading-normal text-[var(--foreground)]">
          Pastikan kamu hanya melakukan transaksi melalui domain <strong className="font-black text-blue-600 dark:text-blue-400">Beliakun.com</strong> dan kanal bantuan yang tercantum di website ini.
        </p>
      </Alert>
    </div>
  );
}
