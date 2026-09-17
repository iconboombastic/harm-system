import { getCases } from '@/lib/actions/cases'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function CasesPage() {
  const { success, data: cases, error } = await getCases()

  if (!success) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Permohonan</h1>
          <p className="text-gray-500">Kelola semua permohonan harmonisasi dokumen.</p>
        </div>
        <Link href="/cases/new">
          <Button>Buat Permohonan Baru</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="px-6 py-4">HARM#</th>
              <th className="px-6 py-4">Judul</th>
              <th className="px-6 py-4">OPD</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">SLA</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cases?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada permohonan ditemukan.
                </td>
              </tr>
            ) : (
              cases?.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{c.harm_number || '-'}</td>
                  <td className="px-6 py-4">{c.title}</td>
                  <td className="px-6 py-4">{c.opd?.nama || c.opd?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{c.official_status || c.status}</Badge>
                  </td>
                  <td className="px-6 py-4">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline">
                      Buka Workspace
                    </Link>
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
