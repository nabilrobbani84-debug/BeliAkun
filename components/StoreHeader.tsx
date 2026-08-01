import React from 'react';
import { User, UserPlus, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { PageContainer } from '@/components/patterns/page-container';

interface StoreHeaderProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  userName?: string;
  onNavigateSection: (sectionId: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function StoreHeader({
  onOpenAuth,
  userName,
  onNavigateSection,
  isDarkMode,
  onToggleTheme,
}: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--card)] border-b-3 sm:border-b-4 border-[var(--border)] shadow-[0px_4px_10px_rgba(0,0,0,0.06)] transition-colors">
      <PageContainer className="py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-5">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-black text-sm sm:text-xl group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="4"/>
              <path d="M12 14v6m0-3h3"/>
            </svg>
            <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[8px] sm:text-[9px] shadow-[1px_1px_0px_0px_#000]">
              ✨
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-black text-base sm:text-2xl tracking-tight text-[var(--foreground)] leading-none">
              Beliakun<span className="text-blue-600">.com</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[var(--muted-foreground)] tracking-wide hidden xs:inline mt-0.5">
              Akun Premium Fast Process
            </span>
          </div>
        </div>

        {/* Right Header Actions: Theme Toggle, Masuk & Daftar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Light / Dark Mode Toggle Button */}
          <Button
            variant="icon"
            size="icon-sm"
            onClick={onToggleTheme}
            className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px]"
            title={isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            aria-label="Ubah Tema"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </Button>

          {/* User Logged In vs Logged Out Buttons */}
          {userName ? (
            <div
              onClick={() => onOpenAuth('login')}
              className="cartoon-card px-3 py-1.5 bg-blue-100 dark:bg-blue-950/60 border-[var(--border)] text-blue-950 dark:text-blue-200 flex items-center gap-2 cursor-pointer hover:bg-blue-200 transition-colors touch-target min-h-[40px]"
            >
              <Avatar fallback={userName} size="xs" />
              <span className="font-extrabold text-xs hidden sm:inline max-w-[120px] truncate">
                {userName}
              </span>
            </div>
          ) : (
            <>
              {/* Masuk (Login) Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenAuth('login')}
                className="touch-target min-h-[38px] sm:min-h-[40px] font-extrabold px-2.5 sm:px-3.5 text-xs"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Masuk</span>
              </Button>

              {/* Daftar (Register) Button */}
              <Button
                variant="cartoon"
                size="sm"
                onClick={() => onOpenAuth('register')}
                className="touch-target min-h-[38px] sm:min-h-[40px] font-extrabold px-2.5 sm:px-3.5 text-xs"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Daftar</span>
              </Button>
            </>
          )}
        </div>
      </PageContainer>
    </header>
  );
}
