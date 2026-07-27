import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Zap, ShieldCheck, Check } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, pkg: ProductPackage, quantity: number) => void;
}

export function ProductCard({
  product,
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    product.defaultPackageId || product.packages[0]?.id || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const selectedPackage =
    product.packages.find((p) => p.id === selectedPkgId) || product.packages[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPackage) return;
    onAddToCart(product, selectedPackage, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const mainBadge = product.tags[0] || 'Promo';
  const getBadgeColor = (tag: string) => {
    switch (tag) {
      case 'Terlaris':
        return 'bg-amber-400 text-slate-950';
      case 'Baru':
        return 'bg-emerald-400 text-slate-950';
      case 'Stok Terbatas':
        return 'bg-rose-400 text-slate-950';
      case 'Promo':
      default:
        return 'bg-blue-400 text-slate-950';
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="cartoon-card-hover bg-white p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Top Status Badges */}
      <div className="flex items-center justify-between gap-1 mb-2.5 z-10">
        <span
          className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${getBadgeColor(
            mainBadge
          )}`}
        >
          {mainBadge}
        </span>

        {selectedPackage?.discountPercent && selectedPackage.discountPercent > 0 && (
          <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
            -{selectedPackage.discountPercent}%
          </span>
        )}
      </div>

      {/* Product Logo & Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-11 h-11 rounded-2xl ${product.logoBg} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center text-white font-black text-sm shrink-0 group-hover:scale-105 transition-transform`}
          >
            {product.name.substring(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block truncate">
              {product.category}
            </span>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-snug mb-3">
          {product.description}
        </p>

        {/* Duration / Package Pill Selector */}
        {product.packages.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
            {product.packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border transition-all ${
                  selectedPkgId === pkg.id
                    ? 'bg-blue-600 text-white border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {pkg.duration}
              </button>
            ))}
          </div>
        )}

        {/* Rating & Sales stats */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 mb-3">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>{product.salesCount}+ terjual</span>
        </div>
      </div>

      {/* Pricing & Footer Actions */}
      <div className="pt-2 border-t border-slate-200 space-y-2">
        <div className="flex items-baseline justify-between gap-1">
          <div>
            <span className="block font-black text-sm sm:text-base text-blue-600 leading-none">
              Rp{selectedPackage?.price.toLocaleString('id-ID')}
            </span>
            {selectedPackage?.originalPrice && (
              <span className="text-[10px] font-bold text-slate-400 line-through">
                Rp{selectedPackage.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
            {selectedPackage?.type}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="col-span-2 cartoon-button-secondary py-1.5 px-1 text-[11px] font-extrabold flex items-center justify-center gap-1"
            title="Lihat detail lengkap"
          >
            <Eye className="w-3.5 h-3.5" /> Detail
          </button>

          <button
            onClick={handleAddToCart}
            className={`col-span-3 cartoon-button-primary py-1.5 px-2 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all ${
              isAdded ? 'bg-emerald-500 text-white border-slate-900' : ''
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" /> Masuk!
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> + Keranjang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
