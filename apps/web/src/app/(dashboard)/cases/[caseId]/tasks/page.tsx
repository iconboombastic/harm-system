import { getCaseById } from '@/lib/actions/cases';
import CaseTasksClient from '@/components/case/case-tasks-client';

export default async function TasksTab({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const { data: caseData } = await getCaseById(caseId);

  return (
    <CaseTasksClient
      caseId={caseId}
      caseTitle={caseData?.title}
    />
  );
}

