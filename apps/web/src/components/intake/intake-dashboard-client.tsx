'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  ExternalLink,
  Search,
  Plus,
  Filter,
  Check,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface IntakeSubmission {
  id: string;
  trackingToken: string;
  opd: string;
  title: string;
  type: string;
  submitDate: string;
  submitterName: string;
  submitterPhone: string;
  documentCompleteness: {
    suratPengantar: boolean;
    naskahAkademik: boolean;
    drafRegulasi: boolean;
    dokumenPendukung: boolean;
  };
  status: 'PENDING_VERIFIKASI' | 'TERVERIFIKASI' | 'DIKEMBALIKAN';
}

const INITIAL_INTAKE: IntakeSubmission[] = [
  {
    id: 'INT-001',
    trackingToken: 'TRK-2026-DINKES-01',
    opd: 'Dinas Kesehatan',
    title: 'Rancangan Peraturan Bupati tentang Penyelenggaraan Integrasi Pelayanan Kesehatan Primer (ILP) Puskesmas',
    type: 'Peraturan Bupati',
    submitDate: '21 Sep 2026',
    submitterName: 'dr. H. Hendra, M.Kes.',
    submitterPhone: '0812-6455-xxxx',
    documentCompleteness: {
      suratPengantar: true,
      naskahAkademik: true,
      drafRegulasi: true,
      dokumenPendukung: true
    },
    status: 'PENDING_VERIFIKASI'
  },
  {
    id: 'INT-002',
    trackingToken: 'TRK-2026-DPMK-03',
    opd: 'Dinas Pemberdayaan Masyarakat & Gampong',
    title: 'Rancangan Qanun tentang Pedoman Penyusunan Rencana Kerja Pemerintah Gampong (RKPG) Tahun 2027',
    type: 'Qanun Kabupaten',
    submitDate: '20 Sep 2026',
    submitterName: 'Rizal Efendi, S.STP.',
    submitterPhone: '0852-7711-xxxx',
    documentCompleteness: {
      suratPengantar: true,
      naskahAkademik: false,
      drafRegulasi: true,
      dokumenPendukung: true
    },
    status: 'PENDING_VERIFIKASI'
  },
  {
    id: 'INT-003',
    trackingToken: 'TRK-2026-BPKD-05',
    opd: 'Badan Pengelolaan Keuangan Daerah',
    title: 'Rancangan Keputusan Bupati tentang Standar Satuan Harga Barang dan Jasa Pemerintah Daerah TA 2027',
    type: 'Keputusan Bupati',
    submitDate: '19 Sep 2026',
    submitterName: 'Fitriani, S.E., M.Si.',
    submitterPhone: '0813-9822-xxxx',
    documentCompleteness: {
      suratPengantar: true,
      naskahAkademik: true,
      drafRegulasi: true,
      dokumenPendukung: true
    },
    status: 'TERVERIFIKASI'
  }
];

export default function IntakeDashboardClient() {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>(INITIAL_INTAKE);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const [actionDoneId, setActionDoneId] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'TERVERIFIKASI' } : s));
    setActionDoneId(id);
    setTimeout(() => setActionDoneId(null), 2500);
  };

  const handleReject = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'DIKEMBALIKAN' } : s));
  };

  const filtered = submissions.filter(s => {
    if (filter === 'PENDING') return s.status === 'PENDING_VERIFIKASI';
    if (filter === 'DONE') return s.status === 'TERVERIFIKASI';
    return true;
  });

  const pendingCount = submissions.filter(s => s.status === 'PENDING_VERIFIKASI').length;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Pintu Masuk Berkas
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Intake Permohonan Regulasi
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Verifikasi kelengkapan berkas usulan harmonisasi dari Organisasi Perangkat Daerah (OPD) sebelum diregistrasi ke sistem HARM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/public-intake">
            <Button size="sm" variant="outline" className="rounded-xl border-slate-300 text-xs font-semibold h-9">
              <span>Formulir Pengajuan OPD</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-500" />
            </Button>
          </Link>
          <Link href="/cases/new">
            <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 shadow-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Registrasi Kasus HARM</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/60 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Menunggu Verifikasi</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">{pendingCount} Usulan</h3>
              <p className="text-[11px] text-slate-500">Berkas masuk dalam 24 jam terakhir</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
              <Inbox className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/60 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Siap Diharmonisasi</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                {submissions.filter(s => s.status === 'TERVERIFIKASI').length} Usulan
              </h3>
              <p className="text-[11px] text-slate-500">Berkas lengkap & teregistrasi</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Portal Tracking Publik</p>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">Aktif</h3>
              <p className="text-[11px] text-slate-500">OPD dapat lacak progres mandiri via token</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua Usulan ({submissions.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Perlu Verifikasi ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('DONE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filter === 'DONE' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Terverifikasi
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.map(item => {
          const isPending = item.status === 'PENDING_VERIFIKASI';
          return (
            <Card key={item.id} className="rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-400 hover:shadow-md transition">
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Row 1: Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px] font-bold text-sky-700 bg-sky-50 border-sky-200">
                      {item.trackingToken}
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-700 border-none text-[10px] font-bold">
                      {item.type}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.opd}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Masuk: {item.submitDate}</span>
                    <Badge className={`border-none text-[10px] font-bold ${
                      item.status === 'TERVERIFIKASI' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'DIKEMBALIKAN' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status === 'PENDING_VERIFIKASI' ? 'MENUNGGU VERIFIKASI' : item.status}
                    </Badge>
                  </div>
                </div>

                {/* Row 2: Title */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                {/* Row 3: Document Checklist */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                    Uji Kelengkapan Dokumen Wajib (Permendagri 120/2018):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <span className={`flex items-center gap-1.5 ${item.documentCompleteness.suratPengantar ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                      {item.documentCompleteness.suratPengantar ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Surat Pengantar OPD</span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${item.documentCompleteness.naskahAkademik ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                      {item.documentCompleteness.naskahAkademik ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Naskah Akademik</span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${item.documentCompleteness.drafRegulasi ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                      {item.documentCompleteness.drafRegulasi ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Draf Naskah Regulasi</span>
                    </span>
                    <span className={`flex items-center gap-1.5 ${item.documentCompleteness.dokumenPendukung ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                      {item.documentCompleteness.dokumenPendukung ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Data Dukung & Matriks</span>
                    </span>
                  </div>
                </div>

                {/* Row 4: Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Pengaju: <b className="text-slate-800">{item.submitterName}</b> ({item.submitterPhone})
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleReject(item.id)}
                          className="h-8 text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                        >
                          <span>Kembalikan ke OPD</span>
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleVerify(item.id)}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs"
                        >
                          {actionDoneId === item.id ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{actionDoneId === item.id ? 'Terverifikasi!' : 'Verifikasi & Terima'}</span>
                        </Button>
                      </>
                    ) : (
                      <Link href="/cases/new">
                        <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1">
                          <span>Buat Kasus Harmonisasi</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
