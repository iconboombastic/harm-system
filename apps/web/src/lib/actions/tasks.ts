'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTasks(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_tasks')
    .select('*, assignee:assignee_id(name, email)')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createTask(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: task, error } = await supabase
    .from('case_tasks')
    .insert({ ...data, creator_id: user?.id })
    .select()
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, data: task }
}

export async function updateTask(id: string, data: any) {
  const supabase = await createClient()
  const { data: task, error } = await supabase
    .from('case_tasks')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, data: task }
}

export async function assignTask(id: string, userId: string) {
  return updateTask(id, { assignee_id: userId })
}

export async function completeTask(id: string) {
  return updateTask(id, { status: 'DONE', completed_at: new Date().toISOString() })
}
