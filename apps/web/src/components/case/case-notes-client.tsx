'use client';

import React, { useState } from 'react';
import { 
  Pin, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  FileText, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  Clock, 
  User, 
  MessageSquare, 
  Tag, 
  Send,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export interface CaseNoteItem {
  id: string;
  title: string;
  content: string;
  quick_answer?: string;
  category: 'PERBAIKAN_PASAL' | 'DISPOSISI' | 'JAWABAN_OPD' | 'GENERAL' | 'PENTING';
  color: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'slate';
  is_pinned: boolean;
  author_name: string;
  sender_role?: 'ADMIN' | 'ATASAN' | 'STAF';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  todos: { id: string; text: string; done: boolean }[];
  created_at: string;
}

const COLOR_MAP = {
  amber: {
    bg: 'bg-amber-50/90',
    border: 'border-amber-200',
    header: 'bg-amber-100/70 text-amber-900',
    badge: 'bg-amber-200/60 text-amber-800',
    accent: '#f59e0b',
  },
  blue: {
    bg: 'bg-blue-50/90',
    border: 'border-blue-200',
    header: 'bg-blue-100/70 text-blue-900',
    badge: 'bg-blue-200/60 text-blue-800',
    accent: '#3b82f6',
  },
  emerald: {
    bg: 'bg-emerald-50/90',
    border: 'border-emerald-200',
    header: 'bg-emerald-100/70 text-emerald-900',
    badge: 'bg-emerald-200/60 text-emerald-800',
    accent: '#10b981',
  },
  rose: {
    bg: 'bg-rose-50/90',
    border: 'border-rose-200',
    header: 'bg-rose-100/70 text-rose-900',
    badge: 'bg-rose-200/60 text-rose-800',
    accent: '#f43f5e',
  },
  purple: {
    bg: 'bg-purple-50/90',
    border: 'border-purple-200',
    header: 'bg-purple-100/70 text-purple-900',
    badge: 'bg-purple-200/60 text-purple-800',
    accent: '#8b5cf6',
  },
  slate: {
    bg: 'bg-slate-50/90',
    border: 'border-slate-200',
    header: 'bg-slate-100/70 text-slate-900',
    badge: 'bg-slate-200/60 text-slate-800',
    accent: '#64748b',
  },
};

const CATEGORY_MAP: Record<string, { label: string; icon: any }> = {
  PERBAIKAN_PASAL: { label: 'Perbaikan Naskah', icon: Tag },
  DISPOSISI: { label: 'Disposisi Atasan', icon: Send },
  JAWABAN_OPD: { label: 'Jawaban Cepat OPD', icon: MessageSquare },
  PENTING: { label: 'Urgensi Khusus', icon: AlertCircle },
  GENERAL: { label: 'Catatan Umum', icon: FileText },
};

export default function CaseNotesClient({
  caseId,
  caseTitle = 'Rancangan Dokumen Hukum',
  currentUserRole = 'ADMIN',
}: {
  caseId: string;
  caseTitle?: string;
  currentUserRole?: string;
}) {
  const [notes, setNotes] = useState<CaseNoteItem[]>([
    {
      id: 'cn-1',
      title: 'Konsideran Menimbang & Hirarki Peraturan',
      content: 'Perlu verifikasi rujukan UU HKPD (UU No. 1/2022) dan PP No. 35/2023. Konsideran mengingat harus menempatkan UU No. 11/2006 (UU PA) di atas peraturan sektoral.',
      quick_answer: 'Yth. Pemohon OPD, konsideran telah disesuaikan dengan UU HKPD No. 1/2022 dan UU Pemerintahan Aceh No. 11/2006. Tidak ada pertentangan kewenangan daerah.',
      category: 'PERBAIKAN_PASAL',
      color: 'amber',
      is_pinned: true,
      author_name: 'M. Yusuf (Legal Drafter)',
      sender_role: 'STAF',
      priority: 'URGENT',
      todos: [
        { id: 't-1', text: 'Periksa kembali susunan konsideran mengingat', done: true },
        { id: 't-2', text: 'Konfirmasi definisi tarif pada pasal 1', done: true },
        { id: 't-3', text: 'Verifikasi lampiran tabel rincian objek', done: false },
      ],
      created_at: '2 jam yang lalu',
    },
    {
      id: 'cn-2',
      title: 'Disposisi Reviewer: Uji Formil & Bukti Dukung',
      content: 'Pastikan Naskah Akademik atau Penjelasan Raperbup telah ditandatangani Kepala OPD pengusul dan dilengkapi SPTJM sebelum dilanjutkan ke Rapat Pleno.',
      quick_answer: 'Dokumen telaahan siap dilanjutkan ke Rapat Pleno Harmonisasi setelah kelengkapan SPTJM terverifikasi.',
      category: 'DISPOSISI',
      color: 'rose',
      is_pinned: true,
      author_name: 'Dr. Ir. Teuku Iskandar (Reviewer Utama)',
      sender_role: 'ATASAN',
      priority: 'HIGH',
      todos: [
        { id: 't-4', text: 'Cek fisik tanda tangan basah / barcode TTE pada SPTJM', done: true },
        { id: 't-5', text: 'Arsipkan softcopy ke Google Drive', done: true },
      ],
      created_at: 'Kemarin',
    },
    {
      id: 'cn-3',
      title: 'Draf Respon Cepat untuk Konfirmasi OPD',
      content: 'Gunakan template ini saat membalas pertanyaan dari admin dinas terkait jadwal fasilitasi provinsi.',
      quick_answer: 'Permohonan harmonisasi sedang dalam tahap fasilitasi Biro Hukum Provinsi Aceh. Estimasi selesai: 3 hari kerja.',
      category: 'JAWABAN_OPD',
      color: 'blue',
      is_pinned: false,
      author_name: 'M. Yusuf',
      sender_role: 'STAF',
      priority: 'NORMAL',
      todos: [
        { id: 't-6', text: 'Simpan nomor kontak LO Biro Hukum Setda Aceh', done: true },
      ],
      created_at: '2 hari yang lalu',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'PINNED' | 'PERBAIKAN' | 'DISPOSISI' | 'JAWABAN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [quickAnswer, setQuickAnswer] = useState('');
  const [category, setCategory] = useState<CaseNoteItem['category']>('PERBAIKAN_PASAL');
  const [color, setColor] = useState<CaseNoteItem['color']>('amber');
  const [priority, setPriority] = useState<CaseNoteItem['priority']>('NORMAL');
  const [isPinned, setIsPinned] = useState(false);
  const [todos, setTodos] = useState<string[]>(['']);

  const handleCopyAnswer = (note: CaseNoteItem) => {
    const text = note.quick_answer || note.content;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, is_pinned: !n.is_pinned } : n));
  };

  const handleToggleTodo = (noteId: string, todoId: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        todos: n.todos.map(t => t.id === todoId ? { ...t, done: !t.done } : t)
      };
    }));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleAddTodoField = () => {
    setTodos([...todos, '']);
  };

  const handleTodoChange = (index: number, val: string) => {
    const next = [...todos];
    next[index] = val;
    setTodos(next);
  };

  const handleCreateNote = () => {
    if (!title.trim() || !content.trim()) return;

    const validTodos = todos
      .filter(t => t.trim().length > 0)
      .map((t, idx) => ({ id: `t-new-${Date.now()}-${idx}`, text: t.trim(), done: false }));

    const newNote: CaseNoteItem = {
      id: `cn-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      quick_answer: quickAnswer.trim() || undefined,
      category,
      color,
      is_pinned: isPinned,
      author_name: 'M. Yusuf (Anda)',
      sender_role: (currentUserRole as any) || 'ADMIN',
      priority,
      todos: validTodos,
      created_at: 'Baru saja',
    };

    setNotes([newNote, ...notes]);
    setIsCreateOpen(false);
    setTitle('');
    setContent('');
    setQuickAnswer('');
    setCategory('PERBAIKAN_PASAL');
    setColor('amber');
    setPriority('NORMAL');
    setIsPinned(false);
    setTodos(['']);
  };

  const filteredNotes = notes.filter(n => {
    if (filter === 'PINNED' && !n.is_pinned) return false;
    if (filter === 'PERBAIKAN' && n.category !== 'PERBAIKAN_PASAL') return false;
    if (filter === 'DISPOSISI' && n.category !== 'DISPOSISI') return false;
    if (filter === 'JAWABAN' && n.category !== 'JAWABAN_OPD') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchQuick = n.quick_answer?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchQuick;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Notion Sticky Notes Kasus
            </span>
            <span className="text-xs text-slate-400">Kasus ID: #{caseId.slice(0, 8)}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Catatan Internal & Respon Cepat Naskah
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Tulis catatan pasal, instruksi perbaikan telaahan hukum, atau siapkan template jawaban cepat yang dapat langsung disalin untuk koordinasi dengan OPD.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sticky Note</span>
        </Button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={filter === 'ALL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('ALL')}
            className={`text-xs h-8 ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Semua ({notes.length})
          </Button>
          <Button
            variant={filter === 'PINNED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('PINNED')}
            className={`text-xs h-8 flex items-center gap-1 ${filter === 'PINNED' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
          >
            <Pin className="w-3 h-3" />
            Disematkan ({notes.filter(n => n.is_pinned).length})
          </Button>
          <Button
            variant={filter === 'PERBAIKAN' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('PERBAIKAN')}
            className={`text-xs h-8 ${filter === 'PERBAIKAN' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
          >
            Perbaikan Naskah
          </Button>
          <Button
            variant={filter === 'DISPOSISI' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('DISPOSISI')}
            className={`text-xs h-8 ${filter === 'DISPOSISI' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
          >
            Disposisi Atasan
          </Button>
          <Button
            variant={filter === 'JAWABAN' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('JAWABAN')}
            className={`text-xs h-8 ${filter === 'JAWABAN' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Jawaban Cepat OPD
          </Button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari catatan atau pasal..."
            className="pl-9 h-8 text-xs bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => {
          const styling = COLOR_MAP[note.color] || COLOR_MAP.amber;
          const categoryMeta = CATEGORY_MAP[note.category] || CATEGORY_MAP.GENERAL;
          const CategoryIcon = categoryMeta.icon;

          const totalTodos = note.todos.length;
          const completedTodos = note.todos.filter(t => t.done).length;

          return (
            <div
              key={note.id}
              className={`rounded-2xl border ${styling.border} ${styling.bg} shadow-md transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden relative group`}
            >
              {/* Header */}
              <div className={`px-4 py-3 border-b ${styling.border} flex items-center justify-between gap-2`}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className={`text-[11px] font-medium border ${styling.badge} flex items-center gap-1`}>
                    <CategoryIcon className="w-3 h-3" />
                    {categoryMeta.label}
                  </Badge>

                  {note.priority === 'URGENT' && (
                    <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4">
                      URGENT
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.is_pinned ? 'text-amber-600 bg-amber-200/60' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                    }`}
                    title={note.is_pinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.is_pinned ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-100/50 transition-colors opacity-60 group-hover:opacity-100"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm tracking-tight leading-snug">
                    {note.title}
                  </h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line font-sans">
                    {note.content}
                  </p>
                </div>

                {/* Quick Answer Box (Copyable) */}
                {note.quick_answer && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium flex items-center gap-1 text-indigo-700">
                        <MessageSquare className="w-3 h-3" />
                        Jawaban Cepat:
                      </span>
                      <button
                        onClick={() => handleCopyAnswer(note)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {copiedId === note.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Respon</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 bg-slate-50/60 p-2 rounded-lg border border-slate-100 font-mono text-[11px] leading-relaxed">
                      {note.quick_answer}
                    </p>
                  </div>
                )}

                {/* To-Do Checklist */}
                {note.todos.length > 0 && (
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-200/50">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>Rincian Tindak Lanjut:</span>
                      <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {completedTodos}/{totalTodos} Selesai
                      </span>
                    </div>
                    <div className="space-y-1">
                      {note.todos.map((todo) => (
                        <button
                          key={todo.id}
                          onClick={() => handleToggleTodo(note.id, todo.id)}
                          className="w-full text-left flex items-start gap-2 p-1.5 rounded-md hover:bg-white/60 transition-colors group/item"
                        >
                          {todo.done ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-slate-600 mt-0.5 shrink-0" />
                          )}
                          <span className={`text-xs ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {todo.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Note Footer */}
              <div className="px-4 py-2.5 bg-white/40 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="font-medium text-slate-700">{note.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{note.created_at}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center">
          <Bookmark className="w-10 h-10 text-slate-400 mb-3" />
          <h3 className="font-semibold text-slate-800 text-base">Belum Ada Catatan yang Sesuai</h3>
          <p className="text-sm text-slate-500 max-w-md mt-1 mb-4">
            Tambahkan catatan sticky internal baru untuk mempermudah pengecekan draf hukum atau komunikasi dengan OPD.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Buat Catatan Sekarang
          </Button>
        </div>
      )}

      {/* Modal: Tambah Sticky Note */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Tambah Sticky Note Baru</span>
            </DialogTitle>
            <DialogDescription>
              Catatan ini terkait langsung dengan permohonan #{caseId.slice(0, 8)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Judul Catatan / Pokok Masalah *</label>
              <Input
                placeholder="Contoh: Koreksi Konsideran Mengingat PP No. 35/2023"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="PERBAIKAN_PASAL">Perbaikan Naskah</option>
                  <option value="DISPOSISI">Disposisi Atasan</option>
                  <option value="JAWABAN_OPD">Jawaban Cepat OPD</option>
                  <option value="PENTING">Urgensi Khusus</option>
                  <option value="GENERAL">Catatan Umum</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">Tinggi</option>
                  <option value="URGENT">Mendesak (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Isi Catatan & Telaahan *</label>
              <Textarea
                placeholder="Tuliskan telaahan pasal, dasar pertimbangan, atau rincian hal yang harus diperbaiki..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">
                Template Respon Cepat (Bisa Disalin Langsung)
              </label>
              <Textarea
                placeholder="Teks resmi yang bisa langsung dicopy untuk dikirimkan ke OPD atau atasan..."
                value={quickAnswer}
                onChange={(e) => setQuickAnswer(e.target.value)}
                rows={2}
                className="text-xs resize-none font-mono"
              />
            </div>

            {/* Checklist Items */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700">Daftar Tugas / Checklist Tindak Lanjut</label>
                <button
                  type="button"
                  onClick={handleAddTodoField}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Baris
                </button>
              </div>
              <div className="space-y-2">
                {todos.map((todo, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Checklist ${idx + 1}...`}
                    value={todo}
                    onChange={(e) => handleTodoChange(idx, e.target.value)}
                    className="text-xs h-8"
                  />
                ))}
              </div>
            </div>

            {/* Warna & Sematkan */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Pilih Warna:</span>
                {(['amber', 'blue', 'emerald', 'rose', 'purple', 'slate'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === c ? 'scale-110 border-slate-900 shadow-sm' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: COLOR_MAP[c].accent }}
                  />
                ))}
              </div>

              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Sematkan di atas</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateNote}
              disabled={!title.trim() || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Simpan Catatan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
