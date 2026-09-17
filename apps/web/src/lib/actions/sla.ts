'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCaseSla(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_sla')
    .select('*, sla_config:sla_config_id(*)')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function pauseSla(caseId: string, reason: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_sla')
    .update({
      paused_at: new Date().toISOString(),
      state: 'PAUSED',
      extension_reason: reason,
    })
    .eq('case_id', caseId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function resumeSla(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_sla')
    .update({
      paused_at: null,
      state: 'ON_TRACK',
    })
    .eq('case_id', caseId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
