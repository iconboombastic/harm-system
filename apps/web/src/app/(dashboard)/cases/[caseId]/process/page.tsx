import { getCaseById } from '@/lib/actions/cases';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/actions/auth-data';
import CaseProcessManager from '@/components/case/case-process-manager';

export default async function ProcessTab({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let role = 'ADMIN';
  if (session) {
    const profile = await getUserProfile(session.user.id);
    role = profile?.role || session.user.user_metadata?.role || 'ADMIN';
  }

  const { data: caseData } = await getCaseById(caseId);

  return (
    <CaseProcessManager
      caseId={caseId}
      caseTitle={caseData?.title}
      harmNumber={caseData?.harm_number}
      currentUserRole={role}
    />
  );
}
