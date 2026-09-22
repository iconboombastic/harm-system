import WorkflowManagerClient from '@/components/admin/workflow-manager-client';

export const metadata = {
  title: 'Alur Kerja (Workflow) | HARM Aceh Tamiang',
  description: 'Konfigurasi alur kerja, tahapan harmonisasi, dan syarat dokumen pendukung',
};

export default function WorkflowsPage() {
  return <WorkflowManagerClient />;
}
