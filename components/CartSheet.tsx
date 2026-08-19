'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/cart-provider';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Empty } from '@/components/beliakun-ui/empty';

export function CartSheet() {
  const router = useRouter();
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

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

  return (
    <Sheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} side="right">
      <SheetHeader onClose={() => setIsCartOpen(false)}>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <SheetTitle>Keranjang Belanja</SheetTitle>
            <SheetDescription>{totalCount} item dipilih</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <SheetContent>
        {cartItems.length === 0 ? (
          <Empty
            variant="cart"
            actionLabel="Mulai Pilih Produk"
            onAction={() => setIsCartOpen(false)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]/20">
              <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Daftar Produk</span>
              <button
                onClick={clearCart}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 flex items-center gap-1 min-h-[32px] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Kosongkan
              </button>
            </div>

            {/* Item List */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 sm:p-3.5 bg-[var(--card)] flex gap-2.5 sm:gap-3 relative"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${item.product.logoBg} border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-extrabold shrink-0 text-xs sm:text-sm mt-0.5`}>
                    {item.product.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0 pr-5 sm:pr-6">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                      {item.selectedPackage.name} ({item.selectedPackage.duration})
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-extrabold text-xs sm:text-sm text-[var(--foreground)]">
                        Rp{(item.selectedPackage.price * item.quantity).toLocaleString('id-ID')}
                      </span>

                      {/* Qty controller */}
                      <div className="flex items-center gap-1 bg-[var(--muted)] border-2 border-[var(--border)] rounded-xl p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--foreground)] font-bold border border-[var(--border)] flex items-center justify-center text-xs touch-target cursor-pointer"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-extrabold text-xs text-[var(--foreground)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-bold flex items-center justify-center text-xs touch-target cursor-pointer"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2.5 right-2.5 text-[var(--muted-foreground)] hover:text-rose-600 transition-colors p-1 touch-target cursor-pointer"
                    aria-label="Hapus dari keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>

            {/* Promo Voucher Form */}
            <form onSubmit={handleApplyCoupon} className="cartoon-card p-3 sm:p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border-[var(--border)] mt-4">
              <label className="block text-xs font-extrabold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Punya Kode Voucher?
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Contoh: BELIAKUN30"
                  className="uppercase font-bold"
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  className="shrink-0 min-h-[44px]"
                >
                  Pakai
                </Button>
              </div>
              {couponSuccessMsg && (
                <p className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 mt-2 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {couponSuccessMsg}
                </p>
              )}
              {couponErrorMsg && (
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-2">{couponErrorMsg}</p>
              )}
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5 font-medium">
                Gunakan voucher <strong className="text-[var(--foreground)]">BELIAKUN30</strong> untuk diskon 30%!
              </p>
            </form>
          </>
        )}
      </SheetContent>

      {cartItems.length > 0 && (
        <SheetFooter>
          <div className="space-y-1.5 text-xs font-bold w-full">
            <div className="flex justify-between text-[var(--muted-foreground)]">
              <span>Subtotal</span>
              <span>Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Diskon Voucher</span>
                <span>-Rp{discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-[var(--foreground)] text-xs sm:text-sm font-extrabold pt-2 border-t border-[var(--border)]/20">
              <span>Total Pembayaran</span>
              <span className="text-sm sm:text-base text-blue-600 dark:text-blue-400">
                Rp{finalTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-950 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-300 dark:border-emerald-700 w-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Proses cepat & garansi resmi penggantian akun</span>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setIsCartOpen(false);
              // Handle mock checkout routing. For real implementation, 
              // we might want to pass discount or coupon via query string or context.
              router.push('/checkout');
            }}
            className="w-full py-3 text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            Lanjut Pembayaran <ArrowRight className="w-4 h-4" />
          </Button>
        </SheetFooter>
      )}
    </Sheet>
  );
}
