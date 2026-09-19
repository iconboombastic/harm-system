import { Suspense } from 'react';
import { getProfile, getActiveSessions, getUserActivityLog } from '@/lib/actions/profile';
import AccountClient from '@/components/account/account-client';

export const metadata = {
  title: 'Pengaturan Akun Enterprise | HARM Kabupaten Aceh Tamiang',
};

export default async function AccountPage() {
  const [profile, sessions, activities] = await Promise.all([
    getProfile(),
    getActiveSessions(),
    getUserActivityLog(),
  ]);

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6 max-w-7xl mx-auto">
      <Suspense fallback={<div className="text-slate-500 text-sm">Memuat profil akun enterprise...</div>}>
        <AccountClient
          initialProfile={profile}
          initialSessions={sessions}
          initialActivities={activities}
        />
      </Suspense>
    </div>
  );
}

