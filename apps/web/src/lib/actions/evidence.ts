'use server'

import { createClient } from '@/lib/supabase/server'

export async function getEvidence(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_evidence')
    .select('*, actor:actor_id(name, email)')
    .eq('case_id', caseId)
    .order('date', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function uploadEvidence(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File | null
  const category = (formData.get('category') as string) || 'FOTO'
  const source = (formData.get('source') as string) || 'INTERNAL'
  const description = (formData.get('description') as string) || ''

  const { data: { user } } = await supabase.auth.getUser()

  let filePath: string | null = null
  let mimeType: string | null = null
  let fileSize: number | null = null

  if (file && file.size > 0) {
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    filePath = `${caseId}/${safeName}`
    mimeType = file.type
    fileSize = file.size

    const { error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(filePath, file)

    if (uploadError) return { success: false, error: uploadError.message }
  }

  const { data: evidence, error: insertError } = await supabase
    .from('case_evidence')
    .insert({
      case_id: caseId,
      category,
      source,
      description,
      date: new Date().toISOString(),
      file_path: filePath,
      mime_type: mimeType,
      file_size: fileSize,
      actor_id: user?.id,
      created_by: user?.id,
      confidentiality: 'INTERNAL',
    })
    .select()
    .single()

  if (insertError) return { success: false, error: insertError.message }
  return { success: true, data: evidence }
}

export async function deleteEvidence(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_evidence').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
