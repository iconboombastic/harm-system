'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  FileText, 
  Scale, 
  ExternalLink, 
  Building2, 
  Tag, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { searchRegulations, generateDirectSearchLinks, OfficialRegulationLink } from '@/lib/services/regulation-service';

interface SearchResultCase {
  id: string;
  caseNumber: string;
  title: string;
  opd: string;
  status: string;
  type: string;
}

const SAMPLE_CASES: SearchResultCase[] = [
  { id: 'case-001', caseNumber: 'HARM-2026-0001', title: 'Raperbup Tata Cara Pemungutan Retribusi Pelayanan Pasar & Kebersihan', opd: 'Badan Pengelolaan Keuangan Daerah', status: 'REVIEW', type: 'Peraturan Bupati' },
  { id: 'case-002', caseNumber: 'HARM-2026-0002', title: 'Raperbup Penyelenggaraan Pelayanan Kesehatan Rujukan RSUD Muda Sedia', opd: 'Dinas Kesehatan', status: 'FASILITASI', type: 'Peraturan Bupati' },
  { id: 'case-003', caseNumber: 'HARM-2026-0003', title: 'Raqan Tata Cara Pemilihan dan Pemberhentian Datok Penghulu', opd: 'Dinas Pemberdayaan Masyarakat & Gampong', status: 'PENELITIAN', type: 'Qanun Kabupaten' },
  { id: 'case-004', caseNumber: 'HARM-2026-0004', title: 'Raperbup Standar Penilaian Bangunan Gedung (PBG) & Sertifikat Laik Fungsi', opd: 'Dinas PUPR', status: 'DRAF_REVISI', type: 'Peraturan Bupati' },
  { id: 'case-005', caseNumber: 'HARM-2026-0005', title: 'Raperbup Tambahan Penghasilan Pegawai (TPP) Berbasis Kinerja ASN', opd: 'BKPSDM', status: 'VERIFIKASI', type: 'Peraturan Bupati' },
  { id: 'case-006', caseNumber: 'HARM-2026-0006', title: 'Qanun Pajak Daerah dan Retribusi Daerah Kabupaten Aceh Tamiang', opd: 'Badan Pengelolaan Keuangan Daerah', status: 'FINAL', type: 'Qanun Kabupaten' }
];

export default function GlobalSearchClient() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CASES' | 'REGULATIONS'>('ALL');

  const matchedCases = query.trim() 
    ? SAMPLE_CASES.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
        c.opd.toLowerCase().includes(query.toLowerCase()) ||
        c.type.toLowerCase().includes(query.toLowerCase())
      )
    : SAMPLE_CASES;

  const matchedRegulations: OfficialRegulationLink[] = query.trim().length >= 2 
    ? searchRegulations(query) 
    : [];

  const directLinks = generateDirectSearchLinks(query.trim() || 'produk hukum');

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Mesin Pencarian Terpadu
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pencarian Cerdas HARM
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Pencarian lintas kasus permohonan, draf klausul, dokumen evidence, dan basis data peraturan resmi BPK RI & JDIHN secara real-time.
        </p>

        {/* Search Bar Input */}
        <div className="mt-4 relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nomor HARM, nama OPD, topik hukum (stunting, retribusi, pbg, dll.)..."
            className="pl-11 pr-24 h-12 text-sm rounded-2xl border-slate-300 shadow-sm focus:border-blue-500"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-lg"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
          <span className="font-semibold">Pencarian Populer:</span>
          {['UU 1/2022 HKPD', 'Stunting Dinkes', 'Persetujuan Bangunan (PBG)', 'Disiplin ASN', 'Datok Penghulu Gampong'].map(chip => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition border border-slate-200 text-[11px]"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Search Official Portal Cards */}
      {query.trim().length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Pencarian Langsung Basis Data Resmi Nasional & Daerah:</span>
            </span>
            <span className="text-[11px] text-slate-300 italic">Kata kunci: "{query}"</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <a 
              href={directLinks.bpkSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-xs font-bold"
            >
              <span>Database BPK RI</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
            <a 
              href={directLinks.jdihnSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-xs font-bold"
            >
              <span>JDIH Nasional (BPHN)</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            </a>
            <a 
              href={directLinks.acehTamiangJdihUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-xs font-bold"
            >
              <span>JDIH Kab. Aceh Tamiang</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>
      )}

      {/* Result Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Hasil ({matchedCases.length + matchedRegulations.length})
        </button>
        <button
          onClick={() => setActiveTab('CASES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'CASES' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kasus HARM ({matchedCases.length})
        </button>
        <button
          onClick={() => setActiveTab('REGULATIONS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'REGULATIONS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Regulasi BPK & JDIHN ({matchedRegulations.length})
        </button>
      </div>

      {/* Results Content */}
      <div className="space-y-6">
        {/* Section 1: Matched Cases */}
        {(activeTab === 'ALL' || activeTab === 'CASES') && matchedCases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Permohonan Harmonisasi Internal:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedCases.map(c => (
                <Card key={c.id} className="rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition">
                  <CardContent className="p-4 flex flex-col justify-between gap-3 h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {c.caseNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {c.type}
                        </Badge>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{c.opd}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                        {c.status}
                      </Badge>
                      <Link href={`/cases/${c.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 font-bold hover:bg-blue-50 flex items-center gap-1">
                          <span>Buka Kasus</span>
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Matched Regulations */}
        {(activeTab === 'ALL' || activeTab === 'REGULATIONS') && matchedRegulations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Regulasi Resmi BPK RI & JDIHN yang Cocok:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedRegulations.map(r => (
                <Card key={r.id} className="rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition">
                  <CardContent className="p-4 flex flex-col justify-between gap-3 h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <Badge className="bg-amber-100 text-amber-900 border-none text-[10px] font-bold">
                          {r.nomor}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 border-emerald-300">
                          {r.status}
                        </Badge>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {r.tentang}
                      </p>
                      {r.keterangan && (
                        <p className="text-[10px] text-amber-800 italic mt-1 bg-amber-50/70 p-1.5 rounded">
                          {r.keterangan}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <a href={r.url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="w-full h-7 text-[11px] font-bold text-amber-800 hover:bg-amber-50 flex items-center justify-center gap-1">
                          <span>BPK RI</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                      <a href={r.jdihnUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="w-full h-7 text-[11px] font-bold text-blue-800 hover:bg-blue-50 flex items-center justify-center gap-1">
                          <span>JDIH</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {matchedCases.length === 0 && matchedRegulations.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tidak ada hasil yang cocok</h4>
            <p className="text-xs text-slate-400 mt-0.5">Coba gunakan kata kunci umum seperti "qanun", "retribusi", "kesehatan", atau "bkpsdm".</p>
          </div>
        )}
      </div>
    </div>
  );
}
