'use client';

import * as React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="icon"
        size="icon-sm"
        onClick={() => setIsOpen(!isOpen)}
        className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] font-black text-xs sm:text-sm tracking-widest text-slate-800 dark:text-slate-200"
        title="Bahasa"
        aria-label="Pilih bahasa"
      >
        {language.toUpperCase()}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[var(--card)] border-2 border-[var(--border)] rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
          <div className="flex flex-col py-1">
            <button
              onClick={() => handleSelect('id')}
              className={`text-left px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${language === 'id' ? 'text-blue-600' : 'text-[var(--foreground)]'}`}
            >
              🇮🇩 Indonesia
            </button>
            <button
              onClick={() => handleSelect('en')}
              className={`text-left px-4 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${language === 'en' ? 'text-blue-600' : 'text-[var(--foreground)]'}`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
