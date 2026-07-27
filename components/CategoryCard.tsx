import React from 'react';
import { Bot, Palette, Film, Briefcase, ShieldCheck, GraduationCap, Share2, Grid, ArrowRight } from 'lucide-react';
import { Category } from '@/types/store';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onSelect: (categoryId: string) => void;
}

export function CategoryCard({ category, isSelected, onSelect }: CategoryCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="w-6 h-6 text-indigo-700" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-pink-700" />;
      case 'Film':
        return <Film className="w-6 h-6 text-amber-700" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-emerald-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-cyan-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-purple-700" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-orange-700" />;
      case 'Grid':
      default:
        return <Grid className="w-6 h-6 text-blue-700" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(category.id)}
      className={`cursor-pointer cartoon-card-hover p-4 sm:p-5 flex flex-col justify-between gap-3 group transition-all relative overflow-hidden ${
        isSelected
          ? 'ring-4 ring-blue-600 bg-blue-50 border-blue-600'
          : `${category.bgColor}`
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="p-3 rounded-2xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] group-hover:rotate-6 transition-transform">
          {getIcon(category.icon)}
        </div>

        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${category.badgeBg}`}>
          {category.count} Produk
        </span>
      </div>

      <div>
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
          <span>{category.name}</span>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" />
        </h3>
        <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2">
          {category.description}
        </p>
      </div>
    </div>
  );
}
