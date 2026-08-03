import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Bot, Palette, Film, ShieldCheck, Briefcase, Grid } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    { id: 'all', label: 'Semua Produk', icon: <Grid className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Premium', icon: <Bot className="w-4 h-4" /> },
    { id: 'design', label: 'Design & Edit', icon: <Palette className="w-4 h-4" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film className="w-4 h-4" /> },
    { id: 'vpn', label: 'VPN & Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'productivity', label: 'Produktivitas', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter((p) => p.categoryId === activeTab);
  }, [products, activeTab]);

  return (
    <SectionContainer className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        {/* Section Header */}
        <SectionHeading
          badge="JELAJAHI SESUAI HOBI & KEBUTUHAN"
          title="Pilih Kategori Produk Digital"
          subtitle="Bandingkan dan pilih paket akun premium yang paling cocok untuk aktivitas harianmu."
          align="center"
        />

        {/* Tabs Bar */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
          <TabsList className="justify-start sm:justify-center">
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} icon={tab.icon}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Tab Panel Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ResponsiveGrid variant="product">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onDirectBuy={(p, pkg) => onAddToCart(p, pkg, 1)}
              />
            ))}
          </ResponsiveGrid>
        </motion.div>
      </PageContainer>
    </SectionContainer>
  );
}
