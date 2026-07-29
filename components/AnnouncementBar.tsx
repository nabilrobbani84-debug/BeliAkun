import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface AnnouncementBarProps {
  onPromoClick: () => void;
}

export function AnnouncementBar({ onPromoClick }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-300 text-slate-900 border-b-2 border-slate-900 px-4 py-2 font-semibold text-xs sm:text-sm relative z-40 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide border border-slate-900 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> PROMO
          </span>
          <span className="truncate">
            Promo minggu ini: <strong className="font-extrabold">diskon hingga 75%</strong> untuk produk digital pilihan!
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPromoClick}
            className="hidden sm:inline-flex items-center gap-1 bg-white hover:bg-slate-900 hover:text-amber-300 text-slate-900 border border-slate-900 px-3 py-1 rounded-full text-xs font-extrabold transition-all shadow-[1.5px_1.5px_0px_0px_#0F172A] active:translate-x-[0.5px] active:translate-y-[0.5px]"
          >
            Lihat Promo <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-900 hover:bg-amber-400 p-1 rounded-full transition-colors"
            aria-label="Tutup pengumuman"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
