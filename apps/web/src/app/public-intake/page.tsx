'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  FileText, 
  HardDrive, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  FileCheck2,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { submitPublicIntake } from '@/lib/actions/intake';

export default function PublicIntakeForm() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitPublicIntake(formData);
      if (result.success && result.token) {
        setToken(result.token);
      } else {
        alert(result.error || 'Gagal mengirim pengajuan');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopy() {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Tampilan Resi Resmi Sukses
  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid-dark opacity-40 pointer-events-none" />
        <div className="max-w-xl w-full relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header Tanda Terima */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 p-6 text-white text-center relative">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs ring-1 ring-white/20">
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Tanda Terima Pendaftaran Harmonisasi</h2>
              <p className="text-xs text-blue-100 mt-1">Bagian Hukum Sekretariat Daerah Kabupaten Aceh Tamiang</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Token Box */}
              <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-xl p-5 text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                  Nomor Token Pelacakan Berkas
                </span>
                <div className="text-3xl font-mono font-black text-blue-800 tracking-wider my-2 select-all">
                  {token}
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    {copied ? 'Tersalin ke Clipboard!' : 'Salin Nomor Token'}
                  </Button>
                </div>
              </div>

              {/* Ketentuan */}
              <div className="space-y-2 text-xs text-slate-600 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 font-semibold text-blue-900">
                  <Clock className="w-4 h-4 text-blue-700" />
                  <span>Informasi SLA & Tahapan Verifikasi:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li>Berkas Anda telah masuk ke antrean verifikasi formal Bagian Hukum.</li>
                  <li>Petugas legal drafter akan memeriksa kelengkapan draf dalam maksimal <strong>1 x 24 Jam</strong>.</li>
                  <li>Gunakan nomor token di atas untuk memantau status atau mengunggah berkas revisi perbaikan.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => window.location.href = `/tracking?token=${token}`}
                >
                  <span>Lacak Status Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2 text-slate-500" />
                  Cetak Bukti Resi
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Sistem HARM v2.0 Enterprise</span>
              <Link href="/login" className="text-blue-600 hover:underline">
                Portal Internal Hukum &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Form Utama
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            H
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900">HARM Portal Layanan OPD</span>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 py-0">
                Resmi
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">Bagian Hukum Setdakab Aceh Tamiang</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/tracking" className="text-xs font-semibold text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">
            🔍 Lacak Status Pengajuan
          </Link>
          <Link href="/login" className="text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition">
            Login Internal &rarr;
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Banner Instruksi */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs mb-3">
              Standardisasi Permenkumham
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Permohonan Harmonisasi Produk Hukum Daerah
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-2 leading-relaxed">
              Layanan mandiri bagi Organisasi Perangkat Daerah (OPD) di lingkungan Pemerintah Kabupaten Aceh Tamiang untuk mengajukan draf Raperbup, SK Bupati, dan Rancangan Qanun sebelum ditetapkan.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Langkah 1</span>
            <span className="text-xs font-semibold text-slate-800">Identitas OPD & Pemohon</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Langkah 2</span>
            <span className="text-xs font-semibold text-slate-800">Substansi Naskah</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Langkah 3</span>
            <span className="text-xs font-semibold text-slate-800">Lampiran & Token Resi</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-100">
            <CardTitle className="text-base text-slate-900">Formulir Pengajuan Dokumen</CardTitle>
            <CardDescription className="text-xs">
              Isi data dengan lengkap dan valid. Tanda terima resmi beserta nomor token pelacakan akan diterbitkan otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bagian 1: Identitas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>1. Identitas Instansi Pengaju (OPD)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="opd" className="text-xs font-semibold text-slate-700">Nama OPD / Dinas Pengusul</Label>
                    <Input id="opd" name="opd" placeholder="Contoh: Dinas Kesehatan / BPKD" required className="h-10 text-sm border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="applicant_name" className="text-xs font-semibold text-slate-700">Nama Pejabat / Pengaju</Label>
                    <Input id="applicant_name" name="applicant_name" placeholder="Nama Lengkap & Gelar" required className="h-10 text-sm border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Kontak Pemohon</Label>
                    <Input id="email" name="email" type="email" placeholder="nama@opd.acehtamiangkab.go.id" required className="h-10 text-sm border-slate-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="applicant_phone" className="text-xs font-semibold text-slate-700">Nomor WhatsApp / HP Kontak</Label>
                    <Input id="applicant_phone" name="applicant_phone" placeholder="08xxxxxxxxxx" className="h-10 text-sm border-slate-200" />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Naskah Produk Hukum */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>2. Detail Produk Hukum yang Diharmonisasi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="document_type" className="text-xs font-semibold text-slate-700">Jenis Produk Hukum</Label>
                    <select id="document_type" name="document_type" className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm bg-white focus:ring-2 focus:ring-blue-600">
                      <option value="PERBUP">Peraturan Bupati (Perbup)</option>
                      <option value="SK_BUPATI">Keputusan Bupati (SK)</option>
                      <option value="PERDA">Rancangan Qanun / Perda</option>
                      <option value="INSTRUKSI_BUPATI">Instruksi Bupati</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Judul / Tentang Regulasi</Label>
                    <Input id="title" name="title" placeholder="Contoh: Raperbup tentang Standar Biaya Masukan Tahun Anggaran 2026" required className="h-10 text-sm border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Latar Belakang & Deskripsi Urgensi</Label>
                  <Textarea id="description" name="description" placeholder="Uraikan urgensi dan dasar hukum pengajuan produk hukum ini..." required className="text-sm border-slate-200 min-h-[90px]" />
                </div>
              </div>

              {/* Bagian 3: Berkas Google Drive */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>3. Berkas & Lampiran (Google Drive Cloud)</span>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-emerald-50/30 rounded-xl border border-blue-200 space-y-2">
                  <Label htmlFor="gdrive_link" className="text-xs font-bold text-blue-900 flex items-center justify-between">
                    <span>Tautan (Link) Google Drive Berkas Permohonan (Sangat Disarankan)</span>
                    <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 text-[10px]">
                      Bebas Batas Ukuran
                    </Badge>
                  </Label>
                  <Input
                    id="gdrive_link"
                    name="gdrive_link"
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/... atau link file naskah"
                    className="h-10 bg-white border-blue-300 text-sm"
                  />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    💡 <strong>Tips Efisiensi:</strong> Simpan seluruh draf (Word .docx, Naskah Akademik PDF, dan Tabel Lampiran) di Google Drive Anda, lalu tempel tautannya di sini. Pastikan pengaturan akses diatur ke <em>"Siapa saja yang memiliki link dapat melihat"</em>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="files" className="text-xs font-semibold text-slate-700">
                    Atau Unggah Berkas PDF Cadangan (Maks. 25 MB)
                  </Label>
                  <Input id="files" name="files" type="file" multiple accept=".pdf" className="h-10 text-sm border-slate-200 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-sm shadow-md shadow-blue-600/20"
                >
                  {submitting ? 'Memproses Pengajuan & Menerbitkan Token...' : 'Kirim Permohonan Harmonisasi & Dapatkan Resi'}
                </Button>
                <p className="text-center text-[11px] text-slate-400 mt-2.5">
                  Dengan mengirim formulir ini, Anda menyatakan draf naskah telah disetujui oleh Kepala OPD pengusul.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <p>&copy; {new Date().getFullYear()} Pemerintah Kabupaten Aceh Tamiang • Bagian Hukum Sekretariat Daerah</p>
        <p className="text-[11px] text-slate-400 mt-1">Platform Harmonisasi Produk Hukum Terpadu Berbasis Digital (HARM Enterprise)</p>
      </footer>
    </div>
  );
}

