import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditCategoryForm from './EditCategoryForm'
import { Category } from '@/lib/supabase/types'

export const revalidate = 0

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    return notFound()
  }

  return <EditCategoryForm category={category as Category} />
}
