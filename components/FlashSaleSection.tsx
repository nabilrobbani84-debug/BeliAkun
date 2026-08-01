import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <SectionContainer className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 border-3 sm:border-4 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] sm:shadow-[8px_8px_0px_0px_var(--cartoon-shadow)] relative overflow-hidden text-slate-900">
          {/* Decorative Background Badges */}
          <div className="absolute top-3 right-3 text-5xl sm:text-7xl opacity-20 pointer-events-none select-none">
            🔥
          </div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-slate-900/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center font-black text-lg sm:text-xl shrink-0">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="bestseller" className="bg-slate-900 text-amber-300 border-slate-900">
                    HOT DEAL
                  </Badge>
                  <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                    Stok Terbatas!
                  </span>
                </div>
                <h2 className="font-black text-xl sm:text-2xl md:text-3xl text-slate-900 mt-0.5">
                  Promo Terbatas Minggu Ini
                </h2>
              </div>
            </div>

            {/* Countdown Clock Box */}
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl p-2.5 shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] shrink-0 text-[var(--foreground)]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600 animate-spin shrink-0" />
                <span className="text-[11px] sm:text-xs font-extrabold">Berakhir dalam:</span>
              </div>
              <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm">
                <span className="bg-slate-900 text-amber-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-amber-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-amber-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Product Cards for Flash Sale */}
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {flashSaleItems.map((item) => {
              const pkg =
                item.packages.find((p) => p.id === item.defaultPackageId) || item.packages[0];

              return (
                <Card
                  key={item.id}
                  variant="interactive"
                  onClick={() => onQuickView(item)}
                  className="p-3 sm:p-3.5 bg-[var(--card)] border-[var(--border)] flex flex-col justify-between cursor-pointer group relative h-full"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="destructive" className="text-[9px] sm:text-[10px]">
                      DISCOUNT
                    </Badge>
                  </div>

                  <div>
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.logoBg} border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] flex items-center justify-center text-white font-extrabold text-xs mb-2`}>
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>

                    <h3 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-bold text-[var(--muted-foreground)] block mt-0.5 truncate">
                      {pkg.duration} ({pkg.type})
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border)]/20 flex items-center justify-between gap-1">
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-blue-600 dark:text-blue-400 block">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-[10px] text-[var(--muted-foreground)] line-through font-semibold block">
                          Rp{pkg.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="accent"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item, pkg, 1);
                      }}
                      className="py-1.5 px-2.5 text-[11px] font-extrabold shrink-0 min-h-[36px]"
                      title="Tambah cepat"
                    >
                      + Keranjang
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Footer CTA */}
          <div className="text-center pt-2">
            <Button
              variant="primary"
              onClick={onViewAllPromo}
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 px-6 py-3 text-xs sm:text-sm inline-flex items-center justify-center gap-2 border-slate-900 w-full sm:w-auto"
            >
              Lihat Semua Promo Diskon <ArrowRight className="w-4 h-4 text-amber-300" />
            </Button>
          </div>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
