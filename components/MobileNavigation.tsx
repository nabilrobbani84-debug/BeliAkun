import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, User, Home, Grid, HelpCircle, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  userName?: string;
  onNavigateSection: (sectionId: string) => void;
}

export function MobileNavigation({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenAuth,
  userName,
  onNavigateSection,
}: MobileNavigationProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Sheet Drawer */}
        <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-xs bg-[#FAF8F5] border-r-4 border-slate-900 shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-5 bg-white border-b-2 border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 border-2 border-slate-900 text-white font-extrabold flex items-center justify-center text-base shadow-[1.5px_1.5px_0px_0px_#0F172A]">
                  B
                </div>
                <span className="font-extrabold text-lg text-slate-900">
                  Beliakun<span className="text-blue-600">.com</span>
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-900"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search trigger in drawer */}
            <div className="p-4 border-b border-slate-200">
              <button
                onClick={onOpenSearch}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 flex items-center gap-2 shadow-[2px_2px_0px_0px_#0F172A]"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Cari produk digital...</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => onNavigateSection('hero')}
                className="w-full text-left cartoon-card p-3 bg-white font-extrabold text-sm text-slate-900 flex items-center gap-3 hover:bg-blue-50"
              >
                <Home className="w-4 h-4 text-blue-600" /> Beranda
              </button>

              <button
                onClick={() => onNavigateSection('products')}
                className="w-full text-left cartoon-card p-3 bg-white font-extrabold text-sm text-slate-900 flex items-center gap-3 hover:bg-blue-50"
              >
                <ShoppingBag className="w-4 h-4 text-amber-500" /> Semua Produk
              </button>

              <button
                onClick={() => onNavigateSection('categories')}
                className="w-full text-left cartoon-card p-3 bg-white font-extrabold text-sm text-slate-900 flex items-center gap-3 hover:bg-blue-50"
              >
                <Grid className="w-4 h-4 text-purple-600" /> Kategori Produk
              </button>

              <button
                onClick={() => onNavigateSection('how-it-works')}
                className="w-full text-left cartoon-card p-3 bg-white font-extrabold text-sm text-slate-900 flex items-center gap-3 hover:bg-blue-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cara Belanja
              </button>

              <button
                onClick={() => onNavigateSection('faq')}
                className="w-full text-left cartoon-card p-3 bg-white font-extrabold text-sm text-slate-900 flex items-center gap-3 hover:bg-blue-50"
              >
                <HelpCircle className="w-4 h-4 text-rose-500" /> FAQ
              </button>
            </div>

            {/* Footer User Account */}
            <div className="p-4 bg-white border-t-2 border-slate-900">
              <button
                onClick={onOpenAuth}
                className="w-full cartoon-button-primary py-2.5 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{userName ? `Akun: ${userName}` : 'Masuk / Daftar Akun'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
