'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="icon"
        size="icon-sm"
        className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px]"
      >
        <div className="w-4 h-4" /> {/* Placeholder */}
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="icon"
      size="icon-sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px]"
      title={isDark ? t.themeLight : t.themeDark}
      aria-label="Ubah Tema"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600" />
      )}
    </Button>
  );
}
