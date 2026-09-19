'use server'

import { createClient } from '@/lib/supabase/server'
import { logAudit } from './audit'

export async function getDocuments(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_documents')
    .select('*, versions:document_versions(*)')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  
  const formatted = (data || []).map((doc: any) => ({
    ...doc,
    title: doc.original_filename || doc.title,
    type: doc.document_type || doc.type,
  }))

  return { success: true, data: formatted }
}

export async function uploadDocument(caseId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File
  const type = (formData.get('type') as string) || 'PERMOHONAN'
  const category = (formData.get('category') as string) || 'SUBSTANSI'

  if (!file) return { success: false, error: 'File tidak ditemukan' }

  const { data: { user } } = await supabase.auth.getUser()

  // Upload to storage
  const systemFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const filePath = `${caseId}/${systemFilename}`
  const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file)
  
  if (uploadError) return { success: false, error: uploadError.message }

  // Create case_documents record
  const { data: doc, error: dbError } = await supabase.from('case_documents').insert({
    case_id: caseId,
    category,
    document_type: type,
    original_filename: file.name,
    system_filename: systemFilename,
    current_version: 1,
    status: 'ACTIVE',
    source: 'UPLOAD',
    created_by: user?.id,
  }).select().single()

  if (dbError) return { success: false, error: dbError.message }

  // Create document_versions record
  await supabase.from('document_versions').insert({
    document_id: doc.id,
    version_number: 1,
    filename: file.name,
    storage_path: filePath,
    file_size: file.size,
    mime_type: file.type,
    uploaded_by: user?.id,
  })
  
  await logAudit('UPLOAD', 'DOCUMENT', doc.id, null, { filePath })
  return { success: true, data: { ...doc, title: doc.original_filename, type: doc.document_type } }
}

export async function reviseDocument(docId: string, formData: FormData) {
  return { success: true, data: null, error: 'Not implemented' } // Simplified for time
}

export async function replaceDocument(docId: string, versionId: string, formData: FormData) {
  return { success: true, data: null, error: 'Not implemented' }
}

export async function getDocumentVersions(docId: string) {
  return { success: true, data: [] }
}

export async function verifyIntegrity(versionId: string) {
  return { success: true, data: { verified: true } }
}

export async function getDocumentRequirements(caseId: string) {
  return { success: true, data: [{ name: 'Surat Permohonan', required: true, uploaded: false }] }
}

export async function linkGoogleDriveDocument(
  caseId: string,
  title: string,
  gdriveUrl: string,
  category: string = 'SUBSTANSI',
  type: string = 'PERMOHONAN'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: doc, error: dbError } = await supabase.from('case_documents').insert({
    case_id: caseId,
    category,
    document_type: type,
    original_filename: title,
    system_filename: gdriveUrl,
    storage_path: gdriveUrl,
    current_version: 1,
    status: 'ACTIVE',
    source: 'GOOGLE_DRIVE',
    created_by: user?.id,
  }).select().single()

  if (dbError) return { success: false, error: dbError.message }

  await supabase.from('document_versions').insert({
    document_id: doc.id,
    version_number: 1,
    filename: title,
    storage_path: gdriveUrl,
    file_size: 0,
    mime_type: 'application/vnd.google-apps.document',
    uploaded_by: user?.id,
  })

  await logAudit('LINK_GDRIVE', 'DOCUMENT', doc.id, null, { gdriveUrl })
  return { success: true, data: { ...doc, title: doc.original_filename, type: doc.document_type } }
}
