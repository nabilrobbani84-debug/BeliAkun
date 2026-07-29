import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Beliakun.com - Akun Premium, Harga Lebih Santai',
  description:
    'Marketplace produk & akun digital premium terpercaya. ChatGPT Plus, Gemini Advanced, Claude Pro, Canva Pro, Netflix, Spotify, VPN Premium.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var originalFetch = window.fetch;
                  var fetchValue = originalFetch;
                  Object.defineProperty(window, 'fetch', {
                    get: function() { return fetchValue; },
                    set: function(val) { fetchValue = val; },
                    configurable: true,
                    enumerable: true
                  });
                } catch(e) {}
                
                // Remove extension-injected attributes like bis_skin_checked before React hydration
                document.addEventListener('DOMContentLoaded', function() {
                  var els = document.querySelectorAll('[bis_skin_checked]');
                  els.forEach(function(el) { el.removeAttribute('bis_skin_checked'); });
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className="bg-[#FAF8F5] text-slate-900 antialiased selection:bg-amber-300 selection:text-slate-900 font-sans min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
