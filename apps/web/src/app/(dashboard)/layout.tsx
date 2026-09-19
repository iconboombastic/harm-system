import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/actions/auth-data';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import FloatingAICopilot from '@/components/ai/floating-ai-copilot';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const profile = await getUserProfile(session.user.id);
  const isMaster = 
    session.user.email === 'm.yusuf010224@gmail.com' || 
    session.user.email?.includes('admin');
  const role = profile?.role || session.user.user_metadata?.role || (isMaster ? 'ADMIN' : 'STAF');
  const user = profile || { 
    email: session.user.email, 
    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Administrator',
    role 
  };

  const displayName = (profile as any)?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Administrator';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar userRole={role} />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50/70 subtle-grid">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Floating AI Legal Copilot CS with Live Screen Detection & BPK/JDIH Links */}
      <FloatingAICopilot 
        currentUser={{
          id: session.user.id,
          name: displayName,
          role
        }} 
      />
    </div>
  );
}
