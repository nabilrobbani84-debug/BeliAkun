'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { initializeKlikQrisPayment } from '@/lib/actions/payments';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, Copy, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface PaymentClientProps {
  order: any;
  initialPayment: any;
  checkoutEnabled: boolean;
  klikqrisEnabled: boolean;
}

export function PaymentClient({ order, initialPayment, checkoutEnabled, klikqrisEnabled }: PaymentClientProps) {
  const router = useRouter();
  const [payment, setPayment] = useState<any>(initialPayment);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>('');

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const isPending = order.status === 'pending_payment';
  const isPaid = order.status === 'paid';
  const isExpired = order.status === 'expired' || order.status === 'cancelled';
  const isReview = order.status === 'payment_review';

  const handleInitialize = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await initializeKlikQrisPayment(order.id);
      if (res.success) {
        setPayment({
          qris_url: res.qrisUrl,
          amount_payable: res.amountPayable,
          unique_amount: res.uniqueAmount,
          provider_expires_at: res.expiresAt,
          signature: res.signature,
          status: 'pending'
        });
      } else {
        setError(res.error || 'Gagal menghasilkan tagihan pembayaran.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi saat menyiapkan QRIS.');
    } finally {
      setLoading(false);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = () => {
    stopPolling();
    // Poll status from local database every 8 seconds
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.order_number}/payment-status`);
        if (res.ok) {
          const data = await res.json();
          if (data.orderStatus !== 'pending_payment') {
            stopPolling();
            router.refresh();
            // Update local state to trigger rerender if router.refresh is delayed
            window.location.reload();
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 8000);
  };

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startCountdown = () => {
    stopCountdown();
    if (!payment?.provider_expires_at) return;

    const expiryTime = new Date(payment.provider_expires_at).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance < 0) {
        stopCountdown();
        setCountdown('EXPIRED');
        router.refresh();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    countdownRef.current = setInterval(updateTimer, 1000);
  };

  // 1. Auto-Initialize Payment on mount if pending and no active payment exists
  useEffect(() => {
    if (isPending && !payment && klikqrisEnabled && checkoutEnabled) {
      setTimeout(() => {
        handleInitialize();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, payment, klikqrisEnabled, checkoutEnabled]);

  // 2. Start Polling & Countdown if payment is pending
  useEffect(() => {
    if (isPending && payment && payment.status === 'pending') {
      startPolling();
      startCountdown();
    } else {
      stopPolling();
      stopCountdown();
    }

    return () => {
      stopPolling();
      stopCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, payment]);

  // 3. Load Snap Payment Script if signature exists
  useEffect(() => {
    if (payment?.signature) {
      const script = document.createElement('script');
      script.src = "https://klikqris.com/js/payment-snap.js?t=" + new Date().getTime();
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [payment?.signature]);


  const handleManualSync = async () => {
    setSyncing(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${order.order_number}/sync-payment`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'paid') {
          router.refresh();
          window.location.reload();
        } else if (data.status === 'expired') {
          router.refresh();
          window.location.reload();
        } else {
          setError('Pembayaran belum terdeteksi. Silakan coba beberapa saat lagi.');
        }
      } else {
        setError('Gagal menyinkronkan pembayaran. Coba lagi.');
      }
    } catch (err) {
      setError('Kesalahan koneksi saat memeriksa pembayaran.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCopyAmount = () => {
    if (!payment?.amount_payable) return;
    navigator.clipboard.writeText(payment.amount_payable.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Security check: Host official validation
  const getQrisImageSrc = (url: string) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      const allowedHosts = [
        'klikqris.com',
        'api.klikqris.com',
        'sandbox.klikqris.com',
        'chart.googleapis.com', // Sometimes Google Charts is used to generate QR from raw text
        'chart.apis.google.com'
      ];
      const isAllowed = allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith('.' + host));
      if (!isAllowed) {
        return '';
      }
      return url;
    } catch (_) {
      return '';
    }
  };

  if (isPaid) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-emerald-950">Pembayaran Berhasil!</h3>
          <p className="text-sm text-emerald-800 mt-1">Pesanan Anda telah lunas dan sedang diproses oleh sistem.</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-red-950">Batas Waktu Habis</h3>
          <p className="text-sm text-red-800 mt-1">Batas waktu pembayaran pesanan telah kedaluwarsa. Silakan lakukan pemesanan ulang.</p>
        </div>
      </div>
    );
  }

  if (isReview) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-amber-950">Pembayaran Sedang Diperiksa</h3>
          <p className="text-sm text-amber-800 mt-1">
            Pembayaran terdeteksi, namun pesanan membutuhkan pemeriksaan lebih lanjut oleh administrator. Mohon tidak membayar kembali.
          </p>
        </div>
      </div>
    );
  }

  if (!klikqrisEnabled) {
    return (
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center shadow-sm">
        <p className="font-bold text-slate-700">Metode pembayaran QRIS dinonaktifkan sementara.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-sm flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm font-bold text-slate-600">Menyiapkan kode pembayaran QRIS...</p>
      </div>
    );
  }

  if (error && !payment) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <p className="text-red-700 font-bold">{error}</p>
        <Button onClick={handleInitialize} size="sm">Coba Lagi</Button>
      </div>
    );
  }

  if (!payment) return null;

  const validQrUrl = getQrisImageSrc(payment.qris_url);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col md:flex-row">
      
      {/* Kolom QR Code */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-slate-100 bg-slate-50">
        
        {/* Container Putih untuk QR agar aman discan pada Dark Mode */}
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-inner flex items-center justify-center w-52 h-52 relative">
          {validQrUrl ? (
            <img 
              src={validQrUrl} 
              alt="KlikQRIS Payment QR Code" 
              width={180} 
              height={180} 
              className="object-contain"
            />
          ) : (
            <div className="text-center text-xs font-bold text-red-500">QR Code Error<br/>Host tidak diizinkan.</div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 font-extrabold mt-3 tracking-wide text-center uppercase">
          PINDAI DENGAN APLIKASI BANK ATAU E-WALLET
        </p>
      </div>

      {/* Kolom Info Pembayaran */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4 bg-white">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-500 tracking-wider uppercase">TOTAL YANG HARUS DIBAYAR</span>
            {countdown && (
              <span className="inline-flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                <Clock className="w-3 h-3" />
                {countdown}
              </span>
            )}
          </div>
          
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">
              Rp {payment.amount_payable.toLocaleString('id-ID')}
            </span>
            <button 
              onClick={handleCopyAmount}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 border border-slate-200 hover:border-blue-200 px-2 py-1 rounded transition-colors"
            >
              {copied ? <span className="text-emerald-600 font-bold">Tersalin!</span> : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          {payment.unique_amount > 0 && (
            <div className="mt-2 text-xs font-bold text-slate-500 flex gap-2">
              <span>(Total Produk: Rp {order.grand_total.toLocaleString('id-ID')})</span>
              <span className="text-blue-600">+ Kode Unik: Rp {payment.unique_amount}</span>
            </div>
          )}
        </div>

        <div className="space-y-3.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600 leading-relaxed">
          <p>1. Scan QRIS menggunakan aplikasi Mobile Banking atau Dompet Digital pilihanmu.</p>
          <p>2. <strong className="text-slate-900">Pastikan nominal pembayaran sama persis</strong> hingga angka terakhir agar terkonfirmasi otomatis.</p>
          <p>3. Status pesanan akan otomatis ter-update menjadi paid dalam hitungan detik setelah transaksi sukses.</p>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          {payment.signature && (
            <button
              id="btnPay"
              data-signature={payment.signature}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-colors shadow-sm"
            >
              Bayar dengan KlikQRIS (Otomatis)
            </button>
          )}

          <Button
            onClick={handleManualSync}
            disabled={syncing}
            variant="secondary"
            className="w-full h-11 text-xs font-bold flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>Periksa Pembayaran</span>
          </Button>

          {error && (
            <p className="text-[11px] font-bold text-red-600 text-center">{error}</p>
          )}
        </div>
      </div>

    </div>
  );
}
