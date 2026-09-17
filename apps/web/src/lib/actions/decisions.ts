'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDecisions(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_decisions')
    .select('*, actor:actor_id(name, email)')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createDecision(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: decision, error } = await supabase
    .from('case_decisions')
    .insert({
      ...data,
      actor_id: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: decision }
}
