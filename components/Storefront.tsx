'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { StoreHeader } from '@/components/StoreHeader';
import { PromotionCarousel } from '@/components/PromotionCarousel';
import { BenefitList } from '@/components/BenefitList';
import { CategorySection } from '@/components/CategorySection';
import { ProductGrid } from '@/components/ProductGrid';
import { FlashSaleSection } from '@/components/FlashSaleSection';
import { ProductTabs } from '@/components/ProductTabs';
import { HowItWorks } from '@/components/HowItWorks';
import { TrustSection } from '@/components/TrustSection';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { FAQSection } from '@/components/FAQSection';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { StoreFooter } from '@/components/StoreFooter';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CartSheet } from '@/components/CartSheet';
import { CheckoutModal } from '@/components/CheckoutModal';
import { SearchDialog } from '@/components/SearchDialog';
import { AuthModal } from '@/components/AuthModal';
import { ToastContainer, ToastMessage } from '@/components/ToastNotification';
import { PRODUCTS } from '@/data/mockData';
import { Product, ProductPackage, CartItem, Category } from '@/types/store';
import { useRouter } from 'next/navigation';

const emptySubscribe = () => () => {};

export function Storefront({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: Category[] }) {
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // State Management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [userName, setUserName] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Toast Helpers
  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check Supabase session & URL search params for OAuth redirect
  useEffect(() => {
    async function checkSession() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Sobat Beliakun';
          setUserName(name);

          // Check query params for login success
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.get('login') === 'success') {
            addToast(
              'Login Google Berhasil! 📬',
              `Selamat datang, ${name}. Notifikasi aktivitas masuk telah dikirimkan ke email Anda (${user.email}).`,
              'success'
            );
            // Clear search params cleanly
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.get('auth_error')) {
            addToast(
              'Gagal Login',
              'Tidak dapat mengotentikasi akun Google Anda. Silakan coba lagi.',
              'error'
            );
            window.history.replaceState({}, '', window.location.pathname);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    }

    checkSession();
  }, []);

  // Cart Operations (Step 4: Direct to Checkout)
  const handleAddToCart = (product: Product, pkg: ProductPackage, quantity: number = 1) => {
    // Step 4: Skip cart and go directly to checkout
    router.push(`/checkout?variant=${pkg.id}`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    addToast('Item Dihapus', 'Produk dikeluarkan dari keranjang.', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    addToast('Keranjang Dikosongkan', 'Seluruh item telah dikeluarkan.', 'info');
  };

  // Checkout Handler
  const handleOpenCheckout = (discount: number) => {
    setAppliedDiscount(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSuccessOrder = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    addToast('Pembayaran Sukses!', 'Detail akun sedang dikirimkan via WhatsApp.', 'success');
  };

  // Smooth Scroll Navigation Helper
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered Products for Category Section
  const categoryProducts = selectedCategoryId === 'all'
    ? initialProducts
    : initialProducts.filter((p) => p.categoryId === selectedCategoryId);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 font-sans">
      {/* 1. Announcement Bar */}
      <AnnouncementBar
        onPromoClick={() => handleNavigateSection('products')}
      />

      {/* 2. Header & Sticky Navigation */}
      <StoreHeader
        onOpenAuth={() => setIsAuthOpen(true)}
        userName={userName}
        onNavigateSection={handleNavigateSection}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Storefront Body Content */}
      <main className="flex-1 space-y-4">
        {/* 3. Promotional Image Banner Slider */}
        <PromotionCarousel
          onCtaClick={(categoryTarget) => {
            if (categoryTarget === 'ai') {
              setSelectedCategoryId('ai');
              handleNavigateSection('products');
            } else if (categoryTarget === 'how-it-works') {
              handleNavigateSection('how-it-works');
            } else {
              handleNavigateSection('products');
            }
          }}
        />

        {/* 4. Quick Benefits */}
        <BenefitList />

        {/* 5. Product Categories */}
        <CategorySection
          selectedCategoryId={selectedCategoryId}
          categories={initialCategories}
          onSelectCategory={(catId) => {
            setSelectedCategoryId(catId);
            handleNavigateSection('category-products-anchor');
          }}
        />

        {/* Dynamic Category Products Grid Anchor */}
        <div id="category-products-anchor">
          <ProductGrid
            title={selectedCategoryId === 'all' ? 'Produk Paling Dicari' : `Kategori: ${selectedCategoryId.toUpperCase()}`}
            subtitle="Klik 'Detail' untuk memilih paket atau '+ Keranjang' untuk order instan."
            products={categoryProducts}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* 7. Flash Sale / Promo Terbatas */}
        <FlashSaleSection
          products={initialProducts}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
          onViewAllPromo={() => handleNavigateSection('products')}
        />

        {/* 8. Products by Category Tabs */}
        <ProductTabs
          products={initialProducts}
          categories={initialCategories}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* 9. How It Works */}
        <HowItWorks />

        {/* 10. Trust Section */}
        <TrustSection />

        {/* 11. Customer Reviews */}
        <ReviewCarousel />

        {/* 12. FAQ Section */}
        <FAQSection />

        {/* 13. Newsletter Call to Action */}
        <NewsletterCTA />
      </main>

      {/* 14. Footer */}
      <StoreFooter
        onNavigateSection={handleNavigateSection}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          handleNavigateSection('category-products-anchor');
        }}
      />

      {/* Interactive Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onDirectBuy={(p, pkg) => handleAddToCart(p, pkg, 1)}
      />

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={initialProducts}
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={(name) => {
          setUserName(name);
          addToast('Halo Selamat Datang!', `Berhasil masuk sebagai ${name}.`);
        }}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
