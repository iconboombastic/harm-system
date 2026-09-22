'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ArrowUpRight, 
  User, 
  Building2, 
  Calendar,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AssignedCase {
  id: string;
  caseNumber: string;
  title: string;
  opd: string;
  roleInCase: 'LEGAL_DRAFTER' | 'REVIEWER' | 'PENELITI';
  currentStage: string;
  daysRemaining: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

const MY_CASES: AssignedCase[] = [
  {
    id: 'case-001',
    caseNumber: 'HARM-2026-0001',
    title: 'Raperbup Tata Cara Pemungutan Retribusi Pelayanan Pasar & Kebersihan',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    roleInCase: 'LEGAL_DRAFTER',
    currentStage: '02 - REVIEW TIM HUKUM',
    daysRemaining: 2,
    priority: 'CRITICAL'
  },
  {
    id: 'case-004',
    caseNumber: 'HARM-2026-0004',
    title: 'Raperbup Standar Penilaian Bangunan Gedung (PBG) & Sertifikat Laik Fungsi',
    opd: 'Dinas Pekerjaan Umum & Penataan Ruang',
    roleInCase: 'LEGAL_DRAFTER',
    currentStage: '03 - REVISI OPD',
    daysRemaining: 5,
    priority: 'HIGH'
  },
  {
    id: 'case-002',
    caseNumber: 'HARM-2026-0002',
    title: 'Raperbup Penyelenggaraan Pelayanan Kesehatan Rujukan RSUD Muda Sedia',
    opd: 'Dinas Kesehatan',
    roleInCase: 'REVIEWER',
    currentStage: '04 - FASILITASI PROVINSI',
    daysRemaining: 4,
    priority: 'HIGH'
  }
];

export default function MyWorkClient() {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'CASES' | 'REVIEWS'>('CASES');

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Workspace Personal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pekerjaan Saya
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar permohonan, disposisi, dan berkas harmonisasi regulasi yang ditugaskan khusus kepada Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/command-center">
            <Button size="sm" className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-9 shadow-xs">
              <span>Command Center</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Kasus Ditangani</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{MY_CASES.length}</h3>
            <p className="text-[11px] text-slate-500">Sebagai Legal Drafter & Reviewer</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50/50 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Perlu Tindakan Cepat</p>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">1</h3>
            <p className="text-[11px] text-slate-500">SLA tersisa &le; 2 hari kerja</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Menunggu Review OPD</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">1</h3>
            <p className="text-[11px] text-slate-500">Sedang diperbaiki oleh pemrakarsa</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Selesai Bulan Ini</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">8</h3>
            <p className="text-[11px] text-slate-500">100% tepat waktu sesuai SLA</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('CASES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'CASES' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Kasus Aktif Saya ({MY_CASES.length})
        </button>
        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'REVIEWS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tugas Telaahan Hukum (4)
        </button>
      </div>

      {/* Assigned Cases List */}
      <div className="space-y-3">
        {MY_CASES.map(item => (
          <Card key={item.id} className="rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.caseNumber}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    Peran: {item.roleInCase.replace('_', ' ')}
                  </Badge>
                  <Badge className={`border-none text-[10px] font-bold ${
                    item.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.priority}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.opd}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{item.currentStage}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className={`text-xs font-bold block ${
                    item.daysRemaining <= 2 ? 'text-rose-600' : 'text-slate-700'
                  }`}>
                    {item.daysRemaining} hari lagi
                  </span>
                  <span className="text-[10px] text-slate-400">Batas Waktu SLA</span>
                </div>

                <Link href={`/cases/${item.id}`}>
                  <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8 shadow-xs flex items-center gap-1">
                    <span>Buka Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
