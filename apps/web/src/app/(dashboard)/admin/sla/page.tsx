import SlaManagerClient from '@/components/admin/sla-manager-client';

export const metadata = {
  title: 'Manajemen SLA | HARM Aceh Tamiang',
  description: 'Pengaturan target batas waktu (SLA) dan kebijakan eskalasi proses harmonisasi',
};

export default function SLAPage() {
  return <SlaManagerClient />;
}
