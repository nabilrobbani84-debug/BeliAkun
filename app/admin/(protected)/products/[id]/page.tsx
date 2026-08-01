import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetailManager from './ProductDetailManager'
import { Product, ProductVariant } from '@/lib/supabase/types'

export const revalidate = 0

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  // 1. Fetch product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (productError || !product) {
    return notFound()
  }

  // 2. Fetch category name
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', product.category_id)
    .single()

  // 3. Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)
    .order('sort_order', { ascending: true })

  // 4. Fetch delivery fields
  const { data: fields } = await supabase
    .from('product_delivery_fields')
    .select('*')
    .eq('product_id', id)
    .order('sort_order', { ascending: true })

  return (
    <ProductDetailManager
      product={product as Product}
      categoryName={category?.name || 'Kategori tidak dikenal'}
      initialVariants={(variants || []) as ProductVariant[]}
      initialFields={fields || []}
    />
  )
}
