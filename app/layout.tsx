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
        {/* Theme initialization script — runs BEFORE paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}

                // Remove extension-injected attributes before React hydration
                try {
                  var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(m) {
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                      if (m.type === 'childList') {
                        m.addedNodes.forEach(function(node) {
                          if (node.nodeType === 1) {
                            if (node.hasAttribute('bis_skin_checked')) {
                              node.removeAttribute('bis_skin_checked');
                            }
                            var children = node.querySelectorAll('[bis_skin_checked]');
                            for (var i = 0; i < children.length; i++) {
                              children[i].removeAttribute('bis_skin_checked');
                            }
                          }
                        });
                      }
                    });
                  });
                  observer.observe(document.documentElement, { 
                    attributes: true, 
                    attributeFilter: ['bis_skin_checked'],
                    childList: true, 
                    subtree: true 
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-amber-300 selection:text-slate-900 font-sans min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
