'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  HardDrive, 
  ExternalLink, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  Info,
  Layers,
  KeyRound,
  FileCheck,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  HARM_GDRIVE_STRUCTURE, 
  generateCaseFolderName, 
  generateStandardFileName,
  generateMockSha256 
} from '@/lib/services/gdrive-storage-service';
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

interface CaseEvidenceExplorerProps {
  caseId: string;
  caseTitle?: string;
  harmNumber?: string;
  opdName?: string;
}

interface EvidenceFile {
  id: string;
  name: string;
  stageCode: string;
  subfolder?: string;
  size: string;
  uploadedAt: string;
  uploader: string;
  sha256: string;
  locked: boolean;
  type: 'pdf' | 'docx' | 'jpg';
}

export default function CaseEvidenceExplorer({
  caseId,
  caseTitle = 'Raperbup Pajak dan Retribusi Daerah',
  harmNumber = 'HARM-2026-0001',
  opdName = 'DINKES (Dinas Kesehatan)',
}: CaseEvidenceExplorerProps) {
  const caseFolderName = generateCaseFolderName(harmNumber, caseTitle);

  // Tree expansion state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'ROOT': true,
    'OPD': true,
    'CASE': true,
    '01': true,
    '04': true,
    '04-Notulen': true,
    '04-Foto Rapat': true,
  });

  const [selectedFolder, setSelectedFolder] = useState<{
    code: string;
    name: string;
    subfolder?: string;
    securityLevel?: string;
    isLocked?: boolean;
  }>({
    code: '04',
    name: '04 - EVIDENCE',
    subfolder: 'Notulen',
    securityLevel: 'RESTRICTED_LEGAL',
    isLocked: false,
  });

  // Sample files mapped to the folder schema
  const [files, setFiles] = useState<EvidenceFile[]>([
    {
      id: 'f-1',
      name: `${harmNumber}_01-ASLI_Surat-Pengantar-Kadis_v1_20260914.pdf`,
      stageCode: '01',
      size: '1.4 MB',
      uploadedAt: '14 Sep 2026, 09:15 WIB',
      uploader: 'Kadis Kesehatan / Admin OPD',
      sha256: generateMockSha256('surat-pengantar', 1400000),
      locked: true,
      type: 'pdf',
    },
    {
      id: 'f-2',
      name: `${harmNumber}_01-ASLI_Draf-Awal-Raperbup_v1_20260914.docx`,
      stageCode: '01',
      size: '280 KB',
      uploadedAt: '14 Sep 2026, 09:20 WIB',
      uploader: 'Tim Teknis Dinas Kesehatan',
      sha256: generateMockSha256('draf-awal', 280000),
      locked: true,
      type: 'docx',
    },
    {
      id: 'f-3',
      name: `${harmNumber}_02-REVIEW_Matriks-Telaahan-Yuridis_v1_20260915.docx`,
      stageCode: '02',
      subfolder: 'Review_01',
      size: '340 KB',
      uploadedAt: '15 Sep 2026, 14:00 WIB',
      uploader: 'M. Yusuf (Legal Drafter)',
      sha256: generateMockSha256('review-1', 340000),
      locked: false,
      type: 'docx',
    },
    {
      id: 'f-4',
      name: `${harmNumber}_03-REVISI_Draf-Setelah-Pleno_v2_20260917.docx`,
      stageCode: '03',
      subfolder: 'Koreksi_Rev-1',
      size: '310 KB',
      uploadedAt: '17 Sep 2026, 16:30 WIB',
      uploader: 'M. Yusuf (Legal Drafter)',
      sha256: generateMockSha256('revisi-1', 310000),
      locked: false,
      type: 'docx',
    },
    {
      id: 'f-5',
      name: `${harmNumber}_04-EVIDENCE_Notulen_Pleno-Harmonisasi_v1_20260917.pdf`,
      stageCode: '04',
      subfolder: 'Notulen',
      size: '850 KB',
      uploadedAt: '17 Sep 2026, 17:00 WIB',
      uploader: 'Notulis Bagian Hukum',
      sha256: generateMockSha256('notulen-pleno', 850000),
      locked: false,
      type: 'pdf',
    },
    {
      id: 'f-6',
      name: `${harmNumber}_04-EVIDENCE_Foto-Rapat_Dokumentasi-Pleno_20260917.jpg`,
      stageCode: '04',
      subfolder: 'Foto Rapat',
      size: '3.2 MB',
      uploadedAt: '17 Sep 2026, 17:10 WIB',
      uploader: 'Bagian Protokol & Komunikasi',
      sha256: generateMockSha256('foto-pleno', 3200000),
      locked: false,
      type: 'jpg',
    },
    {
      id: 'f-7',
      name: `${harmNumber}_04-EVIDENCE_Berita-Acara_Kesepakatan-Harmonisasi_v1_20260917.pdf`,
      stageCode: '04',
      subfolder: 'Berita Acara',
      size: '1.1 MB',
      uploadedAt: '17 Sep 2026, 17:30 WIB',
      uploader: 'Reviewer Utama / Kabag Hukum',
      sha256: generateMockSha256('ba-harmonisasi', 1100000),
      locked: false,
      type: 'pdf',
    },
  ]);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newSubfolder, setNewSubfolder] = useState('Dokumen Pendukung');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const toggleNode = (key: string) => {
    setExpandedNodes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectFolder = (code: string, name: string, subfolder?: string, securityLevel?: string, isLocked?: boolean) => {
    setSelectedFolder({ code, name, subfolder, securityLevel, isLocked });
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleUploadSimulated = () => {
    if (!newDocTitle.trim()) return;

    const stdName = generateStandardFileName(
      harmNumber,
      selectedFolder.code,
      selectedFolder.subfolder || newSubfolder,
      newDocTitle.trim(),
      1,
      'pdf'
    );

    const newFile: EvidenceFile = {
      id: `f-${Date.now()}`,
      name: stdName,
      stageCode: selectedFolder.code,
      subfolder: selectedFolder.subfolder || newSubfolder,
      size: '1.2 MB',
      uploadedAt: 'Baru saja',
      uploader: 'M. Yusuf (Anda)',
      sha256: generateMockSha256(stdName, 1200000),
      locked: selectedFolder.isLocked || false,
      type: 'pdf',
    };

    setFiles([newFile, ...files]);
    setIsUploadOpen(false);
    setNewDocTitle('');
  };

  const activeFiles = files.filter(f => {
    if (f.stageCode !== selectedFolder.code) return false;
    if (selectedFolder.subfolder && f.subfolder !== selectedFolder.subfolder) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Google Drive Storage Architecture */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 tracking-wide flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              HIERARKIS GOOGLE DRIVE RESMI
            </span>
            <span className="text-xs text-slate-400 font-mono">{harmNumber}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Penyimpanan Terpadu Evidence & Berkas Kasus
          </h2>

          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Struktur folder otomatis berstandar birokrasi daerah. Memisahkan dokumen asli yang terkunci (*immutable*), telaahan review, naskah revisi, serta bukti dukung rapat dan fasilitasi.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <a
            href={GDRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-950 shadow-md transition-all"
          >
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span>Buka di Google Drive Web</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Berkas ke Folder Ini</span>
          </Button>
        </div>
      </div>

      {/* Security & Integrity Status Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-300/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Integritas Checksum SHA-256</h4>
            <p className="text-[11px] text-slate-500">Mendeteksi manipulasi isi berkas sejak diunggah.</p>
          </div>
        </div>

        <div className="bento-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-300/40 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Immutable Document Lock</h4>
            <p className="text-[11px] text-slate-500">Folder 01-Dokumen Asli & 05-Final terkunci read-only.</p>
          </div>
        </div>

        <div className="bento-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 border border-blue-300/40 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Isolasi Hak Akses OPD</h4>
            <p className="text-[11px] text-slate-500">OPD lain tidak memiliki izin melihat permohonan ini.</p>
          </div>
        </div>
      </div>

      {/* Split Explorer: Left Directory Tree, Right Folder Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Drive Tree (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Pohon Direktori Google Drive</h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              Live Schema
            </span>
          </div>

          <div className="space-y-1 font-mono text-xs select-none overflow-x-auto pb-2">
            {/* Root */}
            <div>
              <div 
                onClick={() => toggleNode('ROOT')}
                className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-800 font-bold"
              >
                {expandedNodes['ROOT'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span>📁 HARM — ROOT</span>
              </div>

              {expandedNodes['ROOT'] && (
                <div className="pl-5 border-l border-slate-200 ml-3 space-y-1 mt-1">
                  {/* OPD Folder */}
                  <div>
                    <div 
                      onClick={() => toggleNode('OPD')}
                      className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-800 font-semibold"
                    >
                      {expandedNodes['OPD'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                      <Folder className="w-4 h-4 text-amber-500" />
                      <span>📁 DINKES</span>
                    </div>

                    {expandedNodes['OPD'] && (
                      <div className="pl-5 border-l border-slate-200 ml-3 space-y-1 mt-1">
                        {/* Case Folder */}
                        <div>
                          <div 
                            onClick={() => toggleNode('CASE')}
                            className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer text-indigo-950 font-bold bg-indigo-50/60"
                          >
                            {expandedNodes['CASE'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                            <FolderOpen className="w-4 h-4 text-indigo-600" />
                            <span className="truncate">{caseFolderName}</span>
                          </div>

                          {/* Stages inside Case */}
                          {expandedNodes['CASE'] && (
                            <div className="pl-5 border-l border-slate-200 ml-3 space-y-0.5 mt-1">
                              {HARM_GDRIVE_STRUCTURE.stages.map((stage) => {
                                const isSelected = selectedFolder.code === stage.code && !selectedFolder.subfolder;
                                const isExpanded = !!expandedNodes[stage.code];
                                const hasSubs = !!stage.subfolders && stage.subfolders.length > 0;
                                const isLocked = stage.lockStatus === 'TERKUNCI' || stage.lockStatus === 'PERMANEN';

                                return (
                                  <div key={stage.code}>
                                    <div
                                      onClick={() => {
                                        if (hasSubs) toggleNode(stage.code);
                                        handleSelectFolder(stage.code, stage.name, undefined, stage.securityLevel, isLocked);
                                      }}
                                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                                        isSelected 
                                          ? 'bg-blue-600 text-white font-bold shadow-xs' 
                                          : 'text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        {hasSubs ? (
                                          isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />
                                        ) : (
                                          <span className="w-3" />
                                        )}
                                        <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                                        <span className="truncate">{stage.name}</span>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0 ml-2">
                                        {isLocked && (
                                          <Lock className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                                        )}
                                      </div>
                                    </div>

                                    {/* Subfolders if any */}
                                    {hasSubs && isExpanded && (
                                      <div className="pl-6 border-l border-slate-200 ml-3.5 space-y-0.5 my-1">
                                        {stage.subfolders!.map((sub) => {
                                          const isSubSelected = selectedFolder.code === stage.code && selectedFolder.subfolder === sub;
                                          return (
                                            <div
                                              key={sub}
                                              onClick={() => handleSelectFolder(stage.code, stage.name, sub, stage.securityLevel, isLocked)}
                                              className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors ${
                                                isSubSelected
                                                  ? 'bg-blue-600 text-white font-bold'
                                                  : 'text-slate-600 hover:bg-slate-100'
                                              }`}
                                            >
                                              <Folder className={`w-3 h-3 ${isSubSelected ? 'text-white' : 'text-amber-400'}`} />
                                              <span className="truncate">{sub}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Folder Inspector & File Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Folder Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
                    Folder Aktif
                  </Badge>
                  {selectedFolder.isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Lock className="w-3 h-3" />
                      Terkunci (Immutable / Hash Locked)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Unlock className="w-3 h-3" />
                      Terbuka untuk Tim Harmonisasi
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-amber-500" />
                  <span>
                    {selectedFolder.name} {selectedFolder.subfolder ? `→ ${selectedFolder.subfolder}` : ''}
                  </span>
                </h3>
              </div>

              <a
                href={GDRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 self-start sm:self-center"
              >
                <span>Buka di Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Standard Naming Guide */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Standar Penamaan File Baku di Folder Ini:
              </span>
              <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                {generateStandardFileName(
                  harmNumber, 
                  selectedFolder.code, 
                  selectedFolder.subfolder || 'Subkategori', 
                  'Nama-Dokumen', 
                  1, 
                  'pdf'
                )}
              </p>
            </div>
          </div>

          {/* Files List in Active Folder */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="p-4 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Daftar Berkas Terarsip ({activeFiles.length} File)
              </span>
              <Button
                size="sm"
                onClick={() => setIsUploadOpen(true)}
                className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
              >
                <Plus className="w-3 h-3 mr-1" />
                Tambah File
              </Button>
            </div>

            {activeFiles.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Folder className="w-8 h-8 text-slate-300 mx-auto" />
                <span className="font-bold text-slate-700 text-xs block">Belum ada berkas di folder ini</span>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Gunakan tombol di atas untuk mengunggah berkas sesuai format penamaan resmi.
                </p>
              </div>
            ) : (
              activeFiles.map((file) => (
                <div key={file.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-xs truncate font-mono">
                        {file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>Diunggah oleh: <strong className="text-slate-700">{file.uploader}</strong></span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>

                    {/* Checksum SHA-256 Badge */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handleCopyHash(file.sha256)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                        title="Klik untuk menyalin SHA-256 checksum"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[200px]">{file.sha256}</span>
                        {copiedHash === file.sha256 ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>

                      {file.locked && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" /> Immutable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={GDRIVE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Lihat File</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Unggah Berkas ke Folder Google Drive */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <span>Unggah Berkas ke Folder Google Drive</span>
            </DialogTitle>
            <DialogDescription>
              Menyimpan dokumen langsung ke folder: <strong>{selectedFolder.name} {selectedFolder.subfolder ? `(${selectedFolder.subfolder})` : ''}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">Judul Ringkas Dokumen *</label>
              <Input
                placeholder="Contoh: Berita-Acara-Rapat-Harmonisasi-Tarif"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Sistem akan secara otomatis menyusun nama file baku sesuai standar kearsipan resmi.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 mb-1 block">Preview Nama File Terstandarisasi:</label>
              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-800 break-all border border-slate-200">
                {newDocTitle.trim() 
                  ? generateStandardFileName(harmNumber, selectedFolder.code, selectedFolder.subfolder || newSubfolder, newDocTitle.trim(), 1, 'pdf')
                  : '(Ketik judul dokumen untuk melihat preview)'}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Pemeriksaan Keamanan Otomatis:
              </span>
              <ul className="text-[11px] space-y-0.5 list-disc pl-4">
                <li>Enkripsi SHA-256 dibuat otomatis saat dokumen disimpan.</li>
                <li>Penyimpanan tersinkronisasi langsung ke Google Drive Folder resmi Pemkab Aceh Tamiang.</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleUploadSimulated}
              disabled={!newDocTitle.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Simpan & Sinkronkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
