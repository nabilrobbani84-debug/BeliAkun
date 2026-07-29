import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, Star } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';

interface FlashSaleSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, pkg: ProductPackage, quantity: number) => void;
  onViewAllPromo: () => void;
}

export function FlashSaleSection({
  products,
  onQuickView,
  onAddToCart,
  onViewAllPromo,
}: FlashSaleSectionProps) {
  // Simple countdown timer logic
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.slice(0, 4);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
      <div className="cartoon-card p-6 sm:p-8 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0F172A] relative overflow-hidden">
        {/* Decorative Background Badges */}
        <div className="absolute top-3 right-3 text-7xl opacity-20 pointer-events-none select-none">
          🔥
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center font-black text-xl shrink-0">
              <Flame className="w-6 h-6 animate-pulse text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs uppercase tracking-wide bg-slate-900 text-amber-300 px-2.5 py-0.5 rounded-full">
                  HOT DEAL
                </span>
                <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                  Stok Terbatas!
                </span>
              </div>
              <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-0.5">
                Promo Terbatas Minggu Ini
              </h2>
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center gap-2 bg-white border-2 border-slate-900 rounded-2xl p-2.5 shadow-[3px_3px_0px_0px_#0F172A] shrink-0">
            <Clock className="w-5 h-5 text-rose-600 animate-spin" />
            <span className="text-xs font-extrabold text-slate-900">Berakhir dalam:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-slate-900">
              <span className="bg-slate-900 text-amber-300 px-2 py-1 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-amber-300 px-2 py-1 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-amber-300 px-2 py-1 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards for Flash Sale */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {flashSaleItems.map((item) => {
            const pkg =
              item.packages.find((p) => p.id === item.defaultPackageId) || item.packages[0];

            return (
              <div
                key={item.id}
                onClick={() => onQuickView(item)}
                className="cartoon-card p-3.5 bg-white border-slate-900 flex flex-col justify-between cursor-pointer group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all relative"
              >
                <div className="absolute top-2 right-2 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                  DISCOUNT
                </div>

                <div>
                  <div className={`w-10 h-10 rounded-xl ${item.logoBg} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center text-white font-extrabold text-xs mb-2`}>
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>

                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                    {pkg.duration} ({pkg.type})
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-1">
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-blue-600 block">
                      Rp{pkg.price.toLocaleString('id-ID')}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through font-semibold block">
                        Rp{pkg.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item, pkg, 1);
                    }}
                    className="cartoon-button-accent p-1.5 text-xs shrink-0"
                    title="Tambah cepat"
                  >
                    + Beli
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-2">
          <button
            onClick={onViewAllPromo}
            className="cartoon-button-primary bg-slate-900 hover:bg-slate-800 text-amber-300 px-6 py-3 text-xs sm:text-sm inline-flex items-center gap-2 border-slate-900"
          >
            Lihat Semua Promo Diskon <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
