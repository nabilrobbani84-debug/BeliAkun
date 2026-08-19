'use client';

import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';

export function CartButton() {
  const { cartItemCount, setIsCartOpen } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="icon"
      size="icon-sm"
      onClick={() => setIsCartOpen(true)}
      className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] relative"
      title="Keranjang"
      aria-label="Buka keranjang"
    >
      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
      
      {mounted && cartItemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold border border-[var(--card)]">
          {cartItemCount}
        </span>
      )}
    </Button>
  );
}
