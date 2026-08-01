import React from 'react';
import { Product, ProductPackage } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, pkg: ProductPackage, quantity: number) => void;
  title?: string;
  subtitle?: string;
}

export function ProductGrid({
  products,
  onQuickView,
  onAddToCart,
  title = 'Produk Paling Dicari',
  subtitle = 'Pilihan akun digital favorit pengguna Beliakun.com dengan garansi resmi dan proses kilat.',
}: ProductGridProps) {
  return (
    <SectionContainer id="products" className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        {/* Header */}
        <SectionHeading
          badge="TERLALU SAYANG DILEWATKAN"
          title={title}
          subtitle={subtitle}
        />

        {/* Grid */}
        <ResponsiveGrid variant="product">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </ResponsiveGrid>
      </PageContainer>
    </SectionContainer>
  );
}
