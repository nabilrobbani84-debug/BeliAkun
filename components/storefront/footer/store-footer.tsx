import React from 'react';
import { PageContainer } from '@/components/patterns/page-container';
import { FooterTrustBar } from './footer-trust-bar';
import { FooterBrand } from './footer-brand';
import { FooterLinks } from './footer-links';
import { FooterPaymentMethods } from './footer-payment-methods';
import { FooterDisclaimer } from './footer-disclaimer';
import { FooterBottom } from './footer-bottom';

export interface StoreFooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onSelectCategory?: (catId: string) => void;
}

export function StoreFooter({ onNavigateSection }: StoreFooterProps) {
  return (
    <footer className="w-full bg-[var(--card)] border-t-3 sm:border-t-4 border-[var(--border)] mt-8 sm:mt-12 py-8 sm:py-10 lg:py-12 text-[var(--foreground)]">
      <PageContainer>
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Trust Bar */}
          <FooterTrustBar />

          {/* 2. Main Footer Section (Brand + Links & Trust) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-4">
              <FooterBrand />
            </div>
            <div className="lg:col-span-8">
              <FooterLinks onNavigateSection={onNavigateSection} />
            </div>
          </div>

          {/* 3. Payment Methods */}
          <FooterPaymentMethods />

          {/* 4. Disclaimer & Copyright */}
          <div className="space-y-3">
            <FooterDisclaimer />
            <FooterBottom />
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
