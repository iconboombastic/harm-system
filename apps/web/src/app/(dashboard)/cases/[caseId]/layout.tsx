import { getCaseById } from '@/lib/actions/cases';
import { notFound } from 'next/navigation';
import CaseWorkspaceHeader from '@/components/case/case-workspace-header';

export default async function CaseWorkspaceLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const { success, data: caseData } = await getCaseById(caseId);

  if (!success || !caseData) return notFound();

  return (
    <div className="flex flex-col h-full bg-slate-50/50 min-h-screen">
      <CaseWorkspaceHeader caseData={caseData} />
      
      <div className="flex-1 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

