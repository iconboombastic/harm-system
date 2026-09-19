'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, FileText, Search, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-2">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold">Pendaftaran Akun Mandiri Ditutup</h2>
        <p className="text-sm text-muted-foreground">
          Akun internal Bagian Hukum hanya dapat dibuat dan diberikan oleh Administrator Sistem.
        </p>
      </div>

      <div className="rounded-xl border bg-blue-50/60 p-4 text-xs text-blue-900 space-y-2 leading-relaxed">
        <div className="font-semibold text-sm text-blue-800">📌 Informasi untuk OPD / Pemrakarsa:</div>
        <p>
          Bagi perangkat daerah (OPD) atau pihak luar, Anda <strong>tidak perlu membuat akun</strong> untuk mengajukan permohonan ataupun mengunggah berkas perbaikan.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <Link href="/public-intake" className="block">
          <Button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            Ajukan Permohonan (Portal OPD)
          </Button>
        </Link>

        <Link href="/tracking" className="block">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Lacak Status & Upload Perbaikan Dokumen
          </Button>
        </Link>

        <Link href="/login" className="block pt-2">
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Halaman Masuk
          </Button>
        </Link>
      </div>
    </div>
  );
}
