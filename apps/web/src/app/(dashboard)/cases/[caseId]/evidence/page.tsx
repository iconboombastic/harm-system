import { getCaseById } from '@/lib/actions/cases';
import CaseEvidenceExplorer from '@/components/case/case-evidence-explorer';

export default async function EvidenceTab({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const { data: caseData } = await getCaseById(caseId);

  return (
    <CaseEvidenceExplorer
      caseId={caseId}
      caseTitle={caseData?.title}
      harmNumber={caseData?.harm_number}
      opdName={caseData?.opd?.nama || caseData?.opd?.name}
    />
  );
}

