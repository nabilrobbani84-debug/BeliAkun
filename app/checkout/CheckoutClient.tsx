'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { submitGuestCheckout } from '@/lib/actions/checkout';
import { Check, ShieldCheck, Mail, ArrowLeft, Loader2 } from 'lucide-react';

interface CheckoutClientProps {
  variant: any;
  product: any;
  checkoutEnabled: boolean;
}

export function CheckoutClient({ variant, product, checkoutEnabled }: CheckoutClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Idempotency key per page load
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const isOutOfStock = variant.stock_type === 'limited' && !variant.is_available;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEnabled) {
      setError('Checkout sedang dipersiapkan. Silakan kembali lagi nanti.');
      return;
    }
    if (isOutOfStock) {
      setError('Stok paket ini baru saja habis. Silakan pilih paket lain.');
      return;
    }
    if (email !== confirmEmail) {
      setError('Konfirmasi email belum sama.');
      return;
    }
    if (!acceptedTerms) {
      setError('Anda harus menyetujui syarat & ketentuan.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await submitGuestCheckout(
        variant.id,
        email,
        confirmEmail,
        idempotencyKey,
        acceptedTerms
      );

      if (result.success && result.orderNumber) {
        router.push(`/pesanan/${result.orderNumber}`);
      } else {
        setError(result.error || 'Terjadi kesalahan. Silakan coba kembali.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError('Pesanan belum dapat dibuat. Silakan coba kembali beberapa saat lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-16">
      {/* Navbar Minimalis */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <span className="font-bold text-lg">Selesaikan Pesanan</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Kolom Kiri: Form Data */}
        <div className="md:col-span-7 space-y-6">
          {!checkoutEnabled && (
            <div className="bg-amber-100 border border-amber-300 text-amber-900 p-4 rounded-xl font-medium">
              Checkout sedang dipersiapkan. Silakan kembali lagi setelah metode pembayaran tersedia.
            </div>
          )}

          {isOutOfStock && checkoutEnabled && (
            <div className="bg-red-100 border border-red-300 text-red-900 p-4 rounded-xl font-medium">
              Stok untuk paket ini sedang kosong. Silakan pilih paket lain.
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Pengiriman
            </h2>
            <p className="text-sm text-slate-600 mb-5">
              Pastikan email sudah benar. Detail produk nantinya dikirim ke alamat ini setelah pembayaran berhasil.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Email Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-base bg-slate-50"
                  disabled={isSubmitting || !checkoutEnabled}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Konfirmasi Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Ketik ulang email..."
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-base bg-slate-50"
                  disabled={isSubmitting || !checkoutEnabled}
                />
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={isSubmitting || !checkoutEnabled}
                className="mt-1 w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
                Saya menyetujui syarat & ketentuan Beliakun.com dan memastikan bahwa alamat email yang saya berikan adalah benar.
              </label>
            </div>
            
            {error && (
              <div className="mt-4 text-red-600 text-sm font-semibold flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-200">
                <span>⚠️</span> {error}
              </div>
            )}
          </form>
        </div>

        {/* Kolom Kanan: Ringkasan */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden sticky top-20">
            <div className="bg-slate-50 p-5 border-b-2 border-slate-100">
              <h3 className="font-black text-lg">Ringkasan Pesanan</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex gap-4">
                <div className={`w-16 h-16 rounded-xl shrink-0 flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] text-white ${product.logoBg}`}>
                  <span className="font-bold text-xs">{product.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-slate-900 truncate">{product.name}</h4>
                  <p className="text-blue-600 font-bold text-sm">{variant.name}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 
                    {variant.warranty_enabled ? `Garansi ${variant.warranty_duration} ${variant.warranty_unit}` : 'Tanpa Garansi'}
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-2 text-sm font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Tipe Akun</span>
                  <span className="text-slate-900 font-bold">{variant.account_type || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span className="text-slate-900 font-bold">{variant.duration_label || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span className="text-slate-900 font-bold">{variant.delivery_method === 'instant' ? 'Instan' : 'Manual'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga</span>
                  <span className="text-slate-900 font-bold">
                    Rp {variant.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="flex justify-between items-center py-2">
                <span className="font-black text-slate-900">Total Pembayaran</span>
                <span className="font-black text-2xl text-blue-600">
                  Rp {variant.price.toLocaleString('id-ID')}
                </span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || !checkoutEnabled || isOutOfStock}
                className="w-full h-14 rounded-xl font-black text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" /> 
                    <span>Beli Sekarang</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
