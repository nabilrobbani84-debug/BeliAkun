'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
  Store,
  ShoppingCart,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pesanan', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Pengiriman', href: '/admin/fulfillments', icon: Package },
    { name: 'Garansi & Klaim', href: '/admin/warranties', icon: ShieldAlert },
    { name: 'Produk', href: '/admin/products', icon: Store },
    { name: 'Kategori', href: '/admin/categories', icon: FolderTree },
    { name: 'Stok', href: '/admin/stock', icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b-4 border-slate-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center text-white font-black text-sm">
            B
          </div>
          <span className="font-black text-md text-slate-900">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg border-2 border-slate-900 bg-slate-100"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Panel) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r-4 border-slate-900 z-50 transform md:transform-none transition-transform duration-200 ease-in-out md:static flex flex-col justify-between
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex-1 py-6 px-4 space-y-8">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-black text-xl">
              B
            </div>
            <div>
              <span className="font-black text-lg text-slate-900">Beliakun<span className="text-blue-600">.com</span></span>
              <span className="block text-[10px] font-bold text-blue-600 tracking-wider uppercase -mt-1">ADMIN PORTAL</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl border-2 font-bold text-sm transition-all
                    ${isActive
                      ? 'bg-blue-600 text-white border-slate-900 shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                      : 'border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-slate-100 space-y-2 bg-slate-50">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 border-slate-900 bg-white font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 transition-all text-slate-800"
          >
            <Store className="w-4 h-4" />
            Buka Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 border-red-900 bg-red-50 hover:bg-red-100 font-bold text-xs text-red-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
