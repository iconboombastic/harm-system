'use server'

import { createClient } from '@/lib/supabase/server'

export async function getWorkflow(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_stage_instances')
    .select('*, actor:actor_id(name, email)')
    .eq('case_id', caseId)
    .order('stage_order', { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function startStage(caseId: string, stageName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('case_stage_instances')
    .insert({
      case_id: caseId,
      stage_template_name: stageName,
      stage_order: 1,
      status: 'IN_PROGRESS',
      started_at: new Date().toISOString(),
      actor_id: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function completeStage(instanceId: string, outcome: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_stage_instances')
    .update({
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      outcome,
    })
    .eq('id', instanceId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function skipStage(instanceId: string, reason: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_stage_instances')
    .update({
      status: 'SKIPPED',
      skip_reason: reason,
      completed_at: new Date().toISOString(),
    })
    .eq('id', instanceId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
