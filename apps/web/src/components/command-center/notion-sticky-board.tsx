'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pin, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  Clock, 
  User, 
  MessageSquare, 
  Tag, 
  Share2, 
  Send,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { 
  StickyNote, 
  StickyTodoItem, 
  createStickyNote, 
  deleteNote, 
  togglePinNote, 
  toggleStickyTodo 
} from '@/lib/actions/notes';

const COLOR_MAP = {
  amber: {
    bg: 'bg-amber-50/95',
    border: 'border-amber-200/90',
    header: 'bg-amber-100/60 text-amber-900',
    badge: 'bg-amber-200/70 text-amber-900 border-amber-300/60',
    ring: 'focus-visible:ring-amber-400',
    accent: '#f59e0b',
  },
  blue: {
    bg: 'bg-blue-50/95',
    border: 'border-blue-200/90',
    header: 'bg-blue-100/60 text-blue-900',
    badge: 'bg-blue-200/70 text-blue-900 border-blue-300/60',
    ring: 'focus-visible:ring-blue-400',
    accent: '#3b82f6',
  },
  emerald: {
    bg: 'bg-emerald-50/95',
    border: 'border-emerald-200/90',
    header: 'bg-emerald-100/60 text-emerald-900',
    badge: 'bg-emerald-200/70 text-emerald-900 border-emerald-300/60',
    ring: 'focus-visible:ring-emerald-400',
    accent: '#10b981',
  },
  rose: {
    bg: 'bg-rose-50/95',
    border: 'border-rose-200/90',
    header: 'bg-rose-100/60 text-rose-900',
    badge: 'bg-rose-200/70 text-rose-900 border-rose-300/60',
    ring: 'focus-visible:ring-rose-400',
    accent: '#f43f5e',
  },
  purple: {
    bg: 'bg-purple-50/95',
    border: 'border-purple-200/90',
    header: 'bg-purple-100/60 text-purple-900',
    badge: 'bg-purple-200/70 text-purple-900 border-purple-300/60',
    ring: 'focus-visible:ring-purple-400',
    accent: '#8b5cf6',
  },
  slate: {
    bg: 'bg-slate-50/95',
    border: 'border-slate-200/90',
    header: 'bg-slate-100/60 text-slate-900',
    badge: 'bg-slate-200/70 text-slate-900 border-slate-300/60',
    ring: 'focus-visible:ring-slate-400',
    accent: '#64748b',
  },
};

const CATEGORY_LABELS: Record<string, { label: string; icon: any }> = {
  GENERAL: { label: 'Catatan Umum', icon: FileText },
  DISPOSISI: { label: 'Disposisi Reviewer', icon: Send },
  JAWABAN_OPD: { label: 'Jawaban OPD', icon: MessageSquare },
  PERBAIKAN_PASAL: { label: 'Perbaikan Naskah', icon: Tag },
  PENTING: { label: 'Urgensi Tinggi', icon: AlertCircle },
};

interface NotionStickyBoardProps {
  initialNotes?: StickyNote[];
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
  };
}

export default function NotionStickyBoard({ initialNotes = [], currentUser }: NotionStickyBoardProps) {
  const [notes, setNotes] = useState<StickyNote[]>(initialNotes);
  const [filter, setFilter] = useState<'all' | 'pinned' | 'disposisi' | 'jawaban' | 'todo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCaseRef, setNewCaseRef] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newQuickAnswer, setNewQuickAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<StickyNote['category']>('PERBAIKAN_PASAL');
  const [newColor, setNewColor] = useState<StickyNote['color']>('amber');
  const [newPriority, setNewPriority] = useState<StickyNote['priority']>('NORMAL');
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newTodos, setNewTodos] = useState<string[]>(['']);

  // Sync with local storage on client side with strict peer isolation
  useEffect(() => {
    try {
      const storageKey = currentUser?.id ? `harm_notion_sticky_notes_${currentUser.id}` : 'harm_notion_sticky_notes';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
          return;
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [currentUser?.id]);

  const saveToStorage = (updated: StickyNote[]) => {
    setNotes(updated);
    try {
      const storageKey = currentUser?.id ? `harm_notion_sticky_notes_${currentUser.id}` : 'harm_notion_sticky_notes';
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

  // Copy quick answer to clipboard
  const handleCopyAnswer = (note: StickyNote) => {
    const textToCopy = note.quick_answer || note.content;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Toggle pin
  const handleTogglePin = async (noteId: string, currentPin: boolean) => {
    const updated = notes.map((n) => (n.id === noteId ? { ...n, is_pinned: !currentPin } : n));
    saveToStorage(updated);
    await togglePinNote(noteId, !currentPin);
  };

  // Toggle todo item
  const handleToggleTodo = async (noteId: string, todoId: string, currentDone: boolean) => {
    const updated = notes.map((note) => {
      if (note.id !== noteId) return note;
      return {
        ...note,
        todos: note.todos.map((t) => (t.id === todoId ? { ...t, done: !currentDone } : t)),
      };
    });
    saveToStorage(updated);
    await toggleStickyTodo(noteId, todoId, !currentDone);
  };

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    saveToStorage(updated);
    await deleteNote(noteId);
  };

  // Create new note
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) return;

    const validTodos = newTodos.filter((t) => t.trim().length > 0).map((t) => ({ text: t, done: false }));

    const res = await createStickyNote({
      title: newTitle.trim() || 'Catatan Baru',
      content: newContent.trim(),
      quick_answer: newQuickAnswer.trim(),
      case_ref: newCaseRef.trim(),
      category: newCategory,
      color: newColor,
      priority: newPriority,
      is_pinned: newIsPinned,
      assigned_to_name: currentUser?.name || 'Staf Hukum',
      assigned_to_id: currentUser?.id,
      todos: validTodos,
    });

    if (res.success && res.data) {
      const updated = [res.data, ...notes];
      saveToStorage(updated);
    }

    // Reset Form
    setNewTitle('');
    setNewCaseRef('');
    setNewContent('');
    setNewQuickAnswer('');
    setNewTodos(['']);
    setNewCategory('PERBAIKAN_PASAL');
    setNewColor('amber');
    setNewPriority('NORMAL');
    setNewIsPinned(false);
    setIsCreateOpen(false);
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    // Category tabs filter
    if (filter === 'pinned' && !note.is_pinned) return false;
    if (filter === 'disposisi' && note.category !== 'DISPOSISI') return false;
    if (filter === 'jawaban' && !note.quick_answer) return false;
    if (filter === 'todo' && (!note.todos || note.todos.every((t) => t.done))) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchRef = note.case_ref?.toLowerCase().includes(q);
      const matchAns = note.quick_answer?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchRef || matchAns;
    }

    return true;
  });

  // Calculate counts for badges
  const pinnedCount = notes.filter((n) => n.is_pinned).length;
  const disposisiCount = notes.filter((n) => n.category === 'DISPOSISI').length;
  const jawabanCount = notes.filter((n) => !!n.quick_answer).length;
  const pendingTodoCount = notes.filter((n) => n.todos && n.todos.some((t) => !t.done)).length;

  return (
    <div className="space-y-4">
      {/* Notion Sticky Board Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Papan Catatan & Pelacakan Dokumen (Notion Sticky Notes)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Kelola to-do perbaikan naskah, terima disposisi tindak lanjut dari atasan, dan gunakan template jawaban cepat untuk OPD.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Sticky Note</span>
            </Button>
          </div>
        </div>

        {/* Filter Navigation and Instant Search */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Semua</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {notes.length}
              </span>
            </button>

            <button
              onClick={() => setFilter('pinned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'pinned'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <Pin className="w-3 h-3 fill-current" />
              <span>Disematkan</span>
              {pinnedCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                  {pinnedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter('disposisi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'disposisi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>📣 Disposisi Reviewer</span>
              {disposisiCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                  {disposisiCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter('jawaban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'jawaban'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Jawaban OPD</span>
              {jawabanCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                  {jawabanCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter('todo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'todo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>To-Do Belum Selesai</span>
              {pendingTodoCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                  {pendingTodoCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <Input
              type="text"
              placeholder="Cari kata kunci / nomor perkara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 h-8.5 text-xs bg-slate-50 border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Notion Sticky Cards Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada sticky note pada filter ini</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Klik tombol "+ Buat Sticky Note" di atas untuk menambahkan catatan perkara baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
          {filteredNotes.map((note) => {
            const style = COLOR_MAP[note.color || 'amber'] || COLOR_MAP.amber;
            const CategoryIcon = CATEGORY_LABELS[note.category]?.icon || FileText;
            const categoryLabel = CATEGORY_LABELS[note.category]?.label || note.category;
            const completedTodos = note.todos?.filter((t) => t.done).length || 0;
            const totalTodos = note.todos?.length || 0;

            return (
              <div
                key={note.id}
                className={`rounded-xl border ${style.border} ${style.bg} p-4.5 shadow-xs flex flex-col justify-between transition hover:shadow-md relative group`}
              >
                {/* Note Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge className={`text-[10px] font-semibold ${style.badge} border py-0 px-2 flex items-center gap-1`}>
                        <CategoryIcon className="w-3 h-3" />
                        <span>{categoryLabel}</span>
                      </Badge>
                      {note.category === 'DISPOSISI' ? (
                        <Badge className="text-[10px] bg-rose-200/80 text-rose-900 border border-rose-300/60 py-0 px-1.5 flex items-center gap-1 font-semibold">
                          <Send className="w-2.5 h-2.5 text-rose-700" />
                          <span>Disposisi Khusus</span>
                        </Badge>
                      ) : (
                        <Badge className="text-[10px] bg-black/5 text-slate-700 border border-black/10 py-0 px-1.5 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-slate-500" />
                          <span>Privat Saya</span>
                        </Badge>
                      )}
                      {note.priority === 'URGENT' && (
                        <Badge className="text-[10px] bg-red-500 text-white border-none py-0 px-1.5 animate-pulse">
                          Mendesak
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleTogglePin(note.id, note.is_pinned)}
                        title={note.is_pinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
                        className={`p-1.5 rounded-md transition ${
                          note.is_pinned
                            ? 'text-amber-700 bg-amber-200/60'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-black/5'
                        }`}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.is_pinned ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        title="Hapus Catatan"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Case / Document Tag */}
                  {note.case_ref && (
                    <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/5 text-[11px] font-medium text-slate-700">
                      <FileText className="w-3 h-3 text-slate-500" />
                      <span className="truncate max-w-[240px]">{note.case_ref}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-2">
                    {note.title}
                  </h4>

                  {/* Body Content */}
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                    {note.content}
                  </p>

                  {/* Interactive To-Do Checklist */}
                  {note.todos && note.todos.length > 0 && (
                    <div className="my-3 pt-2.5 border-t border-black/5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Checklist Pelacakan:</span>
                        <span>
                          {completedTodos}/{totalTodos} selesai
                        </span>
                      </div>
                      {note.todos.map((todo) => (
                        <div
                          key={todo.id}
                          onClick={() => handleToggleTodo(note.id, todo.id, todo.done)}
                          className="flex items-start gap-2 text-xs cursor-pointer group/item py-0.5"
                        >
                          {todo.done ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`leading-tight transition ${
                              todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {todo.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Copy Answer Box (Notion-style Callout) */}
                  {note.quick_answer && (
                    <div className="my-3 p-3 rounded-lg bg-white/80 border border-black/5 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-blue-600" />
                          <span>Format Jawaban Cepat (OPD / Chat)</span>
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyAnswer(note)}
                          className="h-6 px-2 text-[11px] text-blue-700 hover:text-blue-900 hover:bg-blue-50 flex items-center gap-1 font-semibold"
                        >
                          {copiedId === note.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin Jawaban</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-700 italic bg-slate-50/70 p-2 rounded border border-slate-100">
                        "{note.quick_answer}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                    <User className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="truncate">{note.author_name || 'Staf Hukum'}</span>
                  </div>
                  {note.category === 'DISPOSISI' && note.assigned_to_name && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-medium">
                      Ke: {note.assigned_to_name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog: Buat Sticky Note Baru */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Buat Sticky Note Interaktif ala Notion</span>
            </DialogTitle>
            <DialogDescription>
              Simpan catatan telaahan, to-do checklist naskah, atau draf template jawaban pertanyaan OPD.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNote} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Judul Catatan *</label>
              <Input
                placeholder="Contoh: Perbaikan Pasal 14 Raperbup RTRW"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nomor / Judul Dokumen Terkait</label>
                <Input
                  placeholder="Contoh: HARM-2026-004 (Bappeda)"
                  value={newCaseRef}
                  onChange={(e) => setNewCaseRef(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Kategori Catatan</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="PERBAIKAN_PASAL">Perbaikan Naskah / Pasal</option>
                  <option value="JAWABAN_OPD">Template Jawaban Pertanyaan OPD</option>
                  <option value="DISPOSISI">Disposisi Tindak Lanjut</option>
                  <option value="GENERAL">Catatan Umum Legal Drafter</option>
                  <option value="PENTING">Urgensi Khusus</option>
                </select>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Pilihan Warna Pastel</label>
              <div className="flex items-center gap-3">
                {(['amber', 'blue', 'emerald', 'rose', 'purple', 'slate'] as const).map((colorKey) => (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setNewColor(colorKey)}
                    className={`w-7 h-7 rounded-full transition border-2 ${
                      newColor === colorKey ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'border-black/10'
                    }`}
                    style={{ backgroundColor: COLOR_MAP[colorKey].accent }}
                  />
                ))}
              </div>
            </div>

            {/* Note Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Isi Catatan / Instruksi</label>
              <Textarea
                placeholder="Tuliskan detail catatan telaahan, kelemahan naskah yang perlu diuji, atau konsideran yang harus diperbaiki..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            {/* Quick Answer Template */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Format Jawaban Cepat (Bila Ada Pertanyaan dari OPD)
                </label>
                <span className="text-[10px] text-slate-400">1-Klik Salin ke Clipboard</span>
              </div>
              <Textarea
                placeholder="Contoh: Yth. BPKD, draf naskah telah disesuaikan dengan PMK No. 70/2023. Silakan cek lembar Berita Acara."
                value={newQuickAnswer}
                onChange={(e) => setNewQuickAnswer(e.target.value)}
                rows={2}
                className="text-xs resize-none bg-blue-50/40 border-blue-200"
              />
            </div>

            {/* Dynamic Todo Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Checklist To-Do Pelacakan</label>
                <button
                  type="button"
                  onClick={() => setNewTodos([...newTodos, ''])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Butir
                </button>
              </div>

              {newTodos.map((todo, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <Input
                    placeholder={`Tugas perbaikan ${idx + 1}...`}
                    value={todo}
                    onChange={(e) => {
                      const updated = [...newTodos];
                      updated[idx] = e.target.value;
                      setNewTodos(updated);
                    }}
                    className="text-xs h-8"
                  />
                  {newTodos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setNewTodos(newTodos.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pin Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPinned"
                checked={newIsPinned}
                onChange={(e) => setNewIsPinned(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="isPinned" className="text-xs text-slate-700 cursor-pointer">
                Sematkan catatan ini di posisi paling atas (Pin to Top)
              </label>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                Simpan ke Papan Sticky Notes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
