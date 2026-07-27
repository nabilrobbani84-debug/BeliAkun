import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Star, ArrowRight, Tag } from 'lucide-react';
import { Product } from '@/types/store';

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="relative w-full max-w-2xl bg-[#FAF8F5] border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="p-4 bg-white border-b-2 border-slate-900 flex items-center gap-3">
            <Search className="w-6 h-6 text-slate-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari ChatGPT, Canva, Netflix, Spotify, VPN..."
              className="w-full bg-transparent text-base sm:text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs"
            >
              ESC
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full border border-slate-900 whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`px-3 py-1 rounded-full border border-slate-900 whitespace-nowrap transition-colors ${
                selectedCategory === 'ai'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              AI Premium
            </button>
            <button
              onClick={() => setSelectedCategory('design')}
              className={`px-3 py-1 rounded-full border border-slate-900 whitespace-nowrap transition-colors ${
                selectedCategory === 'design'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              Design & Edit
            </button>
            <button
              onClick={() => setSelectedCategory('entertainment')}
              className={`px-3 py-1 rounded-full border border-slate-900 whitespace-nowrap transition-colors ${
                selectedCategory === 'entertainment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              Entertainment
            </button>
            <button
              onClick={() => setSelectedCategory('productivity')}
              className={`px-3 py-1 rounded-full border border-slate-900 whitespace-nowrap transition-colors ${
                selectedCategory === 'productivity'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              Produktivitas
            </button>
            <button
              onClick={() => setSelectedCategory('vpn')}
              className={`px-3 py-1 rounded-full border border-slate-900 whitespace-nowrap transition-colors ${
                selectedCategory === 'vpn'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-200'
              }`}
            >
              VPN
            </button>
          </div>

          {/* Results List */}
          <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center text-2xl mb-3">
                  🔍
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Produk Tidak Ditemukan
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Coba gunakan kata kunci lain seperti ChatGPT, Canva, Spotify, atau YouTube.
                </p>
              </div>
            ) : (
              filteredProducts.map((prod) => {
                const defaultPkg =
                  prod.packages.find((p) => p.id === prod.defaultPackageId) ||
                  prod.packages[0];
                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="cartoon-card p-3.5 bg-white hover:bg-blue-50/50 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${prod.logoBg} border-2 border-slate-900 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-[2px_2px_0px_0px_#0F172A]`}>
                        {prod.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 truncate">
                          {prod.name}
                        </h5>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block font-extrabold text-sm text-blue-600">
                        Mulai Rp{defaultPkg.price.toLocaleString('id-ID')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {prod.rating}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
