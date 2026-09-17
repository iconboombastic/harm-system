import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/actions/auth-data';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar userRole={profile?.role || 'USER'} />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header user={profile || { email: session.user.email, full_name: session.user.email }} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
