import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/actions/auth-data';

export default async function AdminLayout({
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
  const role = profile?.role || session.user.user_metadata?.role;
  const isMasterAdmin = 
    role === 'ADMIN' || 
    role === 'ATASAN' || 
    session.user.email === 'm.yusuf010224@gmail.com' ||
    session.user.email?.includes('admin');
  
  if (!isMasterAdmin) {
    redirect('/command-center');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Administrasi Sistem</h1>
        <p className="text-muted-foreground">
          Kelola pengguna, struktur organisasi, alur kerja, dan konfigurasi sistem.
        </p>
      </div>
      {children}
    </div>
  );
}
