'use server'

import { createClient } from '@/lib/supabase/server'

export async function getActivities(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_activities')
    .select('*, actor:actor_id(name, email)')
    .eq('case_id', caseId)
    .order('timestamp', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createActivity(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: activity, error } = await supabase
    .from('case_activities')
    .insert({
      ...data,
      actor_id: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: activity }
}
