import { createClient } from '@/lib/supabase/server'
import { Category, ProductWithVariants, Product, ProductVariant } from '@/lib/supabase/types'

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error.message)
    return []
  }

  return data as Category[]
}

export async function getActiveProducts(): Promise<ProductWithVariants[]> {
  const supabase = await createClient()

  // Fetch active products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (productsError || !products) {
    console.error('Error fetching products:', productsError?.message)
    return []
  }

  // Fetch active variants for these products
  const productIds = products.map((p) => p.id)
  
  if (productIds.length === 0) {
    return []
  }

  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (variantsError) {
    console.error('Error fetching variants:', variantsError.message)
    // We could still return products without variants, but usually we want variants
  }

  const variantsMap = (variants || []).reduce((acc: Record<string, ProductVariant[]>, variant: ProductVariant) => {
    if (!acc[variant.product_id]) {
      acc[variant.product_id] = []
    }
    acc[variant.product_id].push(variant)
    return acc
  }, {})

  return products.map((product) => ({
    ...(product as Product),
    variants: variantsMap[product.id] || [],
  }))
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const supabase = await createClient()

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (productError || !product) {
    console.error('Error fetching product by slug:', productError?.message)
    return null
  }

  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (variantsError) {
    console.error('Error fetching variants by product:', variantsError.message)
  }

  return {
    ...(product as Product),
    variants: (variants || []) as ProductVariant[],
  }
}
