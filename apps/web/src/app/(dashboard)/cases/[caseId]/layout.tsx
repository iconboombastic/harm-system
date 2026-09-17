import { getCaseById } from '@/lib/actions/cases'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CaseWorkspaceLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ caseId: string }>
}) {
  const { caseId } = await params
  const { success, data: caseData } = await getCaseById(caseId)

  if (!success || !caseData) return notFound()

  const tabs = [
    { name: 'Ikhtisar', href: '' },
    { name: 'Proses', href: '/process' },
    { name: 'Dokumen', href: '/documents' },
    { name: 'Evidence', href: '/evidence' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Review', href: '/review' },
    { name: 'Catatan', href: '/notes' },
    { name: 'Tugas', href: '/tasks' },
    { name: 'Rapat', href: '/meetings' },
    { name: 'Keputusan', href: '/decisions' },
    { name: 'Relasi', href: '/relations' },
    { name: 'Aktivitas', href: '/activity' },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      <div className="bg-white border-b px-8 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{caseData.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {caseData.official_status || caseData.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 flex gap-4">
              <span>{caseData.harm_number || 'Draft'}</span>
              <span>•</span>
              <span>{caseData.opd?.nama || caseData.opd?.name || 'Unknown OPD'}</span>
            </div>
          </div>
        </div>

        <nav className="flex space-x-6 overflow-x-auto pb-2 -mb-6 border-b">
          {tabs.map(tab => (
            <Link
              key={tab.name}
              href={`/cases/${caseData.id}${tab.href}`}
              className="pb-4 text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent whitespace-nowrap transition-colors"
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}
