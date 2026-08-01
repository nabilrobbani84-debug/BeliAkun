import React from 'react';
import { Home, Grid, Zap, HelpCircle, ShieldCheck, User, MessageSquare, Sun, Moon } from 'lucide-react';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAuth: () => void;
  userName?: string;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function MobileNavigation({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenAuth,
  userName,
  isDarkMode = false,
  onToggleTheme,
}: MobileNavigationProps) {
  const navItems = [
    { id: 'hero', label: 'Beranda Utama', icon: Home },
    { id: 'products', label: 'Semua Produk Digital', icon: Grid },
    { id: 'categories', label: 'Cari Kategori', icon: Zap },
    { id: 'how-it-works', label: 'Cara Belanja Mudah', icon: HelpCircle },
    { id: 'faq', label: 'FAQ & Tanya Jawab', icon: ShieldCheck },
  ];

  return (
    <Sheet isOpen={isOpen} onClose={onClose} side="left">
      <SheetHeader onClose={onClose}>
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-black text-base shrink-0">
            ✨
          </div>
          <div>
            <SheetTitle>Beliakun.com</SheetTitle>
            <SheetDescription>Navigasi Cepat Toko</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <SheetContent>
        {/* User Status Card */}
        <Card className="p-3.5 bg-blue-50 dark:bg-blue-950/60 border-[var(--border)] mb-4">
          {userName ? (
            <div className="flex items-center gap-3">
              <Avatar fallback={userName} status="online" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Pengguna Aktif</span>
                <h4 className="font-extrabold text-sm text-[var(--foreground)] truncate">{userName}</h4>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-xs text-[var(--foreground)]">Belum Masuk Akun</h4>
                <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Masuk untuk riwayat pesanan</p>
              </div>
              <Button size="xs" variant="primary" onClick={onOpenAuth}>
                <User className="w-3.5 h-3.5" /> Masuk
              </Button>
            </div>
          )}
        </Card>

        {/* Theme Mode Switcher Row for Mobile */}
        {onToggleTheme && (
          <div className="mb-4">
            <button
              onClick={onToggleTheme}
              className="w-full cartoon-card p-3 bg-[var(--card)] border-[var(--border)] flex items-center justify-between font-extrabold text-xs text-[var(--foreground)] touch-target min-h-[44px] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
                <span>{isDarkMode ? "Mode Gelap (Aktif)" : "Mode Terang (Aktif)"}</span>
              </div>
              <span className="text-[10px] font-bold text-[var(--muted-foreground)] px-2 py-0.5 rounded-md bg-[var(--muted)] border border-[var(--border)]/30">
                Ubah
              </span>
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateSection(item.id)}
                className="w-full text-left cartoon-card p-3 bg-[var(--card)] border-[var(--border)] flex items-center gap-3 font-extrabold text-xs sm:text-sm text-[var(--foreground)] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors touch-target min-h-[48px] cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-[var(--muted)] text-blue-600 dark:text-blue-400 border border-[var(--border)]/40 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </SheetContent>

      <SheetFooter>
        <div className="w-full space-y-2">
          <Button
            variant="cartoon"
            onClick={() => window.open('https://wa.me/', '_blank')}
            className="w-full py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" /> Hubungi CS via WhatsApp
          </Button>
        </div>
      </SheetFooter>
    </Sheet>
  );
}
