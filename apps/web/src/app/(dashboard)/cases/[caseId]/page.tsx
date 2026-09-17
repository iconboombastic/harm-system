import { getCaseById } from '@/lib/actions/cases'

export default async function CaseOverviewPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params
  const { data: caseData } = await getCaseById(caseId)
  
  if (!caseData) return <div>Data tidak ditemukan</div>

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Informasi Utama</h2>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">Deskripsi</span>
              <p className="text-gray-900">{caseData.description || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Jenis Dokumen</span>
              <p className="text-gray-900 font-medium">{caseData.document_type}</p>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Prioritas</span>
              <p className="text-gray-900">{caseData.priority}</p>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Tanggal Dibuat</span>
              <p className="text-gray-900">{new Date(caseData.created_at).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Aktivitas Terakhir</h2>
          <div className="text-gray-500 italic text-sm">Belum ada aktivitas.</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tim & PIC</h2>
          <div className="space-y-4">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Pengaju (OPD)</span>
              <div className="mt-1 text-sm font-medium">{caseData.owner?.name || caseData.owner?.email || caseData.applicant_name || 'Belum ada'}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Assignee (Bagian Hukum)</span>
              <div className="mt-1 text-sm font-medium">{caseData.assignee?.name || caseData.assignee?.email || 'Belum di-assign'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tindakan Cepat</h2>
          <div className="flex flex-col gap-2">
            <button className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
              Ubah Status
            </button>
            <button className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
              Assign PIC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
