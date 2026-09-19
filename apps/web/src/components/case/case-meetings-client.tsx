'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Plus, 
  HardDrive, 
  ExternalLink, 
  CheckCircle2, 
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

interface MeetingItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  leader: string;
  attendees: string[];
  status: 'COMPLETED' | 'SCHEDULED';
  summary: string;
  actionItems: string[];
  evidenceName?: string;
}

export default function CaseMeetingsClient({
  caseId,
  caseTitle = 'Rancangan Produk Hukum',
  currentUserRole = 'ADMIN',
}: {
  caseId: string;
  caseTitle?: string;
  currentUserRole?: string;
}) {
  const [meetings, setMeetings] = useState<MeetingItem[]>([
    {
      id: 'mtg-1',
      title: 'Rapat Pleno Harmonisasi Substantif Pasal per Pasal',
      date: '17 September 2026',
      time: '09:30 - 12:00 WIB',
      location: 'Ruang Rapat Bagian Hukum Setdakab Aceh Tamiang',
      leader: 'Dr. Ir. Teuku Iskandar (Reviewer Utama)',
      attendees: [
        'Dr. Ir. Teuku Iskandar (Kabag Hukum / Reviewer)',
        'M. Yusuf (Legal Drafter)',
        'Kadis Pengusul / Tim Teknis OPD',
        'Perwakilan BPKD Aceh Tamiang',
      ],
      status: 'COMPLETED',
      summary: 'Pembahasan menyeluruh mengenai konsideran menimbang, penyesuaian tarif retribusi zonasi, dan kepatuhan terhadap UU No. 1/2022.',
      actionItems: [
        'Drafter menyesuaikan klausul Pasal 8 ayat (2) mengenai pengecualian objek retribusi',
        'OPD melengkapi rekapitulasi data potensi wajib retribusi 3 tahun terakhir',
        'Notulensi dan daftar hadir diunggah ke Google Drive',
      ],
      evidenceName: 'Notulen_Rapat_Pleno_17Sep2026.pdf',
    },
    {
      id: 'mtg-2',
      title: 'Rapat Koordinasi Pra-Fasilitasi dengan Biro Hukum Provinsi',
      date: '21 September 2026',
      time: '10:00 - 11:30 WIB',
      location: 'Virtual Zoom / Ruang Command Center Setdakab',
      leader: 'Kabag Hukum Setdakab Aceh Tamiang',
      attendees: [
        'Tim Harmonisasi Bagian Hukum Aceh Tamiang',
        'Analis Kebijakan Biro Hukum Setda Provinsi Aceh',
      ],
      status: 'SCHEDULED',
      summary: 'Klarifikasi poin telaahan fasilitasi rancangan sebelum penerbitan rekomendasi gubernur.',
      actionItems: [
        'Siapkan matriks komparasi naskah awal vs naskah setelah pleno',
        'Pastikan SPTJM dan lembar paraf pimpinan telah lengkap',
      ],
    },
  ]);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLeader, setNewLeader] = useState('');
  const [newAttendees, setNewAttendees] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const handleCreateMeeting = () => {
    if (!newTitle.trim() || !newDate.trim()) return;

    const attendeesList = newAttendees
      .split('\n')
      .map(a => a.trim())
      .filter(Boolean);

    const newMtg: MeetingItem = {
      id: `mtg-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate.trim(),
      time: newTime.trim() || '09:00 - 11:00 WIB',
      location: newLocation.trim() || 'Ruang Rapat Bagian Hukum Setdakab',
      leader: newLeader.trim() || 'Kabag Hukum / Reviewer',
      attendees: attendeesList.length > 0 ? attendeesList : ['Tim Bagian Hukum', 'Tim Teknis OPD'],
      status: 'SCHEDULED',
      summary: newSummary.trim() || 'Rapat koordinasi dan pembahasan berkas.',
      actionItems: ['Konfirmasi kehadiran peserta rapat', 'Siapkan bahan tayang dan draf naskah'],
    };

    setMeetings([newMtg, ...meetings]);
    setIsScheduleOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
    setNewLeader('');
    setNewAttendees('');
    setNewSummary('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Agenda & Notulensi
            </span>
            <span className="text-xs text-slate-400">Kasus ID: #{caseId.slice(0, 8)}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Rapat Pembahasan & Pleno Harmonisasi
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Kelola jadwal rapat pleno, catat notulensi pasal, daftar hadir, dan dokumentasi rapat yang tersimpan langsung di Google Drive.
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
            <span>Arsip Google Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {(currentUserRole === 'ADMIN' || currentUserRole === 'ATASAN') && (
            <Button
              onClick={() => setIsScheduleOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Jadwalkan Rapat</span>
            </Button>
          )}
        </div>
      </div>

      {/* Meeting Cards List */}
      <div className="space-y-4">
        {meetings.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-2xl border ${
              m.status === 'COMPLETED' ? 'border-slate-200' : 'border-indigo-300 ring-1 ring-indigo-200'
            } shadow-sm p-6 space-y-4`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${
                      m.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    }`}
                  >
                    {m.status === 'COMPLETED' ? 'Rapat Selesai Dilaksanakan' : 'Terjadwal'}
                  </Badge>
                  <span className="text-xs text-slate-400">Pimpinan: {m.leader}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{m.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{m.time}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Ringkasan Pembahasan & Notulensi:</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {m.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-1.5">Hasil Tindak Lanjut / Action Items:</h4>
                  <ul className="space-y-1">
                    {m.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Lokasi / Tempat:
                  </h4>
                  <p className="text-slate-600">{m.location}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Daftar Hadir / Peserta:
                  </h4>
                  <ul className="space-y-1 text-slate-600">
                    {m.attendees.map((att, idx) => (
                      <li key={idx} className="truncate">• {att}</li>
                    ))}
                  </ul>
                </div>

                {m.evidenceName && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 block mb-1">Notulen & Berita Acara (G-Drive):</span>
                    <a
                      href={GDRIVE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{m.evidenceName}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Jadwalkan Rapat */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Jadwalkan Rapat Pembahasan Baru</span>
            </DialogTitle>
            <DialogDescription>
              Agenda rapat untuk permohonan #{caseId.slice(0, 8)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Agenda Rapat *</label>
              <Input
                placeholder="Contoh: Rapat Pleno Harmonisasi Konsideran & Tarif"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Tanggal *</label>
                <Input
                  placeholder="Contoh: 24 September 2026"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Waktu Pelaksanaan</label>
                <Input
                  placeholder="Contoh: 09:30 - 12:00 WIB"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Tempat / Ruangan</label>
                <Input
                  placeholder="Ruang Rapat Bagian Hukum"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Pimpinan Rapat</label>
                <Input
                  placeholder="Contoh: Kabag Hukum / Reviewer"
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Daftar Undangan / Peserta (Satu per baris)</label>
              <Textarea
                placeholder="Tim Perancang Bagian Hukum&#10;Kepala OPD Pemrakarsa&#10;Perwakilan BPKD"
                value={newAttendees}
                onChange={(e) => setNewAttendees(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Pokok Pembahasan Awal</label>
              <Textarea
                placeholder="Pokok pembahasan materi muatan raperda/raperbup..."
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                rows={2}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateMeeting}
              disabled={!newTitle.trim() || !newDate.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Simpan Jadwal Rapat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
