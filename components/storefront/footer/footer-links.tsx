import React from 'react';
import { Headphones, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterLinksProps {
  onNavigateSection?: (sectionId: string) => void;
}

export function FooterLinks({ onNavigateSection }: FooterLinksProps) {
  const handleSupportClick = () => {
    if (onNavigateSection) {
      onNavigateSection('faq');
    } else {
      const faqElem = document.getElementById('faq');
      if (faqElem) {
        faqElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-w-0 flex-1">
      {/* Kolom 1: Bantuan */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] uppercase tracking-wider">
          Bantuan
        </h4>
        <ul className="space-y-2 text-xs font-semibold text-[var(--muted-foreground)]">
          <li>
            <button
              onClick={() => onNavigateSection?.('how-it-works')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Cara Belanja
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigateSection?.('products')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Lacak Pesanan
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigateSection?.('faq')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              FAQ & Tanya Jawab
            </button>
          </li>
          <li>
            <button
              onClick={handleSupportClick}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Hubungi Bantuan
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigateSection?.('faq')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Ketentuan Garansi
            </button>
          </li>
        </ul>

        {/* Clear Priority Support Button */}
        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSupportClick}
            className="w-full sm:w-auto font-extrabold text-xs gap-2 min-h-[40px] cartoon-button-secondary"
          >
            <Headphones className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Hubungi Tim Bantuan</span>
          </Button>
        </div>
      </div>

      {/* Kolom 2: Informasi */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] uppercase tracking-wider">
          Informasi
        </h4>
        <ul className="space-y-2 text-xs font-semibold text-[var(--muted-foreground)]">
          <li>
            <a
              href="#about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Tentang Kami
            </a>
          </li>
          <li>
            <a
              href="#privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Kebijakan Privasi
            </a>
          </li>
          <li>
            <a
              href="#terms"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Syarat dan Ketentuan
            </a>
          </li>
          <li>
            <a
              href="#disclaimer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Disclaimer Brand
            </a>
          </li>
          <li>
            <a
              href="#refund"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Kebijakan Pengembalian
            </a>
          </li>
        </ul>
      </div>

      {/* Kolom 3: Elemen Kepercayaan Transaksi */}
      <div className="space-y-3 sm:col-span-2 lg:col-span-1">
        <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] uppercase tracking-wider">
          Belanja dengan lebih tenang
        </h4>
        <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
          Cek kembali detail produk sebelum membayar dan simpan nomor pesanan untuk mendapatkan bantuan lebih cepat.
        </p>

        <ul className="space-y-2 pt-1">
          <li className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Detail produk transparan</span>
          </li>
          <li className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Nomor pesanan tercatat</span>
          </li>
          <li className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Bantuan melalui kanal resmi</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
