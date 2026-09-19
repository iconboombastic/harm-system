'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  User, 
  ShieldCheck, 
  FileText, 
  HardDrive, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface LogItem {
  id: string;
  action: string;
  actor: string;
  role: string;
  category: 'DOCUMENT' | 'WORKFLOW' | 'AI_AUDIT' | 'STORAGE' | 'SECURITY';
  timestamp: string;
  ipAddress: string;
  details: string;
}

export default function CaseActivityClient({
  caseId,
  caseTitle = 'Rancangan Produk Hukum',
  harmNumber = 'HARM-2026-001',
}: {
  caseId: string;
  caseTitle?: string;
  harmNumber?: string;
}) {
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'log-1',
      action: 'Pemeriksaan Kepatuhan AI & Regulasi',
      actor: 'AI Copilot Legal Checker',
      role: 'Sistem AI',
      category: 'AI_AUDIT',
      timestamp: '18 Sep 2026, 15:42 WIB',
      ipAddress: '10.20.1.14 (Internal Setdakab)',
      details: 'Pemeriksaan konsideran terhadap UU HKPD No. 1/2022 dan PP No. 35/2023. Tingkat kepatuhan 96%.',
    },
    {
      id: 'log-2',
      action: 'Sinkronisasi Berkas ke Google Drive',
      actor: 'M. Yusuf',
      role: 'Legal Drafter',
      category: 'STORAGE',
      timestamp: '18 Sep 2026, 14:15 WIB',
      ipAddress: '192.168.10.45',
      details: 'Pengunggahan berkas draf final v2 ke folder resmi Google Drive Pemkab Aceh Tamiang.',
    },
    {
      id: 'log-3',
      action: 'Perubahan Alur: Penambahan Tahap Fasilitasi Provinsi',
      actor: 'Kepala Administrator Sistem',
      role: 'ADMINISTRATOR',
      category: 'WORKFLOW',
      timestamp: '18 Sep 2026, 11:20 WIB',
      ipAddress: '192.168.10.12',
      details: 'Administrator menyisipkan tahapan telaahan fasilitasi provinsi sebelum penetapan naskah dinas.',
    },
    {
      id: 'log-4',
      action: 'Pembubuhan Paraf Berjenjang Tingkat 2',
      actor: 'Dr. Ir. Teuku Iskandar',
      role: 'Kabag Hukum / Reviewer',
      category: 'DOCUMENT',
      timestamp: '17 Sep 2026, 16:30 WIB',
      ipAddress: '192.168.10.8',
      details: 'Pemberian persetujuan paraf hierarkis pada Berita Acara Rapat Harmonisasi.',
    },
    {
      id: 'log-5',
      action: 'Pembuatan Catatan Sticky Telaahan Pasal',
      actor: 'M. Yusuf',
      role: 'Legal Drafter',
      category: 'DOCUMENT',
      timestamp: '17 Sep 2026, 10:05 WIB',
      ipAddress: '192.168.10.45',
      details: 'Menambahkan sticky note telaahan konsideran menimbang dan penyesuaian tarif retribusi zonasi.',
    },
    {
      id: 'log-6',
      action: 'Registrasi Permohonan & Autentikasi Dokumen Awal',
      actor: 'Admin Bagian Hukum',
      role: 'Registrar',
      category: 'SECURITY',
      timestamp: '14 Sep 2026, 09:15 WIB',
      ipAddress: '192.168.10.2',
      details: 'Penerbitan nomor registrasi permohonan HARM-2026-001 dan verifikasi berkas awal pemohon OPD.',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'DOCUMENT' | 'WORKFLOW' | 'AI_AUDIT' | 'STORAGE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filter !== 'ALL' && log.category !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Audit Trail Terenkripsi
            </span>
            <span className="text-xs text-slate-400 font-mono">{harmNumber}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Log Aktivitas & Jejak Forensik Dokumen
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Catatan kronologis menyeluruh untuk seluruh interaksi berkas, paraf pejabat, asistensi AI, dan sinkronisasi berkas Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Audit Logging Aktif
          </Badge>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={filter === 'ALL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('ALL')}
            className={`text-xs h-8 ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Semua ({logs.length})
          </Button>
          <Button
            variant={filter === 'WORKFLOW' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('WORKFLOW')}
            className={`text-xs h-8 ${filter === 'WORKFLOW' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
          >
            Alur & Tahap
          </Button>
          <Button
            variant={filter === 'DOCUMENT' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('DOCUMENT')}
            className={`text-xs h-8 ${filter === 'DOCUMENT' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Dokumen & Paraf
          </Button>
          <Button
            variant={filter === 'AI_AUDIT' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('AI_AUDIT')}
            className={`text-xs h-8 ${filter === 'AI_AUDIT' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Pemeriksaan AI
          </Button>
          <Button
            variant={filter === 'STORAGE' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('STORAGE')}
            className={`text-xs h-8 ${filter === 'STORAGE' ? 'bg-sky-600 text-white' : 'text-slate-600'}`}
          >
            Google Drive
          </Button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas..."
            className="pl-9 h-8 text-xs bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Activity Log List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-slate-900">{log.action}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold ${
                    log.category === 'AI_AUDIT'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : log.category === 'STORAGE'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : log.category === 'WORKFLOW'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {log.category}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {log.details}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <User className="w-3 h-3 text-slate-400" />
                  {log.actor} ({log.role})
                </span>
                <span>•</span>
                <span className="font-mono text-slate-400">{log.ipAddress}</span>
              </div>
            </div>

            <div className="text-right shrink-0 text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
