import { createClient } from '@/lib/supabase/server'
import NewProductForm from './NewProductForm'
import { Category } from '@/lib/supabase/types'

export const revalidate = 0

export default async function NewProductPage() {
  const supabase = await createClient()

  // Fetch active/inactive categories to select
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .neq('status', 'archived')
    .order('sort_order', { ascending: true })

  return <NewProductForm categories={(categories || []) as Category[]} />
}
