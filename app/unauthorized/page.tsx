'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-slate-900 px-4">
      <div className="max-w-md w-full cartoon-card p-8 bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0F172A] text-center space-y-6">
        <h1 className="font-black text-3xl text-red-600">Akses Ditolak!</h1>
        <p className="font-semibold text-slate-600 text-sm">
          Akun Anda tidak memiliki hak akses administrator untuk mengelola Beliakun.com.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-blue-700 transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000]"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-950 font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-200 transition-all"
          >
            Keluar & Gunakan Akun Lain
          </button>
        </div>
      </div>
    </div>
  )
}
