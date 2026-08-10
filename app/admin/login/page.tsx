'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg('Email atau password tidak sesuai.')
        setIsLoading(false)
        return
      }

      // Check if user has admin role in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin') || profile.status !== 'active') {
        setErrorMsg('Akses ditolak. Akun Anda bukan administrator.')
        // Clean session
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Successful login
      router.push('/admin')
    } catch {
      setErrorMsg('Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-slate-900 px-4">
      <div className="max-w-md w-full cartoon-card p-8 bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0F172A] space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 border-3 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-black text-2xl mt-2">Masuk ke Admin Beliakun.com</h1>
          <p className="text-xs font-semibold text-slate-500">
            Kelola produk dan katalog toko dari satu tempat.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border-2 border-red-900 rounded-xl text-red-950 font-bold text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Admin</label>
            <input
              suppressHydrationWarning
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              placeholder="admin@beliakun.com"
            />
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
            <div className="relative">
              <input
                suppressHydrationWarning
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 pr-10"
                placeholder="••••••••"
              />
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            suppressHydrationWarning
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
