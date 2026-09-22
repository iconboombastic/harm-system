'use client';

import { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  AlertCircle,
  Save,
  Copy,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export interface WorkflowStage {
  order: number;
  name: string;
  role: string;
  slaHours: number;
  isOptional?: boolean;
}

export interface WorkflowDocRequirement {
  name: string;
  category: 'LEGAL' | 'SUBSTANSI' | 'FORMAL' | 'ANGGARAN';
  status: 'WAJIB' | 'OPSIONAL';
}

export interface WorkflowTemplateItem {
  id: string;
  name: string;
  documentType: string;
  description: string;
  isActive: boolean;
  stages: WorkflowStage[];
  requirements: WorkflowDocRequirement[];
}

const DEFAULT_WORKFLOWS: WorkflowTemplateItem[] = [
  {
    id: 'wf-qanun',
    name: 'Qanun Kabupaten (Peraturan Daerah)',
    documentType: 'QANUN_KABUPATEN',
    description: 'Standar operasional prosedur pengujian norma regulasi tertinggi tingkat daerah bersama DPRK & Fasilitasi Gubernur',
    isActive: true,
    stages: [
      { order: 1, name: 'Pengajuan Inisiatif & Naskah Akademik', role: 'STAF_OPD', slaHours: 48 },
      { order: 2, name: 'Harmonisasi & Uji Kelayakan Norma', role: 'PERANCANG_HUKUM', slaHours: 96 },
      { order: 3, name: 'Pembahasan Komisi & Rapat Dengar Pendapat', role: 'DPRK', slaHours: 120 },
      { order: 4, name: 'Fasilitasi Biro Hukum Pemprov Aceh', role: 'PROVINSI', slaHours: 168 },
      { order: 5, name: 'Persetujuan Bersama & Paripurna', role: 'BUPATI_DPRK', slaHours: 72 },
      { order: 6, name: 'Penomoran & Pengundangan Lembaran Daerah', role: 'SEKDA', slaHours: 24 },
    ],
    requirements: [
      { name: 'Naskah Akademik Resmi', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Draf Rancangan Qanun (Word)', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Surat Pengantar Bupati / Usulan Komisi DPRK', category: 'FORMAL', status: 'WAJIB' },
      { name: 'Risalah Uji Publik / RDPU', category: 'SUBSTANSI', status: 'WAJIB' },
      { name: 'Matriks Harmonisasi UUPA & Peraturan Perundangan', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Kajian Dampak Fiskal BPKD', category: 'ANGGARAN', status: 'OPSIONAL' },
    ]
  },
  {
    id: 'wf-perbup',
    name: 'Peraturan Bupati (Perbup)',
    documentType: 'PERBUP',
    description: 'Alur harmonisasi peraturan kepala daerah turunan Qanun / Undang-Undang dengan uji sinkronisasi vertikal',
    isActive: true,
    stages: [
      { order: 1, name: 'Pengajuan & Verifikasi Syarat Formal', role: 'ANALIS_HUKUM', slaHours: 24 },
      { order: 2, name: 'Harmonisasi Pasal Demi Pasal (Drafter)', role: 'PERANCANG_HUKUM', slaHours: 72 },
      { order: 3, name: 'Rapat Koordinasi Antar OPD / Stakeholder', role: 'TIM_HARMONISASI', slaHours: 48, isOptional: true },
      { order: 4, name: 'Fasilitasi Provinsi (Khusus Pajak/APBK/Tata Ruang)', role: 'PROVINSI', slaHours: 96, isOptional: true },
      { order: 5, name: 'Paraf Koordinasi Asisten & Kabag Hukum', role: 'KABAG_HUKUM', slaHours: 24 },
      { order: 6, name: 'Penetapan & Penandatanganan Bupati', role: 'BUPATI', slaHours: 48 },
    ],
    requirements: [
      { name: 'Nota Dinas Pengantar Kepala SKPK', category: 'FORMAL', status: 'WAJIB' },
      { name: 'Draf Rancangan Perbup Format Editable (Word)', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Matriks Sanding Analisis Regulasi Vertikal', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Berita Acara Rapat Pembahasan Antar OPD', category: 'SUBSTANSI', status: 'WAJIB' },
      { name: 'Surat Keterangan Bebas Temuan BPK / Inspektorat', category: 'FORMAL', status: 'OPSIONAL' },
    ]
  },
  {
    id: 'wf-sk',
    name: 'Surat Keputusan Bupati (SK Bupati)',
    documentType: 'KEPUTUSAN_BUPATI',
    description: 'Prosedur penetapan kebijakan administratif konkrete, individual, dan final untuk operasional pemerintahan',
    isActive: true,
    stages: [
      { order: 1, name: 'Verifikasi Berkas Kelengkapan', role: 'ANALIS_HUKUM', slaHours: 24 },
      { order: 2, name: 'Pemeriksaan Konsideran & Diktum', role: 'PERANCANG_HUKUM', slaHours: 48 },
      { order: 3, name: 'Validasi Anggaran & Kode Rekening (Bila ada)', role: 'BPKD', slaHours: 24, isOptional: true },
      { order: 4, name: 'Paraf Hirarkis (Kasubbag & Kabag Hukum)', role: 'KABAG_HUKUM', slaHours: 24 },
      { order: 5, name: 'Penetapan Surat Keputusan oleh Bupati', role: 'BUPATI', slaHours: 48 },
    ],
    requirements: [
      { name: 'Nota Dinas Pengantar Pemohon SK', category: 'FORMAL', status: 'WAJIB' },
      { name: 'Draf Keputusan Bupati (Word)', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Daftar Lampiran Personil / Angka / Lokasi', category: 'SUBSTANSI', status: 'WAJIB' },
      { name: 'Surat Rekomendasi Teknis / Rekom Baperjakat', category: 'FORMAL', status: 'OPSIONAL' },
    ]
  },
  {
    id: 'wf-instruksi',
    name: 'Instruksi Bupati',
    documentType: 'INSTRUKSI_BUPATI',
    description: 'Pedoman percepatan pelaksanaan program prioritas daerah atau penanganan tanggap darurat',
    isActive: true,
    stages: [
      { order: 1, name: 'Perumusan Draf Arahan Kebijakan', role: 'STAF_SETDA', slaHours: 24 },
      { order: 2, name: 'Telaah Kewenangan Hukum', role: 'KABAG_HUKUM', slaHours: 24 },
      { order: 3, name: 'Penetapan & Penyebaran Instruksi', role: 'BUPATI', slaHours: 24 },
    ],
    requirements: [
      { name: 'Draf Instruksi Bupati (Word)', category: 'LEGAL', status: 'WAJIB' },
      { name: 'Memo Dinas Urgensi / Kondisi Mendesak', category: 'FORMAL', status: 'WAJIB' },
    ]
  }
];

export default function WorkflowManagerClient() {
  const [workflows, setWorkflows] = useState<WorkflowTemplateItem[]>(DEFAULT_WORKFLOWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDialog, setActiveDialog] = useState<'create' | 'edit' | 'add_doc' | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplateItem | null>(null);

  // Form states for Create / Edit Workflow
  const [formName, setFormName] = useState('');
  const [formDocType, setFormDocType] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStages, setFormStages] = useState<WorkflowStage[]>([]);
  const [formReqs, setFormReqs] = useState<WorkflowDocRequirement[]>([]);

  // Form state for adding document requirement
  const [newDocName, setNewDocName] = useState('');
  const [newDocCat, setNewDocCat] = useState<'LEGAL' | 'SUBSTANSI' | 'FORMAL' | 'ANGGARAN'>('LEGAL');
  const [newDocStatus, setNewDocStatus] = useState<'WAJIB' | 'OPSIONAL'>('WAJIB');

  // Helper to open Edit modal
  const handleOpenEdit = (wf: WorkflowTemplateItem) => {
    setSelectedWorkflow(wf);
    setFormName(wf.name);
    setFormDocType(wf.documentType);
    setFormDescription(wf.description);
    setFormStages([...wf.stages]);
    setFormReqs([...wf.requirements]);
    setActiveDialog('edit');
  };

  // Helper to open Create modal
  const handleOpenCreate = () => {
    setSelectedWorkflow(null);
    setFormName('');
    setFormDocType('');
    setFormDescription('');
    setFormStages([
      { order: 1, name: 'Verifikasi Berkas Pengajuan', role: 'ANALIS_HUKUM', slaHours: 24 },
      { order: 2, name: 'Harmonisasi & Telaahan Naskah', role: 'PERANCANG_HUKUM', slaHours: 48 },
      { order: 3, name: 'Persetujuan Kabag Hukum', role: 'KABAG_HUKUM', slaHours: 24 },
      { order: 4, name: 'Penetapan Pimpinan', role: 'BUPATI', slaHours: 48 },
    ]);
    setFormReqs([
      { name: 'Nota Pengantar Resmi', category: 'FORMAL', status: 'WAJIB' },
      { name: 'Draf Dokumen Regulasi (Word)', category: 'LEGAL', status: 'WAJIB' },
    ]);
    setActiveDialog('create');
  };

  // Stage manipulation
  const handleAddStage = () => {
    const nextOrder = formStages.length + 1;
    setFormStages([
      ...formStages,
      { order: nextOrder, name: `Tahap Baru ${nextOrder}`, role: 'STAF', slaHours: 24 }
    ]);
  };

  const handleRemoveStage = (index: number) => {
    const updated = formStages.filter((_, i) => i !== index).map((s, idx) => ({ ...s, order: idx + 1 }));
    setFormStages(updated);
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formStages.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const items = [...formStages];
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setFormStages(items.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  // Document requirement manipulation inside editor
  const handleAddReqToForm = () => {
    if (!newDocName.trim()) return;
    setFormReqs([
      ...formReqs,
      { name: newDocName.trim(), category: newDocCat, status: newDocStatus }
    ]);
    setNewDocName('');
  };

  const handleRemoveReqFromForm = (idx: number) => {
    setFormReqs(formReqs.filter((_, i) => i !== idx));
  };

  // Save workflow
  const handleSaveWorkflow = () => {
    if (!formName.trim() || !formDocType.trim()) return;

    if (activeDialog === 'create') {
      const newWf: WorkflowTemplateItem = {
        id: `wf-${Date.now()}`,
        name: formName,
        documentType: formDocType.toUpperCase().replace(/\s+/g, '_'),
        description: formDescription || 'Alur proses harmonisasi hukum daerah',
        isActive: true,
        stages: formStages,
        requirements: formReqs
      };
      setWorkflows([newWf, ...workflows]);
    } else if (activeDialog === 'edit' && selectedWorkflow) {
      setWorkflows(workflows.map(wf => wf.id === selectedWorkflow.id ? {
        ...wf,
        name: formName,
        documentType: formDocType,
        description: formDescription,
        stages: formStages,
        requirements: formReqs
      } : wf));
    }

    setActiveDialog(null);
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setWorkflows(workflows.map(wf => wf.id === id ? { ...wf, isActive: !wf.isActive } : wf));
  };

  // Direct quick add supporting document to a specific workflow card
  const handleQuickAddDoc = () => {
    if (!selectedWorkflow || !newDocName.trim()) return;
    const newReq: WorkflowDocRequirement = {
      name: newDocName.trim(),
      category: newDocCat,
      status: newDocStatus
    };
    setWorkflows(workflows.map(wf => wf.id === selectedWorkflow.id ? {
      ...wf,
      requirements: [...wf.requirements, newReq]
    } : wf));
    setNewDocName('');
    setActiveDialog(null);
  };

  const filteredWorkflows = workflows.filter(wf => 
    wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wf.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wf.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs">
                Tata Kelola Alur Regulasi Daerah
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                Permendagri 120/2018 & UUPA
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Konfigurasi Alur Kerja & Syarat Dokumen
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Atur tahapan proses harmonisasi, peran verifikator, target SLA jam kerja, serta dokumen pendukung wajib untuk seluruh produk hukum Pemerintah Kabupaten Aceh Tamiang.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleOpenCreate} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Alur / Produk Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Input 
            placeholder="Cari alur kerja atau jenis regulasi (misal: Qanun, Perbup)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 bg-white"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Total Alur: <strong className="text-slate-900">{workflows.length} Template</strong></span>
          <span>•</span>
          <span>Aktif: <strong className="text-emerald-600">{workflows.filter(w => w.isActive).length} Template</strong></span>
        </div>
      </div>

      {/* Grid of Workflows */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredWorkflows.map((wf) => {
          const totalSla = wf.stages.reduce((acc, s) => acc + s.slaHours, 0);
          const totalDays = (totalSla / 24).toFixed(1);

          return (
            <Card key={wf.id} className={`border transition-all shadow-sm ${wf.isActive ? 'border-slate-200 bg-white hover:border-indigo-300' : 'border-slate-200/60 bg-slate-50 opacity-80'}`}>
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-slate-900">{wf.name}</CardTitle>
                    </div>
                    <CardDescription className="text-xs text-slate-500 line-clamp-2">
                      {wf.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={wf.isActive ? 'success' : 'secondary'} className="text-[11px]">
                      {wf.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    <Workflow className="w-3.5 h-3.5" />
                    {wf.stages.length} Tahapan
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    Target SLA: {totalSla} Jam (~{totalDays} Hari)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    <FileText className="w-3.5 h-3.5" />
                    {wf.requirements.length} Dokumen Pendukung
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-5">
                {/* Stages Timeline */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center justify-between">
                    <span>Tahapan Verifikasi & Penelaahan:</span>
                    <span className="text-[11px] font-normal text-slate-500">Urutan Berjenjang</span>
                  </div>
                  <ol className="relative border-l border-indigo-200 ml-3.5 space-y-3">
                    {wf.stages.map((stage) => (
                      <li key={stage.order} className="pl-4 relative">
                        <div className={`absolute w-3 h-3 rounded-full -left-[6px] top-1 border-2 border-white ${stage.isOptional ? 'bg-amber-500' : 'bg-indigo-600'}`} />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900">{stage.order}. {stage.name}</span>
                            {stage.isOptional && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium">Opsional</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-indigo-700 border-indigo-200">
                              {stage.role}
                            </Badge>
                            <span>{stage.slaHours}j</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Supporting Documents Section */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Dokumen Pendukung Wajib ({wf.requirements.filter(r => r.status === 'WAJIB').length}):
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[11px] text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1"
                      onClick={() => {
                        setSelectedWorkflow(wf);
                        setActiveDialog('add_doc');
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Tambah Dokumen
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {wf.requirements.map((req, idx) => (
                      <Badge 
                        key={idx} 
                        variant={req.status === 'WAJIB' ? 'default' : 'outline'}
                        className={`text-[11px] font-medium ${req.status === 'WAJIB' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'border-slate-300 text-slate-600'}`}
                      >
                        {req.name}
                        {req.status === 'WAJIB' ? (
                          <span className="ml-1 text-[9px] text-red-300 font-bold">*Wajib</span>
                        ) : (
                          <span className="ml-1 text-[9px] text-slate-400">(Opsional)</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs text-slate-600 border-slate-300 hover:bg-slate-100"
                  onClick={() => handleToggleActive(wf.id)}
                >
                  {wf.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5"
                    onClick={() => handleOpenEdit(wf)}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Ubah Alur & Dokumen
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* DIALOG: CREATE / EDIT WORKFLOW TEMPLATE */}
      <Dialog open={activeDialog === 'create' || activeDialog === 'edit'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {activeDialog === 'create' ? 'Buat Template Alur Kerja Produk Hukum' : `Ubah Alur: ${formName}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Konfigurasikan tahapan review, perancang penanggung jawab, target durasi jam kerja, dan daftar kelengkapan berkas pendukung.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* General Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wfName" className="text-xs font-semibold text-slate-700">Nama Regulasi / Template</Label>
                <Input 
                  id="wfName"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Qanun Daerah, SK Pengadaan, Perbup Tarif"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wfDocType" className="text-xs font-semibold text-slate-700">Kode Jenis Dokumen (Key)</Label>
                <Input 
                  id="wfDocType"
                  value={formDocType}
                  onChange={(e) => setFormDocType(e.target.value)}
                  placeholder="Contoh: QANUN, PERBUP, SK_BUPATI"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="wfDesc" className="text-xs font-semibold text-slate-700">Keterangan / Ruang Lingkup</Label>
                <Input 
                  id="wfDesc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Deskripsi singkat dasar hukum atau peruntukan alur ini..."
                />
              </div>
            </div>

            {/* Stages Editor */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Tahapan Alur Berjenjang</h4>
                  <p className="text-xs text-slate-500">Atur urutan penelaahan, peran aparatur, dan target waktu (jam kerja)</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddStage}
                  className="text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Tahap
                </Button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {formStages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {stage.order}
                    </span>
                    <Input 
                      className="h-8 text-xs bg-white flex-1"
                      value={stage.name}
                      onChange={(e) => {
                        const updated = [...formStages];
                        updated[idx].name = e.target.value;
                        setFormStages(updated);
                      }}
                      placeholder="Nama Tahap"
                    />
                    <select
                      className="h-8 text-xs border border-slate-300 rounded px-2 bg-white"
                      value={stage.role}
                      onChange={(e) => {
                        const updated = [...formStages];
                        updated[idx].role = e.target.value;
                        setFormStages(updated);
                      }}
                    >
                      <option value="STAF_OPD">STAF OPD</option>
                      <option value="ANALIS_HUKUM">ANALIS HUKUM</option>
                      <option value="PERANCANG_HUKUM">PERANCANG HUKUM</option>
                      <option value="TIM_HARMONISASI">TIM HARMONISASI</option>
                      <option value="KABAG_HUKUM">KABAG HUKUM</option>
                      <option value="ASISTEN">ASISTEN PEMERINTAHAN</option>
                      <option value="SEKDA">SEKRETARIS DAERAH</option>
                      <option value="BUPATI">BUPATI ACEH TAMIANG</option>
                      <option value="DPRK">DPRK</option>
                      <option value="PROVINSI">BIRO HUKUM PROVINSI</option>
                    </select>
                    <div className="flex items-center gap-1 shrink-0">
                      <Input 
                        type="number"
                        className="h-8 w-16 text-xs bg-white"
                        value={stage.slaHours}
                        onChange={(e) => {
                          const updated = [...formStages];
                          updated[idx].slaHours = Number(e.target.value) || 0;
                          setFormStages(updated);
                        }}
                      />
                      <span className="text-[11px] text-slate-500">Jam</span>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        disabled={idx === 0}
                        onClick={() => handleMoveStage(idx, 'up')}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        disabled={idx === formStages.length - 1}
                        onClick={() => handleMoveStage(idx, 'down')}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveStage(idx)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Requirements Editor */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Dokumen Pendukung yang Disyaratkan</h4>
                <p className="text-xs text-slate-500">Berkas yang harus diunggah pemohon saat mengajukan rancangan ini</p>
              </div>

              {/* Add requirement inline input */}
              <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <Input 
                  className="h-8 text-xs bg-white flex-1"
                  placeholder="Contoh: Naskah Akademik, Surat Fasilitasi, Draf Word..."
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                />
                <select
                  className="h-8 text-xs border border-slate-300 rounded px-2 bg-white"
                  value={newDocCat}
                  onChange={(e: any) => setNewDocCat(e.target.value)}
                >
                  <option value="LEGAL">LEGAL</option>
                  <option value="SUBSTANSI">SUBSTANSI</option>
                  <option value="FORMAL">FORMAL</option>
                  <option value="ANGGARAN">ANGGARAN</option>
                </select>
                <select
                  className="h-8 text-xs border border-slate-300 rounded px-2 bg-white"
                  value={newDocStatus}
                  onChange={(e: any) => setNewDocStatus(e.target.value)}
                >
                  <option value="WAJIB">WAJIB</option>
                  <option value="OPSIONAL">OPSIONAL</option>
                </select>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddReqToForm}
                  className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambahkan
                </Button>
              </div>

              {/* List of current requirements */}
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {formReqs.map((req, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{req.name}</span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        {req.category}
                      </Badge>
                      <Badge variant={req.status === 'WAJIB' ? 'destructive' : 'secondary'} className="text-[10px] py-0 px-1.5">
                        {req.status}
                      </Badge>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveReqFromForm(idx)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Batal
            </Button>
            <Button onClick={handleSaveWorkflow} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: QUICK ADD SUPPORTING DOCUMENT DIRECTLY */}
      <Dialog open={activeDialog === 'add_doc'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Tambah Dokumen Pendukung Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tambahkan berkas persyaratan baru untuk alur <strong className="text-indigo-600">{selectedWorkflow?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nama Dokumen</Label>
              <Input 
                placeholder="Contoh: Surat Rekomendasi Bebas Temuan BPK"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Kategori</Label>
                <select
                  className="w-full border p-2 rounded-md text-xs bg-white"
                  value={newDocCat}
                  onChange={(e: any) => setNewDocCat(e.target.value)}
                >
                  <option value="LEGAL">LEGAL</option>
                  <option value="SUBSTANSI">SUBSTANSI</option>
                  <option value="FORMAL">FORMAL</option>
                  <option value="ANGGARAN">ANGGARAN</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Kewajiban</Label>
                <select
                  className="w-full border p-2 rounded-md text-xs bg-white"
                  value={newDocStatus}
                  onChange={(e: any) => setNewDocStatus(e.target.value)}
                >
                  <option value="WAJIB">WAJIB (Harus Ada)</option>
                  <option value="OPSIONAL">OPSIONAL (Bila Ada)</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveDialog(null)}>
              Batal
            </Button>
            <Button size="sm" onClick={handleQuickAddDoc} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tambahkan Dokumen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
