import React from 'react';
import { Category } from '@/types/store';
import { CategoryCard } from '@/components/CategoryCard';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';

interface CategorySectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  categories: Category[];
}

export function CategorySection({
  selectedCategoryId,
  onSelectCategory,
  categories,
}: CategorySectionProps) {
  const allCategory = {
    id: 'all',
    name: 'Semua Produk',
    slug: 'semua-produk',
    icon: 'Grid',
    count: 13,
    bgColor: 'bg-amber-100 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-300 text-amber-950',
    description: 'Lihat katalog lengkap seluruh produk & layanan digital',
  };

  return (
    <SectionContainer id="categories" className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        {/* Section Header */}
        <SectionHeading
          badge="JELAJAHI KATALOG"
          title="Cari Berdasarkan Kategori"
          subtitle="Pilih kategori kebutuhan digitalmu dari AI, desain, streaming hingga keamanan VPN."
        />

        {/* Grid Categories */}
        <ResponsiveGrid variant="category">
          <CategoryCard
            category={allCategory as any}
            isSelected={selectedCategoryId === 'all'}
            onSelect={onSelectCategory}
          />
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selectedCategoryId === cat.id}
              onSelect={onSelectCategory}
            />
          ))}
        </ResponsiveGrid>
      </PageContainer>
    </SectionContainer>
  );
}
