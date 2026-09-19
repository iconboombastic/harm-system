import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import StafDashboard from '@/components/command-center/staf-dashboard';
import AtasanDashboard from '@/components/command-center/atasan-dashboard';
import AdminDashboard from '@/components/command-center/admin-dashboard';
import { 
  getStaffStickyNotes, 
  getDispatchedNotesProgress, 
  getStaffList 
} from '@/lib/actions/notes';
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

  // Fetch user role and profile name
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('id, role, name')
    .eq('id', session.user.id)
    .single();

  const role = userProfile?.role || session.user.user_metadata?.role || 'ADMIN';
  const userName = userProfile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Pengguna';

  const currentUser = {
    id: session.user.id,
    name: userName,
    role,
  };

  // Pre-fetch sticky notes with privacy isolation, staff dispatches progress, and drafter staff list
  const [{ data: stickyNotes }, { data: dispatches }, staffList] = await Promise.all([
    getStaffStickyNotes(session.user.id, role, userName),
    getDispatchedNotesProgress(session.user.id),
    getStaffList(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
      </div>
      <Suspense fallback={<div>Memuat dashboard...</div>}>
        {role === 'STAF' && (
          <StafDashboard 
            initialNotes={stickyNotes} 
            currentUser={currentUser} 
          />
        )}
        {role === 'ATASAN' && (
          <AtasanDashboard 
            initialNotes={stickyNotes} 
            initialDispatches={dispatches} 
            staffList={staffList} 
            currentUser={currentUser} 
          />
        )}
        {role === 'ADMIN' && (
          <AdminDashboard 
            initialNotes={stickyNotes} 
            initialDispatches={dispatches} 
            staffList={staffList} 
            currentUser={currentUser} 
          />
        )}
      </Suspense>
    </div>
  );
}
