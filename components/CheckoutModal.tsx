import React, { useState } from 'react';
import { QrCode, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Building2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, ProductPackage } from '@/types/store';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/beliakun-ui/field';
import { Badge } from '@/components/ui/badge';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  selectedPackage?: ProductPackage | null;
  cartItems?: import('@/types/store').CartItem[];
  discountAmount?: number;
  onSuccessOrder: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  product,
  selectedPackage,
  cartItems,
  discountAmount,
  onSuccessOrder,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'gopay' | 'bca'>('qris');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [orderId, setOrderId] = useState(123456);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  if (!product && (!cartItems || cartItems.length === 0)) return null;

  const displayProduct = product || cartItems?.[0]?.product;
  const displayPackage = selectedPackage || cartItems?.[0]?.selectedPackage;

  if (!displayProduct || !displayPackage) return null;

  const totalPayment = product && selectedPackage 
    ? selectedPackage.price 
    : Math.max(0, (cartItems || []).reduce((sum, item) => sum + item.selectedPackage.price * item.quantity, 0) - (discountAmount || 0));

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = customerName.trim().replace(/[<>]/g, '');
    const cleanPhone = whatsappNumber.replace(/[^0-9+]/g, '');

    if (!cleanName || cleanName.length < 2) return;
    if (!cleanPhone || cleanPhone.length < 9) return;

    setCustomerName(cleanName);
    setWhatsappNumber(cleanPhone);
    setStep('payment');
  };

  const handleProcessRealtimePayment = () => {
    setIsCheckingPayment(true);

    setTimeout(() => {
      setIsCheckingPayment(false);
      setOrderId(Math.floor(100000 + Math.random() * 900000));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStep('success');
    }, 3500);
  };

  const handleFinish = () => {
    onSuccessOrder();
    setStep('form');
    onClose();
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-extrabold shadow-[2px_2px_0px_0px_#000] shrink-0 text-sm sm:text-base">
            🛍️
          </div>
          <div className="min-w-0">
            <DialogTitle>
              {step === 'form' && 'Informasi Pemesan'}
              {step === 'payment' && 'Pembayaran Pesanan'}
              {step === 'success' && 'Pesanan Berhasil! 🎉'}
            </DialogTitle>
            <DialogDescription>
              {step === 'form' && 'Lengkapi data pengiriman akun'}
              {step === 'payment' && 'Pilih metode pembayaran'}
              {step === 'success' && 'Detail akun sedang disiapkan'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent>
        {step === 'form' && (
          <form onSubmit={handleNextToPayment} className="space-y-3.5 sm:space-y-4">
            {/* Order Summary box */}
            <Card className="p-3.5 sm:p-4 bg-blue-50 dark:bg-blue-950/40 border-[var(--border)] space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-[var(--muted-foreground)] tracking-wider block">
                Item yang Dibeli:
              </span>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${displayProduct.logoBg} border border-slate-900 flex items-center justify-center text-white font-extrabold text-xs shrink-0`}>
                    {displayProduct.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] truncate">
                      {displayProduct.name} {cartItems && cartItems.length > 1 ? `(+${cartItems.length - 1} item)` : ''}
                    </h4>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block truncate">
                      Paket: {displayPackage.name} ({displayPackage.duration})
                    </span>
                  </div>
                </div>

                <span className="font-black text-sm sm:text-base text-blue-600 dark:text-blue-400 shrink-0">
                  Rp{totalPayment.toLocaleString('id-ID')}
                </span>
              </div>
            </Card>

            <Field label="Nama Pemesan" required>
              <Input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi Prasetyo"
              />
            </Field>

            <Field label="No. WhatsApp Aktif" required description="Detail kredensial akun akan dikirimkan langsung via WhatsApp ini.">
              <Input
                type="tel"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Contoh: 081234567890"
              />
            </Field>

            <Field label="Email Pengiriman (Opsional)">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: budi@gmail.com"
              />
            </Field>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-xs sm:text-sm min-h-[44px] font-extrabold"
              >
                Lanjut Pembayaran <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <Card className="p-3.5 sm:p-4 bg-amber-50 dark:bg-amber-950/40 border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-[var(--muted-foreground)]">Total Tagihan:</span>
                <h4 className="text-lg sm:text-xl font-black text-[var(--foreground)]">
                  Rp{totalPayment.toLocaleString('id-ID')}
                </h4>
              </div>
              <Badge variant="verified">Bebas Biaya Admin</Badge>
            </Card>

            {/* Select Payment Method */}
            <div>
              <label className="block text-xs font-extrabold text-[var(--foreground)] mb-2">
                Pilih Metode Pembayaran:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === 'qris' ? 'primary' : 'outline'}
                  onClick={() => setPaymentMethod('qris')}
                  className="flex-col h-auto py-3 gap-1"
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-[10px] sm:text-xs">QRIS / All</span>
                </Button>

                <Button
                  type="button"
                  variant={paymentMethod === 'gopay' ? 'primary' : 'outline'}
                  onClick={() => setPaymentMethod('gopay')}
                  className="flex-col h-auto py-3 gap-1"
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[10px] sm:text-xs">E-Wallet</span>
                </Button>

                <Button
                  type="button"
                  variant={paymentMethod === 'bca' ? 'primary' : 'outline'}
                  onClick={() => setPaymentMethod('bca')}
                  className="flex-col h-auto py-3 gap-1"
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-[10px] sm:text-xs">Bank BCA</span>
                </Button>
              </div>
            </div>

            {/* Payment Detail Box */}
            <Card className="p-3.5 sm:p-4 bg-[var(--card)] border-[var(--border)] text-center space-y-3">
              {paymentMethod === 'qris' && (
                <>
                  <p className="text-xs font-bold text-[var(--foreground)]">
                    Scan QRIS di bawah menggunakan GoPay, OVO, Dana, ShopeePay, BCA, atau m-Banking apapun:
                  </p>
                  <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto p-2 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#000] flex flex-col items-center justify-center">
                    <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center text-white">
                      <div className="flex justify-between w-full">
                        <div className="w-5 h-5 border-2 border-white bg-amber-400 rounded-sm"></div>
                        <div className="w-5 h-5 border-2 border-white bg-amber-400 rounded-sm"></div>
                      </div>
                      <div className="font-extrabold text-[10px] sm:text-[11px] tracking-wider text-amber-300">
                        BELIAKUN QRIS
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="w-5 h-5 border-2 border-white bg-amber-400 rounded-sm"></div>
                        <QrCode className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'gopay' && (
                <div className="p-3 bg-[var(--muted)] rounded-xl space-y-2 text-left">
                  <span className="text-xs font-bold text-[var(--muted-foreground)]">Nomor GoPay / ShopeePay / OVO:</span>
                  <div className="flex items-center justify-between font-extrabold text-sm sm:text-base text-[var(--foreground)] bg-[var(--card)] p-2 border border-[var(--border)] rounded-lg">
                    <span>0812-3456-7890</span>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => handleCopyNumber('081234567890')}
                    >
                      {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedAccount ? 'Tersalin' : 'Salin'}
                    </Button>
                  </div>
                </div>
              )}

              {paymentMethod === 'bca' && (
                <div className="p-3 bg-[var(--muted)] rounded-xl space-y-2 text-left">
                  <span className="text-xs font-bold text-[var(--muted-foreground)]">Nomor Rekening BCA:</span>
                  <div className="flex items-center justify-between font-extrabold text-sm sm:text-base text-[var(--foreground)] bg-[var(--card)] p-2 border border-[var(--border)] rounded-lg">
                    <span>8830-1234-5678</span>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => handleCopyNumber('883012345678')}
                    >
                      {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedAccount ? 'Tersalin' : 'Salin'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                disabled={isCheckingPayment}
                variant="secondary"
                onClick={() => setStep('form')}
              >
                Kembali
              </Button>
              <Button
                type="button"
                loading={isCheckingPayment}
                onClick={handleProcessRealtimePayment}
                variant="primary"
                className="flex-1 font-extrabold"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> Cek Status Pembayaran
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-emerald-400 text-slate-950 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#000] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <h4 className="font-extrabold text-lg sm:text-xl text-[var(--foreground)]">Terima Kasih, {customerName}!</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-1 font-medium max-w-sm mx-auto">
                Pembayaran sebesar <strong className="text-[var(--foreground)]">Rp{totalPayment.toLocaleString('id-ID')}</strong> telah berhasil diverifikasi oleh sistem otomatis.
              </p>
            </div>

            <Card className="p-3.5 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 border-[var(--border)] text-left text-xs font-medium space-y-2">
              <div className="flex items-center gap-1.5 font-extrabold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" /> Pesanan ID #BLK-{orderId}
              </div>
              <p className="text-[var(--foreground)]">
                Detail kredensial akun / link undangan <strong className="text-blue-600 font-extrabold">{displayProduct.name} ({displayPackage.duration})</strong> telah disiapkan dan dikirimkan ke WhatsApp <strong className="text-[var(--foreground)]">{whatsappNumber}</strong>.
              </p>
            </Card>

            <Button
              variant="primary"
              onClick={handleFinish}
              className="w-full py-3 text-xs sm:text-sm min-h-[44px] font-extrabold"
            >
              Kembali ke Toko
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
