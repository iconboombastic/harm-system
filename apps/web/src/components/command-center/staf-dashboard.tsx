'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, CheckCircle2, Clock, Plus, Search, CheckSquare, HardDrive, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

import NotionStickyBoard from './notion-sticky-board';
import { StickyNote } from '@/lib/actions/notes';

interface StafDashboardProps {
  initialNotes?: StickyNote[];
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
  };
}

export default function StafDashboard({ initialNotes, currentUser }: StafDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Banner Drafter */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
            Workspace Perancang Hukum (Legal Drafter)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Meja Kerja Harmonisasi Naskah
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Fokus telaahan naskah akademik, sinkronisasi hierarki regulasi vertikal/horizontal, dan penyusunan draf keputusan final.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tugas Ditugaskan
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12 Perkara</div>
            <p className="text-xs text-blue-600 font-medium mt-1">3 Perlu telaahan hari ini</p>
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
            <div className="text-2xl font-bold text-amber-700">4 Berkas</div>
            <p className="text-xs text-amber-600 font-medium mt-1">Dikembalikan untuk perbaikan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-emerald-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Selesai Bulan Ini
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">18 Berkas</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">100% tepat waktu sesuai SLA</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-indigo-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Arsip Cloud
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
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
            >
              <span>Folder Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[11px] text-slate-500 mt-1">Draf Word & Lampiran Regulasi</p>
          </CardContent>
        </Card>
      </div>

      {/* Notion Sticky Notes Workspace for Legal Drafters */}
      <NotionStickyBoard initialNotes={initialNotes} currentUser={currentUser} />

      {/* Action Shortcut Bar */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Aksi Cepat Perancang Hukum</h4>
          <p className="text-xs text-slate-500">Mulai telaah baru atau telusuri preseden hukum daerah</p>
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
            <Link href="/search">
              <Search className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Cari Regulasi Serupa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
