import { getDocuments } from '@/lib/actions/documents'

export default async function DocumentsTab({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params
  const { data: docs } = await getDocuments(caseId)

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Daftar Dokumen</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          Upload Dokumen
        </button>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-600">Nama Dokumen</th>
              <th className="px-6 py-3 font-medium text-gray-600">Tipe</th>
              <th className="px-6 py-3 font-medium text-gray-600">Kategori</th>
              <th className="px-6 py-3 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!docs || docs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Belum ada dokumen yang diunggah.
                </td>
              </tr>
            ) : (
              docs.map((doc: any) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.type}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.category}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline">Unduh</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
