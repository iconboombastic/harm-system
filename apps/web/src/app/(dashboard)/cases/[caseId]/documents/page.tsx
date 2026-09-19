import { getDocuments } from '@/lib/actions/documents'
import { DocumentsClient } from '@/components/case/documents-client'

export default async function DocumentsTab({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params
  const { data: docs } = await getDocuments(caseId)

  return <DocumentsClient caseId={caseId} initialDocs={(docs as any) || []} />
}
