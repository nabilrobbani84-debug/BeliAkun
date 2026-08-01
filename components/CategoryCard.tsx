import React from 'react';
import { Bot, Palette, Film, ShieldCheck, Briefcase, Grid, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: string;
    count: number;
    bgColor: string;
    badgeBg?: string;
  };
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}

export function CategoryCard({ category, isSelected, onSelect }: CategoryCardProps) {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-purple-700 dark:text-purple-300" />;
      case 'Film':
        return <Film className="w-6 h-6 text-rose-700 dark:text-rose-300" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-amber-700 dark:text-amber-300" />;
      case 'Grid':
      default:
        return <Grid className="w-6 h-6 text-blue-700 dark:text-blue-300" />;
    }
  };

  return (
    <Card
      variant={isSelected ? "selected" : "category"}
      onClick={() => onSelect(category.id)}
      className="p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden h-full"
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Badge variant="bestseller">AKTIF</Badge>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-2xl ${category.bgColor} border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] shrink-0 group-hover:scale-105 transition-transform`}>
            {getCategoryIcon(category.icon)}
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]/40">
            {category.count} Produk
          </span>
        </div>

        <h3 className="font-extrabold text-base sm:text-lg text-[var(--foreground)] group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] font-medium mt-1 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)]/20 flex items-center justify-between text-xs font-extrabold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
        <span>Lihat Kategori</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Card>
  );
}
