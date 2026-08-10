import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Bot, Palette, Film, ShieldCheck, Briefcase, Grid } from 'lucide-react';
import { Category, Product, ProductPackage } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { SectionHeading } from '@/components/patterns/section-heading';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductTabsProps {
  products: Product[];
  categories?: Category[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, pkg: ProductPackage, quantity: number) => void;
}

export function ProductTabs({
  products,
  categories,
  onQuickView,
  onAddToCart,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabOptions = useMemo(() => {
    const baseTabs = [
      { id: 'all', label: 'Semua Produk', icon: <Grid className="w-4 h-4" /> }
    ];

    if (categories && categories.length > 0) {
      const mappedDbTabs = categories.map((cat) => {
        let iconEl = <Grid className="w-4 h-4" />;
        const slug = cat.slug.toLowerCase();
        if (slug.includes('ai')) iconEl = <Bot className="w-4 h-4" />;
        else if (slug.includes('design') || slug.includes('desain') || slug.includes('edit')) iconEl = <Palette className="w-4 h-4" />;
        else if (slug.includes('entertainment')) iconEl = <Film className="w-4 h-4" />;
        else if (slug.includes('vpn') || slug.includes('security') || slug.includes('keamanan')) iconEl = <ShieldCheck className="w-4 h-4" />;
        else if (slug.includes('productivity') || slug.includes('produktivitas')) iconEl = <Briefcase className="w-4 h-4" />;

        return {
          id: cat.id,
          label: cat.name,
          icon: iconEl
        };
      });
      return [...baseTabs, ...mappedDbTabs];
    }

    return [
      ...baseTabs,
      { id: 'ai', label: 'AI Premium', icon: <Bot className="w-4 h-4" /> },
      { id: 'design', label: 'Design dan Edit', icon: <Palette className="w-4 h-4" /> },
      { id: 'entertainment', label: 'Entertainment', icon: <Film className="w-4 h-4" /> },
      { id: 'vpn', label: 'VPN dan Security', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'productivity', label: 'Produktivitas', icon: <Briefcase className="w-4 h-4" /> },
    ];
  }, [categories]);

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
