import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Building2, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '@/types/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  onSuccessOrder: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.selectedPackage.price * item.quantity,
    0
  );
  const totalPayment = Math.max(0, subtotal - discountAmount);

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

  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('');

  const handleProcessRealtimePayment = () => {
    setIsCheckingPayment(true);
    setPaymentStatusText('Menghubungkan ke gateway pembayaran...');

    setTimeout(() => {
      setPaymentStatusText('Menunggu konfirmasi mutasi pembayaran...');
    }, 1500);

    setTimeout(() => {
      setPaymentStatusText('Pembayaran terdeteksi! Memverifikasi pesanan...');
    }, 3000);

    setTimeout(() => {
      setIsCheckingPayment(false);
      setOrderId(Math.floor(100000 + Math.random() * 900000));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStep('success');
    }, 4200);
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

  if (!isOpen) return null;

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                🛍️
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {step === 'form' && 'Informasi Pemesan'}
                  {step === 'payment' && 'Pembayaran Pesanan'}
                  {step === 'success' && 'Pesanan Berhasil! 🎉'}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  {step === 'form' && 'Lengkapi data penerima akun'}
                  {step === 'payment' && 'Pilih metode pembayaran favoritmu'}
                  {step === 'success' && 'Detail akun sedang disiapkan'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors shadow-[2px_2px_0px_0px_#0F172A]"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content based on step */}
          <div className="p-6">
            {step === 'form' && (
              <form onSubmit={handleNextToPayment} className="space-y-4">
                {/* Order Summary box */}
                <div className="cartoon-card p-3.5 bg-blue-50 border-slate-900 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Ringkasan {cartItems.length} Produk:</span>
                    <span className="text-blue-700 font-extrabold">
                      Total: Rp{totalPayment.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 space-y-1 max-h-24 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="truncate max-w-[220px]">
                          • {item.product.name} ({item.selectedPackage.duration}) x{item.quantity}
                        </span>
                        <span className="font-bold">
                          Rp{(item.selectedPackage.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    Nama Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Prasetyo"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    No. WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Detail akun / garansi akan dikirimkan juga via WhatsApp ini.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    Email Pengiriman (Opsional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full cartoon-button-primary py-3 text-sm flex items-center justify-center gap-2"
                  >
                    Lanjut Pembayaran <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <div className="cartoon-card p-3.5 bg-amber-50 border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-600">Total Tagihan:</span>
                    <h4 className="text-xl font-extrabold text-slate-900">
                      Rp{totalPayment.toLocaleString('id-ID')}
                    </h4>
                  </div>
                  <span className="bg-emerald-400 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                    Bebas Biaya Admin
                  </span>
                </div>

                {/* Select Payment Method */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-2">
                    Pilih Metode Pembayaran:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`cartoon-card p-3 text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'qris'
                          ? 'bg-blue-500 text-white border-slate-900 ring-2 ring-slate-900'
                          : 'bg-white text-slate-900'
                      }`}
                    >
                      <QrCode className="w-6 h-6" />
                      <span className="text-xs font-extrabold">QRIS / All</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gopay')}
                      className={`cartoon-card p-3 text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'gopay'
                          ? 'bg-blue-500 text-white border-slate-900 ring-2 ring-slate-900'
                          : 'bg-white text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs font-extrabold">E-Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bca')}
                      className={`cartoon-card p-3 text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'bca'
                          ? 'bg-blue-500 text-white border-slate-900 ring-2 ring-slate-900'
                          : 'bg-white text-slate-900'
                      }`}
                    >
                      <Building2 className="w-6 h-6" />
                      <span className="text-xs font-extrabold">Bank BCA</span>
                    </button>
                  </div>
                </div>

                {/* Payment Detail Box */}
                <div className="cartoon-card p-4 bg-white border-slate-900 text-center space-y-3">
                  {paymentMethod === 'qris' && (
                    <>
                      <p className="text-xs font-bold text-slate-700">
                        Scan QRIS di bawah menggunakan GoPay, OVO, Dana, ShopeePay, BCA, atau m-Banking apapun:
                      </p>
                      <div className="w-44 h-44 mx-auto p-2.5 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0F172A] flex flex-col items-center justify-center">
                        {/* Mock QR Code representation */}
                        <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center text-white">
                          <div className="flex justify-between w-full">
                            <div className="w-6 h-6 border-2 border-white bg-amber-400 rounded-sm"></div>
                            <div className="w-6 h-6 border-2 border-white bg-amber-400 rounded-sm"></div>
                          </div>
                          <div className="font-extrabold text-[11px] tracking-wider text-amber-300">
                            BELIAKUN QRIS
                          </div>
                          <div className="flex justify-between w-full">
                            <div className="w-6 h-6 border-2 border-white bg-amber-400 rounded-sm"></div>
                            <QrCode className="w-6 h-6 text-emerald-400" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'gopay' && (
                    <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-left">
                      <span className="text-xs font-bold text-slate-500">Nomor GoPay / ShopeePay / OVO:</span>
                      <div className="flex items-center justify-between font-extrabold text-base text-slate-900 bg-white p-2 border border-slate-900 rounded-lg">
                        <span>0812-3456-7890</span>
                        <button
                          onClick={() => handleCopyNumber('081234567890')}
                          className="text-xs bg-slate-900 text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedAccount ? 'Tersalin' : 'Salin'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        a.n. <strong className="text-slate-900">Beliakun Digital Official</strong>
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bca' && (
                    <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-left">
                      <span className="text-xs font-bold text-slate-500">Nomor Rekening BCA:</span>
                      <div className="flex items-center justify-between font-extrabold text-base text-slate-900 bg-white p-2 border border-slate-900 rounded-lg">
                        <span>8830-1234-5678</span>
                        <button
                          onClick={() => handleCopyNumber('883012345678')}
                          className="text-xs bg-slate-900 text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedAccount ? 'Tersalin' : 'Salin'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        a.n. <strong className="text-slate-900">PT Beliakun Digital Indonesia</strong>
                      </p>
                    </div>
                  )}
                </div>

                {isCheckingPayment && (
                  <div className="cartoon-card p-3.5 bg-blue-50 border-slate-900 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-600 border-t-transparent shrink-0" />
                    <span className="text-xs font-bold text-slate-800 animate-pulse">
                      {paymentStatusText}
                    </span>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={isCheckingPayment}
                    onClick={() => setStep('form')}
                    className="cartoon-button-secondary py-3 px-4 text-xs font-extrabold disabled:opacity-50"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    disabled={isCheckingPayment}
                    onClick={handleProcessRealtimePayment}
                    className="flex-1 cartoon-button-primary py-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 disabled:opacity-75"
                  >
                    {isCheckingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Memverifikasi Pembayaran...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" /> Cek Status Pembayaran Realtime
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-400 border-4 border-slate-900 shadow-[4px_4px_0px_0px_#0F172A] flex items-center justify-center text-slate-950">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="font-extrabold text-xl text-slate-900">Terima Kasih, {customerName}!</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium max-w-sm mx-auto">
                    Pembayaran sebesar <strong className="text-slate-900">Rp{totalPayment.toLocaleString('id-ID')}</strong> telah berhasil diverifikasi oleh sistem otomatis.
                  </p>
                </div>

                <div className="cartoon-card p-4 bg-emerald-50 border-slate-900 text-left text-xs font-medium space-y-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-emerald-800 text-sm">
                    <ShieldCheck className="w-4 h-4" /> Pesanan ID #BLK-{orderId}
                  </div>
                  <p className="text-slate-700">
                    Detail kredensial akun / link undangan telah disiapkan dan dikirimkan ke WhatsApp <strong className="text-slate-900">{whatsappNumber}</strong>.
                  </p>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full cartoon-button-primary py-3 text-sm font-extrabold"
                >
                  Kembali ke Toko
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
