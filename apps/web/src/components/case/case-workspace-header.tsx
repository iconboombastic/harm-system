'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GitMerge, 
  FileText, 
  HardDrive, 
  CheckSquare, 
  StickyNote, 
  Milestone, 
  Sparkles, 
  Users, 
  Award, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Building2, 
  Clock, 
  ExternalLink,
  Scale
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

interface CaseWorkspaceHeaderProps {
  caseData: any;
}

export default function CaseWorkspaceHeader({ caseData }: CaseWorkspaceHeaderProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const harmNumber = caseData.harm_number || 'HARM-DRAFT';
  const opdName = caseData.opd?.nama || caseData.opd?.name || 'Perangkat Daerah';
  const status = caseData.official_status || caseData.status || 'DALAM_PROSES';

  const handleCopyHarm = () => {
    navigator.clipboard.writeText(harmNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { name: 'Ikhtisar', href: '', icon: LayoutDashboard, color: 'text-blue-600', tile: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    { name: 'Alur & SOP', href: '/process', icon: GitMerge, color: 'text-indigo-600', tile: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
    { name: 'Dokumen', href: '/documents', icon: FileText, color: 'text-amber-600', tile: 'bg-amber-500/10 text-amber-600 border-amber-200' },
    { name: 'Bukti Drive', href: '/evidence', icon: HardDrive, color: 'text-sky-600', tile: 'bg-sky-500/10 text-sky-600 border-sky-200' },
    { name: 'Tugas', href: '/tasks', icon: CheckSquare, color: 'text-emerald-600', tile: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
    { name: 'Catatan Notion', href: '/notes', icon: StickyNote, color: 'text-amber-600', tile: 'bg-amber-500/10 text-amber-600 border-amber-200' },
    { name: 'Timeline', href: '/timeline', icon: Milestone, color: 'text-purple-600', tile: 'bg-purple-500/10 text-purple-600 border-purple-200' },
    { name: 'Review AI', href: '/review', icon: Sparkles, color: 'text-violet-600', tile: 'bg-violet-500/10 text-violet-600 border-violet-200' },
    { name: 'Rapat Pleno', href: '/meetings', icon: Users, color: 'text-blue-600', tile: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    { name: 'Putusan & Paraf', href: '/decisions', icon: Award, color: 'text-emerald-600', tile: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
    { name: 'Relasi Regulasi', href: '/relations', icon: Layers, color: 'text-sky-600', tile: 'bg-sky-500/10 text-sky-600 border-sky-200' },
    { name: 'Audit Forensik', href: '/activity', icon: ShieldCheck, color: 'text-slate-600', tile: 'bg-slate-500/10 text-slate-600 border-slate-200' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Executive Case Hero Banner */}
      <div className="px-6 md:px-8 pt-7 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Identitas Permohonan */}
          <div className="space-y-2.5 max-w-3xl">
            {/* Badges Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copyable HARM Number Tag */}
              <button
                onClick={handleCopyHarm}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs group"
                title="Klik untuk menyalin nomor HARM"
              >
                <span className="font-mono text-xs font-bold tracking-wider">{harmNumber}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                )}
              </button>

              {/* Status Pill with Pulsing Dot */}
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 text-xs px-2.5 py-1 font-bold flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>{status}</span>
              </Badge>

              {/* Priority */}
              <Badge className="bg-amber-50 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 font-semibold">
                Prioritas Tinggi
              </Badge>

              {/* District Crest Authority Tag */}
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>Bagian Hukum Setdakab Aceh Tamiang</span>
              </span>
            </div>

            {/* Document Title */}
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {caseData.title}
            </h1>

            {/* Meta Row */}
            <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{opdName}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Diajukan: {new Date(caseData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-[11px]">
                SLA 14 Hari Kerja
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
            <a
              href={GDRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-300/80 transition shadow-2xs"
            >
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Buka Folder Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <Link href={`/cases/${caseData.id}/review`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Uji Telaahan AI</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Navigation Tab Bar with High-Caliber Icon Tiles */}
      <div className="px-6 md:px-8 border-t border-slate-100 bg-slate-50/50">
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const tabPath = `/cases/${caseData.id}${tab.href}`;
            const isActive = tab.href === '' 
              ? pathname === `/cases/${caseData.id}` 
              : pathname.startsWith(tabPath);
            const IconComponent = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tabPath}
                className={cn(
                  "group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap",
                  isActive
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/90 ring-1 ring-blue-600/10 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                )}
              >
                {/* Icon Tile */}
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-150",
                  isActive 
                    ? tab.tile 
                    : "bg-white border-slate-200 text-slate-500 group-hover:text-slate-800 group-hover:scale-105"
                )}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>

                <span>{tab.name}</span>

                {/* Active Indicator Glow Bottom */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full shadow-[0_0_6px_#2563eb]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
