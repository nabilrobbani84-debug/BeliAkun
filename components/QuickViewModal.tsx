import React, { useState } from 'react';
import { Star, Check, ShieldCheck, Zap, Tag } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDirectBuy: (product: Product, pkg: ProductPackage) => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onDirectBuy,
}: QuickViewModalProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [prevProductId, setPrevProductId] = useState<string | null>(null);

  const currentProductId = product?.id || null;
  if (currentProductId !== prevProductId) {
    setPrevProductId(currentProductId);
    if (product) {
      setSelectedPackageId(product.defaultPackageId || product.packages[0]?.id || '');
    }
  }

  if (!product) return null;

  const currentPackage =
    product.packages.find((p) => p.id === selectedPackageId) || product.packages[0];

  const handleBuyNowClick = () => {
    if (currentPackage) {
      onDirectBuy(product, currentPackage);
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      {/* Header */}
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${product.logoBg} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-extrabold text-xs sm:text-lg shrink-0`}>
            {product.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <Badge variant="promo">{product.category}</Badge>
            <DialogTitle className="mt-0.5">{product.name}</DialogTitle>
          </div>
        </div>
      </DialogHeader>

      {/* Body Content */}
      <DialogContent>
        {/* Rating & Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
          <Badge variant="warning" className="gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
            <span>{product.rating}</span>
            <span className="text-[var(--muted-foreground)] font-normal hidden xs:inline">({product.reviewCount} ulasan)</span>
          </Badge>

          <Badge variant="success" className="gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{product.salesCount}+ Terjual</span>
          </Badge>

          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Garansi {product.guaranteeDays || 30} Hari</span>
          </Badge>
        </div>

        {/* Product Description */}
        <p className="text-xs sm:text-sm text-[var(--foreground)] font-medium leading-relaxed">
          {product.fullDescription || product.description}
        </p>

        {/* Package Selection */}
        <div>
          <label className="block text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Pilih Durasi & Tipe Paket:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.packages.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              return (
                <Card
                  key={pkg.id}
                  variant={isSelected ? "selected" : "interactive"}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className="p-3 sm:p-3.5 cursor-pointer relative"
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-2.5 right-3">
                      <Badge variant="bestseller">PALING DILIHAT</Badge>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)]">
                        {pkg.name}
                      </h4>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]/40">
                        Tipe: {pkg.type}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block font-extrabold text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-[10px] text-[var(--muted-foreground)] line-through font-semibold">
                          Rp{pkg.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  {pkg.description && (
                    <p className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] font-medium mt-1.5 pt-1.5 border-t border-[var(--border)]/20">
                      {pkg.description}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Checklist */}
        <Card className="p-3.5 sm:p-4 bg-[var(--card)] border-[var(--border)]">
          <h4 className="font-extrabold text-xs text-[var(--foreground)] uppercase tracking-wide mb-2">
            Fitur & Keunggulan Paket Ini:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[var(--foreground)]">
            {product.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="p-0.5 rounded-md bg-emerald-400 text-slate-950 border border-slate-900 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </Card>
      </DialogContent>

      {/* Footer Controls */}
      <DialogFooter className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[var(--muted-foreground)] font-bold block">Harga Paket:</span>
          <span className="font-black text-base sm:text-lg text-blue-600 dark:text-blue-400">
            Rp{(currentPackage?.price || 0).toLocaleString('id-ID')}
          </span>
        </div>

        <Button
          variant="primary"
          onClick={handleBuyNowClick}
          className="w-full sm:w-auto min-h-[44px] px-6 font-extrabold"
        >
          <Zap className="w-4 h-4 text-amber-300" /> Beli Sekarang
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
