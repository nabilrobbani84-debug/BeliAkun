import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { CartItem } from '@/types/store';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (appliedDiscount: number, couponCode: string) => void;
}

export function CartSheet({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartSheetProps) {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');
  const [couponErrorMsg, setCouponErrorMsg] = useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.selectedPackage.price * item.quantity,
    0
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponErrorMsg('');
    setCouponSuccessMsg('');

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'BELIAKUN30') {
      const disc = Math.round(subtotal * 0.3);
      setDiscountAmount(disc);
      setCouponSuccessMsg('Voucher 30% Berhasil Dipakai!');
    } else if (cleanCode === 'HEMAT10K') {
      const disc = Math.min(10000, subtotal);
      setDiscountAmount(disc);
      setCouponSuccessMsg('Voucher Rp10.000 Berhasil Dipakai!');
    } else {
      setCouponErrorMsg('Kode voucher tidak ditemukan atau telah kadaluarsa.');
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Sheet Content */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#FAF8F5] border-l-4 border-slate-900 shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Keranjang Belanja</h3>
                  <p className="text-xs text-slate-600 font-semibold">{totalCount} item dipilih</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors shadow-[2px_2px_0px_0px_#0F172A]"
                aria-label="Tutup keranjang"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-24 h-24 rounded-3xl bg-amber-200 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center mb-4 text-4xl">
                    🛒
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-900 mb-1">Keranjang Masih Kosong</h4>
                  <p className="text-xs text-slate-600 font-medium max-w-xs mb-6">
                    Yuk pilih akun digital favoritmu dengan harga hemat dan proses serba cepat!
                  </p>
                  <button
                    onClick={onClose}
                    className="cartoon-button-primary px-6 py-2.5 text-sm"
                  >
                    Mulai Pilih Produk
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Produk</span>
                    <button
                      onClick={onClearCart}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                    </button>
                  </div>

                  {/* Item List */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="cartoon-card p-3.5 bg-white flex gap-3 relative"
                      >
                        <div className={`w-12 h-12 rounded-2xl ${item.product.logoBg} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center text-white font-extrabold shrink-0 text-sm`}>
                          {item.product.name.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs font-semibold text-blue-600 mt-0.5">
                            {item.selectedPackage.name} ({item.selectedPackage.duration})
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <span className="font-extrabold text-sm text-slate-900">
                              Rp{(item.selectedPackage.price * item.quantity).toLocaleString('id-ID')}
                            </span>

                            {/* Qty controller */}
                            <div className="flex items-center gap-1.5 bg-slate-100 border-2 border-slate-900 rounded-xl p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-900 font-bold border border-slate-900 flex items-center justify-center text-xs"
                                aria-label="Kurangi jumlah"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-extrabold text-xs text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center text-xs"
                                aria-label="Tambah jumlah"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors"
                          aria-label="Hapus dari keranjang"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Promo Voucher Form */}
                  <form onSubmit={handleApplyCoupon} className="cartoon-card p-3.5 bg-amber-50/60 border-slate-900 mt-4">
                    <label className="block text-xs font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600" /> Punya Kode Voucher?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Contoh: BELIAKUN30"
                        className="flex-1 bg-white border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="cartoon-button-accent px-3 py-1.5 text-xs font-extrabold shrink-0"
                      >
                        Pakai
                      </button>
                    </div>
                    {couponSuccessMsg && (
                      <p className="text-[11px] font-extrabold text-emerald-700 mt-2 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {couponSuccessMsg}
                      </p>
                    )}
                    {couponErrorMsg && (
                      <p className="text-[11px] font-bold text-rose-600 mt-2">{couponErrorMsg}</p>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">
                      Gunakan voucher <strong className="text-slate-800">BELIAKUN30</strong> untuk diskon 30%!
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t-2 border-slate-900 space-y-3">
                <div className="space-y-1.5 text-xs font-bold">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rp{subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Diskon Voucher</span>
                      <span>-Rp{discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 text-sm font-extrabold pt-2 border-t border-slate-200">
                    <span>Total Pembayaran</span>
                    <span className="text-base text-blue-600">
                      Rp{finalTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-emerald-50 p-2 rounded-xl border border-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Proses cepat & garansi resmi penggantian akun</span>
                </div>

                <button
                  onClick={() => onCheckout(discountAmount, couponCode)}
                  className="w-full cartoon-button-primary py-3 text-sm flex items-center justify-center gap-2"
                >
                  Lanjut Pembayaran <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
