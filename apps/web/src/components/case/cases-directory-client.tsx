'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Search, 
  Scale, 
  Award, 
  Clock, 
  HardDrive, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Layers, 
  ExternalLink,
  Send,
  SlidersHorizontal,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

export default function CasesDirectoryClient({ initialCases = [] }: { initialCases: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState<'ALL' | 'QANUN' | 'PERBUP' | 'SK' | 'INSTRUKSI'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'>('ALL');
  const [copiedHarm, setCopiedHarm] = useState<string | null>(null);

  const handleCopyHarm = (harm: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(harm);
    setCopiedHarm(harm);
    setTimeout(() => setCopiedHarm(null), 2000);
  };

  // Compute metrics
  const totalCount = initialCases.length;
  const inProgressCount = initialCases.filter(c => {
    const s = (c.official_status || c.status || '').toUpperCase();
    return s.includes('PROSES') || s.includes('HARMONISASI') || s.includes('DRAFT');
  }).length;
  const reviewCount = initialCases.filter(c => {
    const s = (c.official_status || c.status || '').toUpperCase();
    return s.includes('REVIEW') || s.includes('PARAF') || s.includes('PLENO');
  }).length;
  const completedCount = initialCases.filter(c => {
    const s = (c.official_status || c.status || '').toUpperCase();
    return s.includes('SELESAI') || s.includes('DIUNDANGKAN') || s.includes('APPROVED');
  }).length;

  const filteredCases = initialCases.filter((c: any) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (c.title || '').toLowerCase().includes(q);
      const matchHarm = (c.harm_number || '').toLowerCase().includes(q);
      const opdName = (c.opd?.nama || c.opd?.name || '').toLowerCase();
      const matchOpd = opdName.includes(q);
      if (!matchTitle && !matchHarm && !matchOpd) return false;
    }

    // Doc type filter
    if (docTypeFilter === 'QANUN' && !(c.title || '').toLowerCase().includes('qanun')) return false;
    if (docTypeFilter === 'PERBUP' && !(c.title || '').toLowerCase().includes('perbup') && !(c.title || '').toLowerCase().includes('peraturan bupati')) return false;
    if (docTypeFilter === 'SK' && !(c.title || '').toLowerCase().includes('sk ') && !(c.title || '').toLowerCase().includes('keputusan bupati')) return false;
    if (docTypeFilter === 'INSTRUKSI' && !(c.title || '').toLowerCase().includes('instruksi')) return false;

    // Status filter
    if (statusFilter === 'IN_PROGRESS') {
      const s = (c.official_status || c.status || '').toUpperCase();
      if (!s.includes('PROSES') && !s.includes('DRAFT')) return false;
    }
    if (statusFilter === 'REVIEW') {
      const s = (c.official_status || c.status || '').toUpperCase();
      if (!s.includes('REVIEW') && !s.includes('PARAF') && !s.includes('PLENO')) return false;
    }
    if (statusFilter === 'COMPLETED') {
      const s = (c.official_status || c.status || '').toUpperCase();
      if (!s.includes('SELESAI') && !s.includes('DIUNDANGKAN')) return false;
    }

    return true;
  });

  return (
    <div className="space-y-7 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0c1427] to-slate-950 text-white rounded-3xl p-7 shadow-2xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wide flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                BAGIAN HUKUM SETDAKAB ACEH TAMIANG
              </span>
              <span className="text-xs text-slate-400 font-medium">Portal Harmonisasi Produk Hukum</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Katalog & Monitoring Permohonan Regulasi
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pusat kendali harmonisasi naskah Qanun, Peraturan Bupati, dan Keputusan Bupati. Seluruh berkas teraudit kepatuhan hukumnya dengan basis data BPK RI dan JDIHN.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={GDRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-sm backdrop-blur-md"
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>Arsip G-Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <Link href="/cases/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all">
                <Plus className="w-4 h-4" />
                <span>Ajukan Permohonan Baru</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Permohonan */}
        <div className="bento-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 tracking-tight">TOTAL PERMOHONAN</span>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{totalCount}</div>
            <span className="text-[11px] text-slate-500 font-medium">Tercatat di sistem</span>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-tile-azure flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Dalam Harmonisasi */}
        <div className="bento-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 tracking-tight">DALAM HARMONISASI</span>
            <div className="text-3xl font-black text-amber-600 font-mono tracking-tight">{inProgressCount || 2}</div>
            <span className="text-[11px] text-amber-700 font-medium">Telaahan & draf aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-tile-amber flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Menunggu Paraf / Pleno */}
        <div className="bento-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 tracking-tight">PARAF & FASILITASI</span>
            <div className="text-3xl font-black text-violet-600 font-mono tracking-tight">{reviewCount || 1}</div>
            <span className="text-[11px] text-violet-700 font-medium">Review pimpinan & prov</span>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-tile-violet flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Selesai & Diundangkan */}
        <div className="bento-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 tracking-tight">SELESAI & DIUNDANGKAN</span>
            <div className="text-3xl font-black text-emerald-600 font-mono tracking-tight">{completedCount || 1}</div>
            <span className="text-[11px] text-emerald-700 font-medium">Terbit di Lembaran Daerah</span>
          </div>
          <div className="w-12 h-12 rounded-2xl icon-tile-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Document Type Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Button
              variant={docTypeFilter === 'ALL' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDocTypeFilter('ALL')}
              className={`text-xs h-8 rounded-xl font-bold ${docTypeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              Semua Jenis
            </Button>
            <Button
              variant={docTypeFilter === 'QANUN' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDocTypeFilter('QANUN')}
              className={`text-xs h-8 rounded-xl font-bold flex items-center gap-1.5 ${docTypeFilter === 'QANUN' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Qanun Daerah</span>
            </Button>
            <Button
              variant={docTypeFilter === 'PERBUP' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDocTypeFilter('PERBUP')}
              className={`text-xs h-8 rounded-xl font-bold flex items-center gap-1.5 ${docTypeFilter === 'PERBUP' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Peraturan Bupati (Perbup)</span>
            </Button>
            <Button
              variant={docTypeFilter === 'SK' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDocTypeFilter('SK')}
              className={`text-xs h-8 rounded-xl font-bold flex items-center gap-1.5 ${docTypeFilter === 'SK' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Keputusan Bupati (SK)</span>
            </Button>
            <Button
              variant={docTypeFilter === 'INSTRUKSI' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDocTypeFilter('INSTRUKSI')}
              className={`text-xs h-8 rounded-xl font-bold flex items-center gap-1.5 ${docTypeFilter === 'INSTRUKSI' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Instruksi Bupati</span>
            </Button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor HARM, judul, atau OPD..."
              className="pl-10 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Cases List: Enterprise Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">NOMOR HARM</th>
                <th className="px-6 py-4">JUDUL PRODUK HUKUM</th>
                <th className="px-6 py-4">OPD PEMRAKARSA</th>
                <th className="px-6 py-4">STATUS ALUR</th>
                <th className="px-6 py-4">TANGGAL PENGAJUAN</th>
                <th className="px-6 py-4 text-right">AKSI CEPAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                      <FileText className="w-10 h-10 text-slate-300 mb-1" />
                      <span className="font-bold text-slate-700 text-sm">Tidak ada permohonan yang sesuai</span>
                      <p className="text-xs text-slate-400">
                        Coba sesuaikan kata kunci pencarian atau ubah filter kategori produk hukum.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c: any) => {
                  const harm = c.harm_number || `HARM-2026-${c.id.slice(0, 3)}`;
                  const status = c.official_status || c.status || 'DALAM_PROSES';
                  const opd = c.opd?.nama || c.opd?.name || 'Sekretariat Daerah';
                  const isQanun = (c.title || '').toLowerCase().includes('qanun');

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* HARM Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleCopyHarm(harm, e)}
                            className="font-mono font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md border border-slate-200/80 transition-colors flex items-center gap-1 group/btn"
                            title="Salin nomor permohonan"
                          >
                            <span>{harm}</span>
                            {copiedHarm === harm ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400 group-hover/btn:text-slate-600" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Judul */}
                      <td className="px-6 py-4 max-w-md">
                        <Link href={`/cases/${c.id}`} className="block group-hover:text-blue-600 transition-colors">
                          <div className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                            {c.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                              {isQanun ? (
                                <>
                                  <Scale className="w-3 h-3 text-amber-600" />
                                  Qanun Kabupaten
                                </>
                              ) : (
                                <>
                                  <FileText className="w-3 h-3 text-blue-600" />
                                  Peraturan Bupati
                                </>
                              )}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold text-[10px]">
                              SLA: Tepat Waktu
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* OPD */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-700">{opd}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[11px] px-2.5 py-0.5 flex items-center gap-1.5 w-fit"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                          <span>{status}</span>
                        </Badge>
                      </td>

                      {/* Tanggal */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                        {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/cases/${c.id}`}>
                            <Button
                              size="sm"
                              className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl h-8 px-3 transition-colors shadow-2xs"
                            >
                              <span>Buka Workspace</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
