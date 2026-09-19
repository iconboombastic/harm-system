'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Clock, 
  Calendar, 
  User, 
  AlertTriangle, 
  Trash2, 
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  done: boolean;
  dueDate: string;
  category: string;
}

export default function CaseTasksClient({
  caseId,
  caseTitle = 'Rancangan Produk Hukum',
}: {
  caseId: string;
  caseTitle?: string;
}) {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'tsk-1',
      title: 'Ubah rujukan konsideran Mengingat ke UU No. 1/2022 (HKPD) & PP 35/2023',
      assignee: 'M. Yusuf (Legal Drafter)',
      priority: 'URGENT',
      done: true,
      dueDate: 'Kemarin',
      category: 'Legal Drafting',
    },
    {
      id: 'tsk-2',
      title: 'Klarifikasi klausul tarif retribusi zonasi pasar ke BPKD & Dinas Perindagkop',
      assignee: 'Rizki Pratama (Legal Drafter)',
      priority: 'HIGH',
      done: false,
      dueDate: 'Besok, 16:00 WIB',
      category: 'Koordinasi Teknis',
    },
    {
      id: 'tsk-3',
      title: 'Unggah naskah bersih hasil harmonisasi v2 ke Google Drive Arsip',
      assignee: 'M. Yusuf (Legal Drafter)',
      priority: 'NORMAL',
      done: false,
      dueDate: '20 Sep 2026',
      category: 'Arsip & Berkas',
    },
    {
      id: 'tsk-4',
      title: 'Cetak dan siapkan lembar kendali paraf hierarkis untuk Kabag Hukum',
      assignee: 'Staf Administrasi',
      priority: 'HIGH',
      done: false,
      dueDate: '21 Sep 2026',
      category: 'Tata Usaha',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('M. Yusuf (Legal Drafter)');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('HIGH');
  const [newDueDate, setNewDueDate] = useState('3 hari lagi');

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title: newTitle.trim(),
      assignee: newAssignee,
      priority: newPriority,
      done: false,
      dueDate: newDueDate,
      category: 'Tindak Lanjut',
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsAddOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'PENDING') return !t.done;
    if (filter === 'DONE') return t.done;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Manajemen Tugas & To-Do Perkara</h2>
          </div>
          <p className="text-xs text-slate-500">
            Daftar butir penugasan yang wajib diselesaikan oleh tim drafter hukum untuk perkara ini.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Badge className="bg-blue-100 text-blue-800 text-xs font-bold border-none px-2.5 py-1">
            {completedCount}/{tasks.length} Selesai
          </Badge>

          <Button
            onClick={() => setIsAddOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Tugas Baru</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'PENDING'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Belum Selesai ({tasks.length - completedCount})
        </button>
        <button
          onClick={() => setFilter('DONE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'DONE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sudah Selesai ({completedCount})
        </button>
      </div>

      {/* Task Cards List */}
      <div className="grid gap-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl border transition flex items-start gap-3 ${
              t.done
                ? 'bg-slate-50/70 border-slate-200 opacity-75'
                : 'bg-white border-slate-200 shadow-2xs hover:border-blue-300'
            }`}
          >
            <button
              onClick={() => toggleTask(t.id)}
              className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 transition"
              title={t.done ? 'Tandai belum selesai' : 'Tandai selesai'}
            >
              {t.done ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`text-xs sm:text-sm font-semibold leading-snug ${
                    t.done ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {t.title}
                </h4>

                <div className="flex items-center gap-1.5 shrink-0">
                  {t.priority === 'URGENT' ? (
                    <Badge className="bg-red-100 text-red-800 border-none text-[10px] font-bold">
                      Mendesak
                    </Badge>
                  ) : t.priority === 'HIGH' ? (
                    <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] font-bold">
                      Prioritas
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-slate-500">
                      Biasa
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.assignee}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tenggat: {t.dueDate}</span>
                </span>
                <span>•</span>
                <span className="text-blue-600 font-medium">{t.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Tambah Tugas Baru untuk Perkara Ini</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tugas ini akan tercatat pada lembar kendali perkara dan tersinkronisasi ke meja kerja staf.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddTask} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Deskripsi Tugas *</label>
              <Input
                placeholder="Contoh: Konfirmasi klausul retribusi pasar ke Dinas PUPR..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Pelaksana (PIC)</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M. Yusuf (Legal Drafter)">M. Yusuf (Legal Drafter)</option>
                  <option value="Rizki Pratama (Legal Drafter)">Rizki Pratama (Legal Drafter)</option>
                  <option value="Dewi Sartika (Legal Drafter)">Dewi Sartika (Legal Drafter)</option>
                  <option value="Staf Administrasi">Staf Administrasi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Urgensi</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="URGENT">Mendesak</option>
                  <option value="HIGH">Prioritas Tinggi</option>
                  <option value="NORMAL">Biasa</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Tenggat Waktu</label>
              <Input
                placeholder="Contoh: Besok, 16:00 WIB"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                Simpan Tugas
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
