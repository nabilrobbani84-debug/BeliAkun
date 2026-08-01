'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { StoreHeader } from '@/components/StoreHeader';
import { PromotionCarousel } from '@/components/storefront/promotion-carousel';
import { ProductCategorySection } from '@/components/storefront/product-category-section';
import { AllProductsSection } from '@/components/storefront/all-products-section';
import { TrustSection } from '@/components/storefront/trust-section';
import { HomepageCTA } from '@/components/storefront/homepage-cta';
import { StoreFooter } from '@/components/StoreFooter';

import { QuickViewModal } from '@/components/QuickViewModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { SearchDialog } from '@/components/SearchDialog';
import { AuthModal } from '@/components/AuthModal';
import { ToastContainer, ToastMessage } from '@/components/ToastNotification';
import { PRODUCTS } from '@/data/mockData';
import { Product, ProductPackage } from '@/types/store';

const emptySubscribe = () => () => {};

export default function StorefrontPage() {
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // State Management
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutPackage, setCheckoutPackage] = useState<ProductPackage | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [userName, setUserName] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme state — only used by the toggle icon, CSS variables handle the rest
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // SSR-safe initial value — actual value set in useEffect
    return false;
  });

  // Sync isDarkMode state with actual DOM class (set by layout.tsx inline script)
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  // Toast Helpers
  const addToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  }, []);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Theme Toggle — instant DOM mutation, no CSS transitions during change
  const handleToggleTheme = useCallback(() => {
    const html = document.documentElement;
    const goingDark = !html.classList.contains('dark');

    // Instant theme switch via DOM — no React re-render cascade needed for color change
    if (goingDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Only update state for icon display
    setIsDarkMode(goingDark);
  }, []);

  // Open Auth Modal with mode ('login' | 'register')
  const handleOpenAuth = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  }, []);

  // Direct Buy Handler (Opens Checkout directly)
  const handleDirectBuy = useCallback((product: Product, pkg: ProductPackage) => {
    setCheckoutProduct(product);
    setCheckoutPackage(pkg);
    setIsCheckoutOpen(true);
  }, []);

  const handleSuccessOrder = useCallback(() => {
    setIsCheckoutOpen(false);
    addToast('Pembayaran Sukses!', 'Detail akun sedang dikirimkan via WhatsApp.', 'success');
  }, [addToast]);

  // Smooth Scroll Navigation Helper
  const handleNavigateSection = useCallback((sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Filtered Products for All Products Section
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.categoryId === selectedCategoryId || p.tags.some(t => t.toLowerCase() === selectedCategoryId));
  }, [selectedCategoryId]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans" suppressHydrationWarning>
      {/* 1. Header Section */}
      <AnnouncementBar
        onPromoClick={() => handleNavigateSection('products')}
      />
      <StoreHeader
        onOpenAuth={handleOpenAuth}
        userName={userName}
        onNavigateSection={handleNavigateSection}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Storefront Body Content */}
      <main className="flex-1">
        {/* 2. Hero Section: Promotion Banner Image Slider */}
        <PromotionCarousel
          onCtaClick={(target) => {
            if (target === 'ai') {
              setSelectedCategoryId('ai');
              handleNavigateSection('products');
            } else {
              handleNavigateSection('products');
            }
          }}
        />

        {/* 3. Kategori Produk */}
        <ProductCategorySection
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => {
            setSelectedCategoryId(catId);
            handleNavigateSection('products');
          }}
        />

        {/* 4. Semua Produk */}
        <AllProductsSection
          products={filteredProducts}
          selectedCategoryId={selectedCategoryId}
          onResetCategory={() => setSelectedCategoryId('all')}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onDirectBuy={handleDirectBuy}
        />

        {/* 5. Section Kepercayaan */}
        <TrustSection />

        {/* 6. CTA Section */}
        <HomepageCTA
          onExploreProducts={() => handleNavigateSection('products')}
        />
      </main>

      {/* 7. Footer Section */}
      <StoreFooter
        onNavigateSection={handleNavigateSection}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          handleNavigateSection('products');
        }}
      />

      {/* Interactive Modals */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onDirectBuy={handleDirectBuy}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={checkoutProduct}
        selectedPackage={checkoutPackage}
        onSuccessOrder={handleSuccessOrder}
      />

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        addToast={addToast}
        onSuccessLogin={(name, isGoogleLogin, googleEmail) => {
          setUserName(name);
          if (!isGoogleLogin) {
            addToast('Selamat Datang!', `Berhasil masuk sebagai ${name}`, 'success');
          }
        }}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
