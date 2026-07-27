import React from 'react';
import { ShieldCheck, Heart, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react';

interface StoreFooterProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectCategory: (catId: string) => void;
}

export function StoreFooter({ onNavigateSection, onSelectCategory }: StoreFooterProps) {
  return (
    <footer className="w-full bg-white border-t-4 border-slate-900 mt-12 pt-12 pb-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b-2 border-slate-200">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] flex items-center justify-center text-white font-black text-xl">
                B
              </div>
              <span className="font-black text-2xl text-slate-900">
                Beliakun<span className="text-blue-600">.com</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-sm">
              Marketplace produk digital terpercaya untuk kebutuhan hiburan, produktivitas, kreativitas, dan teknologi dengan proses kilat & garansi resmi.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="#instagram"
                className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-pink-100 text-slate-900 flex items-center justify-center transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
                aria-label="Instagram Beliakun"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-blue-100 text-slate-900 flex items-center justify-center transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
                aria-label="Twitter Beliakun"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#whatsapp"
                className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-emerald-100 text-slate-900 flex items-center justify-center transition-colors shadow-[1.5px_1.5px_0px_0px_#000]"
                aria-label="WhatsApp Beliakun CS"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Belanja */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Belanja
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600">
              <li>
                <button onClick={() => onNavigateSection('products')} className="hover:text-blue-600 transition-colors">
                  Semua Produk
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('ai')} className="hover:text-blue-600 transition-colors">
                  Produk AI Premium
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('design')} className="hover:text-blue-600 transition-colors">
                  Design & Editing
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('entertainment')} className="hover:text-blue-600 transition-colors">
                  Entertainment
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('vpn')} className="hover:text-blue-600 transition-colors">
                  VPN & Security
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Bantuan */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Bantuan
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600">
              <li>
                <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-blue-600 transition-colors">
                  Cara Belanja
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('faq')} className="hover:text-blue-600 transition-colors">
                  FAQ & Tanya Jawab
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-600 transition-colors">
                  Hubungi CS (WhatsApp)
                </a>
              </li>
              <li>
                <a href="#warranty" className="hover:text-blue-600 transition-colors">
                  Ketentuan Garansi
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Informasi */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Informasi
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600">
              <li>
                <a href="#about" className="hover:text-blue-600 transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-blue-600 transition-colors">Disclaimer Brand</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Badges */}
        <div className="py-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-extrabold text-slate-900">
            Metode Pembayaran Populer:
          </span>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-slate-800">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              QRIS
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              GoPay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              OVO
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              Dana
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              ShopeePay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              BCA
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              Mandiri
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
              BRI
            </span>
          </div>
        </div>

        {/* Disclaimer Text & Copyright */}
        <div className="pt-6 space-y-4 text-center md:text-left">
          <div className="cartoon-card p-4 bg-slate-50 border-slate-900 text-xs text-slate-600 font-medium leading-relaxed">
            <strong className="text-slate-900 font-bold block mb-1">Disclaimer Brand:</strong>
            Beliakun.com merupakan penyedia atau reseller produk dan layanan digital pihak ketiga. Seluruh nama, logo, dan merek dagang merupakan hak milik masing-masing pemilik merek. Beliakun.com tidak mengklaim afiliasi resmi dengan pemilik merek tersebut, kecuali dinyatakan secara tertulis.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-semibold gap-2 pt-2">
            <p suppressHydrationWarning>© {new Date().getFullYear()} Beliakun.com - Akun Premium, Harga Lebih Santai.</p>
            <p className="flex items-center gap-1">
              Dibuat dengan <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> untuk Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
