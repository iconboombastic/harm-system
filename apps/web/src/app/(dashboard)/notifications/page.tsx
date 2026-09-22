import NotificationsClient from '@/components/notifications/notifications-client';

export const metadata = { 
  title: 'Notifikasi | HARM - Bagian Hukum Setdakab Aceh Tamiang',
  description: 'Pemberitahuan terkini disposisi telaahan, peringatan SLA, dan agenda pleno harmonisasi'
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
