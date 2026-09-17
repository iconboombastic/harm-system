export async function getSession() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUserProfile(userId: string) {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, name, jabatan, unit, phone, avatar_url, role, is_active, preferences')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}
