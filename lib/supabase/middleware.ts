import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude the login page
    if (request.nextUrl.pathname === '/admin/login') {
      if (user) {
        // If already logged in, redirect to admin dashboard
        // First check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .single()

        if (profile && (profile.role === 'admin' || profile.role === 'super_admin') && profile.status === 'active') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      return supabaseResponse
    }

    // Require authentication
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check authorization role (admin/super_admin)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (error || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin') || profile.status !== 'active') {
      // Redirect to unauthorized / main site or clear session
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return supabaseResponse
}
