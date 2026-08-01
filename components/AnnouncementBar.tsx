import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface AnnouncementBarProps {
  onPromoClick: () => void;
}

export function AnnouncementBar({ onPromoClick }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-300 text-slate-900 border-b-2 border-slate-900 px-2.5 sm:px-5 py-1.5 sm:py-2 font-semibold text-xs sm:text-sm relative z-40">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-slate-900 text-amber-300 px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-extrabold uppercase tracking-wide border border-slate-900 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> PROMO
          </span>
          <span className="truncate text-[10px] sm:text-xs md:text-sm font-bold leading-tight">
            Diskon hingga <strong className="font-extrabold">75%</strong> untuk produk digital pilihan minggu ini!
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onPromoClick}
            className="hidden sm:inline-flex items-center gap-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-300 hover:bg-slate-900 hover:text-amber-300 dark:hover:bg-slate-800 border border-slate-900 px-3 py-1 rounded-full text-xs font-extrabold transition-[transform,box-shadow] duration-100 shadow-[1.5px_1.5px_0px_0px_#0F172A] active:translate-x-[0.5px] active:translate-y-[0.5px] min-h-[32px]"
          >
            Lihat Promo <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-900 hover:bg-amber-400 p-1 rounded-full transition-colors shrink-0 touch-target"
            aria-label="Tutup pengumuman"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
