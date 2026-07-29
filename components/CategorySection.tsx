import React from 'react';
import { Sparkles, Grid } from 'lucide-react';
import { CATEGORIES } from '@/data/mockData';
import { CategoryCard } from '@/components/CategoryCard';

interface CategorySectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySection({
  selectedCategoryId,
  onSelectCategory,
}: CategorySectionProps) {
  const allCategory = {
    id: 'all',
    name: 'Semua Produk',
    slug: 'semua-produk',
    icon: 'Grid',
    count: 13,
    bgColor: 'bg-amber-100',
    badgeBg: 'bg-amber-300 text-amber-950',
    description: 'Lihat katalog lengkap seluruh produk & layanan digital',
  };

  return (
    <section id="categories" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-blue-600 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
            <Sparkles className="w-3.5 h-3.5" /> JELAJAHI KATALOG
          </span>
          <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
            Cari Berdasarkan Kategori
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md">
          Pilih kategori kebutuhan digitalmu dari AI, desain, streaming hingga keamanan VPN.
        </p>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CategoryCard
          category={allCategory}
          isSelected={selectedCategoryId === 'all'}
          onSelect={onSelectCategory}
        />
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isSelected={selectedCategoryId === cat.id}
            onSelect={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
}
