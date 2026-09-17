'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logAudit(action: string, objectType: string, objectId: string, oldValue: any, newValue: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  await supabase.from('audit_trail').insert({
    action,
    object_type: objectType,
    object_id: objectId,
    actor_id: user?.id,
    old_value: oldValue,
    new_value: newValue
  })
}

export async function getAuditTrail(filters: any) {
  const supabase = await createClient()
  let query = supabase.from('audit_trail').select('*, actor:actor_id(name, email)')
  if (filters?.objectId) query = query.eq('object_id', filters.objectId)
  
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function logAccess(action: string, filePath: string, documentVersionId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('access_log').insert({
      user_id: user.id,
      action,
      file_path: filePath,
      document_version_id: documentVersionId,
    })
  }
}
