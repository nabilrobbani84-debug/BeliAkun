import React, { useState } from 'react';
import { Star, Eye, Zap } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onDirectBuy: (product: Product, pkg: ProductPackage) => void;
}

export function ProductCard({
  product,
  onQuickView,
  onDirectBuy,
}: ProductCardProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    product.defaultPackageId || product.packages[0]?.id || ''
  );

  const selectedPackage =
    product.packages.find((p) => p.id === selectedPkgId) || product.packages[0];

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPackage) return;
    onDirectBuy(product, selectedPackage);
  };

  const mainBadge = product.tags[0] || 'Promo';
  const getBadgeVariant = (tag: string) => {
    switch (tag) {
      case 'Terlaris':
        return 'bestseller';
      case 'Baru':
        return 'new';
      case 'Stok Terbatas':
        return 'limited';
      case 'Promo':
      default:
        return 'promo';
    }
  };

  return (
    <Card
      variant="product"
      onClick={() => onQuickView(product)}
      className="p-3.5 sm:p-4 group relative overflow-hidden h-full cursor-pointer flex flex-col justify-between"
    >
      {/* Top Status Badges */}
      <div className="flex items-center justify-between gap-1 mb-2.5 z-10">
        <Badge variant={getBadgeVariant(mainBadge)} className="truncate max-w-[110px]">
          {mainBadge}
        </Badge>

        {selectedPackage?.discountPercent && selectedPackage.discountPercent > 0 && (
          <Badge variant="destructive" className="shrink-0 font-black">
            -{selectedPackage.discountPercent}%
          </Badge>
        )}
      </div>

      {/* Product Logo & Header */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${product.logoBg} border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] flex items-center justify-center text-white font-black text-xs sm:text-sm shrink-0 group-hover:scale-105 transition-transform`}
          >
            {product.name.substring(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider block truncate">
              {product.category}
            </span>
            <h3 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-[11px] text-[var(--muted-foreground)] font-medium line-clamp-2 leading-snug mb-3 min-h-[32px]">
          {product.description}
        </p>

        {/* Duration / Package Pill Selector */}
        {product.packages.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-3 mt-auto" onClick={(e) => e.stopPropagation()}>
            {product.packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border min-h-[28px] flex items-center cursor-pointer ${
                  selectedPkgId === pkg.id
                    ? 'bg-blue-600 text-white border-[var(--border)] shadow-[1.5px_1.5px_0px_0px_var(--cartoon-shadow)]'
                    : 'bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]/40 hover:bg-[var(--muted)]/80'
                }`}
              >
                {pkg.duration}
              </button>
            ))}
          </div>
        )}

        {/* Rating & Sales stats */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[var(--muted-foreground)] mb-3 mt-auto">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
          </div>
          <span className="opacity-40">•</span>
          <span>{product.salesCount}+ terjual</span>
        </div>
      </div>

      {/* Pricing & Footer Actions */}
      <div className="pt-2 border-t border-[var(--border)]/20 space-y-2.5">
        <div className="flex items-baseline justify-between gap-1">
          <div>
            <span className="block font-black text-sm sm:text-base text-blue-600 dark:text-blue-400 leading-none">
              {selectedPackage ? `Rp${selectedPackage.price.toLocaleString('id-ID')}` : 'Hubungi Admin'}
            </span>
            {selectedPackage?.originalPrice && (
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] line-through">
                Rp{selectedPackage.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {selectedPackage && (
            <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700 shrink-0">
              {selectedPackage.type}
            </span>
          )}
        </div>

        {/* Direct Buy Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="secondary"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 text-[11px] min-h-[38px] font-extrabold"
            title="Lihat rincian paket"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Detail</span>
          </Button>

          <Button
            variant="primary"
            size="xs"
            onClick={handleBuy}
            className="w-full py-2 text-[11px] min-h-[38px] font-extrabold bg-blue-600 hover:bg-blue-500"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 text-amber-300" />
            <span className="truncate">Beli</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
