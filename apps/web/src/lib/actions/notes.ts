'use server'

import { createClient } from '@/lib/supabase/server'

export async function getNotes(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_notes')
    .select('*, author:author_id(name, email)')
    .eq('case_id', caseId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createNote(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: note, error } = await supabase
    .from('case_notes')
    .insert({
      ...data,
      author_id: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: note }
}

export async function togglePinNote(noteId: string, isPinned: boolean) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_notes')
    .update({ is_pinned: isPinned })
    .eq('id', noteId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_notes').delete().eq('id', noteId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
