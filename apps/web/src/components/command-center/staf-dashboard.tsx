'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  CheckSquare, 
  HardDrive, 
  ExternalLink,
  Scale,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Send,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import Link from 'next/link';
import NotionStickyBoard from './notion-sticky-board';
import { StickyNote } from '@/lib/actions/notes';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

interface ActiveDrafterCase {
  id: string;
  harmNumber: string;
  title: string;
  opd: string;
  docType: string;
  stage: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  slaHoursLeft: number;
  completeness: number;
}

const SAMPLE_DRAFTER_CASES: ActiveDrafterCase[] = [
  {
    id: 'case-1',
    harmNumber: 'HARM-2026-0089',
    title: 'Rancangan Peraturan Bupati tentang Tata Cara Pemungutan Pajak Sarang Burung Walet dan Mineral Bukan Logam',
    opd: 'Badan Pengelolaan Keuangan Daerah (BPKD)',
    docType: 'PERBUP',
    stage: 'Harmonisasi Pasal Demi Pasal',
    priority: 'HIGH',
    slaHoursLeft: 18,
    completeness: 85,
  },
  {
    id: 'case-2',
    harmNumber: 'HARM-2026-0092',
    title: 'Rancangan Qanun Kabupaten tentang Pengelolaan Sampah dan Pengurangan Kantong Plastik Sekali Pakai',
    opd: 'Dinas Lingkungan Hidup (DLH)',
    docType: 'QANUN',
    stage: 'Uji Kelayakan Norma & Naskah Akademik',
    priority: 'NORMAL',
    slaHoursLeft: 42,
    completeness: 60,
  },
  {
    id: 'case-3',
    harmNumber: 'HARM-2026-0095',
    title: 'Rancangan Surat Keputusan Bupati tentang Tim Koordinasi Penanggulangan Kemiskinan Daerah (TKPKD) T.A. 2026',
    opd: 'Badan Perencanaan Pembangunan Daerah (BAPPEDA)',
    docType: 'SK_BUPATI',
    stage: 'Verifikasi Diktum & Personil',
    priority: 'NORMAL',
    slaHoursLeft: 24,
    completeness: 90,
  },
  {
    id: 'case-4',
    harmNumber: 'HARM-2026-0098',
    title: 'Rancangan Instruksi Bupati tentang Percepatan Penurunan Stunting Terintegrasi Tingkat Gampong / Kampung',
    opd: 'Dinas Pemberdayaan Masyarakat dan Kampung (DPMK)',
    docType: 'INSTRUKSI',
    stage: 'Paraf Koordinasi Kabag Hukum',
    priority: 'CRITICAL',
    slaHoursLeft: 8,
    completeness: 95,
  },
];

interface StafDashboardProps {
  initialNotes?: StickyNote[];
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
  };
}

export default function StafDashboard({ initialNotes, currentUser }: StafDashboardProps) {
  const [caseFilter, setCaseFilter] = useState('');
  const [activeCases] = useState<ActiveDrafterCase[]>(SAMPLE_DRAFTER_CASES);

  const filteredCases = activeCases.filter(c => 
    c.title.toLowerCase().includes(caseFilter.toLowerCase()) ||
    c.harmNumber.toLowerCase().includes(caseFilter.toLowerCase()) ||
    c.opd.toLowerCase().includes(caseFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner Drafter */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                Meja Kerja Perancang Peraturan (Legal Drafter)
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                Bagian Hukum Setdakab Aceh Tamiang
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Bertugas, {currentUser?.name || 'Perancang Hukum'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fokus penelaahan naskah akademik, sinkronisasi hierarki regulasi vertikal/horizontal, serta penyusunan draf qanun dan keputusan bupati yang akuntabel.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md">
              <Link href="/cases/new">
                <Plus className="w-4 h-4 mr-1.5" /> Registrasi Naskah Baru
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-white/10 hover:bg-white/20 text-white text-xs">
              <Link href="/tasks">
                <CheckSquare className="w-4 h-4 mr-1.5" /> Tugas Saya
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Naskah Aktif Ditelaah
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeCases.length} Perkara</div>
            <p className="text-xs text-blue-600 font-medium mt-1">1 Mendekati batas SLA (&lt;12 jam)</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-xs hover:border-amber-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Revisi OPD
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">3 Berkas</div>
            <p className="text-xs text-amber-600 font-medium mt-1">Clock-stop aktif (tidak hitung SLA)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-emerald-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Harmonisasi Selesai
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">18 Berkas</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">100% tepat waktu sesuai SLA 2026</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-indigo-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vault Google Drive
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <HardDrive className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <a 
              href={GDRIVE_FOLDER_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1"
            >
              <span>Folder Master Cloud</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[11px] text-slate-500 mt-1">Draf Word & Lampiran Regulasi</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Drafting Table Section */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                Antrean Naskah yang Ditugaskan kepada Anda
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pilih rancangan peraturan untuk mulai menguji kepatuhan materi muatan dan menyusun catatan telaah hukum.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari HARM#, judul, atau OPD..." 
                value={caseFilter}
                onChange={(e) => setCaseFilter(e.target.value)}
                className="pl-8 text-xs bg-slate-50"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Tidak ada permohonan yang cocok dengan pencarian.
              </div>
            ) : (
              filteredCases.map((c) => (
                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {c.harmNumber}
                      </span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold">
                        {c.docType}
                      </Badge>
                      <Badge 
                        variant={c.priority === 'CRITICAL' ? 'destructive' : c.priority === 'HIGH' ? 'warning' : 'secondary'}
                        className="text-[10px] py-0 px-1.5"
                      >
                        {c.priority}
                      </Badge>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {c.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {c.opd}
                      </span>
                      <span>•</span>
                      <span className="text-indigo-700 font-semibold">
                        Tahap: {c.stage}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                    {/* SLA Countdown pill */}
                    <div className="text-right">
                      <div className={`text-xs font-bold flex items-center gap-1 justify-end ${c.slaHoursLeft <= 12 ? 'text-red-600' : 'text-emerald-700'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        Sisa {c.slaHoursLeft} Jam
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Kelengkapan: {c.completeness}%
                      </div>
                    </div>

                    {/* Direct CTA */}
                    <Button asChild size="sm" className="bg-slate-900 hover:bg-blue-700 text-white text-xs">
                      <Link href={`/cases`}>
                        Buka Telaah
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Legal Cross-Check & Compliance Tools */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-600" />
              Hierarki UUPA No. 11/2006
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Pastikan produk hukum daerah mencantumkan kewenangan khusus Aceh dan tidak bertentangan dengan syariat Islam serta regulasi nasional.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50">
              <Link href="/search">
                <Search className="w-3.5 h-3.5 mr-1" /> Cari Pasal & Preseden UUPA
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Pedoman Permendagri 120/2018
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Verifikasi kelengkapan format baku: konsideran Menimbang, Dasar Mengingat, Diktum Memutuskan, dan Batang Tubuh Pasal.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50">
              <Link href="/evidence">
                <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Buka Format Baku Konsideran
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Kepatuhan Rekomendasi BPK RI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Hindari sanksi pidana dalam Perbup, pastikan terminologi PBG (bukan IMB), dan sinkronkan referensi UU HKPD No. 1/2022.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full text-xs text-amber-700 border-amber-200 hover:bg-amber-50">
              <Link href="/reports">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> Lihat Matriks Temuan Audit
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notion Sticky Notes Workspace for Legal Drafters */}
      <NotionStickyBoard initialNotes={initialNotes} currentUser={currentUser} />

      {/* Action Shortcut Bar */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Pintasan Navigasi Perancang</h4>
          <p className="text-xs text-slate-500">Akses cepat modul koordinasi berkas dan repositori regulasi daerah</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
            <Link href="/cases/new">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Buat Permohonan Baru
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-300 text-xs">
            <Link href="/tasks">
              <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Daftar Tugas Saya
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-300 text-xs">
            <Link href="/evidence">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Vault Evidence
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-300 text-xs">
            <Link href="/search">
              <Search className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Cari Regulasi Serupa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
