'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Award, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  HardDrive, 
  ExternalLink, 
  Plus, 
  AlertCircle,
  PenTool
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

interface DecisionItem {
  id: string;
  title: string;
  type: 'REKOMENDASI_HARMONISASI' | 'PERSETUJUAN_NASKAH' | 'CATATAN_KOREKSI';
  status: 'APPROVED' | 'APPROVED_WITH_NOTES' | 'PENDING';
  decisionNumber: string;
  decisionDate: string;
  author: string;
  role: string;
  summary: string;
  conditions: string[];
}

export default function CaseDecisionsClient({
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
  const [parafSteps, setParafSteps] = useState([
    {
      level: 1,
      title: 'Kasubbag Penyusunan Perundang-Undangan',
      name: 'Rizki Pratama, S.H.',
      status: 'SIGNED',
      signedAt: '16 Sep 2026, 14:00 WIB',
      notes: 'Format naskah dinas dan konsideran telah terverifikasi.',
    },
    {
      level: 2,
      title: 'Kepala Bagian Hukum Setdakab',
      name: 'Dr. Ir. Teuku Iskandar, S.H., M.Hum.',
      status: 'SIGNED',
      signedAt: '17 Sep 2026, 16:30 WIB',
      notes: 'Substansi materi muatan selaras dengan perundang-undangan lebih tinggi.',
    },
    {
      level: 3,
      title: 'Asisten Pemerintahan dan Kesra',
      name: 'Drs. H. Syahrul, M.Si.',
      status: 'SIGNED',
      signedAt: '18 Sep 2026, 10:15 WIB',
      notes: 'Diteruskan ke meja Sekretaris Daerah.',
    },
    {
      level: 4,
      title: 'Sekretaris Daerah Kabupaten Aceh Tamiang',
      name: 'Ir. Muhammad Zein, M.Si.',
      status: 'IN_PROGRESS',
      signedAt: 'Sedang Berjalan',
      notes: 'Penelaahan lembar kendali paraf tingkat Sekda.',
    },
    {
      level: 5,
      title: 'Bupati Aceh Tamiang',
      name: 'Bupati Aceh Tamiang',
      status: 'PENDING',
      signedAt: 'Menunggu',
      notes: 'Penandatanganan naskah otentik final.',
    },
  ]);

  const [decisions, setDecisions] = useState<DecisionItem[]>([
    {
      id: 'dec-1',
      title: 'Berita Acara Hasil Harmonisasi Produk Hukum',
      type: 'REKOMENDASI_HARMONISASI',
      status: 'APPROVED_WITH_NOTES',
      decisionNumber: 'BA.HARM/180/042/2026',
      decisionDate: '17 September 2026',
      author: 'Tim Harmonisasi Bagian Hukum Setdakab',
      role: 'Reviewer & Drafter',
      summary: 'Rancangan Peraturan Daerah dinyatakan DAPAT DILANJUTKAN ke tahapan Fasilitasi Tingkat Provinsi dengan perbaikan catatan teknis penyesuaian tarif retribusi zonasi pasar.',
      conditions: [
        'Koreksi rujukan ayat pada Pasal 12 huruf c harus diselesaikan sebelum pengiriman naskah ke provinsi',
        'Analisis dampak penerimaan retribusi dari BPKD dilampirkan sebagai lampiran resmi',
      ],
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newStatus, setNewStatus] = useState<DecisionItem['status']>('APPROVED');

  const handleCreateDecision = () => {
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newDec: DecisionItem = {
      id: `dec-${Date.now()}`,
      title: newTitle.trim(),
      type: 'REKOMENDASI_HARMONISASI',
      status: newStatus,
      decisionNumber: newNumber.trim() || `BA.HARM/180/${Date.now().toString().slice(-3)}/2026`,
      decisionDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Kabag Hukum / Reviewer',
      role: 'Bagian Hukum Setdakab',
      summary: newSummary.trim(),
      conditions: ['Pastikan lembar kendali paraf ditandatangani berjenjang.'],
    };

    setDecisions([newDec, ...decisions]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewNumber('');
    setNewSummary('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Pengesahan & Keputusan
            </span>
            <span className="text-xs text-slate-400 font-mono">{harmNumber}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Log Keputusan & Lembar Kendali Paraf
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Pencatatan resmi Berita Acara Harmonisasi, status validasi yuridis, dan alur paraf hierarkis dari Staf hingga Bupati Aceh Tamiang.
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
            <span>Folder Berita Acara G-Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {(currentUserRole === 'ADMIN' || currentUserRole === 'ATASAN') && (
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Keputusan</span>
            </Button>
          )}
        </div>
      </div>

      {/* Lembar Kendali Paraf Hierarkis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Lembar Kendali Paraf Hierarkis (Hierarchical Endorsement)</h3>
              <p className="text-xs text-slate-500">Alur pengesahan berjenjang sebelum penandatanganan resmi oleh Bupati.</p>
            </div>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs">
            3 dari 5 Paraf Terpenuhi
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {parafSteps.map((step) => {
            const isSigned = step.status === 'SIGNED';
            const isCurrent = step.status === 'IN_PROGRESS';

            return (
              <div
                key={step.level}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 ${
                  isSigned
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isCurrent
                    ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-200 shadow-sm'
                    : 'bg-slate-50/70 border-dashed border-slate-200 opacity-70'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">LEVEL 0{step.level}</span>
                    {isSigned ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> PARAF
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded animate-pulse">
                        <Clock className="w-3 h-3" /> MEJA INI
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">MENUNGGU</span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-slate-900 leading-tight">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium truncate">
                    {step.name}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                  <div className="font-mono">{step.signedAt}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Log List */}
      <div className="space-y-4">
        {decisions.map((dec) => (
          <div
            key={dec.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${
                      dec.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : dec.status === 'APPROVED_WITH_NOTES'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {dec.status === 'APPROVED'
                      ? 'Disetujui Penuh'
                      : dec.status === 'APPROVED_WITH_NOTES'
                      ? 'Disetujui dengan Catatan Perbaikan'
                      : 'Menunggu Pertimbangan'}
                  </Badge>
                  <span className="text-xs font-mono font-semibold text-slate-600">
                    No: {dec.decisionNumber}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{dec.title}</h3>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{dec.decisionDate}</span>
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Amar Pertimbangan & Kesimpulan:</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {dec.summary}
                </p>
              </div>

              {dec.conditions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1.5">Catatan Kewajiban / Syarat Perbaikan:</h4>
                  <ul className="space-y-1.5">
                    {dec.conditions.map((cond, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 bg-amber-50/50 p-2 rounded-lg border border-amber-200/70">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Diterbitkan oleh: <strong className="text-slate-800">{dec.author}</strong> ({dec.role})</span>
              <a
                href={GDRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <span>Lihat Berita Acara Fisik di Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Catat Keputusan */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Catat Putusan / Rekomendasi Harmonisasi</span>
            </DialogTitle>
            <DialogDescription>
              Dokumentasikan Berita Acara atau rekomendasi resmi untuk permohonan #{caseId.slice(0, 8)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Judul Keputusan / Rekomendasi *</label>
              <Input
                placeholder="Contoh: Berita Acara Harmonisasi Tahap Akhir"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Nomor Berita Acara / Keputusan</label>
                <Input
                  placeholder="BA.HARM/180/045/2026"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Status Putusan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="APPROVED">Disetujui Penuh</option>
                  <option value="APPROVED_WITH_NOTES">Disetujui dengan Catatan</option>
                  <option value="PENDING">Menunggu Pertimbangan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Amar Pertimbangan & Rekomendasi Yuridis *</label>
              <Textarea
                placeholder="Uraikan hasil telaahan hukum dan instruksi kelanjutan naskah..."
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateDecision}
              disabled={!newTitle.trim() || !newSummary.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Simpan Keputusan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
