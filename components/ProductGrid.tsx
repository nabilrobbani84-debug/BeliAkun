import React from 'react';
import { Sparkles } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';

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
    <section id="products" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-900 bg-amber-300 px-3 py-1 rounded-full border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A]">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" /> TERLALU SAYANG DILEWATKAN
          </span>
          <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
            {title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md">
          {subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
