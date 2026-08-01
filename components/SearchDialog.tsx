import React, { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { Product } from '@/types/store';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Empty } from '@/components/beliakun-ui/empty';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function SearchDialog({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      return matchesQuery && matchesCat;
    });
  }, [products, query, selectedCategory]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Pencarian Produk Digital</DialogTitle>
      </DialogHeader>

      <DialogContent>
        {/* Search Input */}
        <Input
          leftIcon={<Search className="w-4 h-4 text-[var(--muted-foreground)]" />}
          placeholder="Cari ChatGPT, Canva, Netflix, Spotify, VPN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          autoFocus
        />

        {/* Category Filter Pills */}
        <div className="p-2 bg-[var(--muted)] border border-[var(--border)]/20 rounded-xl flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
          {['all', 'ai', 'design', 'entertainment', 'productivity', 'vpn'].map((catId) => {
            const labelMap: Record<string, string> = {
              all: 'Semua',
              ai: 'AI Premium',
              design: 'Design & Edit',
              entertainment: 'Entertainment',
              productivity: 'Produktivitas',
              vpn: 'VPN',
            };
            const isSelected = selectedCategory === catId;
            return (
              <button
                key={catId}
                type="button"
                onClick={() => setSelectedCategory(catId)}
                className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors min-h-[36px] flex items-center cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-[var(--border)] shadow-[1px_1px_0px_0px_var(--cartoon-shadow)]'
                    : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]'
                }`}
              >
                {labelMap[catId]}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2">
          {filteredProducts.length === 0 ? (
            <Empty
              variant="search"
              title="Produk Tidak Ditemukan"
              description="Coba gunakan kata kunci lain seperti ChatGPT, Canva, Spotify, atau YouTube."
            />
          ) : (
            filteredProducts.map((prod) => {
              const defaultPkg =
                prod.packages.find((p) => p.id === prod.defaultPackageId) ||
                prod.packages[0];
              return (
                <Card
                  key={prod.id}
                  variant="interactive"
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="p-3 sm:p-3.5 bg-[var(--card)] flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${prod.logoBg} border-2 border-slate-900 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-[2px_2px_0px_0px_#000]`}>
                      {prod.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] group-hover:text-blue-600 truncate">
                        {prod.name}
                      </h5>
                      <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block font-extrabold text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      Mulai Rp{defaultPkg.price.toLocaleString('id-ID')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[var(--muted-foreground)] mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {prod.rating}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
