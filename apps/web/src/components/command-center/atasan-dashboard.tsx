'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { 
  Users, 
  AlertTriangle, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Send, 
  Plus, 
  CheckSquare, 
  Square,
  Trash2, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import NotionStickyBoard from './notion-sticky-board';
import { 
  dispatchReviewerNote, 
  StickyNote, 
  DispatchedNoteProgress, 
  StaffUserItem 
} from '@/lib/actions/notes';

const DEFAULT_REVIEWER_DISPATCHES: DispatchedNoteProgress[] = [
  {
    id: 'disp-seed-1',
    sender_name: 'Pejabat Penelaah (Atasan)',
    sender_role: 'ATASAN',
    target_staff_name: 'M. Yusuf (Legal Drafter)',
    case_title: 'Raperbup Rencana Tata Ruang Wilayah (HARM-2026-004)',
    instruction: 'Perbaiki konsideran Menimbang huruf b agar selaras dengan UU Cipta Kerja No. 6/2023. Cek klausul kewenangan bupati pada pasal 14 ayat 2.',
    quick_template: 'Yth. Bappeda, konsideran Raperbup telah diselaraskan dengan UU No. 6/2023. Berita acara siap ditandatangani.',
    priority: 'URGENT',
    color: 'rose',
    todos: [
      { id: 't1', text: 'Ubah rujukan pasal 14 ayat 2 di draf Word', done: true },
      { id: 't2', text: 'Konfirmasi pemetaan batas zonasi ke Dinas PUPR', done: false },
      { id: 't3', text: 'Unggah naskah v2 ke Google Drive Arsip', done: false },
    ],
    total_todos: 3,
    completed_todos: 1,
    progress_percent: 33,
    status: 'IN_PROGRESS',
    created_at: '4 jam lalu',
  },
  {
    id: 'disp-seed-2',
    sender_name: 'Pejabat Penelaah (Atasan)',
    sender_role: 'ATASAN',
    target_staff_name: 'M. Yusuf (Legal Drafter)',
    case_title: 'SK Tim Panitia Seleksi Terbuka JPTP (HARM-2026-012)',
    instruction: 'Arahan Sekda: SK Tim Panitia Seleksi Terbuka JPTP harus selesai paraf Bagian Hukum sebelum hari Jumat untuk ditandatangani Bupati.',
    quick_template: 'Draf SK Tim Pansel JPTP telah selesai diharmonisasi dan siap diajukan ke meja Kabag Hukum.',
    priority: 'URGENT',
    color: 'amber',
    todos: [
      { id: 't4', text: 'Verifikasi susunan tim independen & akademisi', done: true },
      { id: 't5', text: 'Siapkan lembar kendali paraf hierarkis', done: true },
      { id: 't6', text: 'Cetak naskah dinas di kertas kop Bupati', done: false },
    ],
    total_todos: 3,
    completed_todos: 2,
    progress_percent: 67,
    status: 'IN_PROGRESS',
    created_at: 'Kemarin',
  },
  {
    id: 'disp-seed-3',
    sender_name: 'Pejabat Penelaah (Atasan)',
    sender_role: 'ATASAN',
    target_staff_name: 'Rizki Pratama (Legal Drafter)',
    case_title: 'Raperbup Pengelolaan Sampah Rumah Tangga (HARM-2026-018)',
    instruction: 'Minta data lampiran teknis retribusi pengangkutan sampah ke Dinas Lingkungan Hidup sebelum rapat pleno harmonisasi.',
    quick_template: 'Draf pasal 8 telah diklarifikasi dengan Dinas LH.',
    priority: 'HIGH',
    color: 'blue',
    todos: [
      { id: 't7', text: 'Kirim surat permintaan data ke Dinas LH', done: true },
      { id: 't8', text: 'Susun matriks perbandingan tarif retribusi', done: true },
    ],
    total_todos: 2,
    completed_todos: 2,
    progress_percent: 100,
    status: 'COMPLETED',
    created_at: '2 hari lalu',
  },
];

interface AtasanDashboardProps {
  initialNotes?: StickyNote[];
  initialDispatches?: DispatchedNoteProgress[];
  staffList?: StaffUserItem[];
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
  };
}

export default function AtasanDashboard({
  initialNotes = [],
  initialDispatches = [],
  staffList = [],
  currentUser,
}: AtasanDashboardProps) {
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatches, setDispatches] = useState<DispatchedNoteProgress[]>(
    initialDispatches.length > 0 ? initialDispatches : DEFAULT_REVIEWER_DISPATCHES
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [targetStaff, setTargetStaff] = useState(
    staffList[0]?.name || 'M. Yusuf (Legal Drafter)'
  );
  const [caseTitle, setCaseTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [quickTemplate, setQuickTemplate] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('URGENT');
  const [todos, setTodos] = useState<string[]>(['']);
  const [noteColor, setNoteColor] = useState<'rose' | 'amber' | 'blue' | 'purple'>('rose');

  // Load from local storage fallback if empty
  useEffect(() => {
    try {
      if (initialDispatches.length === 0) {
        const saved = localStorage.getItem('harm_reviewer_dispatches');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDispatches(parsed);
          }
        }
      }
    } catch (e) {}
  }, [initialDispatches]);

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim() || !instruction.trim()) return;

    setIsSubmitting(true);
    const validTodos = todos.filter((t) => t.trim().length > 0);

    // Call server action to push into Supabase case_notes
    const res = await dispatchReviewerNote({
      targetStaffName: targetStaff,
      caseTitle: caseTitle.trim(),
      instruction: instruction.trim(),
      quickTemplate: quickTemplate.trim(),
      todos: validTodos,
      priority,
      color: noteColor,
      senderRole: 'ATASAN',
    });

    const newDispatch: DispatchedNoteProgress = {
      id: res.data?.id || `disp-${Date.now()}`,
      sender_name: currentUser?.name || 'Pejabat Penelaah (Atasan)',
      sender_role: 'ATASAN',
      target_staff_name: targetStaff,
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

    const updated = [newDispatch, ...dispatches];
    setDispatches(updated);
    try {
      localStorage.setItem('harm_reviewer_dispatches', JSON.stringify(updated));
    } catch (e) {}

    // Reset Form
    setCaseTitle('');
    setInstruction('');
    setQuickTemplate('');
    setTodos(['']);
    setPriority('URGENT');
    setIsSubmitting(false);
    setIsDispatchOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs">
              Dasbor Pimpinan & Reviewer Utama
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pengesahan & Monitoring Regulasi Daerah
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Pusat persetujuan telaah hukum, penandatanganan berita acara harmonisasi, dan pengawasan batas waktu (SLA) permohonan OPD.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              onClick={() => setIsDispatchOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>+ Disposisi Sticky Note ke Staf</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Leadership Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Persetujuan
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">8 Naskah</div>
            <p className="text-xs text-blue-600 font-medium mt-1">5 Raperbup siap paraf • 3 Telaahan</p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Antrean persetujuan</span>
              <Link href="/tasks" className="text-blue-600 hover:underline font-semibold">
                Tinjau Sekarang &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-amber-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Perkara Berisiko SLA
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">3 Perkara</div>
            <p className="text-xs text-amber-600 font-medium mt-1">Mendekati batas 14 hari kerja</p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Perlu atensi prioritas</span>
              <Link href="/cases" className="text-amber-700 hover:underline font-semibold">
                Lihat Daftar &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs hover:border-indigo-300 transition bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Beban Kerja Tim Perancang
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">6 Drafter</div>
            <p className="text-xs text-indigo-600 font-medium mt-1">Rata-rata 4 berkas per perancang hukum</p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Distribusi seimbang</span>
              <Link href="/reports" className="text-indigo-600 hover:underline font-semibold">
                Matriks Tim &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviewer to Staff Dispositions / Sticky Notes Follow-Up Section */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <Send className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                Disposisi Sticky Note & Tindak Lanjut ke Meja Kerja Staf
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Kirimkan instruksi telaah perbaikan naskah secara instan ke papan Notion staf agar langsung ditindaklanjuti.
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsDispatchOpen(true)}
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kirim Disposisi Baru</span>
          </Button>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dispatches.map((disp) => {
              const isDone = disp.status === 'COMPLETED';
              const isInProgress = disp.status === 'IN_PROGRESS';

              return (
                <div
                  key={disp.id}
                  className="rounded-xl border border-rose-200/80 bg-rose-50/60 p-4.5 flex flex-col justify-between hover:shadow-xs transition space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-rose-200/80 text-rose-900 border-none text-[10px] font-bold">
                        Ditugaskan ke: {disp.target_staff_name}
                      </Badge>
                      {isDone ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>100% Selesai</span>
                        </Badge>
                      ) : isInProgress ? (
                        <Badge className="bg-rose-100 text-rose-800 border-none text-[10px] font-semibold">
                          {disp.progress_percent}% Berjalan
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] font-semibold">
                          Belum Dimulai
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">
                      {disp.case_title}
                    </h4>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-black/5">
                      {disp.instruction}
                    </p>

                    {/* Real-Time Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5 text-rose-600" />
                          <span>Progres Tugas Staf</span>
                        </span>
                        <span className="font-bold text-slate-800">
                          {disp.completed_todos}/{disp.total_todos} butir ({disp.progress_percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' : isInProgress ? 'bg-rose-600' : 'bg-amber-400'
                          }`}
                          style={{ width: `${disp.progress_percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Checklist To-Dos Breakdown */}
                    {disp.todos && disp.todos.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-rose-200/60">
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

                  <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{disp.created_at}</span>
                    </span>
                    <span className="text-emerald-700 font-medium text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tersinkron di Notion Staf</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Approval Notice */}
      <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-950">Validasi Digital & Berita Acara Rapat</h4>
            <p className="text-xs text-blue-800 mt-0.5">
              Setiap paraf dan disposisi yang Anda berikan langsung tercatat pada Audit Trail dan disinkronkan ke status tracking OPD secara instan.
            </p>
          </div>
        </div>
        <Link href="/cases" className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline whitespace-nowrap pl-4">
          Buka Perkara Aktif &rarr;
        </Link>
      </div>

      {/* Notion Sticky Notes Tracking Board */}
      <NotionStickyBoard initialNotes={initialNotes} currentUser={currentUser} />

      {/* Modal Dialog: Kirim Sticky Note Follow-Up ke Staf */}
      <Dialog open={isDispatchOpen} onOpenChange={setIsDispatchOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-rose-600" />
              <span>Kirim Catatan Tindak Lanjut (Follow-Up) ke Staf</span>
            </DialogTitle>
            <DialogDescription>
              Catatan ini akan langsung muncul sebagai Sticky Note berprioritas tinggi di meja kerja Notion staf perancang hukum.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDispatchSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Pilih Staf Legal Drafter *</label>
                <select
                  value={targetStaff}
                  onChange={(e) => setTargetStaff(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="URGENT">Mendesak / Selesaikan Hari Ini</option>
                  <option value="HIGH">Prioritas Tinggi</option>
                  <option value="NORMAL">Biasa</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Judul Perkara / Regulasi Terkait *</label>
              <Input
                placeholder="Contoh: Raperbup Retribusi Daerah (HARM-2026-007)"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Instruksi & Arahan Tindak Lanjut *</label>
              <Textarea
                placeholder="Tuliskan arahan perbaikan pasal, konsideran yang harus dicek, atau dokumen yang harus dimintakan ke OPD..."
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
                placeholder="Contoh kalimat penjelasan yang bisa staf salin saat menjawab permohonan OPD..."
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
                  Butir To-Do yang Wajib Dikerjakan Staf
                </label>
                <button
                  type="button"
                  onClick={() => setTodos([...todos, ''])}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Butir
                </button>
              </div>

              {todos.map((todo, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <Input
                    placeholder={`Instruksi tindak lanjut ${idx + 1}...`}
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
                onClick={() => setIsDispatchOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {isSubmitting ? 'Mengirimkan...' : 'Kirim Disposisi ke Staf'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

