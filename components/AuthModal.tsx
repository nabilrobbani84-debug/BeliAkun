import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Sparkles, KeyRound, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (userName: string, isGoogleLogin?: boolean, googleEmail?: string) => void;
  addToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AuthModal({ isOpen, onClose, onSuccessLogin, addToast }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot_password' | 'forgot_success'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || email.split('@')[0] || 'Sobat Beliakun';
    onSuccessLogin(finalName, false);
    onClose();
  };

  const handleGoogleLogin = () => {
    setIsLoggingInGoogle(true);
    setTimeout(() => {
      setIsLoggingInGoogle(false);
      const googleUserEmail = 'user.google@gmail.com';
      const googleName = 'User Google';
      onSuccessLogin(googleName, true, googleUserEmail);
      if (addToast) {
        addToast(
          'Login Google Berhasil! 📬',
          `Notifikasi keamanan & aktivitas masuk telah dikirimkan ke Google Email (${googleUserEmail}).`,
          'success'
        );
      }
      onClose();
    }, 1500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsSendingReset(true);
    setTimeout(() => {
      setIsSendingReset(false);
      setView('forgot_success');
      if (addToast) {
        addToast(
          'Instruksi Reset Dikirim 📧',
          `Tautan untuk mereset kata sandi telah dikirim ke ${forgotEmail}`,
          'info'
        );
      }
    }, 1200);
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md bg-[#FAF8F5] border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white border-2 border-slate-900 flex items-center justify-center font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                {view === 'forgot_password' || view === 'forgot_success' ? '🔐' : '🔑'}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {view === 'register' && 'Daftar Akun Baru'}
                  {view === 'login' && 'Masuk ke Beliakun'}
                  {view === 'forgot_password' && 'Lupa Kata Sandi'}
                  {view === 'forgot_success' && 'Cek Email Anda'}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  {view === 'register' && 'Buat akun untuk riwayat pesanan cepat'}
                  {view === 'login' && 'Masuk untuk cek riwayat & garansi'}
                  {view === 'forgot_password' && 'Kami akan mengirim instruksi reset kata sandi'}
                  {view === 'forgot_success' && 'Tautan pemulihan akun berhasil dikirim'}
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

          {/* Form Content */}
          {(view === 'login' || view === 'register') && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Google OAuth Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingInGoogle}
                className="w-full cartoon-button-secondary py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 bg-white hover:bg-slate-50 disabled:opacity-70"
              >
                {isLoggingInGoogle ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent" />
                    Menghubungkan Akun Google...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Lanjutkan dengan Akun Google
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-slate-300"></div>
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide">
                  atau via email
                </span>
                <div className="flex-1 h-px bg-slate-300"></div>
              </div>

              {view === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rian Prasetyo"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-900 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl pl-9 pr-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-extrabold text-slate-900">
                    Kata Sandi
                  </label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot_password')}
                      className="text-[11px] font-extrabold text-blue-600 hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl pl-9 pr-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full cartoon-button-primary py-3 text-sm font-extrabold flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {view === 'register' ? 'Daftar Sekarang' : 'Masuk Akun'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView(view === 'login' ? 'register' : 'login')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {view === 'register'
                    ? 'Sudah punya akun? Masuk di sini'
                    : 'Belum punya akun? Daftar gratis'}
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password View */}
          {view === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4">
              <div className="cartoon-card p-3.5 bg-amber-50 border-slate-900 flex items-start gap-2.5">
                <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  Masukkan alamat email akun Beliakun Anda. Kami akan mengirimkan pesan berisi tautan aman untuk mereset kata sandi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-white border-2 border-slate-900 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="cartoon-button-secondary py-3 px-4 text-xs font-extrabold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="flex-1 cartoon-button-primary py-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2"
                >
                  {isSendingReset ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Link Reset'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Success View */}
          {view === 'forgot_success' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-400 border-3 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A] flex items-center justify-center text-slate-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-extrabold text-lg text-slate-900">Email Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  Kami telah mengirimkan instruksi pemulihan ke <strong className="text-slate-900">{forgotEmail}</strong>. Silakan periksa kotak masuk atau folder spam email Anda.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full cartoon-button-primary py-2.5 text-xs font-extrabold"
              >
                Kembali ke Halaman Masuk
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
