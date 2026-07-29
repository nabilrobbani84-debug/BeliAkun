import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, Sparkles, ChevronDown, Sun, Moon } from 'lucide-react';
import { MobileNavigation } from '@/components/MobileNavigation';

interface StoreHeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  userName?: string;
  onNavigateSection: (sectionId: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function StoreHeader({
  cartItemCount,
  onOpenCart,
  onOpenSearch,
  onOpenAuth,
  userName,
  onNavigateSection,
  isDarkMode = false,
  onToggleTheme,
}: StoreHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-200 border-b-2 border-slate-900 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md py-2.5 shadow-md'
            : 'bg-[#FAF8F5] py-3.5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo Brand Beliakun.com */}
          <div
            onClick={() => onNavigateSection('hero')}
            className="cursor-pointer flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#0F172A] flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="4"/>
                <path d="M12 14v6m0-3h3"/>
              </svg>
              {/* Premium Verified Sparkle Badge */}
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[9px] shadow-[1px_1px_0px_0px_#000]">
                ✨
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 font-black text-xl sm:text-2xl tracking-tight text-slate-900">
                Beliakun<span className="text-blue-600">.com</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900 shadow-[1px_1px_0px_0px_#000] animate-pulse" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden sm:block">
                Akun Digital Premium
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-extrabold text-xs tracking-wide text-slate-800">
            <button
              onClick={() => onNavigateSection('hero')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              Beranda
            </button>
            <button
              onClick={() => onNavigateSection('products')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              Semua Produk
            </button>
            <button
              onClick={() => onNavigateSection('categories')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              Kategori
            </button>
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              Cara Belanja
            </button>
            <button
              onClick={() => onNavigateSection('faq')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Search Column Input Trigger */}
          <div
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 bg-white border-2 border-slate-900 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-500 cursor-pointer shadow-[2px_2px_0px_0px_#0F172A] hover:border-blue-600 transition-all max-w-xs flex-1"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Cari ChatGPT, Canva, Netflix...</span>
            <kbd className="hidden xl:inline-block ml-auto bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-300 font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Dark/Light Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-amber-300 shadow-[2px_2px_0px_0px_#0F172A] dark:shadow-[2px_2px_0px_0px_#000] transition-all"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle tema gelap atau terang"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-slate-900" />}
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
              aria-label="Cari produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={onOpenCart}
              className="cartoon-button-accent px-3 py-2 text-xs flex items-center gap-2 relative"
              aria-label="Buka keranjang belanja"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-black">Keranjang</span>
              {cartItemCount > 0 && (
                <span className="bg-rose-500 text-white font-extrabold text-[11px] w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center -mr-1 shadow-[1px_1px_0px_0px_#000] animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account Button */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex cartoon-button-secondary px-3.5 py-2 text-xs items-center gap-1.5"
            >
              <User className="w-4 h-4 text-slate-700" />
              <span className="font-extrabold truncate max-w-[100px]">
                {userName || 'Masuk'}
              </span>
            </button>

            {/* Mobile Menu Toggle Sheet Trigger */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_0px_#0F172A]"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Sheet */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => {
          setIsMobileNavOpen(false);
          onOpenSearch();
        }}
        onOpenAuth={() => {
          setIsMobileNavOpen(false);
          onOpenAuth();
        }}
        userName={userName}
        onNavigateSection={(sec) => {
          setIsMobileNavOpen(false);
          onNavigateSection(sec);
        }}
      />
    </>
  );
}
