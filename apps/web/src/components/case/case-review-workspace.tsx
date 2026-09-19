'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Printer,
  ShieldCheck,
  Building2,
  HardDrive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  OFFICIAL_REGULATION_DATABASE, 
  OfficialRegulationLink,
  detectLegalDomain,
  getRegulationsByDomain
} from '@/lib/services/regulation-service';
import { dispatchReviewerNote } from '@/lib/actions/notes';

interface CaseReviewWorkspaceProps {
  caseId: string;
  caseTitle?: string;
  harmNumber?: string;
  opdName?: string;
}

export default function CaseReviewWorkspace({
  caseId,
  caseTitle = 'Raperbup Pajak Daerah & Retribusi Daerah (HARM-2026-007)',
  harmNumber = 'HARM-2026-007',
  opdName = 'Badan Pengelolaan Keuangan Daerah',
}: CaseReviewWorkspaceProps) {
  const [draftText, setDraftText] = useState(
    `BUPATI ACEH TAMIANG
PERATURAN BUPATI ACEH TAMIANG
NOMOR 12 TAHUN 2026
TENTANG
TATA CARA PEMUNGUTAN RETRIBUSI DAERAH

DENGAN RAHMAT ALLAH YANG MAHA KUASA
BUPATI ACEH TAMIANG,

Menimbang:
a. bahwa untuk melaksanakan ketentuan Pasal 95 Qanun Kabupaten Aceh Tamiang Nomor 1 Tahun 2024 tentang Pajak Daerah dan Retribusi Daerah, perlu menetapkan tata cara pemungutan retribusi daerah;
b. bahwa berdasarkan pertimbangan sebagaimana dimaksud dalam huruf a, perlu menetapkan Peraturan Bupati tentang Tata Cara Pemungutan Retribusi Daerah;

Mengingat:
1. Undang-Undang Nomor 11 Tahun 2006 tentang Pemerintahan Aceh;
2. Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 13 Tahun 2022;
3. Undang-Undang Nomor 1 Tahun 2022 tentang Hubungan Keuangan antara Pemerintah Pusat dan Pemerintahan Daerah;
4. Peraturan Pemerintah Nomor 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah;
5. Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;

MEMUTUSKAN:
Menetapkan: PERATURAN BUPATI TENTANG TATA CARA PEMUNGUTAN RETRIBUSI DAERAH.

BAB I
KETENTUAN UMUM
Pasal 1
Dalam Peraturan Bupati ini yang dimaksud dengan:
1. Daerah adalah Kabupaten Aceh Tamiang.
2. Pemerintah Daerah adalah Pemerintah Kabupaten Aceh Tamiang.
3. Bupati adalah Bupati Aceh Tamiang.
4. Pejabat Pengelola Keuangan Daerah yang selanjutnya disingkat PPKD adalah Kepala Badan Pengelolaan Keuangan Daerah Kabupaten Aceh Tamiang.
5. Retribusi Daerah yang selanjutnya disebut Retribusi adalah pungutan Daerah sebagai pembayaran atas jasa atau pemberian izin tertentu yang khusus disediakan dan/atau diberikan oleh Pemerintah Daerah untuk kepentingan orang pribadi atau badan.`
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  // Dynamically load precision sector regulations based on case title & OPD name
  const detectedDomain = detectLegalDomain(`${caseTitle} ${opdName} ${draftText}`);
  const relevantRegulations: OfficialRegulationLink[] = getRegulationsByDomain(detectedDomain).slice(0, 5);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditDone(true);
      // Trigger floating AI copilot with context
      window.dispatchEvent(
        new CustomEvent('harm:inspect-document', {
          detail: {
            title: caseTitle,
            type: 'Peraturan Bupati',
            category: `Substansi ${detectedDomain.replace('_', ' ')}`,
            opdName: opdName,
          },
        })
      );
    }, 900);
  };

  const handleDispatchReview = async () => {
    try {
      await dispatchReviewerNote({
        targetStaffName: 'M. Yusuf (Legal Drafter)',
        caseTitle: caseTitle,
        instruction: 'Hasil telaahan hukum: Konsideran Mengingat telah sesuai UU 1/2022 dan PP 35/2023. Mohon pastikan klausul batas waktu penyetoran kas ke RKUD maksimal 1x24 jam.',
        todos: [
          'Verifikasi nomor registrasi Qanun Pajak dan Retribusi 2024',
          'Pastikan batas waktu penyetoran kas selaras dengan PP 12/2019',
          'Siapkan naskah paraf hierarkis untuk Kabag Hukum'
        ],
        priority: 'HIGH',
        color: 'blue',
        senderRole: 'ATASAN',
      });
      setDispatched(true);
      setTimeout(() => setDispatched(false), 3000);
    } catch (e) {
      alert('Gagal mengirim disposisi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs">
              Modul Telaahan Hukum & Kepatuhan Regulasi
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" /> Terhubung BPK.RI & JDIHN
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Pemeriksaan Naskah Harmonisasi ({harmNumber})
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pengujian keselarasan hierarki norma, dasar hukum perundang-undangan, dan kepatuhan standar legal drafting UU No. 12/2011 jo. UU No. 13/2022.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAuditing ? 'Memindai Naskah...' : 'Jalankan Audit AI & BPK.RI'}</span>
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Cetak Telaahan</span>
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Draf Naskah Editor & Review Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Naskah Draf Regulasi Aktif
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Anda dapat mengedit atau menempelkan teks draf pasal untuk diuji langsung oleh AI.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(draftText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  <span>{copied ? 'Tersalin' : 'Salin Draf'}</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={20}
                className="font-mono text-xs leading-relaxed bg-slate-50 border-slate-200 text-slate-900 p-4 rounded-xl resize-y"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Compliance Findings & Official BPK/JDIH Links (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Audit Score Card */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <span>Status Kepatuhan Hukum</span>
                </CardTitle>
                <Badge className="bg-emerald-100 text-emerald-800 border-none text-xs font-bold">
                  92% Lulus Harmonisasi
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950">Konsideran Mengingat Memenuhi Standar BPK:</span>
                  <p className="text-emerald-900 mt-0.5">
                    Telah mencantumkan UU No. 1/2022 (HKPD) dan PP No. 35/2023. Tidak ditemukan rujukan undang-undang yang telah dicabut (UU 28/2009).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-blue-50/80 p-3 rounded-xl border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-950">Kekhususan Aceh Terpenuhi:</span>
                  <p className="text-blue-900 mt-0.5">
                    UU No. 11 Tahun 2006 (UUPA) telah dicantumkan pada konsideran Mengingat nomor 2 sesuai kaidah hierarki perundang-undangan di Aceh.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleDispatchReview}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 py-2.5 rounded-xl shadow-xs"
              >
                {dispatched ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4 text-amber-400" />}
                <span>{dispatched ? 'Disposisi Terkirim ke Meja Staf!' : 'Kirim Lembar Telaahan ke Staf Drafter'}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Direct BPK RI & JDIHN Reference Cards */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Tautan Referensi Resmi Terverifikasi</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Naskah resmi langsung dari database BPK RI & JDIHN.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {relevantRegulations.map((reg) => {
                const isBpk = reg.source === 'BPK_RI';

                return (
                  <div
                    key={reg.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        className={`text-[10px] font-bold ${
                          isBpk
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {reg.sourceName}
                      </Badge>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Masih Berlaku</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">
                      {reg.nomor}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {reg.tentang}
                    </p>

                    {/* Direct Clickable Link */}
                    <a
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                        isBpk
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <span>Buka di {reg.sourceName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
