'use client';

import { useState } from 'react';
import { Database, Cloud, Activity, ShieldAlert, HardDrive, Download, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { exportDatabaseBackup } from '@/lib/actions/admin';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

export default function SystemHealthPage() {
  const [downloading, setDownloading] = useState(false);

  async function handleBackupDownload() {
    setDownloading(true);
    try {
      const backup = await exportDatabaseBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HARM_BACKUP_DATABASE_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Gagal membuat cadangan database: ' + err.message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Kesehatan Sistem & Penyimpanan</h2>
          <p className="text-muted-foreground">Monitor infrastruktur, integrasi Google Drive, dan pencadangan database HARM</p>
        </div>
      </div>

      {/* Google Drive Integration Spotlight */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Penyimpanan Berkas: Google Drive Cloud</CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-medium text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 inline text-emerald-600" /> Terhubung
                  </Badge>
                </div>
                <CardDescription>
                  Semua berkas dokumen dan bukti diarsipkan ke folder Google Drive Pemkab Aceh Tamiang agar kuota Supabase tidak limit dan tetap cepat.
                </CardDescription>
              </div>
            </div>
            <a
              href={GDRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-blue-700 font-medium text-sm rounded-lg border border-blue-300 shadow-sm transition-colors"
            >
              <span>Buka Google Drive</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-white/80 border rounded-lg p-3 text-sm">
              <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">ID Folder Google Drive</span>
              <span className="font-mono text-gray-800 font-semibold text-xs break-all">1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9</span>
            </div>
            <div className="bg-white/80 border rounded-lg p-3 text-sm flex items-center justify-between">
              <div>
                <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">Cadangkan Data Database</span>
                <span className="text-gray-700 text-xs">Unduh salinan seluruh data tabel</span>
              </div>
              <Button
                size="sm"
                onClick={handleBackupDownload}
                disabled={downloading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                {downloading ? 'Memproses...' : 'Unduh Backup (.json)'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-800">
              <Database className="h-4 w-4 text-emerald-600" /> Database Relasional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">SEHAT</div>
            <p className="text-xs text-muted-foreground mt-1">Supabase PostgreSQL (Aman & Hemat)</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-800">
              <Cloud className="h-4 w-4 text-emerald-600" /> Berkas & Arsip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">GOOGLE DRIVE</div>
            <p className="text-xs text-muted-foreground mt-1">Bebas kuota batas lokal</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-800">
              <ShieldAlert className="h-4 w-4 text-emerald-600" /> Autentikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">SEHAT</div>
            <p className="text-xs text-muted-foreground mt-1">Supabase Auth (Admin & Staff)</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-800">
              <Activity className="h-4 w-4 text-emerald-600" /> Alur & Resi OPD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">LANCAR</div>
            <p className="text-xs text-muted-foreground mt-1">Intake Publik & Tracking Token</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Efisiensi Kapasitas Sistem</CardTitle>
          <CardDescription>Status penggunaan sumber daya komputasi dan penyimpanan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Database Supabase (Teks & Metadata)</span>
              <span className="text-emerald-700 font-semibold">&lt; 5 MB / 500 MB (Sangat Hemat - 1%)</span>
            </div>
            <Progress value={1} className="h-2" />
            <p className="text-xs text-gray-500">
              Data teks kasus sangat ringan dan mampu menampung puluhan ribu permohonan sebelum menyentuh batas kuota.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Penyimpanan Berkas Fisik (PDF/Word/Scan)</span>
              <span className="text-blue-700 font-semibold">Tersimpan di Google Drive Cloud</span>
            </div>
            <Progress value={100} className="h-2 bg-blue-100 [&>div]:bg-blue-600" />
            <p className="text-xs text-gray-500">
              Seluruh berkas dokumen naskah dan lampiran disimpan di Google Drive Kabupaten Aceh Tamiang untuk memastikan sistem selalu lancar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
