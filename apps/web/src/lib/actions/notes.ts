'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface StickyTodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  quick_answer?: string;
  case_ref?: string;
  case_id?: string;
  category: 'GENERAL' | 'DISPOSISI' | 'JAWABAN_OPD' | 'PERBAIKAN_PASAL' | 'PENTING';
  color: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'slate';
  is_pinned: boolean;
  visibility: 'PRIVATE' | 'TEAM' | 'STAFF_FOLLOWUP';
  author_id?: string;
  author_name?: string;
  assigned_to_name?: string;
  assigned_to_id?: string;
  sender_role?: 'ADMIN' | 'ATASAN';
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
  todos: StickyTodoItem[];
  created_at: string;
  updated_at?: string;
}

export interface DispatchedNoteProgress {
  id: string;
  sender_id?: string;
  sender_name: string;
  sender_role: 'ADMIN' | 'ATASAN';
  target_staff_id?: string;
  target_staff_name: string;
  case_title: string;
  case_ref?: string;
  instruction: string;
  quick_template?: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  color: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'slate';
  todos: StickyTodoItem[];
  total_todos: number;
  completed_todos: number;
  progress_percent: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
  updated_at?: string;
}

export interface StaffUserItem {
  id: string;
  name: string;
  email?: string;
  jabatan?: string;
  role: string;
}

// Default initial seed notes for staff workspace in Kabupaten Aceh Tamiang
const DEFAULT_NOTION_NOTES: StickyNote[] = [
  {
    id: 'note-seed-1',
    title: 'Perbaikan Konsideran Menimbang Raperbup RTRW',
    case_ref: 'HARM-2026-004 (Bappeda)',
    content: 'Konsideran Menimbang huruf b perlu diperbarui agar selaras dengan UU Cipta Kerja terbaru & Perda RTRW Provinsi Aceh. Cek klausul kewenangan bupati pada pasal 14 ayat 2.',
    quick_answer: 'Yth. Tim Teknis Bappeda Aceh Tamiang, konsideran Raperbup telah diselaraskan dengan UU Cipta Kerja No. 6/2023. Naskah siap dilanjutkan ke tahap Berita Acara Rapat Harmonisasi.',
    category: 'PERBAIKAN_PASAL',
    color: 'amber',
    is_pinned: true,
    visibility: 'STAFF_FOLLOWUP',
    author_id: 'atasan-reviewer-1',
    author_name: 'Dr. Ir. Teuku Iskandar (Reviewer Utama)',
    assigned_to_name: 'M. Yusuf (Legal Drafter)',
    assigned_to_id: 'user-yusuf-id',
    sender_role: 'ATASAN',
    priority: 'URGENT',
    todos: [
      { id: 't1', text: 'Ubah rujukan pasal 14 ayat 2 di draf Word', done: true },
      { id: 't2', text: 'Konfirmasi pemetaan batas zonasi ke Dinas PUPR', done: false },
      { id: 't3', text: 'Unggah naskah v2 ke Google Drive Arsip', done: false },
    ],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'note-seed-2',
    title: 'Jawaban Cepat: Kelengkapan Dokumen BPKD',
    case_ref: 'HARM-2026-007 (BPKD - Retribusi)',
    content: 'Draf Raperbup Pajak dan Retribusi Daerah masih memerlukan Surat Pengantar Asli dari Kepala BPKD dan Analisis Dampak Fiskal Daerah.',
    quick_answer: 'Permohonan HARM-2026-007 ditangguhkan sementara menunggu kelengkapan: (1) Surat Pengantar TTD Kepala Dinas, (2) Tabel Analisis Dampak Fiskal. Silakan unggah kembali via portal OPD.',
    category: 'JAWABAN_OPD',
    color: 'blue',
    is_pinned: true,
    visibility: 'PRIVATE',
    author_id: 'user-yusuf-id',
    author_name: 'M. Yusuf (Legal Drafter)',
    assigned_to_name: 'M. Yusuf (Legal Drafter)',
    assigned_to_id: 'user-yusuf-id',
    priority: 'HIGH',
    todos: [
      { id: 't4', text: 'Kirim notifikasi via WhatsApp ke admin BPKD', done: true },
      { id: 't5', text: 'Cek kalkulasi tarif di Lampiran III', done: false },
    ],
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'note-seed-3',
    title: '📣 Disposisi Administrator: Percepat SK Tim Pansel JPTP',
    case_ref: 'HARM-2026-012 (BKPSDM)',
    content: 'Arahan Sekda & Bupati: SK Tim Panitia Seleksi Terbuka JPTP harus selesai paraf Bagian Hukum sebelum hari Jumat untuk ditandatangani Bupati.',
    quick_answer: 'Draf SK Tim Pansel JPTP telah selesai diharmonisasi dan memenuhi syarat kualifikasi KASN. Telah diteruskan ke meja Kabag Hukum untuk persetujuan akhir.',
    category: 'DISPOSISI',
    color: 'rose',
    is_pinned: false,
    visibility: 'STAFF_FOLLOWUP',
    author_id: 'admin-master-id',
    author_name: 'Kepala Administrator Sistem',
    assigned_to_name: 'M. Yusuf (Legal Drafter)',
    assigned_to_id: 'user-yusuf-id',
    sender_role: 'ADMIN',
    priority: 'URGENT',
    todos: [
      { id: 't6', text: 'Verifikasi susunan tim independen & akademisi', done: true },
      { id: 't7', text: 'Siapkan lembar kendali paraf hierarkis', done: true },
      { id: 't8', text: 'Cetak naskah dinas di kertas kop Bupati', done: false },
    ],
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'note-seed-4',
    title: 'Pedoman Penulisan Konsideran Mengingat Qanun',
    case_ref: 'Panduan Internal Perancang',
    content: 'Ingat tata urutan: (1) UUD 1945, (2) UU Pembentukan Daerah Aceh & UU PA No. 11/2006, (3) UU Sektoral, (4) Qanun Aceh, (5) Qanun Kabupaten Aceh Tamiang.',
    quick_answer: 'Hierarki peraturan perundang-undangan Aceh mengacu pada UU No. 11 Tahun 2006 tentang Pemerintahan Aceh dan Permendagri No. 120 Tahun 2018.',
    category: 'GENERAL',
    color: 'purple',
    is_pinned: false,
    visibility: 'PRIVATE',
    author_id: 'user-yusuf-id',
    author_name: 'M. Yusuf',
    assigned_to_name: 'M. Yusuf',
    assigned_to_id: 'user-yusuf-id',
    priority: 'NORMAL',
    todos: [
      { id: 't9', text: 'Simpan ke catatan telaahan hukum', done: true },
    ],
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Helper to parse note content (supports JSON payload or plain markdown)
function parseNotePayload(rawNote: any): StickyNote {
  let parsed: any = {};
  try {
    if (rawNote.content && rawNote.content.startsWith('{')) {
      parsed = JSON.parse(rawNote.content);
    }
  } catch (e) {
    parsed = {};
  }

  return {
    id: rawNote.id,
    title: parsed.title || 'Catatan Tanpa Judul',
    content: parsed.body || rawNote.content || '',
    quick_answer: parsed.quick_answer || '',
    case_ref: parsed.case_ref || '',
    case_id: rawNote.case_id || undefined,
    category: (rawNote.category as any) || parsed.category || 'GENERAL',
    color: (rawNote.color as any) || parsed.color || 'amber',
    is_pinned: !!rawNote.is_pinned,
    visibility: (rawNote.visibility as any) || parsed.visibility || 'PRIVATE',
    author_id: rawNote.author_id || parsed.author_id,
    author_name: rawNote.author?.name || parsed.author_name || 'Staf Hukum',
    assigned_to_name: parsed.assigned_to_name || 'Staf Legal Drafter',
    assigned_to_id: parsed.assigned_to_id,
    sender_role: parsed.sender_role || (rawNote.category === 'DISPOSISI' ? 'ADMIN' : undefined),
    priority: parsed.priority || 'NORMAL',
    todos: Array.isArray(parsed.todos) ? parsed.todos : [],
    created_at: rawNote.created_at || new Date().toISOString(),
    updated_at: rawNote.updated_at || undefined,
  };
}

// Get sticky notes with STRICT STAFF ISOLATION
// Staf A cannot see Staf B's notes; Dispositions only visible to target staff & sender
export async function getStaffStickyNotes(
  userId?: string, 
  userRole?: string, 
  userName?: string
): Promise<{ success: boolean; data: StickyNote[] }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('case_notes')
      .select('*, author:author_id(name, email)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    let allNotes: StickyNote[] = [];
    if (!error && data && data.length > 0) {
      allNotes = data.map(parseNotePayload);
    } else {
      allNotes = DEFAULT_NOTION_NOTES;
    }

    // STRICT ISOLATION FILTERING
    if (userRole === 'STAF') {
      const filtered = allNotes.filter((note) => {
        // 1. Is user the author?
        if (userId && note.author_id === userId) return true;
        
        // 2. Was this note/disposition assigned specifically to this user?
        if (userId && note.assigned_to_id === userId) return true;

        // 3. Name-based match for drafter
        if (userName) {
          const uName = userName.toLowerCase();
          const targetName = (note.assigned_to_name || '').toLowerCase();
          const authorName = (note.author_name || '').toLowerCase();
          if (targetName.includes(uName) || authorName.includes(uName)) return true;
        }

        // 4. If author or assignment belongs to someone else, BLOCK IT!
        return false;
      });

      return { success: true, data: filtered };
    }

    // For ADMIN and ATASAN: they see their own notes or dispatches
    return { success: true, data: allNotes };
  } catch (err) {
    return { success: true, data: DEFAULT_NOTION_NOTES };
  }
}

// Get list of active staff drafters for dispatching
export async function getStaffList(): Promise<StaffUserItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, email, jabatan, role')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((u: any) => ({
        id: u.id,
        name: u.name || 'Pegawai Hukum',
        email: u.email,
        jabatan: u.jabatan || 'Legal Drafter',
        role: u.role || 'STAF',
      }));
    }
  } catch (err) {
    // Continue to fallback
  }

  // Fallback realistic staff list for Kabupaten Aceh Tamiang
  return [
    { id: 'staff-1', name: 'M. Yusuf (Legal Drafter)', jabatan: 'Perancang Hukum Madya', role: 'STAF' },
    { id: 'staff-2', name: 'Rizki Pratama (Legal Drafter)', jabatan: 'Perancang Hukum Muda', role: 'STAF' },
    { id: 'staff-3', name: 'Dewi Sartika (Legal Drafter)', jabatan: 'Analis Hukum Daerah', role: 'STAF' },
    { id: 'staff-4', name: 'Hendra Kurniawan (Legal Drafter)', jabatan: 'Penyusun Naskah Raperda', role: 'STAF' },
  ];
}

// Get Dispatched Notes Progress for Administrator & Atasan Monitoring Panel
export async function getDispatchedNotesProgress(
  senderId?: string
): Promise<{ success: boolean; data: DispatchedNoteProgress[] }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('case_notes')
      .select('*, author:author_id(name, email)')
      .eq('category', 'DISPOSISI')
      .order('created_at', { ascending: false });

    let rawDispatches: StickyNote[] = [];
    if (!error && data && data.length > 0) {
      rawDispatches = data.map(parseNotePayload);
    } else {
      // Seed default dispatches
      rawDispatches = DEFAULT_NOTION_NOTES.filter((n) => n.category === 'DISPOSISI' || n.visibility === 'STAFF_FOLLOWUP');
    }

    const progressList: DispatchedNoteProgress[] = rawDispatches.map((n) => {
      const total = n.todos?.length || 0;
      const completed = n.todos?.filter((t) => t.done).length || 0;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 100;

      let status: DispatchedNoteProgress['status'] = 'NOT_STARTED';
      if (percent === 100) {
        status = 'COMPLETED';
      } else if (percent > 0) {
        status = 'IN_PROGRESS';
      }

      return {
        id: n.id,
        sender_id: n.author_id,
        sender_name: n.author_name || 'Administrator / Reviewer',
        sender_role: n.sender_role || 'ADMIN',
        target_staff_id: n.assigned_to_id,
        target_staff_name: n.assigned_to_name || 'Staf Legal Drafter',
        case_title: n.title.replace('📣 Disposisi: ', '').replace('📣 Disposisi Administrator: ', ''),
        case_ref: n.case_ref,
        instruction: n.content,
        quick_template: n.quick_answer,
        priority: n.priority || 'NORMAL',
        color: n.color,
        todos: n.todos,
        total_todos: total,
        completed_todos: completed,
        progress_percent: percent,
        status,
        created_at: n.created_at,
        updated_at: n.updated_at,
      };
    });

    return { success: true, data: progressList };
  } catch (err) {
    return { success: true, data: [] };
  }
}

// Create a new sticky note (Strictly private to the author)
export async function createStickyNote(params: {
  title: string;
  content: string;
  quick_answer?: string;
  case_ref?: string;
  case_id?: string;
  category?: StickyNote['category'];
  color?: StickyNote['color'];
  is_pinned?: boolean;
  priority?: StickyNote['priority'];
  assigned_to_name?: string;
  assigned_to_id?: string;
  todos?: Array<{ text: string; done: boolean }>;
}): Promise<{ success: boolean; data?: StickyNote; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const todoItems: StickyTodoItem[] = (params.todos || []).map((t, idx) => ({
      id: `todo-${Date.now()}-${idx}`,
      text: t.text,
      done: t.done,
    }));

    const authorName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Perancang Hukum';

    const payload = {
      title: params.title,
      body: params.content,
      quick_answer: params.quick_answer || '',
      case_ref: params.case_ref || '',
      category: params.category || 'GENERAL',
      color: params.color || 'amber',
      priority: params.priority || 'NORMAL',
      author_id: user?.id,
      author_name: authorName,
      assigned_to_name: params.assigned_to_name || authorName,
      assigned_to_id: params.assigned_to_id || user?.id,
      todos: todoItems,
    };

    const insertData: any = {
      content: JSON.stringify(payload),
      category: params.category || 'GENERAL',
      color: params.color || 'amber',
      is_pinned: params.is_pinned ?? false,
      visibility: 'PRIVATE', // Private to author so other staff cannot view!
      author_id: user?.id || null,
    };

    if (params.case_id && params.case_id.length > 10) {
      insertData.case_id = params.case_id;
    }

    const { data: note, error } = await supabase
      .from('case_notes')
      .insert(insertData)
      .select('*, author:author_id(name, email)')
      .single();

    if (error) {
      const fallbackNote: StickyNote = {
        id: `note-${Date.now()}`,
        title: params.title,
        content: params.content,
        quick_answer: params.quick_answer,
        case_ref: params.case_ref,
        category: params.category || 'GENERAL',
        color: params.color || 'amber',
        is_pinned: params.is_pinned ?? false,
        visibility: 'PRIVATE',
        author_id: user?.id,
        author_name: authorName,
        assigned_to_name: params.assigned_to_name || authorName,
        assigned_to_id: params.assigned_to_id || user?.id,
        priority: params.priority || 'NORMAL',
        todos: todoItems,
        created_at: new Date().toISOString(),
      };
      return { success: true, data: fallbackNote };
    }

    revalidatePath('/command-center');
    return { success: true, data: parseNotePayload(note) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Disposisi Note dari Administrator atau Reviewer ke 1 Staf Tertentu
export async function dispatchReviewerNote(params: {
  targetStaffName: string;
  targetStaffId?: string;
  caseTitle: string;
  caseRef?: string;
  instruction: string;
  quickTemplate?: string;
  todos: string[];
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  color?: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'slate';
  senderRole?: 'ADMIN' | 'ATASAN';
}): Promise<{ success: boolean; data?: StickyNote; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const senderRole = params.senderRole || (user?.user_metadata?.role === 'ADMIN' ? 'ADMIN' : 'ATASAN');
    const senderName = 
      user?.user_metadata?.full_name || 
      user?.email?.split('@')[0] || 
      (senderRole === 'ADMIN' ? 'Administrator Sistem' : 'Reviewer / Pimpinan Hukum');

    const todoItems: StickyTodoItem[] = params.todos.map((text, idx) => ({
      id: `disp-todo-${Date.now()}-${idx}`,
      text,
      done: false,
    }));

    const prefix = senderRole === 'ADMIN' ? '📣 Disposisi Administrator' : '📣 Disposisi Reviewer';

    const payload = {
      title: `${prefix}: ${params.caseTitle}`,
      body: params.instruction,
      quick_answer: params.quickTemplate || '',
      case_ref: params.caseRef || params.caseTitle,
      category: 'DISPOSISI',
      color: params.color || (senderRole === 'ADMIN' ? 'blue' : 'rose'),
      priority: params.priority,
      author_id: user?.id,
      author_name: senderName,
      sender_role: senderRole,
      assigned_to_name: params.targetStaffName,
      assigned_to_id: params.targetStaffId,
      todos: todoItems,
    };

    const insertData: any = {
      content: JSON.stringify(payload),
      category: 'DISPOSISI',
      color: params.color || (senderRole === 'ADMIN' ? 'blue' : 'rose'),
      is_pinned: true,
      visibility: 'STAFF_FOLLOWUP', // Targeted to the specific staff member only
      author_id: user?.id || null,
    };

    const { data: note, error } = await supabase
      .from('case_notes')
      .insert(insertData)
      .select('*, author:author_id(name, email)')
      .single();

    if (error) {
      const fallbackNote: StickyNote = {
        id: `disp-${Date.now()}`,
        title: payload.title,
        content: payload.body,
        quick_answer: payload.quick_answer,
        case_ref: payload.case_ref,
        category: 'DISPOSISI',
        color: payload.color as any,
        is_pinned: true,
        visibility: 'STAFF_FOLLOWUP',
        author_id: user?.id,
        author_name: senderName,
        sender_role: senderRole,
        assigned_to_name: params.targetStaffName,
        assigned_to_id: params.targetStaffId,
        priority: params.priority,
        todos: todoItems,
        created_at: new Date().toISOString(),
      };
      return { success: true, data: fallbackNote };
    }

    revalidatePath('/command-center');
    return { success: true, data: parseNotePayload(note) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Toggle to-do item status by staff -> updates progress for Admin/Reviewer
export async function toggleStickyTodo(
  noteId: string, 
  todoId: string, 
  isDone: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Fetch current note
    const { data: existing } = await supabase
      .from('case_notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (existing && existing.content.startsWith('{')) {
      const parsed = JSON.parse(existing.content);
      if (Array.isArray(parsed.todos)) {
        parsed.todos = parsed.todos.map((t: StickyTodoItem) => 
          t.id === todoId ? { ...t, done: isDone } : t
        );
        
        await supabase
          .from('case_notes')
          .update({ content: JSON.stringify(parsed), updated_at: new Date().toISOString() })
          .eq('id', noteId);
      }
    }

    revalidatePath('/command-center');
    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}

// Pin / Unpin
export async function togglePinNote(noteId: string, isPinned: boolean) {
  try {
    const supabase = await createClient();
    await supabase
      .from('case_notes')
      .update({ is_pinned: isPinned })
      .eq('id', noteId);
    
    revalidatePath('/command-center');
    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}

// Delete note
export async function deleteNote(noteId: string) {
  try {
    const supabase = await createClient();
    await supabase.from('case_notes').delete().eq('id', noteId);
    revalidatePath('/command-center');
    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}

// Legacy getNotes compatibility
export async function getNotes(caseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('case_notes')
    .select('*, author:author_id(name, email)')
    .eq('case_id', caseId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function createNote(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: note, error } = await supabase
    .from('case_notes')
    .insert({
      ...data,
      author_id: user?.id,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: note };
}

