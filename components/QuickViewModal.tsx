import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Check, ShieldCheck, Zap, ShoppingBag, Plus, Minus, Tag } from 'lucide-react';
import { Product, ProductPackage } from '@/types/store';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, pkg: ProductPackage, quantity: number) => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [prevProductId, setPrevProductId] = useState<string | null>(null);

  const currentProductId = product?.id || null;
  if (currentProductId !== prevProductId) {
    setPrevProductId(currentProductId);
    if (product) {
      setSelectedPackageId(product.defaultPackageId || product.packages[0]?.id || '');
      setQuantity(1);
    }
  }

  if (!isOpen || !product) return null;

  const currentPackage =
    product.packages.find((p) => p.id === selectedPackageId) || product.packages[0];

  const handleAddToCartClick = () => {
    if (currentPackage) {
      onAddToCart(product, currentPackage, quantity);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
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
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 10 }}
          className="relative w-full max-w-2xl bg-[#FAF8F5] border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden z-10 my-6"
        >
          {/* Top Header */}
          <div className="p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${product.logoBg} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center text-white font-extrabold text-lg shrink-0`}>
                {product.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {product.category}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 mt-0.5 leading-tight">
                  {product.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors shadow-[2px_2px_0px_0px_#0F172A]"
              aria-label="Tutup detail"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Rating & badges bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-400 text-amber-950">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                <span>{product.rating}</span>
                <span className="text-slate-500 font-normal">({product.reviewCount} ulasan)</span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-400 text-emerald-950">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>{product.salesCount}+ Terjual</span>
              </div>

              <div className="flex items-center gap-1 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-400 text-blue-950">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Garansi {product.guaranteeDays || 30} Hari</span>
              </div>
            </div>

            {/* Product Description */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {product.fullDescription || product.description}
            </p>

            {/* Package Selection */}
            <div>
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-600" /> Pilih Durasi & Tipe Paket:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.packages.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`cursor-pointer cartoon-card p-3.5 border-2 transition-all relative ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600 shadow-[4px_4px_0px_0px_#2563EB]'
                          : 'bg-white border-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {pkg.isPopular && (
                        <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                          PALING DILIHAT
                        </span>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {pkg.name}
                          </h4>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300">
                            Tipe: {pkg.type}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="block font-extrabold text-sm text-blue-600">
                            Rp{pkg.price.toLocaleString('id-ID')}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through font-semibold">
                              Rp{pkg.originalPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>

                      {pkg.description && (
                        <p className="text-[11px] text-slate-600 font-medium mt-1.5 pt-1.5 border-t border-slate-200">
                          {pkg.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features Checklist */}
            <div className="cartoon-card p-4 bg-white border-slate-900">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2.5">
                Fitur & Keunggulan Paket Ini:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-800">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="p-0.5 rounded-md bg-emerald-400 text-slate-950 border border-slate-900 shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-5 bg-white border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <span className="text-xs font-bold text-slate-600">Jumlah:</span>
              <div className="flex items-center gap-2 bg-slate-100 border-2 border-slate-900 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-900 font-bold border border-slate-900 flex items-center justify-center"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-extrabold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right sm:hidden">
                <span className="text-[10px] text-slate-500 font-bold block">Total:</span>
                <span className="font-extrabold text-base text-blue-600">
                  Rp{((currentPackage?.price || 0) * quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:block text-right pr-2">
                <span className="text-[10px] text-slate-500 font-bold block">Total:</span>
                <span className="font-extrabold text-lg text-blue-600">
                  Rp{((currentPackage?.price || 0) * quantity).toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={handleAddToCartClick}
                className="w-full sm:w-auto cartoon-button-primary px-6 py-3 text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Tambah ke Keranjang
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
