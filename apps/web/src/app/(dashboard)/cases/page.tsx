import { getCases } from '@/lib/actions/cases';
import CasesDirectoryClient from '@/components/case/cases-directory-client';

export default async function CasesPage() {
  const { success, data: cases, error } = await getCases();

  if (!success) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-semibold">
          Gagal memuat daftar permohonan: {error}
        </div>
      </div>
    );
  }

  return <CasesDirectoryClient initialCases={(cases as any[]) || []} />;
}

