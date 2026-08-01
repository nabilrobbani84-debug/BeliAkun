'use client';

import React from 'react';
import { Product, ProductPackage } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/beliakun-ui/empty';

interface AllProductsSectionProps {
  products: Product[];
  selectedCategoryId: string;
  onResetCategory: () => void;
  onQuickView: (product: Product) => void;
  onDirectBuy: (product: Product, pkg: ProductPackage) => void;
}

export function AllProductsSection({
  products,
  selectedCategoryId,
  onResetCategory,
  onQuickView,
  onDirectBuy,
}: AllProductsSectionProps) {
  const categoryTitleMap: Record<string, string> = {
    all: 'Semua Produk',
    ai: 'Produk AI Premium',
    capcut: 'CapCut Premium',
    claude: 'Claude Pro',
    chatgpt: 'ChatGPT Plus',
    gemini: 'Gemini Advanced',
    canva: 'Canva Pro',
    vpn: 'VPN Premium',
    streaming: 'Streaming & Entertainment',
    design: 'Design & Editing',
  };

  const title = categoryTitleMap[selectedCategoryId] || `Kategori: ${selectedCategoryId.toUpperCase()}`;

  return (
    <SectionContainer id="products" className="py-3 sm:py-4">
      <PageContainer>
        {/* Header with Title & Action Filter Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <SectionHeading
            badge="KATALOG LENGKAP"
            title={title}
            subtitle="Temukan akun dan layanan premium yang tersedia di Beliakun.com."
            className="mb-0"
          />

          {selectedCategoryId !== 'all' && (
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--muted-foreground)]">
                Filter Aktif: <strong className="text-blue-600 uppercase">{selectedCategoryId}</strong>
              </span>
              <Button size="xs" variant="outline" onClick={onResetCategory}>
                Tampilkan Semua
              </Button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <Empty
            variant="product"
            title="Belum Ada Produk di Kategori Ini"
            description="Coba pilih kategori lain atau lihat katalog lengkap kami."
            actionLabel="Tampilkan Semua Produk"
            onAction={onResetCategory}
          />
        ) : (
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onDirectBuy={onDirectBuy}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </SectionContainer>
  );
}
