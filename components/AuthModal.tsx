import React, { useState, useEffect } from 'react';
import { Mail, Lock, Sparkles, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/beliakun-ui/field';
import { Card } from '@/components/ui/card';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccessLogin: (userName: string, isGoogleLogin?: boolean, googleEmail?: string) => void;
  addToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccessLogin,
  addToast,
}: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot_password' | 'forgot_success'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    if (isOpen && view !== initialMode) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setTimeout(() => setView(initialMode), 0);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || email.split('@')[0] || 'Sobat Beliakun';
    onSuccessLogin(finalName, false);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoggingInGoogle(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setIsLoggingInGoogle(false);
      if (addToast) {
        addToast(
          'Gagal Login Google',
          err?.message || 'Terjadi kesalahan saat mengarahkan ke Google Login. Silakan coba lagi.',
          'error'
        );
      }
    }
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
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="md">
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-500 text-white border-2 border-slate-900 flex items-center justify-center font-extrabold shadow-[2px_2px_0px_0px_#000] shrink-0 text-sm">
            {view === 'forgot_password' || view === 'forgot_success' ? '🔐' : '🔑'}
          </div>
          <div className="min-w-0">
            <DialogTitle>
              {view === 'register' && 'Daftar Akun Baru'}
              {view === 'login' && 'Masuk ke Beliakun'}
              {view === 'forgot_password' && 'Lupa Kata Sandi'}
              {view === 'forgot_success' && 'Cek Email Anda'}
            </DialogTitle>
            <DialogDescription>
              {view === 'register' && 'Buat akun untuk riwayat pesanan cepat'}
              {view === 'login' && 'Masuk untuk cek riwayat & garansi'}
              {view === 'forgot_password' && 'Kami akan mengirim instruksi reset kata sandi'}
              {view === 'forgot_success' && 'Tautan pemulihan akun berhasil dikirim'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent>
        {(view === 'login' || view === 'register') && (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <Button
              type="button"
              variant="secondary"
              loading={isLoggingInGoogle}
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-3 text-xs sm:text-sm font-extrabold min-h-[44px]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span className="truncate">Lanjutkan dengan Akun Google</span>
            </Button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-[var(--border)]/20"></div>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wide">
                atau via email
              </span>
              <div className="flex-1 h-px bg-[var(--border)]/20"></div>
            </div>

            {view === 'register' && (
              <Field label="Nama Lengkap" required>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rian Prasetyo"
                />
              </Field>
            )}

            <Field label="Alamat Email" required>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </Field>

            <Field label="Kata Sandi" required>
              <div className="flex justify-between items-center mb-1">
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => setView('forgot_password')}
                    className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline ml-auto cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </Field>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              {view === 'register' ? 'Daftar Sekarang' : 'Masuk Akun'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline min-h-[32px] inline-flex items-center cursor-pointer"
              >
                {view === 'register'
                  ? 'Sudah punya akun? Masuk di sini'
                  : 'Belum punya akun? Daftar gratis'}
              </button>
            </div>
          </form>
        )}

        {view === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 sm:space-y-4">
            <Card className="p-3 sm:p-3.5 bg-amber-50 dark:bg-amber-950/40 border-[var(--border)] flex items-start gap-2.5">
              <KeyRound className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-[var(--muted-foreground)] leading-relaxed">
                Masukkan alamat email akun Beliakun Anda. Kami akan mengirimkan pesan berisi tautan aman untuk mereset kata sandi.
              </p>
            </Card>

            <Field label="Alamat Email Terdaftar" required>
              <Input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="nama@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </Field>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setView('login')}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button
                type="submit"
                loading={isSendingReset}
                variant="primary"
                className="flex-1"
              >
                Kirim Link Reset
              </Button>
            </div>
          </form>
        )}

        {view === 'forgot_success' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-emerald-400 text-slate-950 border-3 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-[var(--foreground)]">Email Berhasil Dikirim!</h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-1 font-medium leading-relaxed">
                Kami telah mengirimkan instruksi pemulihan ke <strong className="text-[var(--foreground)]">{forgotEmail}</strong>. Silakan periksa kotak masuk atau folder spam email Anda.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => setView('login')}
              className="w-full py-2.5 text-xs font-extrabold min-h-[44px]"
            >
              Kembali ke Halaman Masuk
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
