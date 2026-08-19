'use client';

import * as React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderButtonProps {
  userName?: string;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function OrderButton({ userName, onOpenAuth }: OrderButtonProps) {
  const handleClick = () => {
    if (userName) {
      window.location.href = '/riwayat-pesanan';
    } else {
      // Guest behavior: prompt login
      onOpenAuth('login');
    }
  };

  return (
    <Button
      variant="icon"
      size="icon-sm"
      onClick={handleClick}
      className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] relative"
      title={userName ? "Riwayat Pesanan" : "Login untuk lihat pesanan"}
      aria-label="Lihat pesanan"
    >
      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
    </Button>
  );
}
