'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCase } from '@/lib/actions/cases'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function NewCasePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [opds, setOpds] = useState<Array<{ id: string; kode: string; nama: string }>>([
    { id: 'ca2653c0-5df3-4533-b2b0-048b1aed7e0c', kode: 'SETDA', nama: 'Sekretariat Daerah' },
    { id: '4e16854f-e715-4dbc-b79d-26969e8dafa1', kode: 'BKPSDM', nama: 'Badan Kepegawaian dan Pengembangan SDM' },
    { id: '6fbe8acc-309e-443b-9497-e0faf630ac36', kode: 'BAPPEDA', nama: 'Badan Perencanaan Pembangunan Daerah' },
    { id: '9d62c38b-d82c-4225-9f35-5e60d5ccda25', kode: 'DINKES', nama: 'Dinas Kesehatan' },
    { id: 'c4814e73-0e52-4da9-9caf-d38f3af1807c', kode: 'DISDIK', nama: 'Dinas Pendidikan dan Kebudayaan' },
  ])

  useEffect(() => {
    async function loadOpds() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('opd').select('id, kode, nama').order('nama')
        if (data && data.length > 0) {
          setOpds(data)
        }
      } catch (err) {
        console.error('Failed to load OPDs:', err)
      }
    }
    loadOpds()
  }, [])

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)

      const input = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        opd_id: formData.get('opd_id') as string,
        document_type: formData.get('document_type') as string,
        priority: formData.get('priority') as string,
      }

      const res = await createCase(input)

      if (!res.success) {
        setError(res.error || 'Terjadi kesalahan saat membuat permohonan.')
        setLoading(false)
        return
      }

      /*
       * Case berhasil dibuat.
       *
       * Untuk sementara file belum di-upload ke Supabase Storage.
       * File baru sebatas dipilih pada form.
       *
       * Upload dokumen akan kita sambungkan setelah
       * proses create case sudah stabil.
       */

      router.push(`/cases/${res.data.id}`)
      router.refresh()

    } catch (err) {
      console.error('Create case error:', err)

      setError(
        'Terjadi kesalahan pada sistem. Silakan coba lagi.'
      )

      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-sm border mt-8">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Buat Permohonan Baru
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Isi data permohonan harmonisasi dokumen.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ========================================= */}
        {/* JUDUL */}
        {/* ========================================= */}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-2"
          >
            Judul Permohonan
          </label>

          <input
            id="title"
            required
            name="title"
            type="text"
            maxLength={500}
            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Raperbup tentang Retribusi"
          />
        </div>


        {/* ========================================= */}
        {/* DESKRIPSI */}
        {/* ========================================= */}

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Deskripsi
          </label>

          <textarea
            id="description"
            required
            name="description"
            rows={4}
            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jelaskan secara singkat maksud permohonan..."
          />
        </div>


        {/* ========================================= */}
        {/* OPD */}
        {/* ========================================= */}

        <div>
          <label
            htmlFor="opd_id"
            className="block text-sm font-medium mb-2"
          >
            OPD Pemrakarsa
          </label>

          <select
            id="opd_id"
            required
            name="opd_id"
            defaultValue=""
            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option
              value=""
              disabled
            >
              Pilih OPD Pemrakarsa
            </option>

            {opds.map((opd) => (
              <option key={opd.id} value={opd.id}>
                {opd.kode} — {opd.nama}
              </option>
            ))}
          </select>
        </div>


        {/* ========================================= */}
        {/* JENIS DOKUMEN + PRIORITAS */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* JENIS DOKUMEN */}

          <div>
            <label
              htmlFor="document_type"
              className="block text-sm font-medium mb-2"
            >
              Jenis Dokumen
            </label>

            <select
              id="document_type"
              required
              name="document_type"
              defaultValue="PERBUP"
              className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="PERDA">
                Peraturan Daerah / Qanun
              </option>

              <option value="PERBUP">
                Peraturan Bupati
              </option>

              <option value="KEPUTUSAN_BUPATI">
                SK Bupati
              </option>

              <option value="INSTRUKSI_BUPATI">
                Instruksi Bupati
              </option>

            </select>
          </div>


          {/* PRIORITAS */}

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-2"
            >
              Prioritas
            </label>

            <select
              id="priority"
              required
              name="priority"
              defaultValue="NORMAL"
              className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="LOW">
                Rendah
              </option>

              <option value="NORMAL">
                Normal
              </option>

              <option value="HIGH">
                Tinggi
              </option>

              <option value="CRITICAL">
                Mendesak
              </option>

            </select>
          </div>

        </div>


        {/* ========================================= */}
        {/* INFORMASI PEMOHON */}
        {/* ========================================= */}

        <div className="rounded-lg border bg-gray-50 p-4">

          <div className="text-sm font-medium text-gray-800">
            Pemohon
          </div>

          <div className="text-sm text-gray-500 mt-1">
            Nama dan email pemohon akan diambil otomatis
            dari akun yang sedang login.
          </div>

        </div>


        {/* ========================================= */}
        {/* DOKUMEN */}
        {/* ========================================= */}

        <div>

          <label
            className="block text-sm font-medium mb-2"
          >
            Dokumen Permohonan
          </label>

          <div className="border-2 border-dashed rounded-lg p-6 text-center">

            <input
              type="file"
              id="document"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0] || null

                setSelectedFile(file)
              }}
            />

            <label
              htmlFor="document"
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 font-medium"
            >
              Sematkan Dokumen
            </label>


            {selectedFile ? (

              <div className="mt-3 text-sm text-gray-700">

                <div className="font-medium">
                  {selectedFile.name}
                </div>

                <div className="text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>

              </div>

            ) : (

              <p className="mt-3 text-sm text-gray-500">
                PDF, DOC, atau DOCX
              </p>

            )}

          </div>

        </div>


        {/* ========================================= */}
        {/* TOMBOL */}
        {/* ========================================= */}

        <div className="pt-4 flex justify-end gap-3">

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => router.back()}
          >
            Batal
          </Button>


          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Menyimpan...'
              : 'Buat Permohonan'}
          </Button>

        </div>

      </form>

    </div>
  )
}