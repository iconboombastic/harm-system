import { getCaseById } from '@/lib/actions/cases';
import CaseActivityClient from '@/components/case/case-activity-client';

export default async function ActivityTab({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const { data: caseData } = await getCaseById(caseId);

  return (
    <CaseActivityClient
      caseId={caseId}
      caseTitle={caseData?.title}
      harmNumber={caseData?.harm_number}
    />
  );
}

