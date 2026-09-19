'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Server, 
  Users, 
  Database, 
  ShieldCheck, 
  HardDrive, 
  ExternalLink, 
  ArrowUpRight, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Activity, 
  Download, 
  UserPlus,
  Send,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import NotionStickyBoard from './notion-sticky-board';
import { 
  StickyNote, 
  DispatchedNoteProgress, 
  StaffUserItem, 
  dispatchReviewerNote 
} from '@/lib/actions/notes';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

const DEFAULT_ADMIN_DISPATCHES: DispatchedNoteProgress[] = [
  {
    id: 'disp-adm-1',
    sender_name: 'Kepala Administrator Sistem (M. Yusuf)',
    sender_role: 'ADMIN',
    target_staff_name: 'M. Yusuf (Legal Drafter)',
    case_title: 'SK Tim Panitia Seleksi Terbuka JPTP (HARM-2026-012)',
    instruction: 'Arahan Sekda & Bupati: SK Tim Panitia Seleksi Terbuka JPTP harus selesai paraf Bagian Hukum sebelum hari Jumat untuk ditandatangani Bupati.',
    quick_template: 'Draf SK Tim Pansel JPTP telah selesai diharmonisasi dan siap diajukan ke meja Kabag Hukum.',
    priority: 'URGENT',
    color: 'blue',
    todos: [
      { id: 't1', text: 'Verifikasi susunan tim independen & akademisi', done: true },
      { id: 't2', text: 'Siapkan lembar kendali paraf hierarkis', done: true },
      { id: 't3', text: 'Cetak naskah dinas di kertas kop Bupati', done: false },
    ],
    total_todos: 3,
    completed_todos: 2,
    progress_percent: 67,
    status: 'IN_PROGRESS',
    created_at: 'Hari ini, 09:30 WIB',
  },
  {
    id: 'disp-adm-2',
    sender_name: 'Kepala Administrator Sistem (M. Yusuf)',
    sender_role: 'ADMIN',
    target_staff_name: 'Rizki Pratama (Legal Drafter)',
    case_title: 'Raperbup Tata Kelola SPBE & Satu Data Daerah (HARM-2026-019)',
    instruction: 'Lakukan sinkronisasi materi muatan pasal keamanan siber dengan Perpres No. 95/2018 dan panduan teknis BSSN.',
    quick_template: 'Sinkronisasi klausul keamanan SPBE telah disesuaikan dengan standar BSSN.',
    priority: 'HIGH',
    color: 'emerald',
    todos: [
      { id: 't4', text: 'Klarifikasi klausul sertifikasi elektronik ke Diskominfosan', done: true },
      { id: 't5', text: 'Uji konsideran Mengingat dengan Peraturan BSSN No. 4/2021', done: true },
    ],
    total_todos: 2,
    completed_todos: 2,
    progress_percent: 100,
    status: 'COMPLETED',
    created_at: 'Kemarin, 14:15 WIB',
  },
  {
    id: 'disp-adm-3',
    sender_name: 'Kepala Administrator Sistem (M. Yusuf)',
    sender_role: 'ADMIN',
    target_staff_name: 'Dewi Sartika (Legal Drafter)',
    case_title: 'Raperbup Tarif Retribusi Parkir Tepi Jalan (HARM-2026-024)',
    instruction: 'Minta data rekapitulasi titik potensi parkir ke Dinas Perhubungan Aceh Tamiang untuk kelengkapan lampiran zona tarif.',
    quick_template: 'Data zona titik parkir telah diterima dari Dishub.',
    priority: 'NORMAL',
    color: 'amber',
    todos: [
      { id: 't6', text: 'Kirim formulir checklist data ke Dishub', done: false },
      { id: 't7', text: 'Validasi rumus perhitungan tarif zona A dan B', done: false },
    ],
    total_todos: 2,
    completed_todos: 0,
    progress_percent: 0,
    status: 'NOT_STARTED',
    created_at: 'Kemarin, 16:40 WIB',
  },
];

interface AdminDashboardProps {
  initialNotes?: StickyNote[];
  initialDispatches?: DispatchedNoteProgress[];
  staffList?: StaffUserItem[];
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
  };
}

export default function AdminDashboard({
  initialNotes = [],
  initialDispatches = [],
  staffList = [],
  currentUser,
}: AdminDashboardProps) {
  const [dispatches, setDispatches] = useState<DispatchedNoteProgress[]>(
    initialDispatches.length > 0 ? initialDispatches : DEFAULT_ADMIN_DISPATCHES
  );
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [targetStaffName, setTargetStaffName] = useState(
    staffList[0]?.name || 'M. Yusuf (Legal Drafter)'
  );
  const [caseTitle, setCaseTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [quickTemplate, setQuickTemplate] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('URGENT');
  const [noteColor, setNoteColor] = useState<'blue' | 'rose' | 'amber' | 'emerald' | 'purple'>('blue');
  const [todos, setTodos] = useState<string[]>(['']);

  // Handle Administrator Dispatch Submit
  const handleAdminDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim() || !instruction.trim()) return;

    setIsSubmitting(true);
    const validTodos = todos.filter((t) => t.trim().length > 0);

    const res = await dispatchReviewerNote({
      targetStaffName,
      caseTitle: caseTitle.trim(),
      instruction: instruction.trim(),
      quickTemplate: quickTemplate.trim(),
      todos: validTodos,
      priority,
      color: noteColor,
      senderRole: 'ADMIN',
    });

    const newDispatch: DispatchedNoteProgress = {
      id: res.data?.id || `disp-${Date.now()}`,
      sender_name: currentUser?.name || 'Kepala Administrator Sistem',
      sender_role: 'ADMIN',
      target_staff_name: targetStaffName,
      case_title: caseTitle.trim(),
      instruction: instruction.trim(),
      quick_template: quickTemplate.trim(),
      priority,
      color: noteColor,
      todos: validTodos.map((text, i) => ({ id: `td-${Date.now()}-${i}`, text, done: false })),
      total_todos: validTodos.length,
      completed_todos: 0,
      progress_percent: 0,
      status: 'NOT_STARTED',
      created_at: 'Baru saja',
    };

    setDispatches([newDispatch, ...dispatches]);

    // Reset Form
    setCaseTitle('');
    setInstruction('');
    setQuickTemplate('');
    setTodos(['']);
    setPriority('URGENT');
    setIsSubmitting(false);
    setIsDispatchModalOpen(false);
  };

  // Calculations for KPI
  const totalDispatches = dispatches.length;
  const completedDispatches = dispatches.filter((d) => d.status === 'COMPLETED').length;
  const inProgressDispatches = dispatches.filter((d) => d.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 subtle-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                Portal Eksekutif & Administrator
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Kendali Harmonisasi Produk Hukum
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pemantauan terpadu beban kerja legal drafter, alur pengajuan permohonan OPD, dan pemantauan progres tindak lanjut staf secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              onClick={() => setIsDispatchModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>+ Disposisi Tugas ke 1 Staf</span>
            </Button>
            <a
              href={GDRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>Arsip Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Infrastruktur */}
        <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kesehatan Layanan
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Server className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>Normal 100%</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase & Google Drive Aktif</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Permohonan Berjalan */}
        <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Perkara Berjalan
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">24 Berkas</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>18 Raperbup • 6 SK Bupati</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Kepatuhan SLA */}
        <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kepatuhan Waktu SLA
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">96.8%</div>
            <div className="mt-2 space-y-1">
              <Progress value={96.8} className="h-1.5 bg-indigo-100 [&>div]:bg-indigo-600" />
              <span className="text-[10px] text-slate-500">Rata-rata 12 hari kerja per regulasi</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Antrean Verifikasi Intake */}
        <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Antrean Permohonan OPD
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">7 Menunggu</div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-amber-700 font-medium">Perlu verifikasi formal</span>
              <Link href="/intake" className="text-blue-600 hover:underline font-semibold">
                Periksa &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: ADMINISTRATOR STAFF DISPATCH MONITORING PANEL */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Send className="w-4 h-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Pemantauan Progres Disposisi & Kinerja Staf Hukum
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Kirimkan instruksi telaah ke 1 staf tertentu dan pantau persentase penyelesaian butir to-do secara real-time.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>{completedDispatches} Selesai</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-semibold">{inProgressDispatches} Berjalan</span>
              <span className="text-slate-300">•</span>
              <span>{totalDispatches} Total</span>
            </div>

            <Button
              onClick={() => setIsDispatchModalOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Disposisi ke 1 Staf</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {dispatches.map((disp) => {
              const isDone = disp.status === 'COMPLETED';
              const isInProgress = disp.status === 'IN_PROGRESS';

              return (
                <div
                  key={disp.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4.5 flex flex-col justify-between hover:shadow-xs hover:border-blue-200 transition space-y-3.5"
                >
                  <div className="space-y-2.5">
                    {/* Header: Staff Target Badge & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-bold">
                        Ditugaskan ke: {disp.target_staff_name}
                      </Badge>

                      {isDone ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>100% Selesai</span>
                        </Badge>
                      ) : isInProgress ? (
                        <Badge className="bg-blue-100 text-blue-800 border-none text-[10px] font-semibold">
                          {disp.progress_percent}% Berjalan
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] font-semibold">
                          Belum Dimulai
                        </Badge>
                      )}
                    </div>

                    {/* Case Title */}
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                      {disp.case_title}
                    </h4>

                    {/* Instruction Box */}
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                      {disp.instruction}
                    </p>

                    {/* Real-Time Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>Progres Tugas Staf</span>
                        </span>
                        <span className="font-bold text-slate-800">
                          {disp.completed_todos}/{disp.total_todos} butir ({disp.progress_percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' : isInProgress ? 'bg-blue-600' : 'bg-amber-400'
                          }`}
                          style={{ width: `${disp.progress_percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Checklist To-Dos Breakdown */}
                    {disp.todos && disp.todos.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-200/60">
                        {disp.todos.map((t, idx) => (
                          <div key={t.id || idx} className="flex items-start gap-1.5 text-[11px]">
                            {t.done ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <span className={t.done ? 'line-through text-slate-400' : 'text-slate-700'}>
                              {t.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Meta Footer */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{disp.created_at}</span>
                    </span>
                    <span className="text-blue-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tersinkron di Staf</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notion Sticky Notes Tracking Board */}
      <NotionStickyBoard initialNotes={initialNotes} currentUser={currentUser} />

      {/* Enterprise Management Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/admin/users" 
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Manajemen Akun Staf & Pimpinan</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Buat akun baru pejabat, atasan, atau staf legal drafter tanpa registrasi publik.
          </p>
        </Link>

        <Link 
          href="/admin/system" 
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Database className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Pencadangan Database ke Google Drive</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Unduh salinan berkas cadangan database instan untuk arsip aman permanen.
          </p>
        </Link>

        <Link 
          href="/admin/audit" 
          className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Audit Trail & Log Transparansi</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Rekam jejak setiap perubahan status, pengunggahan dokumen, dan disposisi perkara.
          </p>
        </Link>
      </div>

      {/* Modal Dialog: Administrator Kirim Disposisi ke 1 Staf */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              <span>Kirim Disposisi / Tugas ke 1 Staf Tertentu</span>
            </DialogTitle>
            <DialogDescription>
              Disposisi ini HANYA akan muncul di meja kerja staf yang Anda pilih dan tidak dapat dilihat oleh staf lainnya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdminDispatchSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Pilih Staf Legal Drafter Target *</label>
                <select
                  value={targetStaffName}
                  onChange={(e) => setTargetStaffName(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {staffList.length > 0 ? (
                    staffList.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.jabatan || 'Drafter'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="M. Yusuf (Legal Drafter)">M. Yusuf (Legal Drafter)</option>
                      <option value="Rizki Pratama (Legal Drafter)">Rizki Pratama (Legal Drafter)</option>
                      <option value="Dewi Sartika (Legal Drafter)">Dewi Sartika (Legal Drafter)</option>
                      <option value="Hendra Kurniawan (Legal Drafter)">Hendra Kurniawan (Legal Drafter)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Tingkat Urgensi</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="URGENT">Mendesak / Selesaikan Hari Ini</option>
                  <option value="HIGH">Prioritas Tinggi</option>
                  <option value="NORMAL">Biasa</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Judul Perkara / Dokumen Hukum Terkait *</label>
              <Input
                placeholder="Contoh: Raperbup Pajak & Retribusi Daerah (HARM-2026-007)"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Instruksi & Arahan Tugas *</label>
              <Textarea
                placeholder="Tuliskan poin perbaikan pasal, rujukan regulasi yang harus dicek, atau koordinasi teknis yang diperlukan..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                required
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Saran Format Jawaban untuk Staf (Opsional)
              </label>
              <Textarea
                placeholder="Kalimat balasan yang bisa staf salin saat menjawab permohonan OPD..."
                value={quickTemplate}
                onChange={(e) => setQuickTemplate(e.target.value)}
                rows={2}
                className="text-xs resize-none bg-slate-50 border-slate-200"
              />
            </div>

            {/* Checklist items to be done by staff */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Butir To-Do yang Wajib Diselesaikan Staf (Terpantau Real-Time)
                </label>
                <button
                  type="button"
                  onClick={() => setTodos([...todos, ''])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Butir
                </button>
              </div>

              {todos.map((todo, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <Input
                    placeholder={`Tugas perbaikan naskah ${idx + 1}...`}
                    value={todo}
                    onChange={(e) => {
                      const updated = [...todos];
                      updated[idx] = e.target.value;
                      setTodos(updated);
                    }}
                    className="text-xs h-8"
                  />
                  {todos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTodos(todos.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {isSubmitting ? 'Mengirimkan...' : 'Kirim Disposisi ke Meja Staf'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

