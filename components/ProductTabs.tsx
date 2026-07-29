import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Palette, Film, ShieldCheck, Briefcase, Grid, Sparkles } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';

interface ProductTabsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, pkg: ProductPackage, quantity: number) => void;
}

export function ProductTabs({
  products,
  onQuickView,
  onAddToCart,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabOptions = [
    { id: 'all', label: 'Semua Produk', icon: Grid },
    { id: 'ai', label: 'AI Premium', icon: Bot },
    { id: 'design', label: 'Design & Edit', icon: Palette },
    { id: 'entertainment', label: 'Entertainment', icon: Film },
    { id: 'vpn', label: 'VPN & Security', icon: ShieldCheck },
    { id: 'productivity', label: 'Produktivitas', icon: Briefcase },
  ];

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter((p) => p.categoryId === activeTab);
  }, [products, activeTab]);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300">
          <Sparkles className="w-3.5 h-3.5" /> JELAJAHI SESUAI HOBI & KEBUTUHAN
        </span>
        <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
          Pilih Kategori Produk Digital
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
          Bandingkan dan pilih paket akun premium yang paling cocok untuk aktivitas harianmu.
        </p>
      </div>

      {/* Tabs Bar (Shadcn Tabs layout) */}
      <div className="cartoon-card p-2 bg-slate-100 border-slate-900 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none mb-8">
        {tabOptions.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]'
                  : 'bg-white text-slate-800 border-2 border-transparent hover:border-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </motion.div>
    </section>
  );
}
