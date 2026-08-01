import React from 'react';

export function FooterBottom() {
  return (
    <div className="pt-4 border-t border-[var(--border)]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] font-semibold gap-2 text-center sm:text-left">
      <p suppressHydrationWarning>
        © 2026 Beliakun.com. Seluruh hak dilindungi.
      </p>
      <p className="text-blue-600 dark:text-blue-400 font-extrabold">
        Akun Premium, Harga Lebih Santai.
      </p>
    </div>
  );
}
