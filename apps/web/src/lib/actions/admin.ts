'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Fungsi helper untuk mengecek izin admin
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return { error: 'Unauthorized' };
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
    
  if (profile?.role !== 'ADMIN' && profile?.role !== 'ATASAN') {
    return { error: 'Forbidden' };
  }
  
  return { success: true, supabase };
}

// User Actions
export async function getUsers() {
  const auth = await checkAdmin();
  if (auth.error) return [];
  
  const { data } = await auth.supabase!
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data || [];
}

export async function createUser(data: { email: string; password?: string; name: string; role: string; jabatan?: string; unit?: string }) {
  const auth = await checkAdmin();
  if (auth.error) return { error: auth.error };
  
  const { data: newUser, error: signUpError } = await auth.supabase!.auth.signUp({
    email: data.email,
    password: data.password || 'AcehTamiang2026!',
    options: {
      data: {
        full_name: data.name,
        role: data.role || 'STAF',
        jabatan: data.jabatan || '',
        unit: data.unit || 'Bagian Hukum',
      },
    },
  });

  if (signUpError) return { error: signUpError.message };

  if (newUser?.user) {
    await auth.supabase!.from('user_profiles').upsert({
      id: newUser.user.id,
      name: data.name,
      role: data.role || 'STAF',
      jabatan: data.jabatan || '',
      unit: data.unit || 'Bagian Hukum',
      is_active: true,
    });
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(id: string, data: any) {
  const auth = await checkAdmin();
  if (auth.error) return { error: auth.error };
  
  const { error } = await auth.supabase!
    .from('user_profiles')
    .update(data)
    .eq('id', id);
    
  if (error) return { error: error.message };
  revalidatePath('/admin/users');
  return { success: true };
}

export async function deactivateUser(id: string) {
  return updateUser(id, { is_active: false });
}

// OPD Actions
export async function getOpds() {
  const auth = await checkAdmin();
  if (auth.error) return [];
  
  const { data } = await auth.supabase!
    .from('opd')
    .select('*')
    .order('nama');
    
  return data || [];
}

export async function createOpd(data: any) {
  const auth = await checkAdmin();
  if (auth.error) return { error: auth.error };
  
  const { error } = await auth.supabase!
    .from('opd')
    .insert(data);
    
  if (error) return { error: error.message };
  revalidatePath('/admin/opd');
  return { success: true };
}

export async function updateOpd(id: string, data: any) {
  const auth = await checkAdmin();
  if (auth.error) return { error: auth.error };
  
  const { error } = await auth.supabase!
    .from('opd')
    .update(data)
    .eq('id', id);
    
  if (error) return { error: error.message };
  revalidatePath('/admin/opd');
  return { success: true };
}

// System Actions
export async function getAuditTrail() {
  const auth = await checkAdmin();
  if (auth.error) return [];
  
  const { data } = await auth.supabase!
    .from('audit_trail')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
    
  return data || [];
}

export async function getJobs() {
  // Simulasi data antrean pekerjaan latar belakang
  return [
    { id: '1', type: 'EMAIL_NOTIFICATION', status: 'COMPLETED', createdAt: new Date().toISOString() },
    { id: '2', type: 'DOCUMENT_GENERATION', status: 'PROCESSING', createdAt: new Date().toISOString() },
    { id: '3', type: 'DATA_SYNC', status: 'FAILED', createdAt: new Date().toISOString() },
  ];
}

export async function getSystemHealth() {
  return {
    database: 'SEHAT',
    storage: 'SEHAT',
    auth: 'SEHAT',
    queue: 'PERINGATAN',
    lastChecked: new Date().toISOString()
  };
}

export async function exportDatabaseBackup() {
  const supabase = await createClient();
  
  const [cases, intake, profiles, opds, docs, tasks, audit] = await Promise.all([
    supabase.from('cases').select('*'),
    supabase.from('intake_submissions').select('*'),
    supabase.from('user_profiles').select('*'),
    supabase.from('opd_units').select('*'),
    supabase.from('case_documents').select('*'),
    supabase.from('case_tasks').select('*'),
    supabase.from('audit_trail').select('*').limit(500),
  ]);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    system: 'HARM - Sistem Harmonisasi Dokumen Terpadu Kabupaten Aceh Tamiang',
    database_version: '1.0',
    data: {
      cases: cases.data || [],
      intake_submissions: intake.data || [],
      user_profiles: profiles.data || [],
      opd_units: opds.data || [],
      case_documents: docs.data || [],
      case_tasks: tasks.data || [],
      audit_trail: audit.data || [],
    }
  };
}
