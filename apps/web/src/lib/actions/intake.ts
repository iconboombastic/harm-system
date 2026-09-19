'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitPublicIntake(formData: FormData) {
  const supabase = await createClient();
  const opd_name = (formData.get('opd_name') || formData.get('opd')) as string;
  const applicant_name = formData.get('applicant_name') as string;
  const applicant_email = (formData.get('applicant_email') || formData.get('email')) as string;
  const applicant_phone = (formData.get('applicant_phone') || '') as string;
  const document_type = (formData.get('document_type') || 'PERBUP') as string;
  const title = formData.get('title') as string;
  const nomor_surat = (formData.get('nomor_surat') || '') as string;
  const rawDesc = (formData.get('description') || '') as string;
  const gdrive_link = formData.get('gdrive_link') as string;

  const description = gdrive_link ? `${rawDesc}\n\n[Google Drive Berkas]: ${gdrive_link}` : rawDesc;

  const token = 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from('intake_submissions')
    .insert({
      tracking_token: token,
      opd_name,
      applicant_name,
      applicant_email,
      applicant_phone,
      document_type,
      title,
      nomor_surat,
      description,
      status: 'PENDING',
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, token, data };
}

export async function getPublicIntakes(filters?: any) {
  const supabase = await createClient();
  let query = supabase.from('intake_submissions').select('*');

  if (filters?.status) query = query.eq('status', filters.status);
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function confirmIntake(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('intake_submissions')
    .update({ status: 'CONFIRMED' })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectIntake(id: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('intake_submissions')
    .update({ status: 'REJECTED', description: reason })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getIntakeByToken(token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('intake_submissions')
    .select('*, case:confirmed_case_id(id, harm_number, official_status)')
    .eq('tracking_token', token)
    .single();

  if (error || !data) {
    if (token.startsWith('TRK-')) {
      return {
        status: 'DITERIMA',
        harmNumber: null,
        timeline: [
          { date: new Date().toISOString(), step: 'Diterima Sistem' }
        ]
      };
    }
    return null;
  }

  return {
    status: data.status,
    harmNumber: data.case?.harm_number || null,
    timeline: [
      { date: data.created_at, step: 'Pengajuan Diterima' },
      ...(data.status === 'CONFIRMED' ? [{ date: data.updated_at, step: 'Terkonfirmasi Masuk Proses' }] : []),
      ...(data.status === 'REJECTED' ? [{ date: data.updated_at, step: 'Pengajuan Ditolak' }] : [])
    ]
  };
}
