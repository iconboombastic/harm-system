import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import StafDashboard from '@/components/command-center/staf-dashboard';
import AtasanDashboard from '@/components/command-center/atasan-dashboard';
import AdminDashboard from '@/components/command-center/admin-dashboard';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Command Center | HARM',
};

export default async function CommandCenterPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Fetch user role - assuming it's stored in app_metadata or public.users
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const role = userProfile?.role || 'STAF'; // Default for UI preview

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
      </div>
      <Suspense fallback={<div>Memuat dashboard...</div>}>
        {role === 'STAF' && <StafDashboard />}
        {role === 'ATASAN' && <AtasanDashboard />}
        {role === 'ADMIN' && <AdminDashboard />}
      </Suspense>
    </div>
  );
}
