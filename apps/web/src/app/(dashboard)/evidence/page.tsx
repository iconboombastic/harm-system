import GlobalEvidenceClient from '@/components/evidence/global-evidence-client';

export const metadata = { 
  title: 'Pusat Evidence | HARM - Bagian Hukum Setdakab Aceh Tamiang',
  description: 'Pusat repositori bukti dokumen harmonisasi hukum terverifikasi SHA-256'
};

export default function EvidenceIndexPage() {
  return <GlobalEvidenceClient />;
}
