import React from 'react';
import { getCases } from '@/lib/actions/cases';
import CaseMeetingsClient from '@/components/case/case-meetings-client';
import { Users2, Calendar, Clock, MapPin, HardDrive, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata = {
  title: 'Rapat Harmonisasi | HARM Kabupaten Aceh Tamiang',
};

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

export default async function GlobalMeetingsPage() {
  const { data: cases } = await getCases();
  const activeCase = cases && cases.length > 0 ? cases[0] : null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-7 shadow-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 tracking-wide flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5" />
              BAGIAN HUKUM SETDAKAB ACEH TAMIANG
            </span>
            <span className="text-xs text-slate-400">Jadwal & Notulensi Terpadu</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Rapat Pleno & Koordinasi Harmonisasi Regulasi
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pusat koordinasi agenda rapat pleno pembahasan pasal per pasal bersama OPD pemrakarsa, tenaga perancang perundang-undangan, dan instansi vertikal terkait.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={GDRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-sm"
          >
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span>Folder Berkas G-Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Embedded Meeting Client */}
      <CaseMeetingsClient
        caseId={activeCase?.id || 'case-global'}
        caseTitle={activeCase?.title || 'Harmonisasi Produk Hukum Daerah'}
        currentUserRole="ADMIN"
      />
    </div>
  );
}
