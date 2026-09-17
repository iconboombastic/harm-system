'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createCaseSchema } from '@harm/shared/src/validators'
import { logAudit } from './audit'

export async function getCases(filters?: any) {
  const supabase = await createClient()
  let query = supabase.from('cases').select(`
    *,
    opd:opd_id(*),
    assignee:assignee_id(*),
    owner:case_owner_id(*)
  `)

  if (filters?.status) query = query.eq('official_status', filters.status)
  if (filters?.opd) query = query.eq('opd_id', filters.opd)
  if (filters?.assignee) query = query.eq('assignee_id', filters.assignee)
  
  query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function getCaseById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('cases').select('*, opd:opd_id(*), assignee:assignee_id(*), owner:case_owner_id(*)').eq('id', id).single()
  
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createCase(input: any) {
  const supabase = await createClient()

  // Ambil akun yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: 'Unauthorized',
    }
  }

  // Ambil profil pengguna
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('user_profiles')
    .select('id, name, role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Profile error:', profileError)

    return {
      success: false,
      error: 'Profil pengguna tidak ditemukan.',
    }
  }

  // Validasi DATA FORM saja
  const validated = createCaseSchema.safeParse(input)

  if (!validated.success) {
    const validationError = validated.error.flatten()

    console.error(
      'CREATE CASE VALIDATION ERROR:',
      JSON.stringify(validationError, null, 2)
    )

    return {
      success: false,
      error: Object.values(validationError.fieldErrors)
        .flat()
        .join(', ') || 'Validasi gagal',
    }
  }

  // Gabungkan data form + data otomatis dari akun login
  const caseData = {
    ...validated.data,

    // Pemohon otomatis dari akun yang login
    applicant_name: profile.name,
    applicant_email: user.email || '',

    // Pemilik case otomatis akun pembuat
    case_owner_id: user.id,

    // Status awal sesuai schema
    official_status: 'DIAJUKAN',
    operational_state: 'IN_PROGRESS',
  }

  const { data, error } = await supabase
    .from('cases')
    .insert(caseData)
    .select()
    .single()

  if (error) {
    console.error('Create case error:', error)

    return {
      success: false,
      error: error.message,
    }
  }

  await logAudit(
    'CREATE',
    'CASE',
    data.id,
    null,
    data
  )

  revalidatePath('/cases')

  return {
    success: true,
    data,
  }
}

export async function updateCase(id: string, input: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('cases').update(input).eq('id', id).select().single()
  
  if (error) return { success: false, error: error.message }
  await logAudit('UPDATE', 'CASE', id, null, data)
  revalidatePath(`/cases/${id}`)
  return { success: true, data }
}

export async function archiveCase(caseId: string) {
  return updateCase(caseId, { is_archived: true, archived_at: new Date().toISOString() })
}

export async function allocateHarmNumber(caseId: string) {
  const supabase = await createClient()
  const year = new Date().getFullYear()
  const { data: harmNumber, error: rpcError } = await supabase.rpc('allocate_harm_number', { p_year: year })
  
  const finalHarmNumber = (!rpcError && harmNumber)
    ? harmNumber
    : `HARM-${year}-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`

  return updateCase(caseId, { harm_number: finalHarmNumber })
}

export async function confirmIntake(caseId: string) {
  return updateCase(caseId, { intake_confirmed: true, intake_confirmed_at: new Date().toISOString() })
}

export async function reopenCase(caseId: string, reason: string) {
  const res = await updateCase(caseId, { official_status: 'MENUNGGU_REVIEW_ULANG' })
  if (res.success) await logAudit('REOPEN', 'CASE', caseId, null, { reason })
  return res
}

export async function updateCaseOwnership(caseId: string, role: string, newUserId: string, reason: string) {
  const updateData: any = {}
  if (role === 'assignee') updateData.assignee_id = newUserId
  if (role === 'owner') updateData.case_owner_id = newUserId
  
  const res = await updateCase(caseId, updateData)
  if (res.success) await logAudit('UPDATE_OWNERSHIP', 'CASE', caseId, null, { role, newUserId, reason })
  return res
}

export async function addCaseWatcher(caseId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_watchers').insert({ case_id: caseId, user_id: userId })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function removeCaseWatcher(caseId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_watchers').delete().match({ case_id: caseId, user_id: userId })
  if (error) return { success: false, error: error.message }
  return { success: true }
}
