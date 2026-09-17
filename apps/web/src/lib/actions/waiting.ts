'use server'

import { createClient } from '@/lib/supabase/server'

export async function getWaitingItems(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_waiting')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createWaiting(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: waiting, error } = await supabase
    .from('case_waiting')
    .insert({
      ...data,
      created_by: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: waiting }
}
