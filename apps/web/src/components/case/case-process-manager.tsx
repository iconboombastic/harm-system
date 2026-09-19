'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  RotateCcw, 
  Trash2, 
  CheckSquare, 
  Square,
  Building2,
  Sparkles,
  BookOpen
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

export interface WorkflowStageItem {
  id: string;
  name: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  pic: string;
  isCustom?: boolean;
  completedAt?: string;
}

export interface SupportingDocumentItem {
  id: string;
  name: string;
  category: 'QANUN_PAYUNG' | 'NASKAH_AKADEMIK' | 'SURAT_PENGANTAR' | 'BERITA_ACARA' | 'LAINNYA';
  isRequired: boolean;
  isFulfilled: boolean;
  notes?: string;
  uploadedFileName?: string;
}

interface CaseProcessManagerProps {
  caseId: string;
  caseTitle?: string;
  harmNumber?: string;
  currentUserRole?: string;
}

export default function CaseProcessManager({
  caseId,
  caseTitle = 'Rancangan Produk Hukum',
  harmNumber = 'HARM-2026-004',
  currentUserRole = 'ADMIN',
}: CaseProcessManagerProps) {
  const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'ATASAN';

  // 1. Stages State
  const [stages, setStages] = useState<WorkflowStageItem[]>([
    {
      id: 'stg-1',
      name: 'Penerimaan & Intake Berkas OPD',
      description: 'Pemeriksaan awal kelengkapan surat permohonan dan berkas draf dari OPD pemohon.',
      status: 'COMPLETED',
      pic: 'Front Office Intake',
      completedAt: '12 Sep 2026',
    },
    {
      id: 'stg-2',
      name: 'Pemeriksaan Formalitas & Dokumen Pendukung',
      description: 'Validasi kelengkapan dokumen pendukung (Qanun Payung, Naskah Akademik, dan SPTJM).',
      status: 'COMPLETED',
      pic: 'Analis Hukum Muda',
      completedAt: '14 Sep 2026',
    },
    {
      id: 'stg-3',
      name: 'Harmonisasi & Analisis Substansi Hukum',
      description: 'Uji materiil pasal, keselarasan hierarki UU 12/2011, dan audit kepatuhan regulasi BPK RI.',
      status: 'IN_PROGRESS',
      pic: 'Tim Legal Drafter (M. Yusuf)',
    },
    {
      id: 'stg-4',
      name: 'Rapat Pleno Pembahasan Antar-Instansi',
      description: 'Penyelarasan klausul bersama OPD teknis, Bappeda, BPKD, dan Bagian Hukum.',
      status: 'PENDING',
      pic: 'Reviewer / Kabag Hukum',
    },
    {
      id: 'stg-5',
      name: 'Fasilitasi Biro Hukum Provinsi Aceh',
      description: 'Pengajuan nomor register dan evaluasi gubernur sesuai Permendagri No. 120/2018.',
      status: 'PENDING',
      pic: 'Subbag Dokumentasi',
    },
    {
      id: 'stg-6',
      name: 'Paraf Hierarkis & Penandatanganan Bupati',
      description: 'Pembubuhan paraf kendali Kabag Hukum, Asisten, Sekda, dan penetapan oleh Bupati.',
      status: 'PENDING',
      pic: 'Sekretaris Daerah & Bupati',
    },
  ]);

  // 2. Supporting Documents Requirements State
  const [supportingDocs, setSupportingDocs] = useState<SupportingDocumentItem[]>([
    {
      id: 'doc-req-1',
      name: 'Surat Permohonan Resmi dari Kepala OPD',
      category: 'SURAT_PENGANTAR',
      isRequired: true,
      isFulfilled: true,
      uploadedFileName: 'Surat_Pengantar_OPD.pdf',
    },
    {
      id: 'doc-req-2',
      name: 'Draf Naskah Rancangan Peraturan (Format Word)',
      category: 'LAINNYA',
      isRequired: true,
      isFulfilled: true,
      uploadedFileName: 'Draf_Rancangan_Regulasi_v1.docx',
    },
    {
      id: 'doc-req-3',
      name: 'Naskah Akademik / Penjelasan Latar Belakang Yuridis',
      category: 'NASKAH_AKADEMIK',
      isRequired: true,
      isFulfilled: true,
      uploadedFileName: 'Naskah_Akademik_Final.pdf',
    },
    {
      id: 'doc-req-4',
      name: 'Salinan Qanun Payung / Peraturan Daerah Induk',
      category: 'QANUN_PAYUNG',
      isRequired: true,
      isFulfilled: false,
      notes: 'Wajib melampirkan Qanun Kabupaten Aceh Tamiang Nomor 1 Tahun 2024 tentang Pajak dan Retribusi Daerah.',
    },
  ]);

  // Modals state
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);

  // New Stage form
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');
  const [newStagePic, setNewStagePic] = useState('Administrator');

  // New Supporting Doc form
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<SupportingDocumentItem['category']>('QANUN_PAYUNG');
  const [newDocRequired, setNewDocRequired] = useState(true);
  const [newDocNotes, setNewDocNotes] = useState('');

  // Handle Add Stage
  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: WorkflowStageItem = {
      id: `stg-${Date.now()}`,
      name: newStageName.trim(),
      description: newStageDesc.trim() || 'Tahap khusus yang ditambahkan oleh Administrator.',
      status: 'PENDING',
      pic: newStagePic,
      isCustom: true,
    };

    // Sisipkan setelah tahap yang sedang berjalan
    const inProgIdx = stages.findIndex((s) => s.status === 'IN_PROGRESS');
    const insertIdx = inProgIdx >= 0 ? inProgIdx + 1 : stages.length;

    const updated = [...stages];
    updated.splice(insertIdx, 0, newStage);
    setStages(updated);

    setNewStageName('');
    setNewStageDesc('');
    setIsAddStageOpen(false);
  };

  // Handle Add Supporting Doc Requirement
  const handleAddSupportingDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: SupportingDocumentItem = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      category: newDocCategory,
      isRequired: newDocRequired,
      isFulfilled: false,
      notes: newDocNotes.trim() || undefined,
    };

    setSupportingDocs([...supportingDocs, newDoc]);
    setNewDocName('');
    setNewDocNotes('');
    setIsAddDocOpen(false);
  };

  // Toggle supporting doc fulfillment
  const toggleDocFulfilled = (id: string) => {
    setSupportingDocs(
      supportingDocs.map((d) => (d.id === id ? { ...d, isFulfilled: !d.isFulfilled } : d))
    );
  };

  // Advance current stage
  const handleCompleteCurrentStage = (stageId: string) => {
    const idx = stages.findIndex((s) => s.id === stageId);
    if (idx === -1) return;

    const updated = stages.map((s, i) => {
      if (i === idx) {
        return { ...s, status: 'COMPLETED' as const, completedAt: 'Baru saja' };
      }
      if (i === idx + 1) {
        return { ...s, status: 'IN_PROGRESS' as const };
      }
      return s;
    });

    setStages(updated);
  };

  // Rollback stage (Administrator privilege)
  const handleRollbackStage = (stageId: string) => {
    const idx = stages.findIndex((s) => s.id === stageId);
    if (idx <= 0) return;

    const updated = stages.map((s, i) => {
      if (i === idx) {
        return { ...s, status: 'PENDING' as const };
      }
      if (i === idx - 1) {
        return { ...s, status: 'IN_PROGRESS' as const };
      }
      return s;
    });

    setStages(updated);
  };

  const fulfilledCount = supportingDocs.filter((d) => d.isFulfilled).length;
  const totalDocsCount = supportingDocs.length;
  const isAllFulfilled = fulfilledCount === totalDocsCount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
              Alur Harmonisasi & Dokumen Prasyarat
            </Badge>
            {isAdmin && (
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Hak Akses Administrator Aktif
              </Badge>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Manajemen Alur Dokumen ({harmNumber})
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pengendalian urutan tahapan legal drafting, fasilitasi provinsi, dan pemenuhan dokumen pendukung (Qanun Payung, Naskah Akademik).
          </p>
        </div>

        {/* Administrator Action Bar */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              onClick={() => setIsAddStageOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Sisipkan Tahap Baru</span>
            </Button>
            <Button
              onClick={() => setIsAddDocOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>+ Tambah Dokumen Pendukung</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alur Proses Interaktif (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                  <span>Tahapan Alur Berjalan</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Pergerakan berkas dari penerimaan hingga penandatanganan kepala daerah.
                </CardDescription>
              </div>

              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => setIsAddStageOpen(true)}
                  variant="outline"
                  className="text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Tahap Baru</span>
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-5">
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-2">
                {stages.map((stage, idx) => {
                  const isCompleted = stage.status === 'COMPLETED';
                  const isInProgress = stage.status === 'IN_PROGRESS';

                  return (
                    <div key={stage.id} className="relative pl-7">
                      {/* Node Indicator */}
                      <div
                        className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isCompleted && <span className="text-[9px] font-bold">✓</span>}
                      </div>

                      {/* Card Content */}
                      <div
                        className={`p-4 rounded-xl border transition ${
                          isInProgress
                            ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                            : isCompleted
                            ? 'bg-slate-50/60 border-slate-200'
                            : 'bg-white border-slate-200/80 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm">{stage.name}</h4>
                              {stage.isCustom && (
                                <Badge className="bg-purple-100 text-purple-800 border-none text-[10px] font-bold">
                                  Tahap Khusus Admin
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{stage.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                              <span className="font-medium text-slate-700">PIC: {stage.pic}</span>
                              {stage.completedAt && (
                                <span className="text-emerald-700 font-semibold">• Selesai {stage.completedAt}</span>
                              )}
                            </div>
                          </div>

                          {/* Stage Status Badge */}
                          <div className="shrink-0">
                            {isCompleted ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                              </Badge>
                            ) : isInProgress ? (
                              <Badge className="bg-blue-600 text-white border-none text-[10px] font-semibold animate-pulse">
                                Sedang Berjalan
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-400 text-[10px]">
                                Menunggu
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Administrator Action Buttons on Stage */}
                        {isInProgress && (
                          <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between">
                            <span className="text-[11px] text-blue-700 font-medium">
                              Tahap aktif saat ini.
                            </span>

                            <div className="flex items-center gap-2">
                              {isAdmin && idx > 0 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRollbackStage(stage.id)}
                                  className="h-8 text-xs text-slate-600 hover:text-slate-900"
                                  title="Kembalikan ke tahap sebelumnya"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                  <span>Kembalikan</span>
                                </Button>
                              )}

                              <Button
                                size="sm"
                                onClick={() => handleCompleteCurrentStage(stage.id)}
                                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1"
                              >
                                <span>Selesaikan & Lanjutkan</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Kelola Dokumen Pendukung Wajib (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Dokumen Pendukung Alur</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Prasyarat berkas legalitas agar permohonan sah diproses.
                </CardDescription>
              </div>

              <Badge
                className={`text-[11px] font-bold ${
                  isAllFulfilled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {fulfilledCount}/{totalDocsCount} Lengkap
              </Badge>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {supportingDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-xl border transition flex items-start gap-2.5 ${
                    doc.isFulfilled
                      ? 'bg-emerald-50/50 border-emerald-200/80'
                      : 'bg-amber-50/50 border-amber-200/80'
                  }`}
                >
                  <button
                    onClick={() => toggleDocFulfilled(doc.id)}
                    className="shrink-0 mt-0.5"
                    title={doc.isFulfilled ? 'Tandai belum terpenuhi' : 'Tandai terpenuhi'}
                  >
                    {doc.isFulfilled ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-amber-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5
                        className={`text-xs font-bold leading-tight ${
                          doc.isFulfilled ? 'text-slate-800' : 'text-slate-900'
                        }`}
                      >
                        {doc.name}
                      </h5>
                      {doc.isRequired && (
                        <Badge variant="outline" className="text-[9px] text-red-600 border-red-200 shrink-0">
                          Wajib
                        </Badge>
                      )}
                    </div>

                    {doc.notes && (
                      <p className="text-[11px] text-amber-900/80 italic">{doc.notes}</p>
                    )}

                    {doc.uploadedFileName && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{doc.uploadedFileName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Requirement Button */}
              {isAdmin && (
                <Button
                  onClick={() => setIsAddDocOpen(true)}
                  variant="outline"
                  className="w-full text-xs font-semibold border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 flex items-center justify-center gap-1.5 py-2.5 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>+ Tambah Dokumen Pendukung Wajib (Qanun/Akademik)</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal 1: Sisipkan Tahap Baru (Administrator) */}
      <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Sisipkan Tahapan Baru ke Alur Perkara</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Sebagai Administrator, Anda dapat menambahkan tahap penelaahan khusus seperti Penyelarasan Qanun Payung, Fasilitasi Provinsi, atau Evaluasi Kemendagri.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStage} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nama Tahap Baru *</label>
              <Input
                placeholder="Contoh: Penyelarasan Qanun Payung Daerah No. 1/2024"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Deskripsi & Arahan Pelaksanaan</label>
              <Textarea
                placeholder="Tuliskan arahan pelaksanaan dan syarat berkas yang harus disiapkan..."
                value={newStageDesc}
                onChange={(e) => setNewStageDesc(e.target.value)}
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Pelaksana / PIC Penanggung Jawab</label>
              <Input
                placeholder="Contoh: Tim Legal Drafter / Kasubbag Perundang-Undangan"
                value={newStagePic}
                onChange={(e) => setNewStagePic(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddStageOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                Simpan & Sisipkan ke Alur
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Tambah Dokumen Pendukung Wajib (Administrator) */}
      <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>Tambah Dokumen Pendukung Wajib</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tambahkan persyaratan dokumen pendukung baru (misal: Qanun Payung, Naskah Akademik, atau Rekomendasi Teknis) agar alur memenuhi kriteria formal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSupportingDoc} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nama Dokumen Pendukung *</label>
              <Input
                placeholder="Contoh: Salinan Qanun Kabupaten Aceh Tamiang No. 1/2024"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Kategori</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="QANUN_PAYUNG">Qanun Payung / Dasar Hukum</option>
                  <option value="NASKAH_AKADEMIK">Naskah Akademik</option>
                  <option value="SURAT_PENGANTAR">Surat Pengantar OPD</option>
                  <option value="BERITA_ACARA">Berita Acara Rapat</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer h-9">
                  <input
                    type="checkbox"
                    checked={newDocRequired}
                    onChange={(e) => setNewDocRequired(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Wajib Terpenuhi</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Catatan Khusus (Opsional)</label>
              <Input
                placeholder="Contoh: Wajib memuat lembar pengesahan bupati"
                value={newDocNotes}
                onChange={(e) => setNewDocNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDocOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold">
                Tambah Persyaratan Dokumen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
