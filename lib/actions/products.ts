'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

// 1. Create Product
export async function createProduct(formData: {
  category_id: string
  name: string
  slug: string
  short_description: string
  description: string
  features: string[]
  badge: 'none' | 'bestseller' | 'saving' | 'new' | 'limited_stock'
  delivery_method: 'instant' | 'manual'
  warranty_enabled: boolean
  warranty_duration: number | null
  warranty_unit: 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom' | null
  warranty_label: string
  status: 'draft' | 'active' | 'inactive' | 'archived'
  sort_order: number
}) {
  await ensureAdmin()
  const supabase = await createClient()

  const cleanSlug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-')

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        category_id: formData.category_id,
        name: formData.name.trim(),
        slug: cleanSlug,
        short_description: formData.short_description.trim() || null,
        description: formData.description.trim() || null,
        features: formData.features,
        badge: formData.badge,
        delivery_method: formData.delivery_method,
        warranty_enabled: formData.warranty_enabled,
        warranty_duration: formData.warranty_enabled ? formData.warranty_duration : null,
        warranty_unit: formData.warranty_enabled ? formData.warranty_unit : null,
        warranty_label: formData.warranty_enabled ? formData.warranty_label.trim() : null,
        status: formData.status,
        sort_order: formData.sort_order,
      },
    ])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Slug produk sudah digunakan.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true, data }
}

// 2. Update Product
export async function updateProduct(
  id: string,
  formData: {
    category_id: string
    name: string
    slug: string
    short_description: string
    description: string
    features: string[]
    badge: 'none' | 'bestseller' | 'saving' | 'new' | 'limited_stock'
    delivery_method: 'instant' | 'manual'
    warranty_enabled: boolean
    warranty_duration: number | null
    warranty_unit: 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom' | null
    warranty_label: string
    status: 'draft' | 'active' | 'inactive' | 'archived'
    sort_order: number
  }
) {
  await ensureAdmin()
  const supabase = await createClient()

  const cleanSlug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-')

  const { data, error } = await supabase
    .from('products')
    .update({
      category_id: formData.category_id,
      name: formData.name.trim(),
      slug: cleanSlug,
      short_description: formData.short_description.trim() || null,
      description: formData.description.trim() || null,
      features: formData.features,
      badge: formData.badge,
      delivery_method: formData.delivery_method,
      warranty_enabled: formData.warranty_enabled,
      warranty_duration: formData.warranty_enabled ? formData.warranty_duration : null,
      warranty_unit: formData.warranty_enabled ? formData.warranty_unit : null,
      warranty_label: formData.warranty_enabled ? formData.warranty_label.trim() : null,
      status: formData.status,
      sort_order: formData.sort_order,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Slug produk sudah digunakan.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/admin/products')
  return { success: true, data }
}

// 3. Save Delivery Fields (Bulk Upsert/Delete)
export async function saveDeliveryFields(
  productId: string,
  fields: Array<{
    id?: string
    field_key: string
    label: string
    field_type: 'text' | 'email' | 'password' | 'url' | 'code' | 'pin' | 'textarea' | 'number'
    is_required: boolean
    is_secret: boolean
    sort_order: number
  }>
) {
  await ensureAdmin()
  const supabase = await createClient()

  // First, get currently stored fields
  const { data: existingFields } = await supabase
    .from('product_delivery_fields')
    .select('id')
    .eq('product_id', productId)

  const existingIds = (existingFields || []).map((f) => f.id)
  const incomingIds = fields.filter((f) => f.id).map((f) => f.id!)

  // Identify fields to delete
  const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id))

  // Delete removed fields
  if (idsToDelete.length > 0) {
    await supabase.from('product_delivery_fields').delete().in('id', idsToDelete)
  }

  // Upsert incoming fields
  const upsertData = fields.map((f) => ({
    id: f.id || undefined,
    product_id: productId,
    field_key: f.field_key.trim().toLowerCase().replace(/\s+/g, '_'),
    label: f.label.trim(),
    field_type: f.field_type,
    is_required: f.is_required,
    is_secret: f.is_secret,
    sort_order: f.sort_order,
  }))

  const { error } = await supabase.from('product_delivery_fields').upsert(upsertData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

// 4. Create Variant
export async function createVariant(
  productId: string,
  variantData: {
    name: string
    sku: string
    price: number
    compare_at_price: number | null
    duration_value: number | null
    duration_unit: 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom'
    duration_label: string
    package_label: string
    stock_type: 'limited' | 'unlimited'
    account_type: 'invite' | 'sharing' | 'private' | 'license' | 'link_access' | 'custom'
    status: 'active' | 'inactive' | 'archived'
    sort_order: number
  }
) {
  await ensureAdmin()
  const supabase = await createClient()

  const cleanSku = variantData.sku.trim().toUpperCase()

  const { data, error } = await supabase
    .from('product_variants')
    .insert([
      {
        product_id: productId,
        name: variantData.name.trim(),
        sku: cleanSku,
        price: variantData.price,
        compare_at_price: variantData.compare_at_price || null,
        duration_value: variantData.duration_value,
        duration_unit: variantData.duration_unit,
        duration_label: variantData.duration_label.trim() || null,
        package_label: variantData.package_label.trim() || null,
        stock_type: variantData.stock_type,
        account_type: variantData.account_type,
        status: variantData.status,
        sort_order: variantData.sort_order,
      },
    ])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'SKU sudah digunakan oleh varian lain.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
  return { success: true, data }
}

// 5. Update Variant
export async function updateVariant(
  id: string,
  productId: string,
  variantData: {
    name: string
    sku: string
    price: number
    compare_at_price: number | null
    duration_value: number | null
    duration_unit: 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'custom'
    duration_label: string
    package_label: string
    stock_type: 'limited' | 'unlimited'
    account_type: 'invite' | 'sharing' | 'private' | 'license' | 'link_access' | 'custom'
    status: 'active' | 'inactive' | 'archived'
    sort_order: number
  }
) {
  await ensureAdmin()
  const supabase = await createClient()

  const cleanSku = variantData.sku.trim().toUpperCase()

  const { data, error } = await supabase
    .from('product_variants')
    .update({
      name: variantData.name.trim(),
      sku: cleanSku,
      price: variantData.price,
      compare_at_price: variantData.compare_at_price || null,
      duration_value: variantData.duration_value,
      duration_unit: variantData.duration_unit,
      duration_label: variantData.duration_label.trim() || null,
      package_label: variantData.package_label.trim() || null,
      stock_type: variantData.stock_type,
      account_type: variantData.account_type,
      status: variantData.status,
      sort_order: variantData.sort_order,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'SKU sudah digunakan oleh varian lain.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/admin/products/${productId}`)
  return { success: true, data }
}
