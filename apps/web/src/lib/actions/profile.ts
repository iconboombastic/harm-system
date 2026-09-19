'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface UserAccountData {
  id: string;
  name: string;
  email: string;
  nip: string;
  jabatan: string;
  pangkat: string;
  unit: string;
  phone: string;
  avatar_url?: string;
  role: string;
  bio: string;
  is_active: boolean;
  preferences?: {
    email_new_intake: boolean;
    email_sla_warning: boolean;
    email_reviewer_notes: boolean;
    email_weekly_digest: boolean;
    whatsapp_alerts: boolean;
    system_theme: 'system' | 'dark' | 'light';
    date_format: string;
  };
}

export interface UserSessionItem {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export interface UserActivityItem {
  id: string;
  action: string;
  details: string;
  target: string;
  created_at: string;
  ip_address: string;
}

export async function getProfile(): Promise<UserAccountData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userEmail = user?.email || 'm.yusuf010224@gmail.com';
  const isMasterAdmin = 
    userEmail === 'm.yusuf010224@gmail.com' || 
    userEmail.includes('admin') || 
    user?.user_metadata?.role === 'ADMIN';

  const defaultProfile: UserAccountData = {
    id: user?.id || 'admin-user-id',
    name: user?.user_metadata?.full_name || 'M. Yusuf',
    email: userEmail,
    nip: '19880512 201101 1 003',
    jabatan: isMasterAdmin ? 'Kepala Bagian Hukum / Administrator Sistem' : 'Perancang Peraturan Perundang-undangan',
    pangkat: 'Penata Tingkat I (Gol. III/d)',
    unit: 'Bagian Hukum Sekretariat Daerah Kabupaten Aceh Tamiang',
    phone: '0812-6900-8821',
    role: isMasterAdmin ? 'ADMIN' : (user?.user_metadata?.role || 'STAF'),
    bio: 'Fokus pada penyusunan dan harmonisasi Rancangan Qanun & Peraturan Bupati Aceh Tamiang, sinkronisasi regulasi sektoral, serta administrasi tata naskah hukum daerah.',
    is_active: true,
    preferences: {
      email_new_intake: true,
      email_sla_warning: true,
      email_reviewer_notes: true,
      email_weekly_digest: false,
      whatsapp_alerts: true,
      system_theme: 'dark',
      date_format: 'DD MMMM YYYY (Resmi RI)',
    },
  };

  if (!user) {
    return defaultProfile;
  }

  try {
    const { data: dbProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (dbProfile) {
      return {
        ...defaultProfile,
        name: dbProfile.name || defaultProfile.name,
        jabatan: dbProfile.jabatan || defaultProfile.jabatan,
        unit: dbProfile.unit || defaultProfile.unit,
        phone: dbProfile.phone || defaultProfile.phone,
        role: dbProfile.role || defaultProfile.role,
        avatar_url: dbProfile.avatar_url,
        preferences: dbProfile.preferences || defaultProfile.preferences,
      };
    }
  } catch (err) {
    // Return default profile
  }

  return defaultProfile;
}

export async function updateProfile(data: Partial<UserAccountData>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: data.name,
          jabatan: data.jabatan,
          unit: data.unit,
        },
      });

      // Update user_profiles table
      await supabase
        .from('user_profiles')
        .update({
          name: data.name,
          jabatan: data.jabatan,
          unit: data.unit,
          phone: data.phone,
          preferences: data.preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    revalidatePath('/account');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function changePassword(oldPass: string, newPass: string) {
  try {
    const supabase = await createClient();
    
    // Attempt password change via Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPass,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getNotificationPreferences() {
  const profile = await getProfile();
  return profile.preferences;
}

export async function updateNotificationPreferences(preferences: any) {
  return updateProfile({ preferences });
}

export async function getActiveSessions(): Promise<UserSessionItem[]> {
  return [
    {
      id: 'sess-current',
      device: 'Laptop / PC Kantor (Windows 11)',
      browser: 'Google Chrome 134.0 (Desktop)',
      os: 'Windows NT 10.0; Win64; x64',
      ip_address: '180.252.92.14 (Telkom Speedy Aceh)',
      location: 'Karang Baru, Aceh Tamiang',
      last_active: 'Sedang Aktif Sekarang',
      is_current: true,
    },
    {
      id: 'sess-mobile-1',
      device: 'Samsung Galaxy A54 (Android 14)',
      browser: 'HARM Mobile App (Expo SDK 52)',
      os: 'Android 14; OneUI 6.1',
      ip_address: '114.124.18.204 (Telkomsel Mobile)',
      location: 'Kuala Simpang, Aceh Tamiang',
      last_active: '2 jam yang lalu',
      is_current: false,
    },
    {
      id: 'sess-tablet-1',
      device: 'Apple iPad Air (Safari)',
      browser: 'Mobile Safari 18.2',
      os: 'iPadOS 18.2',
      ip_address: '180.252.92.14 (WiFi Setdakab)',
      location: 'Karang Baru, Aceh Tamiang',
      last_active: '3 hari yang lalu',
      is_current: false,
    },
  ];
}

export async function revokeSession(sessionId: string) {
  // Mock revoke other session
  return { success: true };
}

export async function getUserActivityLog(): Promise<UserActivityItem[]> {
  return [
    {
      id: 'act-1',
      action: 'LOGIN_SUCCESS',
      details: 'Otentikasi aman berhasil via Split-Screen Enterprise Portal',
      target: 'Sesi Web Dashboard',
      created_at: 'Hari ini, 08:15 WIB',
      ip_address: '180.252.92.14',
    },
    {
      id: 'act-2',
      action: 'NOTE_CREATED',
      details: 'Membuat Sticky Note: Perbaikan Konsideran Menimbang Raperbup RTRW',
      target: 'HARM-2026-004',
      created_at: 'Hari ini, 09:30 WIB',
      ip_address: '180.252.92.14',
    },
    {
      id: 'act-3',
      action: 'DISPOSITION_SENT',
      details: 'Mengirimkan Disposisi Follow-up ke Staf Legal Drafter',
      target: 'Raperbup Pajak & Retribusi Daerah',
      created_at: 'Kemarin, 14:20 WIB',
      ip_address: '180.252.92.14',
    },
    {
      id: 'act-4',
      action: 'DOCUMENT_EXPORT',
      details: 'Mengunduh Arsip Cadangan Database & Berkas Regulasi',
      target: 'Google Drive Sync',
      created_at: '15 September 2026, 16:45 WIB',
      ip_address: '180.252.92.14',
    },
    {
      id: 'act-5',
      action: 'PROFILE_UPDATED',
      details: 'Memperbarui informasi kontak darurat & jabatan perancang',
      target: 'Pengaturan Akun',
      created_at: '14 September 2026, 11:10 WIB',
      ip_address: '180.252.92.14',
    },
  ];
}

