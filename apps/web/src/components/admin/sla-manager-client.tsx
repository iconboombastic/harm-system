'use client';

import { useState } from 'react';
import { 
  Clock, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Sliders, 
  Zap, 
  BellRing,
  Info,
  Layers,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SlaStageConfig {
  id: string;
  name: string;
  role: string;
  hours: number;
}

interface SlaDocConfig {
  key: string;
  label: string;
  description: string;
  warningPercent: number;
  pauseOnWaitingOpd: boolean;
  stages: SlaStageConfig[];
}

const INITIAL_SLA_CONFIGS: Record<string, SlaDocConfig> = {
  PERBUP: {
    key: 'PERBUP',
    label: 'Peraturan Bupati (Perbup)',
    description: 'Standar Service Level Agreement untuk produk hukum pengaturan kepala daerah',
    warningPercent: 80,
    pauseOnWaitingOpd: true,
    stages: [
      { id: 'p1', name: 'Verifikasi Berkas & Syarat Formal', role: 'ANALIS_HUKUM', hours: 24 },
      { id: 'p2', name: 'Harmonisasi Pasal Demi Pasal', role: 'PERANCANG_HUKUM', hours: 72 },
      { id: 'p3', name: 'Rapat Koordinasi Antar OPD', role: 'TIM_HARMONISASI', hours: 48 },
      { id: 'p4', name: 'Fasilitasi Biro Hukum Provinsi Aceh', role: 'PROVINSI', hours: 96 },
      { id: 'p5', name: 'Paraf Koordinasi Asisten & Kabag Hukum', role: 'KABAG_HUKUM', hours: 24 },
      { id: 'p6', name: 'Penetapan & Pengundangan Bupati', role: 'BUPATI', hours: 48 },
    ]
  },
  QANUN: {
    key: 'QANUN',
    label: 'Qanun Kabupaten (Perda)',
    description: 'Standar waktu pengujian materiil dan persetujuan bersama DPRK Aceh Tamiang',
    warningPercent: 85,
    pauseOnWaitingOpd: true,
    stages: [
      { id: 'q1', name: 'Pemeriksaan Naskah Akademik & Prolegda', role: 'STAF_OPD', hours: 48 },
      { id: 'q2', name: 'Harmonisasi & Uji Kelayakan Norma Hukum', role: 'PERANCANG_HUKUM', hours: 96 },
      { id: 'q3', name: 'Pembahasan Komisi & RDPU DPRK', role: 'DPRK', hours: 168 },
      { id: 'q4', name: 'Evaluasi / Fasilitasi Gubernur Aceh', role: 'PROVINSI', hours: 168 },
      { id: 'q5', name: 'Paripurna Persetujuan Bersama', role: 'BUPATI_DPRK', hours: 72 },
      { id: 'q6', name: 'Pengundangan Lembaran Daerah', role: 'SEKDA', hours: 24 },
    ]
  },
  SK_BUPATI: {
    key: 'SK_BUPATI',
    label: 'Surat Keputusan Bupati (SK)',
    description: 'Target waktu proses keputusan tata usaha negara konkrete dan penetapan dinas',
    warningPercent: 75,
    pauseOnWaitingOpd: true,
    stages: [
      { id: 's1', name: 'Verifikasi Persyaratan Administrasi', role: 'ANALIS_HUKUM', hours: 24 },
      { id: 's2', name: 'Pemeriksaan Konsideran & Diktum (Drafter)', role: 'PERANCANG_HUKUM', hours: 48 },
      { id: 's3', name: 'Validasi Anggaran BPKD (Bila Relevan)', role: 'BPKD', hours: 24 },
      { id: 's4', name: 'Paraf Hierarkis Kasubbag & Kabag', role: 'KABAG_HUKUM', hours: 24 },
      { id: 's5', name: 'Penandatanganan oleh Bupati', role: 'BUPATI', hours: 48 },
    ]
  },
  INSTRUKSI: {
    key: 'INSTRUKSI',
    label: 'Instruksi Bupati',
    description: 'SLA jalur cepat untuk kebijakan taktis dan percepatan program daerah',
    warningPercent: 80,
    pauseOnWaitingOpd: false,
    stages: [
      { id: 'i1', name: 'Penyusunan Draf Kebijakan', role: 'STAF_SETDA', hours: 24 },
      { id: 'i2', name: 'Telaahan Kewenangan Hukum', role: 'KABAG_HUKUM', hours: 24 },
      { id: 'i3', name: 'Penetapan & Distribusi Resmi', role: 'BUPATI', hours: 24 },
    ]
  }
};

export default function SlaManagerClient() {
  const [configs, setConfigs] = useState<Record<string, SlaDocConfig>>(INITIAL_SLA_CONFIGS);
  const [activeTab, setActiveTab] = useState<string>('PERBUP');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentConfig = configs[activeTab];

  const handleStageHoursChange = (stageId: string, hours: number) => {
    const updatedStages = currentConfig.stages.map(s => 
      s.id === stageId ? { ...s, hours: Math.max(1, hours) } : s
    );
    setConfigs({
      ...configs,
      [activeTab]: {
        ...currentConfig,
        stages: updatedStages
      }
    });
  };

  const handleWarningPercentChange = (percent: number) => {
    setConfigs({
      ...configs,
      [activeTab]: {
        ...currentConfig,
        warningPercent: percent
      }
    });
  };

  const handleTogglePause = () => {
    setConfigs({
      ...configs,
      [activeTab]: {
        ...currentConfig,
        pauseOnWaitingOpd: !currentConfig.pauseOnWaitingOpd
      }
    });
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const totalHours = currentConfig.stages.reduce((acc, s) => acc + s.hours, 0);
  const totalDays = (totalHours / 24).toFixed(1);
  const warningHours = Math.round((totalHours * currentConfig.warningPercent) / 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">
                Manajemen Target Waktu (SLA)
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                Jam Kerja ASN Pemkab
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Service Level Agreement Harmonisasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Konfigurasikan target batas waktu penyelesaian per tahapan, ambang batas peringatan dini (*early warning*), dan aturan penundaan waktu (*clock-stop*) otomatis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Simpan Pengaturan SLA
            </Button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <strong className="font-bold">Konfigurasi SLA Berhasil Disimpan!</strong>
            <p className="text-emerald-700">Parameter batas waktu dan ambang peringatan diperbarui secara otomatis untuk seluruh permohonan baru.</p>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Waktu Kerja Efektif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">08:00 - 16:30</div>
            <p className="text-xs text-slate-500 mt-1">Senin - Jumat (Kecuali Hari Libur)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Total Durasi {currentConfig.label.split(' ')[0]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-700">{totalHours} Jam</div>
            <p className="text-xs text-slate-500 mt-1">Estimasi ~{totalDays} Hari Kerja Kalender</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Peringatan Dini ({currentConfig.warningPercent}%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-amber-700">{warningHours} Jam</div>
            <p className="text-xs text-slate-500 mt-1">Kirim peringatan kuning saat tercapai</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <PauseCircle className="w-3.5 h-3.5 text-indigo-600" />
              Aturan Clock-Stop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-indigo-700">
              {currentConfig.pauseOnWaitingOpd ? 'Aktif Otomatis' : 'Nonaktif'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Jeda waktu saat menunggu perbaikan OPD</p>
          </CardContent>
        </Card>
      </div>

      {/* SLA Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="PERBUP" className="text-xs font-semibold">Peraturan Bupati</TabsTrigger>
          <TabsTrigger value="QANUN" className="text-xs font-semibold">Qanun Kabupaten</TabsTrigger>
          <TabsTrigger value="SK_BUPATI" className="text-xs font-semibold">SK Bupati</TabsTrigger>
          <TabsTrigger value="INSTRUKSI" className="text-xs font-semibold">Instruksi Bupati</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stages SLA Breakdown (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Target Batas Waktu Per Tahapan
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Atur alokasi jam kerja maksimal untuk masing-masing analis dan perancang hukum.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-indigo-700 border-indigo-200">
                      {currentConfig.stages.length} Tahapan
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentConfig.stages.map((stage, idx) => (
                    <div 
                      key={stage.id} 
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{stage.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-7">
                          <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-300">
                            {stage.role}
                          </Badge>
                          <span className="text-[11px] text-slate-500">
                            (~{(stage.hours / 24).toFixed(1)} hari kerja)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Label htmlFor={`hours-${stage.id}`} className="text-xs font-semibold text-slate-600">
                          Alokasi:
                        </Label>
                        <Input 
                          id={`hours-${stage.id}`}
                          type="number"
                          min={1}
                          max={720}
                          value={stage.hours}
                          onChange={(e) => handleStageHoursChange(stage.id, Number(e.target.value))}
                          className="w-20 h-8 text-xs font-bold text-center bg-white"
                        />
                        <span className="text-xs text-slate-500">Jam Kerja</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* SLA Policy & Rules (1 Col) */}
            <div className="space-y-4">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Kebijakan Eskalasi & Clock-Stop
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Parameter otomatisasi sistem peringatan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Warning threshold */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-700">Ambang Batas Peringatan Dini</Label>
                      <span className="text-xs font-bold text-amber-600">{currentConfig.warningPercent}%</span>
                    </div>
                    <input 
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={currentConfig.warningPercent}
                      onChange={(e) => handleWarningPercentChange(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <p className="text-[11px] text-slate-500">
                      Notifikasi peringatan kuning (warning) akan dikirim ke WhatsApp drafter setelah melewati {warningHours} jam.
                    </p>
                  </div>

                  {/* Pause on OPD waiting */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-700">Jeda Waktu (Clock-Stop) OPD</Label>
                      <Button 
                        size="sm" 
                        variant={currentConfig.pauseOnWaitingOpd ? 'default' : 'outline'}
                        className={`h-7 text-xs ${currentConfig.pauseOnWaitingOpd ? 'bg-indigo-600' : ''}`}
                        onClick={handleTogglePause}
                      >
                        {currentConfig.pauseOnWaitingOpd ? 'Aktif' : 'Mati'}
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Saat permohonan dikembalikan ke instansi pemohon untuk revisi substansi, penghitungan waktu SLA otomatis dijeda agar tidak merugikan indikator kinerja Bagian Hukum.
                    </p>
                  </div>

                  {/* Holiday Calendar Note */}
                  <div className="pt-3 border-t border-slate-200 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-800">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Penghitungan Kalender Hari Kerja
                    </div>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Sistem terintegrasi dengan Kalender Hari Libur Nasional & Hari Libur Khusus Aceh (Ketetapan Gubernur Aceh & MoU Helsinki). Hari libur otomatis dilewati dalam kalkulasi SLA.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 bg-slate-50 rounded-b-xl">
                  <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    <Save className="w-3.5 h-3.5 mr-1.5" /> Simpan Perubahan {currentConfig.label.split(' ')[0]}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
