'use server';

import { createClient } from '@/lib/supabase/server';

export async function getNotifications(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return [];
  return data || [];
}

export async function markAsRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getUnreadCount(userId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}

export async function createNotification(userId: string, type: string, title: string, message: string, caseId?: string, actionUrl?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      case_id: caseId,
      action_url: actionUrl,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
