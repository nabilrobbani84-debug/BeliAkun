import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditProductForm from './EditProductForm'
import { Product, Category } from '@/lib/supabase/types'

export const revalidate = 0

export default async function EditProductPage(props: {
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

  // 2. Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .neq('status', 'archived')
    .order('sort_order', { ascending: true })

  return (
    <EditProductForm
      product={product as Product}
      categories={(categories || []) as Category[]}
    />
  )
}
