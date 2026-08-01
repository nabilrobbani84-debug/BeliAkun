import React from 'react';
import { Star } from 'lucide-react';
import { REVIEWS } from '@/data/mockData';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ReviewCarousel() {
  return (
    <SectionContainer className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        <SectionHeading
          badge="ULASAN PELANGGAN"
          title="Kata Mereka Tentang Beliakun.com"
        />

        <Carousel loop>
          {REVIEWS.map((rev) => (
            <CarouselItem key={rev.id}>
              <Card variant="interactive" className="p-4 sm:p-5 bg-[var(--card)] border-[var(--border)] h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${rev.avatarBg} border-2 border-slate-900 flex items-center justify-center text-base sm:text-lg font-bold shadow-[2px_2px_0px_0px_#000] shrink-0`}
                      >
                        {rev.avatarEmoji}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] leading-tight truncate">
                          {rev.name}
                        </h4>
                        <span className="text-[10px] sm:text-[11px] font-bold text-[var(--muted-foreground)] block truncate">
                          {rev.productPurchased}
                        </span>
                      </div>
                    </div>

                    <Badge variant="verified">✓ Terverifikasi</Badge>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--foreground)] font-medium leading-relaxed italic line-clamp-4">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[10px] sm:text-[11px] text-[var(--muted-foreground)] font-semibold text-right">
                  {rev.date}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </Carousel>
      </PageContainer>
    </SectionContainer>
  );
}
