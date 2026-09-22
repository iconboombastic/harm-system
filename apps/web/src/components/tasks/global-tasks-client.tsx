'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Search, 
  ChevronRight, 
  Plus, 
  Calendar, 
  User, 
  ArrowUpRight,
  Sparkles,
  Tag,
  CheckSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TaskItem {
  id: string;
  title: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  opd: string;
  assignee: string;
  dueDate: string;
  daysLeft: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  category: 'REVIEW_HUKUM' | 'KOREKSI_DRAF' | 'FASILITASI' | 'NOTULEN_RAPAT' | 'VERIFIKASI_OPD';
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'TSK-001',
    title: 'Harmonisasi Pasal 15 UU 12/2011 terkait Larangan Sanksi Pidana pada Perbup',
    caseId: 'case-001',
    caseNumber: 'HARM-2026-0001',
    caseTitle: 'Raperbup Tata Cara Pemungutan Retribusi Pelayanan Pasar & Kebersihan',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    assignee: 'M. Yusuf (Legal Drafter)',
    dueDate: '24 Sep 2026',
    daysLeft: 2,
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    category: 'REVIEW_HUKUM'
  },
  {
    id: 'TSK-002',
    title: 'Penyelarasan Konsideran Mengingat dengan UU 17/2023 (Omnibus Kesehatan)',
    caseId: 'case-002',
    caseNumber: 'HARM-2026-0002',
    caseTitle: 'Raperbup Penyelenggaraan Pelayanan Kesehatan Rujukan RSUD Muda Sedia',
    opd: 'Dinas Kesehatan',
    assignee: 'Siti Rahmah, S.H.',
    dueDate: '25 Sep 2026',
    daysLeft: 3,
    priority: 'HIGH',
    status: 'PENDING',
    category: 'KOREKSI_DRAF'
  },
  {
    id: 'TSK-003',
    title: 'Penyusunan Berita Acara Rapat Harmonisasi Pleno Pembentukan Qanun Desa',
    caseId: 'case-003',
    caseNumber: 'HARM-2026-0003',
    caseTitle: 'Raqan Tata Cara Pemilihan dan Pemberhentian Datok Penghulu',
    opd: 'Dinas Pemberdayaan Masyarakat & Gampong',
    assignee: 'Ahmad Fauzi, S.H.',
    dueDate: '26 Sep 2026',
    daysLeft: 4,
    priority: 'MEDIUM',
    status: 'PENDING',
    category: 'NOTULEN_RAPAT'
  },
  {
    id: 'TSK-004',
    title: 'Pengunggahan Dokumen Hasil Fasilitasi Biro Hukum Pemerintah Aceh',
    caseId: 'case-004',
    caseNumber: 'HARM-2026-0004',
    caseTitle: 'Raperbup Standar Penilaian Bangunan Gedung (PBG) & SLF',
    opd: 'Dinas PUPR',
    assignee: 'M. Yusuf (Legal Drafter)',
    dueDate: '27 Sep 2026',
    daysLeft: 5,
    priority: 'HIGH',
    status: 'PENDING',
    category: 'FASILITASI'
  },
  {
    id: 'TSK-005',
    title: 'Pengecekan Matriks Uji Beban Kerja & Hak Keuangan ASN Pegawai Kontrak',
    caseId: 'case-005',
    caseNumber: 'HARM-2026-0005',
    caseTitle: 'Raperbup Tambahan Penghasilan Pegawai (TPP) Berbasis Kinerja ASN',
    opd: 'BKPSDM',
    assignee: 'Nurul Hidayah, S.H.',
    dueDate: '28 Sep 2026',
    daysLeft: 6,
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    category: 'REVIEW_HUKUM'
  },
  {
    id: 'TSK-006',
    title: 'Verifikasi Naskah Bersih Sebelum Penandatanganan TTE Lembaran Daerah',
    caseId: 'case-006',
    caseNumber: 'HARM-2026-0006',
    caseTitle: 'Qanun Pajak Daerah dan Retribusi Daerah Tahun 2024',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    assignee: 'Dahlan, S.H. (Kabag Hukum)',
    dueDate: '21 Sep 2026',
    daysLeft: 0,
    priority: 'LOW',
    status: 'DONE',
    category: 'VERIFIKASI_OPD'
  }
];

export default function GlobalTasksClient() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CRITICAL' | 'TODAY' | 'IN_PROGRESS' | 'DONE'>('ALL');

  const toggleTaskDone = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'DONE' ? 'PENDING' : 'DONE'
        };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.opd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'CRITICAL') return t.priority === 'CRITICAL' || t.priority === 'HIGH';
    if (selectedFilter === 'TODAY') return t.daysLeft <= 2 && t.status !== 'DONE';
    if (selectedFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (selectedFilter === 'DONE') return t.status === 'DONE';

    return true;
  });

  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;
  const criticalCount = tasks.filter(t => t.priority === 'CRITICAL' && t.status !== 'DONE').length;
  const doneCount = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                Pusat Tugas & Disposisi
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Daftar Tugas Harmonisasi
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitoring seluruh disposisi tugas tim hukum, telaahan naskah, koreksi klausul, dan fasilitasi provinsi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cases">
            <Button size="sm" variant="outline" className="rounded-xl border-slate-300 text-xs font-semibold h-9">
              <span>Buka Katalog Kasus</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-500" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/60 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Tugas Berjalan</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{pendingCount}</h3>
              <p className="text-[11px] text-slate-500">Memerlukan tindak lanjut staf drafter</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50/60 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Prioritas Mendesak</p>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">{criticalCount}</h3>
              <p className="text-[11px] text-slate-500">Batas SLA mendekati jatuh tempo</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/60 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tugas Selesai</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{doneCount}</h3>
              <p className="text-[11px] text-slate-500">Telah diverifikasi & diparaf</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Cari tugas, nomor HARM, OPD, atau staf..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl border-slate-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              selectedFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              selectedFilter === 'CRITICAL' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Prioritas Tinggi
          </button>
          <button
            onClick={() => setSelectedFilter('TODAY')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              selectedFilter === 'TODAY' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mendekati SLA (&le;2 Hari)
          </button>
          <button
            onClick={() => setSelectedFilter('DONE')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              selectedFilter === 'DONE' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Selesai ({doneCount})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'DONE';
          return (
            <div 
              key={task.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone 
                  ? 'bg-slate-50/70 border-slate-200/80 opacity-75' 
                  : 'bg-white border-slate-200/90 shadow-xs hover:border-violet-400 hover:shadow-md'
              }`}
            >
              {/* Checkbox and Info */}
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleTaskDone(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
                    isDone 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-slate-300 hover:border-violet-500 bg-white'
                  }`}
                  title={isDone ? 'Tandai belum selesai' : 'Tandai tugas selesai'}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                      {task.caseNumber}
                    </span>
                    <Badge variant="outline" className={`text-[10px] font-bold ${
                      task.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-300' :
                      task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {task.priority === 'CRITICAL' ? 'URGENT' : task.priority}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium">
                      &bull; {task.opd}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold leading-snug ${
                    isDone ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}>
                    {task.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    Permohonan: <span className="text-slate-700 font-medium">{task.caseTitle}</span>
                  </p>
                </div>
              </div>

              {/* Meta and Link */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1 text-[11px] text-slate-500">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-700">{task.assignee}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1 text-[11px] mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className={task.daysLeft <= 2 && !isDone ? 'font-bold text-rose-600' : 'text-slate-500'}>
                      Batas: {task.dueDate} {task.daysLeft <= 2 && !isDone && `(${task.daysLeft} hari lagi)`}
                    </span>
                  </div>
                </div>

                <Link href={`/cases/${task.caseId}/tasks`}>
                  <Button size="sm" variant="ghost" className="h-8 px-2.5 rounded-xl hover:bg-violet-50 text-violet-700 font-semibold text-xs flex items-center gap-1">
                    <span>Buka</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tidak ada tugas yang sesuai filter</h4>
            <p className="text-xs text-slate-400 mt-0.5">Seluruh tugas pada kriteria ini telah diselesaikan atau kata kunci pencarian tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
