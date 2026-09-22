'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  Search, 
  Download, 
  ExternalLink, 
  HardDrive, 
  Filter, 
  Calendar, 
  Building2, 
  FileCheck2, 
  Camera, 
  FileSpreadsheet, 
  Lock, 
  ArrowUpRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface EvidenceItem {
  id: string;
  fileName: string;
  caseNumber: string;
  caseTitle: string;
  category: 'SURAT' | 'BERITA_ACARA' | 'NOTULEN' | 'FOTO_RAPAT' | 'FASILITASI' | 'REGISTRASI';
  opd: string;
  uploadedAt: string;
  fileSize: string;
  sha256Hash: string;
  driveFolder: string;
  driveUrl: string;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-001',
    fileName: 'HARM-2026-0001_04_SURAT_Permohonan_Harmonisasi_Dinkes.pdf',
    caseNumber: 'HARM-2026-0001',
    caseTitle: 'Raperbup Tata Cara Pemungutan Retribusi Pelayanan Pasar & Kebersihan',
    category: 'SURAT',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    uploadedAt: '18 Sep 2026',
    fileSize: '1.8 MB',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    driveFolder: '04 - EVIDENCE/Surat',
    driveUrl: 'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9'
  },
  {
    id: 'EVD-002',
    fileName: 'HARM-2026-0001_04_BA_Berita_Acara_Pleno_Harmonisasi.pdf',
    caseNumber: 'HARM-2026-0001',
    caseTitle: 'Raperbup Tata Cara Pemungutan Retribusi Pelayanan Pasar & Kebersihan',
    category: 'BERITA_ACARA',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    uploadedAt: '19 Sep 2026',
    fileSize: '2.4 MB',
    sha256Hash: 'a8b3f21876543210fedcba9876543210abcdef0123456789abcdef0123456789',
    driveFolder: '04 - EVIDENCE/Berita Acara',
    driveUrl: 'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9'
  },
  {
    id: 'EVD-003',
    fileName: 'HARM-2026-0002_04_FASILITASI_Surat_Gubernur_Biro_Hukum_Aceh.pdf',
    caseNumber: 'HARM-2026-0002',
    caseTitle: 'Raperbup Penyelenggaraan Pelayanan Kesehatan Rujukan RSUD Muda Sedia',
    category: 'FASILITASI',
    opd: 'Dinas Kesehatan',
    uploadedAt: '20 Sep 2026',
    fileSize: '3.1 MB',
    sha256Hash: '7c5a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a',
    driveFolder: '04 - EVIDENCE/Fasilitasi',
    driveUrl: 'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9'
  },
  {
    id: 'EVD-004',
    fileName: 'HARM-2026-0003_04_NOTULEN_Harmonisasi_Qanun_Pilkades.pdf',
    caseNumber: 'HARM-2026-0003',
    caseTitle: 'Raqan Tata Cara Pemilihan dan Pemberhentian Datok Penghulu',
    category: 'NOTULEN',
    opd: 'Dinas Pemberdayaan Masyarakat & Gampong',
    uploadedAt: '21 Sep 2026',
    fileSize: '890 KB',
    sha256Hash: '5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f',
    driveFolder: '04 - EVIDENCE/Notulen',
    driveUrl: 'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9'
  },
  {
    id: 'EVD-005',
    fileName: 'HARM-2026-0001_04_FOTO_Dokumentasi_Rapat_Pleno_Setdakab.jpg',
    caseNumber: 'HARM-2026-0001',
    caseTitle: 'Raperbup Tata Cara Pemungutan Retribusi Pelayanan Pasar & Kebersihan',
    category: 'FOTO_RAPAT',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    uploadedAt: '19 Sep 2026',
    fileSize: '4.2 MB',
    sha256Hash: '9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
    driveFolder: '04 - EVIDENCE/Foto Rapat',
    driveUrl: 'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9'
  },
  {
    id: 'EVD-006',
    fileName: 'HARM-2026-0006_05_FINAL_Lembaran_Daerah_Qanun_1_2024.pdf',
    caseNumber: 'HARM-2026-0006',
    caseTitle: 'Qanun Pajak Daerah dan Retribusi Daerah Tahun 2024',
    category: 'REGISTRASI',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    uploadedAt: '20 Sep 2026',
    fileSize: '5.6 MB',
    sha256Hash: 'b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5',
    driveFolder: '05 - FINAL',
    driveUrl: 'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9'
  }
];

export default function GlobalEvidenceClient() {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredEvidence = evidenceList.filter(item => {
    const matchesSearch = 
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.opd.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Pusat Bukti & Arsip Digital
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pusat Evidence Harmonisasi
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Repositori resmi seluruh berkas bukti (Surat Permohonan, Berita Acara, Notulen, Foto Rapat, dan Fasilitasi) dengan verifikasi hash integritas SHA-256.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-md shadow-blue-600/20">
              <HardDrive className="w-3.5 h-3.5 mr-1.5" />
              <span>Buka Google Drive Setdakab</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Total Berkas Evidence</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{evidenceList.length} Berkas</h3>
              <p className="text-[11px] text-slate-500">Tersinkronisasi otomatis ke cloud</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Integritas SHA-256</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">100% Verified</h3>
              <p className="text-[11px] text-slate-500">Bebas manipulasi & immutable</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Struktur Standar Setdakab</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">7 Subdirektori</h3>
              <p className="text-[11px] text-slate-500">Surat, BA, Notulen, Foto, Fasilitasi, dll.</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
              <HardDrive className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Cari nama berkas, nomor HARM, atau OPD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl border-slate-200"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { key: 'ALL', label: 'Semua Kategori' },
            { key: 'SURAT', label: 'Surat' },
            { key: 'BERITA_ACARA', label: 'Berita Acara' },
            { key: 'NOTULEN', label: 'Notulen' },
            { key: 'FASILITASI', label: 'Fasilitasi' },
            { key: 'FOTO_RAPAT', label: 'Foto Rapat' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat.key 
                  ? 'bg-slate-900 text-white font-bold' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <Card className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Dokumen Evidence</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">OPD Pemrakarsa</th>
                  <th className="py-3 px-3">Ukuran & Tanggal</th>
                  <th className="py-3 px-3">Verifikasi Integritas SHA-256</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvidence.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                          {item.category === 'FOTO_RAPAT' ? (
                            <Camera className="w-4 h-4 text-sky-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{item.fileName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                              {item.caseNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              📁 {item.driveFolder}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant="outline" className={`text-[10px] font-bold ${
                        item.category === 'SURAT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        item.category === 'BERITA_ACARA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.category === 'FASILITASI' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                        item.category === 'NOTULEN' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {item.category.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-700">{item.opd}</td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      <div>{item.fileSize}</div>
                      <div className="text-[10px] text-slate-400">{item.uploadedAt}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-mono text-[10px] truncate max-w-[130px] text-slate-500" title={item.sha256Hash}>
                          {item.sha256Hash.substring(0, 16)}...
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <a href={item.driveUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="h-7 px-2.5 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1 mx-auto">
                          <span>Buka di Drive</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
