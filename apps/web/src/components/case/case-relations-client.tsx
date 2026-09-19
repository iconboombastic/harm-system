'use client';

import React, { useState } from 'react';
import { 
  GitFork, 
  BookOpen, 
  ExternalLink, 
  Plus, 
  ShieldCheck, 
  Link as LinkIcon, 
  FileText, 
  Layers, 
  Sparkles,
  Search
} from 'lucide-react';
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

interface LegalRelationItem {
  id: string;
  level: string;
  name: string;
  relationType: 'DASAR_HUKUM_UTAMA' | 'PERATURAN_PELAKSANA' | 'QANUN_PAYUNG' | 'PEDOMAN_TEKNIS';
  status: 'SELARAS' | 'PERLU_PENYESUAIAN' | 'VALIDATED';
  description: string;
  bpkUrl: string;
  jdihUrl: string;
}

export default function CaseRelationsClient({
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
  const [relations, setRelations] = useState<LegalRelationItem[]>([
    {
      id: 'rel-1',
      level: 'Undang-Undang Republik Indonesia',
      name: 'UU No. 11 Tahun 2006 tentang Pemerintahan Aceh',
      relationType: 'DASAR_HUKUM_UTAMA',
      status: 'SELARAS',
      description: 'Menjamin kekhususan kewenangan otonomi Aceh dan kewenangan pembentukan Qanun / Peraturan Kepala Daerah.',
      bpkUrl: 'https://peraturan.bpk.go.id/Search?Keywords=UU%2011%20Tahun%202006%20Pemerintahan%20Aceh',
      jdihUrl: 'https://jdihn.go.id/search?c=all&q=UU%2011%202006%20Pemerintahan%20Aceh',
    },
    {
      id: 'rel-2',
      level: 'Undang-Undang Republik Indonesia',
      name: 'UU No. 1 Tahun 2022 tentang Hubungan Keuangan Pusat dan Daerah (HKPD)',
      relationType: 'DASAR_HUKUM_UTAMA',
      status: 'VALIDATED',
      description: 'Konsideran mengingat dan materi tarif retribusi daerah wajib diselaraskan secara penuh dengan UU HKPD.',
      bpkUrl: 'https://peraturan.bpk.go.id/Search?Keywords=UU%201%20Tahun%202022%20HKPD',
      jdihUrl: 'https://jdihn.go.id/search?c=all&q=UU%201%202022%20Hubungan%20Keuangan',
    },
    {
      id: 'rel-3',
      level: 'Peraturan Pemerintah RI',
      name: 'PP No. 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah',
      relationType: 'PEDOMAN_TEKNIS',
      status: 'SELARAS',
      description: 'Tata cara pemungutan, pelaporan, dan tata kelola tarif retribusi jasa umum dan usaha daerah.',
      bpkUrl: 'https://peraturan.bpk.go.id/Search?Keywords=PP%2035%20Tahun%202023%20Pajak%20Daerah',
      jdihUrl: 'https://jdihn.go.id/search?c=all&q=PP%2035%202023%20Pajak%20Daerah',
    },
    {
      id: 'rel-4',
      level: 'Qanun Kabupaten Aceh Tamiang',
      name: 'Qanun Kabupaten Aceh Tamiang No. 1 Tahun 2024 tentang Pajak dan Retribusi',
      relationType: 'QANUN_PAYUNG',
      status: 'SELARAS',
      description: 'Peraturan payung tingkat daerah yang mendelegasikan rincian teknis operasional ke dalam Peraturan Bupati ini.',
      bpkUrl: 'https://peraturan.bpk.go.id/Search?Keywords=Qanun%20Aceh%20Tamiang%20Pajak',
      jdihUrl: 'https://jdih.acehtamiangkab.go.id',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState('Undang-Undang RI');
  const [newType, setNewType] = useState<LegalRelationItem['relationType']>('DASAR_HUKUM_UTAMA');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateRelation = () => {
    if (!newName.trim()) return;

    const encoded = encodeURIComponent(newName.trim());
    const newRel: LegalRelationItem = {
      id: `rel-${Date.now()}`,
      name: newName.trim(),
      level: newLevel,
      relationType: newType,
      status: 'VALIDATED',
      description: newDesc.trim() || 'Peraturan terkait dalam pohon hirarki hukum.',
      bpkUrl: `https://peraturan.bpk.go.id/Search?Keywords=${encoded}`,
      jdihUrl: `https://jdihn.go.id/search?c=all&q=${encoded}`,
    };

    setRelations([...relations, newRel]);
    setIsAddOpen(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-sky-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Hirarki & Hubungan Regulasi
            </span>
            <span className="text-xs text-slate-400 font-mono">{harmNumber}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Relasi Produk Hukum & Dasar Perundang-Undangan
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Peta hirarki vertikal dan horizontal yang menjadi landasan hukum permohonan ini, terhubung langsung dengan basis data resmi BPK RI, JDIHN, dan JDIH Aceh Tamiang.
          </p>
        </div>

        {(currentUserRole === 'ADMIN' || currentUserRole === 'ATASAN') && (
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Relasi Regulasi</span>
          </Button>
        )}
      </div>

      {/* Relations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relations.map((rel) => (
          <div
            key={rel.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {rel.level}
                </span>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[11px] font-medium"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Harmonis & Valid
                </Badge>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {rel.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {rel.description}
              </p>
            </div>

            {/* Verified Official Links */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <a
                href={rel.bpkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                <span>Basis Data BPK RI</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>

              <a
                href={rel.jdihUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                <span>Portal JDIH</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Tambah Relasi */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <span>Tambah Relasi Regulasi / Dasar Hukum</span>
            </DialogTitle>
            <DialogDescription>
              Tautkan undang-undang, PP, atau Qanun yang relevan dengan naskah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Nama / Judul Peraturan *</label>
              <Input
                placeholder="Contoh: Permendagri No. 120 Tahun 2018 tentang Pembentukan Produk Hukum Daerah"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Tingkatan Hirarki</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="Undang-Undang RI">Undang-Undang RI</option>
                  <option value="Peraturan Pemerintah RI">Peraturan Pemerintah RI</option>
                  <option value="Peraturan Presiden RI">Peraturan Presiden RI</option>
                  <option value="Peraturan Menteri">Peraturan Menteri (Permen)</option>
                  <option value="Qanun Aceh (Provinsi)">Qanun Aceh (Provinsi)</option>
                  <option value="Qanun Kab. Aceh Tamiang">Qanun Kab. Aceh Tamiang</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Jenis Keterkaitan</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs h-9 rounded-md border border-slate-300 px-3 bg-white"
                >
                  <option value="DASAR_HUKUM_UTAMA">Dasar Hukum Utama</option>
                  <option value="QANUN_PAYUNG">Qanun Payung (Induk)</option>
                  <option value="PEDOMAN_TEKNIS">Pedoman Teknis</option>
                  <option value="PERATURAN_PELAKSANA">Peraturan Pelaksana</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Keterangan / Relevansi Norma</label>
              <Input
                placeholder="Penyelarasan ketentuan pasal tertentu..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateRelation}
              disabled={!newName.trim()}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Simpan Relasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
