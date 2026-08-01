'use client';

import React from 'react';
import { Bot, Palette, Film, ShieldCheck, Video, Sparkles, Grid } from 'lucide-react';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { Card } from '@/components/ui/card';

interface ProductCategorySectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function ProductCategorySection({
  selectedCategoryId,
  onSelectCategory,
}: ProductCategorySectionProps) {
  const categoryTiles = [
    {
      id: 'capcut',
      name: 'CapCut',
      icon: Video,
      color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'claude',
      name: 'Claude',
      icon: Sparkles,
      color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      icon: Bot,
      color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
    },
    {
      id: 'gemini',
      name: 'Gemini',
      icon: Bot,
      color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
    },
    {
      id: 'canva',
      name: 'Canva',
      icon: Palette,
      color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'vpn',
      name: 'VPN',
      icon: ShieldCheck,
      color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
    },
    {
      id: 'streaming',
      name: 'Streaming',
      icon: Film,
      color: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300',
    },
    {
      id: 'all',
      name: 'Semua Produk',
      icon: Grid,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
    },
  ];

  return (
    <SectionContainer id="categories" className="py-2.5 sm:py-3.5">
      <PageContainer>
        <SectionHeading
          badge="KATEGORI UTAMA"
          title="Pilih Produk Favoritmu"
          subtitle="Cari produk berdasarkan layanan yang kamu butuhkan."
        />

        {/* Category Shortcut Grid */}
        <div className="grid grid-cols-2 gap-2.5 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-8">
          {categoryTiles.map((tile) => {
            const isSelected = selectedCategoryId === tile.id;
            const Icon = tile.icon;

            return (
              <Card
                key={tile.id}
                variant={isSelected ? 'selected' : 'interactive'}
                onClick={() => onSelectCategory(tile.id)}
                className="p-3 flex flex-col items-center justify-center text-center cursor-pointer group min-h-[90px] sm:min-h-[100px]"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl ${tile.color} border-2 border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)] flex items-center justify-center shrink-0 mb-2 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-extrabold text-xs text-[var(--foreground)] truncate max-w-full">
                  {tile.name}
                </span>
              </Card>
            );
          })}
        </div>
      </PageContainer>
    </SectionContainer>
  );
}
