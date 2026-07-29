import React, { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, MessageSquareHeart } from 'lucide-react';
import { REVIEWS } from '@/data/mockData';

export function ReviewCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            <MessageSquareHeart className="w-3.5 h-3.5" /> ULASAN PELANGGAN
          </span>
          <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
            Kata Mereka Tentang Beliakun.com
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="p-2.5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px]"
            aria-label="Ulasan sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2.5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px]"
            aria-label="Ulasan berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden p-1" ref={emblaRef}>
        <div className="flex gap-4">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex-[0_0_88%] sm:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0"
            >
              <div className="cartoon-card p-5 bg-white border-slate-900 h-full flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-2xl ${rev.avatarBg} border-2 border-slate-900 flex items-center justify-center text-lg font-bold shadow-[2px_2px_0px_0px_#0F172A] shrink-0`}
                      >
                        {rev.avatarEmoji}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {rev.name}
                        </h4>
                        <span className="text-[11px] font-bold text-slate-500 block">
                          {rev.productPurchased}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terverifikasi
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-semibold text-right">
                  {rev.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
