import OpdManagerClient from '@/components/admin/opd-manager-client';

export const metadata = {
  title: 'Struktur OPD | HARM Aceh Tamiang',
  description: 'Kelola master data Organisasi Perangkat Daerah dan unit kerja instansi pemohon',
};

export default function OPDPage() {
  return <OpdManagerClient />;
}
