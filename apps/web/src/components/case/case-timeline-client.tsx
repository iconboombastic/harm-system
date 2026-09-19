'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  Calendar, 
  User, 
  HardDrive, 
  ExternalLink, 
  Plus, 
  Filter, 
  ShieldCheck, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Award,
  AlertCircle
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

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

export interface TimelineEvent {
  id: string;
  title: string;
  stageName: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  category: 'TAHAP_RESMI' | 'RAPAT' | 'PARAF' | 'AI_CHECK' | 'EXTERNAL';
  description: string;
  evidenceUrl?: string;
  evidenceLabel?: string;
  notes?: string;
}

export default function CaseTimelineClient({
  caseId,
  caseTitle = 'Rancangan Produk Hukum',
  harmNumber = 'HARM-2026-001',
  currentUserRole = 'ADMIN',
}: {
  caseId: string;
  caseTitle?: string;
  harmNumber?: string;
  currentUserRole?: string;
}) {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 'evt-1',
      title: 'Penerimaan Permohonan & Berkas Draf Awal',
      stageName: 'Penerimaan & Registrasi',
      timestamp: '14 Sep 2026, 09:15 WIB',
      actor: 'Admin Bagian Hukum',
      actorRole: 'Registrar',
      status: 'COMPLETED',
      category: 'TAHAP_RESMI',
      description: 'Berkas permohonan harmonisasi diterima dari OPD pemrakarsa beserta Surat Pengantar resmi dan draf Word/PDF.',
      evidenceUrl: GDRIVE_FOLDER_URL,
      evidenceLabel: 'Surat_Pengantar_OPD_001.pdf',
      notes: 'Nomor registrasi HARM-2026-001 diterbitkan secara otomatis dan dialokasikan ke tim drafter.',
    },
    {
      id: 'evt-2',
      title: 'Uji Formil & Verifikasi Kelengkapan Dokumen',
      stageName: 'Pemeriksaan Berkas',
      timestamp: '15 Sep 2026, 11:30 WIB',
      actor: 'M. Yusuf (Legal Drafter)',
      actorRole: 'Staf Drafter',
      status: 'COMPLETED',
      category: 'TAHAP_RESMI',
      description: 'Pemeriksaan checklist dokumen pendukung: Naskah Akademik/Penjelasan, SPTJM, dan draf rancangan.',
      evidenceUrl: GDRIVE_FOLDER_URL,
      evidenceLabel: 'Lembar_Verifikasi_Kelengkapan.pdf',
      notes: 'Seluruh dokumen pokok terverifikasi lengkap memenuhi standar Permendagri No. 120/2018.',
    },
    {
      id: 'evt-3',
      title: 'Audit Kepatuhan Regulasi & Asistensi AI Copilot',
      stageName: 'Harmonisasi Substantif',
      timestamp: '16 Sep 2026, 14:20 WIB',
      actor: 'AI Copilot Legal Checker & Drafter',
      actorRole: 'Sistem AI & Perancang',
      status: 'COMPLETED',
      category: 'AI_CHECK',
      description: 'Pemeriksaan silang konsideran terhadap basis data BPK RI, JDIH Nasional, dan Qanun Aceh.',
      notes: 'Klausul dasar hukum telah diverifikasi selaras dengan UU No. 1/2022 dan PP No. 35/2023 tanpa pertentangan norma.',
    },
    {
      id: 'evt-4',
      title: 'Rapat Pleno Harmonisasi Bersama OPD & Tim Perancang',
      stageName: 'Rapat Pleno Harmonisasi',
      timestamp: '17 Sep 2026, 10:00 WIB',
      actor: 'Dr. Ir. Teuku Iskandar (Reviewer)',
      actorRole: 'Pimpinan Rapat',
      status: 'COMPLETED',
      category: 'RAPAT',
      description: 'Pembahasan pasal per pasal bersama kepala dinas pengusul, tim perancang hukum, dan Badan Pengelola Keuangan Daerah.',
      evidenceUrl: GDRIVE_FOLDER_URL,
      evidenceLabel: 'Berita_Acara_Rapat_Pleno_Harmonisasi.pdf',
      notes: 'Disepakati 4 poin penyelarasan pada BAB Ketentuan Tarif dan BAB Sanksi Administratif.',
    },
    {
      id: 'evt-5',
      title: 'Fasilitasi & Telaah Biro Hukum Setda Provinsi Aceh',
      stageName: 'Fasilitasi Provinsi',
      timestamp: '18 Sep 2026, 08:45 WIB',
      actor: 'Tim Fasilitasi Biro Hukum Provinsi Aceh',
      actorRole: 'Pemerintah Provinsi',
      status: 'IN_PROGRESS',
      category: 'EXTERNAL',
      description: 'Pengiriman berkas hasil pleno ke Gubernur Aceh melalui Biro Hukum Setda Aceh untuk memperoleh Surat Hasil Fasilitasi.',
      notes: 'Saat ini berkas sedang ditelaah oleh tim analis provinsi. Batas waktu SLA: 5 hari kerja.',
    },
    {
      id: 'evt-6',
      title: 'Lembar Kendali Paraf Hierarkis Berjenjang',
      stageName: 'Paraf Hierarkis',
      timestamp: 'Dijadwalkan',
      actor: 'Kasubbag, Kabag Hukum, Asisten, Sekdakab',
      actorRole: 'Pimpinan Daerah',
      status: 'PENDING',
      category: 'PARAF',
      description: 'Proses pembubuhan paraf hierarkis sebelum naskah final diajukan ke meja Bupati Aceh Tamiang.',
    },
    {
      id: 'evt-7',
      title: 'Penetapan & Pengundangan di JDIH Aceh Tamiang',
      stageName: 'Penetapan & Pengundangan',
      timestamp: 'Dijadwalkan',
      actor: 'Bupati Aceh Tamiang & Kabag Hukum',
      actorRole: 'Kepala Daerah',
      status: 'PENDING',
      category: 'TAHAP_RESMI',
      description: 'Penandatanganan resmi oleh Bupati, pemberian nomor Lembaran Daerah, dan publikasi terbuka pada portal JDIH.',
    },
  ]);

  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'>('ALL');
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({
    'evt-4': true,
    'evt-5': true,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newStage, setNewStage] = useState('');
  const [newActor, setNewActor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TimelineEvent['category']>('TAHAP_RESMI');
  const [newStatus, setNewStatus] = useState<TimelineEvent['status']>('COMPLETED');
  const [newEvidenceLabel, setNewEvidenceLabel] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddEvent = () => {
    if (!newTitle.trim() || !newStage.trim()) return;

    const newEvt: TimelineEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      stageName: newStage.trim(),
      timestamp: 'Baru saja, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      actor: newActor.trim() || 'Administrator',
      actorRole: newRole.trim() || 'Bagian Hukum',
      status: newStatus,
      category: newCategory,
      description: newDesc.trim() || 'Pencatatan riwayat milestone baru pada dokumen.',
      evidenceUrl: GDRIVE_FOLDER_URL,
      evidenceLabel: newEvidenceLabel.trim() || undefined,
    };

    setEvents([newEvt, ...events]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewStage('');
    setNewActor('');
    setNewRole('');
    setNewDesc('');
    setNewEvidenceLabel('');
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'ALL') return true;
    return e.status === filter;
  });

  const completedCount = events.filter(e => e.status === 'COMPLETED').length;
  const progressPercent = Math.round((completedCount / events.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-blue-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Audit Trail & Riwayat Milestone
            </span>
            <span className="text-xs text-slate-400 font-mono">{harmNumber}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Kronologi & Rekam Jejak Harmonisasi
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Seluruh rekam jejak tahapan, notulensi rapat, paraf hierarkis, dan berkas autentikasi tercatat secara runtut dan transparan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GDRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition-all"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>Folder Arsip G-Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {(currentUserRole === 'ADMIN' || currentUserRole === 'ATASAN') && (
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Peristiwa</span>
            </Button>
          )}
        </div>
      </div>

      {/* Progress & Milestone Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">Kemajuan Alur Permohonan</span>
            <span className="font-bold text-blue-600">{progressPercent}% ({completedCount} dari {events.length} Tahap Selesai)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 shrink-0">
          <Button
            variant={filter === 'ALL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('ALL')}
            className={`text-xs h-8 ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
          >
            Semua ({events.length})
          </Button>
          <Button
            variant={filter === 'COMPLETED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('COMPLETED')}
            className={`text-xs h-8 ${filter === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Selesai ({completedCount})
          </Button>
          <Button
            variant={filter === 'IN_PROGRESS' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('IN_PROGRESS')}
            className={`text-xs h-8 ${filter === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
          >
            Sedang Berjalan ({events.filter(e => e.status === 'IN_PROGRESS').length})
          </Button>
          <Button
            variant={filter === 'PENDING' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('PENDING')}
            className={`text-xs h-8 ${filter === 'PENDING' ? 'bg-slate-700 text-white' : 'text-slate-600'}`}
          >
            Berikutnya ({events.filter(e => e.status === 'PENDING').length})
          </Button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 md:pl-8 border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 my-4">
        {filteredEvents.map((evt, idx) => {
          const isDone = evt.status === 'COMPLETED';
          const isInProgress = evt.status === 'IN_PROGRESS';
          const isPending = evt.status === 'PENDING';
          const isExpanded = !!expandedEvents[evt.id];

          return (
            <div key={evt.id} className="relative group">
              {/* Dot Icon on Timeline Axis */}
              <div
                className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isInProgress
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isInProgress ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Event Card */}
              <div
                className={`rounded-2xl border transition-all ${
                  isInProgress
                    ? 'bg-blue-50/40 border-blue-300 shadow-md ring-1 ring-blue-200'
                    : isDone
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/70 border-dashed border-slate-300 opacity-80'
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpand(evt.id)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {evt.stageName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isInProgress
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {isDone ? 'Selesai' : isInProgress ? 'Sedang Berlangsung' : 'Terjadwal'}
                      </Badge>

                      {evt.category === 'AI_CHECK' && (
                        <Badge className="bg-indigo-600 text-white text-[10px] px-1.5 py-0 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Verified
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                      {evt.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium text-slate-700">{evt.actor}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{evt.timestamp}</span>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                    <p className="leading-relaxed text-slate-700">
                      {evt.description}
                    </p>

                    {evt.notes && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-sans text-slate-700 space-y-1">
                        <span className="font-semibold text-slate-900 block text-[11px]">
                          Catatan Telaahan / Hasil:
                        </span>
                        <p>{evt.notes}</p>
                      </div>
                    )}

                    {/* Attached Evidence */}
                    {evt.evidenceUrl && evt.evidenceLabel && (
                      <div className="flex items-center justify-between p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <span className="font-medium text-blue-950 block text-[11px]">
                              Bukti Dukung Tersimpan di Google Drive:
                            </span>
                            <span className="text-[11px] text-blue-700 font-mono">
                              {evt.evidenceLabel}
                            </span>
                          </div>
                        </div>

                        <a
                          href={evt.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 font-medium text-xs rounded-lg border border-blue-300 shadow-2xs transition-colors shrink-0"
                        >
                          <span>Buka File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="flex sm:hidden items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>{evt.actor} ({evt.actorRole})</span>
                      <span>{evt.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Catat Peristiwa */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Catat Milestone / Peristiwa Baru</span>
            </DialogTitle>
            <DialogDescription>
              Tambahkan catatan peristiwa resmi atau perkembangan proses ke riwayat timeline dokumen ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Nama Milestone / Peristiwa *</label>
              <Input
                placeholder="Contoh: Pengiriman Draf Perbaikan Hasil Harmonisasi ke Bupati"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Nama Tahap / Posisi *</label>
                <Input
                  placeholder="Contoh: Pembahasan Akhir"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Kategori Peristiwa</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="TAHAP_RESMI">Tahap Resmi</option>
                  <option value="RAPAT">Rapat Pembahasan</option>
                  <option value="PARAF">Paraf / Pengesahan</option>
                  <option value="EXTERNAL">Koordinasi Provinsi / Kemenkumham</option>
                  <option value="AI_CHECK">Pemeriksaan AI</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Nama Pelaksana / Aktor</label>
                <Input
                  placeholder="Contoh: Tim Harmonisasi Bagian Hukum"
                  value={newActor}
                  onChange={(e) => setNewActor(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="COMPLETED">Selesai Dilaksanakan</option>
                  <option value="IN_PROGRESS">Sedang Berlangsung</option>
                  <option value="PENDING">Terjadwal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Keterangan / Rincian Peristiwa</label>
              <Textarea
                placeholder="Jelaskan apa yang dibahas, diputuskan, atau ditindaklanjuti..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Nama Bukti Dukung (Google Drive)</label>
              <Input
                placeholder="Contoh: Berita_Acara_Persetujuan_Final.pdf"
                value={newEvidenceLabel}
                onChange={(e) => setNewEvidenceLabel(e.target.value)}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tautan file otomatis tersambung ke folder Google Drive resmi Pemkab Aceh Tamiang.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!newTitle.trim() || !newStage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Simpan ke Riwayat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
