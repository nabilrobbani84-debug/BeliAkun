'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to validate admin session on server side
async function ensureAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized: No user session')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin') || profile.status !== 'active') {
    throw new Error('Unauthorized: User is not an admin')
  }
}

export async function createCategory(formData: {
  name: string
  slug: string
  description: string
  status: 'active' | 'inactive' | 'archived'
  sort_order: number
}) {
  await ensureAdmin()

  const supabase = await createClient()
  
  // Clean slug
  const cleanSlug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-')

  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description.trim() || null,
        status: formData.status,
        sort_order: formData.sort_order,
      },
    ])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Slug sudah digunakan.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true, data }
}

export async function updateCategory(
  id: string,
  formData: {
    name: string
    slug: string
    description: string
    status: 'active' | 'inactive' | 'archived'
    sort_order: number
  }
) {
  await ensureAdmin()

  const supabase = await createClient()

  // Clean slug
  const cleanSlug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-')

  const { data, error } = await supabase
    .from('categories')
    .update({
      name: formData.name.trim(),
      slug: cleanSlug,
      description: formData.description.trim() || null,
      status: formData.status,
      sort_order: formData.sort_order,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Slug sudah digunakan.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true, data }
}
