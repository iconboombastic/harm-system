'use server'

import { createClient } from '@/lib/supabase/server'

export async function getRelations(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_relations')
    .select('*, related_case:related_case_id(id, harm_number, title, official_status)')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function addRelation(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: relation, error } = await supabase
    .from('case_relations')
    .insert({
      ...data,
      created_by: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: relation }
}
