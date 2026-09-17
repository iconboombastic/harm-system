'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchCases(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cases')
    .select('*, opd:opd_id(nama, kode)')
    .or(`title.ilike.%${query}%,harm_number.ilike.%${query}%,applicant_name.ilike.%${query}%`)
    .limit(20)

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function globalSearch(query: string, filters?: any) {
  const supabase = await createClient()
  const [casesRes, tasksRes, docsRes] = await Promise.all([
    supabase
      .from('cases')
      .select('id, harm_number, title, official_status, document_type')
      .or(`title.ilike.%${query}%,harm_number.ilike.%${query}%`)
      .limit(10),
    supabase
      .from('case_tasks')
      .select('id, title, status, case_id')
      .ilike('title', `%${query}%`)
      .limit(10),
    supabase
      .from('case_documents')
      .select('id, original_filename, document_type, case_id')
      .ilike('original_filename', `%${query}%`)
      .limit(10),
  ])

  return {
    success: true,
    data: {
      cases: casesRes.data || [],
      tasks: tasksRes.data || [],
      documents: docsRes.data || [],
    },
  }
}
