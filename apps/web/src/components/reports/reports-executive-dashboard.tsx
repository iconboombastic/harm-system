'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Building2, 
  Scale, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Award, 
  Layers, 
  Filter, 
  ChevronDown, 
  ArrowUpRight, 
  Search,
  BookOpen,
  HelpCircle,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OPDPerformance {
  code: string;
  name: string;
  totalCases: number;
  completed: number;
  inProgress: number;
  avgDurationDays: number;
  slaComplianceRate: number;
  revisionRate: number;
}

interface MonthlyData {
  month: string;
  submitted: number;
  completed: number;
  slaPercent: number;
}

export default function ReportsExecutiveDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'2026' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('2026');
  const [selectedOpd, setSelectedOpd] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'overview' | 'opd' | 'workflow' | 'audit' | 'print'>('overview');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Executive KPI summary data
  const kpis = {
    totalHarmonized: 148,
    growthPercent: 24.5,
    slaCompliance: 96.2,
    slaTarget: 90.0,
    avgDurationDays: 3.6,
    avgDurationTarget: 7.0,
    normComplianceIndex: 98.8,
    flawsDetectedAndCorrected: 19,
    activePendingCases: 23,
    totalQanun: 28,
    totalPerbup: 84,
    totalSK: 26,
    totalInstruksi: 10,
  };

  // OPD ranking data
  const opdList: OPDPerformance[] = [
    { code: 'DINKES', name: 'Dinas Kesehatan', totalCases: 38, completed: 34, inProgress: 4, avgDurationDays: 3.2, slaComplianceRate: 98.5, revisionRate: 8.5 },
    { code: 'BPKD', name: 'Badan Pengelolaan Keuangan Daerah', totalCases: 29, completed: 27, inProgress: 2, avgDurationDays: 3.4, slaComplianceRate: 97.0, revisionRate: 11.0 },
    { code: 'BKPSDM', name: 'Badan Kepegawaian & SDM', totalCases: 24, completed: 21, inProgress: 3, avgDurationDays: 3.5, slaComplianceRate: 95.8, revisionRate: 9.2 },
    { code: 'DPMK', name: 'Dinas Pemberdayaan Masyarakat & Gampong', totalCases: 21, completed: 18, inProgress: 3, avgDurationDays: 3.9, slaComplianceRate: 94.2, revisionRate: 14.5 },
    { code: 'DPUPR', name: 'Dinas Pekerjaan Umum & Penataan Ruang', totalCases: 17, completed: 15, inProgress: 2, avgDurationDays: 4.1, slaComplianceRate: 92.5, revisionRate: 18.0 },
    { code: 'DISDIKBUD', name: 'Dinas Pendidikan dan Kebudayaan', totalCases: 14, completed: 12, inProgress: 2, avgDurationDays: 3.7, slaComplianceRate: 95.0, revisionRate: 10.5 },
    { code: 'DLH', name: 'Dinas Lingkungan Hidup', totalCases: 12, completed: 10, inProgress: 2, avgDurationDays: 3.8, slaComplianceRate: 94.0, revisionRate: 12.0 },
    { code: 'SATPOL_PP', name: 'Satuan Polisi Pamong Praja & WH', totalCases: 9, completed: 8, inProgress: 1, avgDurationDays: 3.3, slaComplianceRate: 97.5, revisionRate: 7.0 },
  ];

  // Monthly trends (2026)
  const monthlyTrends: MonthlyData[] = [
    { month: 'Jan', submitted: 18, completed: 16, slaPercent: 94.5 },
    { month: 'Feb', submitted: 22, completed: 21, slaPercent: 96.0 },
    { month: 'Mar', submitted: 26, completed: 25, slaPercent: 97.2 },
    { month: 'Apr', submitted: 24, completed: 23, slaPercent: 96.5 },
    { month: 'Mei', submitted: 29, completed: 27, slaPercent: 95.8 },
    { month: 'Jun', submitted: 29, completed: 28, slaPercent: 97.0 },
  ];

  // Audit compliance findings
  const auditFindings = [
    {
      category: 'Koreksi Sanksi Pidana pada Perbup',
      count: 7,
      description: 'Penghapusan ancaman pidana kurungan pada klausul draf Perbup untuk dialihkan ke sanksi administratif berjenjang sesuai Pasal 15 ayat (2) UU 12/2011.',
      status: 'TERKOREKSI',
      severity: 'TINGGI'
    },
    {
      category: 'Pembersihan UU Kedaluwarsa (UU 28/2009 & UU 5/2014)',
      count: 9,
      description: 'Penyelarasan konsideran Mengingat dengan mengganti UU 28/2009 menjadi UU 1/2022 (HKPD) dan UU 5/2014 menjadi UU 20/2023 (ASN).',
      status: 'TERKOREKSI',
      severity: 'TINGGI'
    },
    {
      category: 'Istilah Teknis Perizinan (IMB ke PBG)',
      count: 5,
      description: 'Penyesuaian nomenklatur perizinan bangunan dari IMB menjadi Persetujuan Bangunan Gedung (PBG) sesuai amanat PP No. 16 Tahun 2021.',
      status: 'TERKOREKSI',
      severity: 'SEDANG'
    },
    {
      category: 'Pencantuman Konsideran UUPA (UU 11/2006)',
      count: 148,
      description: 'Pemenuhan 100% klausul kekhususan Aceh dalam konsideran Mengingat pada seluruh produk hukum daerah Kabupaten Aceh Tamiang.',
      status: 'LENGKAP',
      severity: 'PATUH'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Kode OPD,Nama OPD,Total Kasus,Selesai,Sedang Berjalan,Rata-rata Durasi (Hari),Kepatuhan SLA (%),Tingkat Revisi (%)\n';
    const rows = opdList.map(o => `"${o.code}","${o.name}",${o.totalCases},${o.completed},${o.inProgress},${o.avgDurationDays},${o.slaComplianceRate},${o.revisionRate}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Eksekutif_HARM_Aceh_Tamiang_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* 1. TOP EXECUTIVE BRIEFING HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200/80 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                Pemerintah Kabupaten Aceh Tamiang
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                Laporan Eksekutif Harmonisasi Hukum
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Ringkasan akuntabilitas tata kelola regulasi daerah, evaluasi SLA, kepatuhan norma BPK RI & JDIHN, serta pemeringkatan kinerja perangkat daerah (OPD).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold text-slate-600">
            {(['2026', 'Q1', 'Q2', 'Q3', 'Q4'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedPeriod === period 
                    ? 'bg-white text-slate-900 shadow-xs font-bold text-blue-700' 
                    : 'hover:text-slate-900'
                }`}
              >
                {period === '2026' ? 'Tahun 2026' : `Triwulan ${period.replace('Q', '')}`}
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            className="rounded-xl border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs h-9 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            <span>Ekspor Data (CSV)</span>
          </Button>

          <Button 
            size="sm" 
            onClick={handlePrint}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-md shadow-blue-600/20"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Cetak Lembar Pejabat</span>
          </Button>
        </div>
      </div>

      {/* 2. PRINT-ONLY HEADER (Only visible when printing / PDF export) */}
      <div className="hidden print:block mb-8 text-center border-b-2 border-slate-900 pb-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-center">
            <h3 className="text-sm font-bold tracking-widest uppercase text-slate-800">Pemerintah Kabupaten Aceh Tamiang</h3>
            <h2 className="text-lg font-black tracking-wider uppercase text-slate-950">Sekretariat Daerah — Bagian Hukum</h2>
            <p className="text-xs text-slate-600">Kompleks Perkantoran Pemerintah Kabupaten Aceh Tamiang, Karang Baru</p>
          </div>
        </div>
        <div className="mt-4 pt-2 border-t border-slate-400">
          <h1 className="text-base font-black uppercase text-slate-950 underline underline-offset-4">
            LAPORAN EKSEKUTIF KINERJA HARMONISASI PRODUK HUKUM DAERAH
          </h1>
          <p className="text-xs text-slate-600 mt-1">Periode Evaluasi: {selectedPeriod === '2026' ? 'Tahun Anggaran 2026' : `Triwulan ${selectedPeriod.replace('Q', '')} Tahun 2026`}</p>
        </div>
      </div>

      {/* 3. EXECUTIVE KPI BENTO TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Total Selesai */}
        <Card className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-blue-50/50 via-white to-white shadow-xs hover:shadow-md transition">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Kasus Selesai</span>
              <div className="p-2 rounded-xl bg-blue-100/70 text-blue-700">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{kpis.totalHarmonized}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +{kpis.growthPercent}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dari total 171 permohonan masuk ({kpis.activePendingCases} masih dalam proses)
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: SLA Compliance */}
        <Card className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/50 via-white to-white shadow-xs hover:shadow-md transition">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tingkat Kepatuhan SLA</span>
              <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">{kpis.slaCompliance}%</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                Target: &ge;{kpis.slaTarget}%
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Melampaui target standar pelayanan publik Bagian Hukum Setdakab
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Rata-rata Durasi */}
        <Card className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-violet-50/50 via-white to-white shadow-xs hover:shadow-md transition">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Kecepatan Harmonisasi</span>
              <div className="p-2 rounded-xl bg-violet-100/70 text-violet-700">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{kpis.avgDurationDays}</span>
              <span className="text-sm font-bold text-slate-600">Hari Kerja</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              51% lebih cepat dibanding batas maksimal SOP (7 hari kerja)
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Indeks Kepatuhan Norma */}
        <Card className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-amber-50/50 via-white to-white shadow-xs hover:shadow-md transition">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Kepatuhan Norma & Audit</span>
              <div className="p-2 rounded-xl bg-amber-100/70 text-amber-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{kpis.normComplianceIndex}%</span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                0 Cacat Formil
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {kpis.flawsDetectedAndCorrected} potensi cacat materi/sanksi dicegah oleh telaahan hukum
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. NAVIGATION TABS FOR DETAILED SECTIONS */}
      <div className="border-b border-slate-200 print:hidden">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Ikhtisar & Tren</span>
          </button>

          <button
            onClick={() => setActiveTab('opd')}
            className={`pb-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'opd'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Kinerja OPD ({opdList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Kepatuhan Norma BPK RI & JDIHN</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`pb-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'print'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Pratinjau Lembar Pengesahan</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IKHTISAR & TREN HARMONISASI */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'print') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Monthly Trend Chart */}
            <Card className="lg:col-span-2 rounded-2xl border border-slate-200/90 shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Tren Volume Harmonisasi Bulanan (Tahun 2026)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Perbandingan permohonan masuk vs permohonan diselesaikan tepat waktu
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    Rata-rata: 24.6 Kasus/Bulan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Visual Bar Chart */}
                <div className="space-y-3.5">
                  {monthlyTrends.map((item) => {
                    const percent = Math.round((item.completed / item.submitted) * 100);
                    return (
                      <div key={item.month} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 w-10">{item.month} 2026</span>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span>Masuk: <b className="text-slate-800">{item.submitted}</b></span>
                            <span>Selesai: <b className="text-emerald-700">{item.completed}</b></span>
                            <span className="font-bold text-blue-600">{item.slaPercent}% SLA</span>
                          </div>
                        </div>
                        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-blue-600 h-full rounded-l-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                            title={`Selesai: ${item.completed} (${percent}%)`}
                          />
                          <div 
                            className="bg-amber-400 h-full transition-all duration-500"
                            style={{ width: `${100 - percent}%` }}
                            title={`Proses: ${item.submitted - item.completed}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                      <span>Selesai Tepat Waktu</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                      <span>Sedang Harmoniasi</span>
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700">Efisiensi Rata-rata: 96.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* Right: Distribution of Legal Products */}
            <Card className="rounded-2xl border border-slate-200/90 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-slate-900">
                  Proporsi Jenis Produk Hukum
                </CardTitle>
                <CardDescription className="text-xs">
                  Klasifikasi naskah hukum yang diundangkan di Aceh Tamiang
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Qanun */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-amber-700" />
                      <span>Qanun Kabupaten (Perda)</span>
                    </span>
                    <span className="text-sm font-black text-amber-900">{kpis.totalQanun}</span>
                  </div>
                  <div className="w-full bg-amber-200/60 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '19%' }} />
                  </div>
                  <p className="text-[10px] text-amber-800 mt-1">
                    Regulasi mengikat publik, tarif retribusi & kewenangan otonomi
                  </p>
                </div>

                {/* Peraturan Bupati */}
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                      <span>Peraturan Bupati (Perbup)</span>
                    </span>
                    <span className="text-sm font-black text-blue-900">{kpis.totalPerbup}</span>
                  </div>
                  <div className="w-full bg-blue-200/60 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '57%' }} />
                  </div>
                  <p className="text-[10px] text-blue-800 mt-1">
                    Aturan pelaksana teknis qanun dan pedoman operasional dinas
                  </p>
                </div>

                {/* Keputusan Bupati */}
                <div className="p-3 rounded-xl bg-violet-50/80 border border-violet-200/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-violet-900 text-xs flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-violet-700" />
                      <span>Keputusan Bupati (SK)</span>
                    </span>
                    <span className="text-sm font-black text-violet-900">{kpis.totalSK}</span>
                  </div>
                  <div className="w-full bg-violet-200/60 rounded-full h-2">
                    <div className="bg-violet-600 h-2 rounded-full" style={{ width: '17.5%' }} />
                  </div>
                  <p className="text-[10px] text-violet-800 mt-1">
                    Penetapan tim kerja lintas OPD, beasiswa & pengangkatan dinas
                  </p>
                </div>

                {/* Instruksi Bupati */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Instruksi Bupati</span>
                    </span>
                    <span className="text-sm font-black text-emerald-900">{kpis.totalInstruksi}</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '6.5%' }} />
                  </div>
                  <p className="text-[10px] text-emerald-800 mt-1">
                    Arahan percepatan program prioritas dan tanggap darurat
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MATRIKS & PERINGKAT KINERJA OPD */}
      {/* ========================================================================= */}
      {(activeTab === 'opd' || activeTab === 'print') && (
        <Card className="rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/60 border-b border-slate-200/80 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Matriks & Evaluasi Kinerja Perangkat Daerah (OPD)
                </CardTitle>
                <CardDescription className="text-xs">
                  Pemeringkatan efisiensi harmonisasi berkas, kepatuhan batas waktu, dan frekuensi revisi naskah
                </CardDescription>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Total Kasus Diolah: <b className="text-slate-900">148 Dokumen</b>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Peringkat</th>
                    <th className="py-3 px-4">Perangkat Daerah (OPD)</th>
                    <th className="py-3 px-3 text-center">Total Usulan</th>
                    <th className="py-3 px-3 text-center">Selesai</th>
                    <th className="py-3 px-3 text-center">Proses</th>
                    <th className="py-3 px-3 text-center">Rata-rata Durasi</th>
                    <th className="py-3 px-3 text-center">Kepatuhan SLA</th>
                    <th className="py-3 px-3 text-center">Tingkat Revisi</th>
                    <th className="py-3 px-4 text-center">Status Akreditasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opdList.map((opd, idx) => {
                    const isTop = idx < 3;
                    return (
                      <tr key={opd.code} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-black text-slate-500">
                          {isTop ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                              idx === 0 ? 'bg-amber-100 text-amber-800' : idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-amber-200/50 text-amber-900'
                            }`}>
                              {idx + 1}
                            </span>
                          ) : (
                            <span>#{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs">{opd.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{opd.code} — Pemkab Aceh Tamiang</div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-slate-900">{opd.totalCases}</td>
                        <td className="py-3.5 px-3 text-center font-semibold text-emerald-700 bg-emerald-50/50">{opd.completed}</td>
                        <td className="py-3.5 px-3 text-center font-semibold text-amber-700 bg-amber-50/50">{opd.inProgress}</td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-700">{opd.avgDurationDays} Hari</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`font-bold ${opd.slaComplianceRate >= 95 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {opd.slaComplianceRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium text-slate-600">{opd.revisionRate}%</td>
                        <td className="py-3.5 px-4 text-center">
                          {opd.slaComplianceRate >= 95 ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                              SANGAT BAIK
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800 border-none text-[10px] font-bold">
                              BAIK
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KEPATUHAN NORMA HUKUM & AUDIT BPK RI */}
      {/* ========================================================================= */}
      {(activeTab === 'audit' || activeTab === 'print') && (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-200/90 shadow-xs">
            <CardHeader className="bg-slate-50/60 border-b border-slate-200/80 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Laporan Kepatuhan Norma Hukum & Pengujian Regulasi BPK RI</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pengawasan preventif terhadap konsideran Mengingat, hierarki perundang-undangan, dan potensi cacat formil
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-600 text-white font-bold text-xs">
                  NIHIL CACAT FORMIL
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditFindings.map((finding, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{finding.category}</span>
                        <Badge variant="outline" className={`text-[10px] font-bold ${
                          finding.status === 'TERKOREKSI' 
                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {finding.count} Kasus — {finding.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 text-slate-500 font-medium">
                      <span>Tingkat Kritis: <b className="text-slate-800">{finding.severity}</b></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Telah Selaras 100%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal Reference Direct Links */}
              <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-blue-950">Sinkronisasi Database BPK RI & JDIH Terpadu</h4>
                    <p className="text-[11px] text-blue-800">
                      Seluruh naskah produk hukum terhubung otomatis dengan portal resmi JDIHN BPHN, Peraturan BPK RI, dan JDIH Aceh Tamiang.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a 
                    href="https://peraturan.bpk.go.id" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-800 font-bold text-xs hover:bg-blue-50"
                  >
                    <span>BPK RI</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://jdih.acehtamiangkab.go.id" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    <span>JDIH Tamiang</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4 / PRINT: LEMBAR PENGESAHAN & TANDA TANGAN PEJABAT */}
      {/* ========================================================================= */}
      {(activeTab === 'print' || isPrinting) && (
        <div className="mt-8 pt-6 border-t-2 border-slate-300">
          <div className="text-center mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Lembar Pengesahan Akuntabilitas & Verifikasi Hierarki
            </h4>
            <p className="text-[11px] text-slate-500">
              Disahkan di Karang Baru, Kabupaten Aceh Tamiang pada tanggal {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
            {/* Pejabat 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-slate-600 font-medium">Diperiksa & Diverifikasi Oleh:</p>
              <p className="font-bold text-slate-900 mt-0.5">Perancang Peraturan / Kasubbag</p>
              <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                [Tanda Tangan Digital / TTE BSrE]
              </div>
              <p className="font-black text-slate-900 underline underline-offset-2">M. YUSUF, S.H., M.H.</p>
              <p className="text-[10px] text-slate-500">NIP. 19880512 201102 1 002</p>
            </div>

            {/* Pejabat 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-slate-600 font-medium">Disetujui Oleh:</p>
              <p className="font-bold text-slate-900 mt-0.5">Kepala Bagian Hukum Setdakab</p>
              <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                [Tanda Tangan Digital / TTE BSrE]
              </div>
              <p className="font-black text-slate-900 underline underline-offset-2">DAHLAN, S.H., M.Hum.</p>
              <p className="text-[10px] text-slate-500">NIP. 19760814 200312 1 004</p>
            </div>

            {/* Pejabat 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-slate-600 font-medium">Mengetahui:</p>
              <p className="font-bold text-slate-900 mt-0.5">Sekretaris Daerah Kab. Aceh Tamiang</p>
              <div className="h-16 flex items-center justify-center text-slate-300 italic text-[11px]">
                [Tanda Tangan Digital / TTE BSrE]
              </div>
              <p className="font-black text-slate-900 underline underline-offset-2">Drs. TRI KURNIA, M.Pd.</p>
              <p className="text-[10px] text-slate-500">NIP. 19680410 199303 1 005</p>
            </div>
          </div>

          <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
            Dokumen ini di-generate secara otomatis oleh HARM System (Sistem Harmonisasi Dokumen Terpadu) — Bagian Hukum Setdakab Aceh Tamiang.
            <br />
            Integritas berkas terverifikasi SHA-256 &middot; Terkoneksi Google Drive Cloud Setdakab.
          </div>
        </div>
      )}
    </div>
  );
}
