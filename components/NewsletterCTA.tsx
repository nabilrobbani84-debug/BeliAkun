import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
      <div className="cartoon-card p-6 sm:p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0F172A] text-white relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-7 space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-300 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider">
              🎁 INFO VOUCHER TERBARU
            </span>
            <h2 className="font-black text-2xl sm:text-3xl md:text-4xl text-white">
              Jangan Sampai Ketinggalan Promo!
            </h2>
            <p className="text-xs sm:text-sm font-medium text-blue-100 max-w-lg leading-relaxed">
              Dapatkan informasi produk baru, voucher diskon kejutan, dan penawaran spesial langsung di email kamu.
            </p>
          </div>

          <div className="md:col-span-5">
            {isSubmitted ? (
              <div className="cartoon-card p-4 bg-emerald-400 text-slate-950 border-slate-900 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="font-extrabold text-sm">Terima Kasih Telah Mendaftar!</h4>
                <p className="text-xs font-semibold">
                  Kami akan mengirimkan voucher diskon kejutan ke email kamu.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan alamat email kamu..."
                      className="w-full bg-white border-2 border-slate-900 rounded-2xl pl-10 pr-3 py-3 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>

                  <button
                    type="submit"
                    className="cartoon-button-accent px-5 py-3 text-xs sm:text-sm font-extrabold shrink-0 flex items-center justify-center gap-1.5"
                  >
                    Daftar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-blue-200 font-medium">
                  🔒 Bebas spam. Kamu bisa membatalkan langganan kapan saja.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
