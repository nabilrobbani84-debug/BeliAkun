'use client';

import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HomepageCTAProps {
  onExploreProducts: () => void;
}

export function HomepageCTA({ onExploreProducts }: HomepageCTAProps) {
  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/', '_blank');
  };

  return (
    <SectionContainer className="py-3 sm:py-4">
      <PageContainer>
        <Card variant="promotion" className="p-6 sm:p-10 md:p-12 relative overflow-hidden text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-2">
              <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
                Sudah Tahu Produk yang Kamu Cari?
              </h2>
              <p className="text-xs sm:text-base font-medium text-blue-100 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Pilih produk premium yang paling sesuai dan cek detail paketnya sebelum membeli.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 justify-center md:justify-end">
              <Button
                variant="accent"
                onClick={onExploreProducts}
                className="px-6 py-3 text-xs sm:text-sm font-extrabold gap-2 w-full sm:w-auto min-h-[44px]"
              >
                Lihat Semua Produk <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                onClick={handleOpenWhatsApp}
                className="px-6 py-3 text-xs sm:text-sm font-extrabold gap-2 w-full sm:w-auto min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Butuh Bantuan?
              </Button>
            </div>
          </div>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
