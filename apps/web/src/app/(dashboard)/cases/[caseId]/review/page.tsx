import { getCaseById } from '@/lib/actions/cases';
import CaseReviewWorkspace from '@/components/case/case-review-workspace';

export default async function ReviewTab({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const { data: caseData } = await getCaseById(caseId);

  return (
    <CaseReviewWorkspace
      caseId={caseId}
      caseTitle={caseData?.title}
      harmNumber={caseData?.harm_number}
      opdName={caseData?.opd?.nama || caseData?.opd?.name}
    />
  );
}
