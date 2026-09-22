'use client';

import { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Download,
  Filter,
  MapPin,
  Save,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export interface OpdItem {
  id: string;
  kode: string;
  nama: string;
  kategori: 'DINAS' | 'BADAN' | 'SEKRETARIAT' | 'INSPEKTORAT' | 'KECAMATAN';
  email: string;
  phone: string;
  picName: string;
  userCount: number;
  activeCases: number;
  isActive: boolean;
}

const INITIAL_OPD_LIST: OpdItem[] = [
  {
    id: 'opd-1',
    kode: 'SETDAKAB',
    nama: 'Sekretariat Daerah Kabupaten Aceh Tamiang',
    kategori: 'SEKRETARIAT',
    email: 'setda@acehtamiangkab.go.id',
    phone: '0641-31001',
    picName: 'Drs. Tri Kurnia (Asisten I)',
    userCount: 18,
    activeCases: 6,
    isActive: true,
  },
  {
    id: 'opd-2',
    kode: 'BPKD',
    nama: 'Badan Pengelolaan Keuangan Daerah',
    kategori: 'BADAN',
    email: 'bpkd@acehtamiangkab.go.id',
    phone: '0641-31012',
    picName: 'Yusriah, S.E., M.Si.',
    userCount: 12,
    activeCases: 4,
    isActive: true,
  },
  {
    id: 'opd-3',
    kode: 'BKPSDM',
    nama: 'Badan Kepegawaian & Pengembangan SDM',
    kategori: 'BADAN',
    email: 'bkpsdm@acehtamiangkab.go.id',
    phone: '0641-31002',
    picName: 'Muhammad Mahyar, S.STP',
    userCount: 9,
    activeCases: 3,
    isActive: true,
  },
  {
    id: 'opd-4',
    kode: 'DINKES',
    nama: 'Dinas Kesehatan Kabupaten Aceh Tamiang',
    kategori: 'DINAS',
    email: 'dinkes@acehtamiangkab.go.id',
    phone: '0641-31004',
    picName: 'dr. Mustakim, M.Kes.',
    userCount: 15,
    activeCases: 5,
    isActive: true,
  },
  {
    id: 'opd-5',
    kode: 'DPUPR',
    nama: 'Dinas Pekerjaan Umum dan Penataan Ruang',
    kategori: 'DINAS',
    email: 'dpupr@acehtamiangkab.go.id',
    phone: '0641-31008',
    picName: 'Ir. Edi Noviar, M.T.',
    userCount: 11,
    activeCases: 3,
    isActive: true,
  },
  {
    id: 'opd-6',
    kode: 'DISDIKBUD',
    nama: 'Dinas Pendidikan dan Kebudayaan',
    kategori: 'DINAS',
    email: 'disdik@acehtamiangkab.go.id',
    phone: '0641-31005',
    picName: 'Drs. Abdul Muthalib',
    userCount: 14,
    activeCases: 2,
    isActive: true,
  },
  {
    id: 'opd-7',
    kode: 'DPMK',
    nama: 'Dinas Pemberdayaan Masyarakat dan Kampung',
    kategori: 'DINAS',
    email: 'dpmk@acehtamiangkab.go.id',
    phone: '0641-31015',
    picName: 'M. Nur, S.Pd.',
    userCount: 8,
    activeCases: 4,
    isActive: true,
  },
  {
    id: 'opd-8',
    kode: 'DLH',
    nama: 'Dinas Lingkungan Hidup',
    kategori: 'DINAS',
    email: 'dlh@acehtamiangkab.go.id',
    phone: '0641-31018',
    picName: 'Suriyani, S.P., M.Si.',
    userCount: 7,
    activeCases: 2,
    isActive: true,
  },
  {
    id: 'opd-9',
    kode: 'SATPOL_PP',
    nama: 'Satuan Polisi Pamong Praja dan Wilayatul Hisbah',
    kategori: 'DINAS',
    email: 'satpolpp@acehtamiangkab.go.id',
    phone: '0641-31020',
    picName: 'Oki Kurniawan, S.STP',
    userCount: 8,
    activeCases: 2,
    isActive: true,
  },
  {
    id: 'opd-10',
    kode: 'INSPEKTORAT',
    nama: 'Inspektorat Daerah Kabupaten Aceh Tamiang',
    kategori: 'INSPEKTORAT',
    email: 'inspektorat@acehtamiangkab.go.id',
    phone: '0641-31006',
    picName: 'Aulia Rahman, S.E., Ak.',
    userCount: 10,
    activeCases: 1,
    isActive: true,
  },
  {
    id: 'opd-11',
    kode: 'SETWAN',
    nama: 'Sekretariat DPRK Aceh Tamiang',
    kategori: 'SEKRETARIAT',
    email: 'setwan@acehtamiangkab.go.id',
    phone: '0641-31030',
    picName: 'Rahmat Syahputra, S.H.',
    userCount: 6,
    activeCases: 2,
    isActive: true,
  },
  {
    id: 'opd-12',
    kode: 'KEC_KARANG_BARU',
    nama: 'Kecamatan Karang Baru',
    kategori: 'KECAMATAN',
    email: 'karangbaru@acehtamiangkab.go.id',
    phone: '0641-31041',
    picName: 'Camat Karang Baru',
    userCount: 4,
    activeCases: 1,
    isActive: true,
  }
];

export default function OpdManagerClient() {
  const [opds, setOpds] = useState<OpdItem[]>(INITIAL_OPD_LIST);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpd, setEditingOpd] = useState<OpdItem | null>(null);

  // Form states
  const [formKode, setFormKode] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formKategori, setFormKategori] = useState<'DINAS' | 'BADAN' | 'SEKRETARIAT' | 'INSPEKTORAT' | 'KECAMATAN'>('DINAS');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPic, setFormPic] = useState('');

  const handleOpenAdd = () => {
    setEditingOpd(null);
    setFormKode('');
    setFormNama('');
    setFormKategori('DINAS');
    setFormEmail('');
    setFormPhone('');
    setFormPic('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (opd: OpdItem) => {
    setEditingOpd(opd);
    setFormKode(opd.kode);
    setFormNama(opd.nama);
    setFormKategori(opd.kategori);
    setFormEmail(opd.email);
    setFormPhone(opd.phone);
    setFormPic(opd.picName);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKode.trim() || !formNama.trim()) return;

    if (editingOpd) {
      setOpds(opds.map(item => item.id === editingOpd.id ? {
        ...item,
        kode: formKode.toUpperCase().trim(),
        nama: formNama.trim(),
        kategori: formKategori,
        email: formEmail.trim(),
        phone: formPhone.trim(),
        picName: formPic.trim() || 'Staf Penghubung',
      } : item));
    } else {
      const newOpd: OpdItem = {
        id: `opd-${Date.now()}`,
        kode: formKode.toUpperCase().trim(),
        nama: formNama.trim(),
        kategori: formKategori,
        email: formEmail.trim() || `${formKode.toLowerCase()}@acehtamiangkab.go.id`,
        phone: formPhone.trim() || '0641-31000',
        picName: formPic.trim() || 'Staf Penghubung',
        userCount: 1,
        activeCases: 0,
        isActive: true,
      };
      setOpds([newOpd, ...opds]);
    }

    setIsDialogOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setOpds(opds.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
  };

  const handleExportCsv = () => {
    const headers = 'ID,Kode,Nama,Kategori,Email,Telepon,PIC,Pengguna,PerkaraAktif,Status\n';
    const rows = opds.map(o => `"${o.id}","${o.kode}","${o.nama}","${o.kategori}","${o.email}","${o.phone}","${o.picName}",${o.userCount},${o.activeCases},"${o.isActive ? 'Aktif' : 'Nonaktif'}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Daftar_OPD_Aceh_Tamiang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = opds.filter(item => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.picName.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.kategori === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs">
                Direktori Perangkat Daerah
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                Pemerintah Kabupaten Aceh Tamiang
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Organisasi Perangkat Daerah (OPD)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manajemen master data unit kerja, dinas pengusul, pejabat narahubung (PIC), dan akun instansi pemohon harmonisasi hukum daerah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={handleExportCsv}
              className="border-slate-700 bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
            <Button 
              onClick={handleOpenAdd}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tambah Instansi / OPD
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Instansi Terdaftar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{opds.length} Unit Kerja</div>
            <p className="text-xs text-sky-600 font-medium mt-1">Dinas, Badan, Setda, Kecamatan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Akun ASN Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {opds.reduce((acc, o) => acc + o.userCount, 0)} ASN
            </div>
            <p className="text-xs text-slate-500 mt-1">Terhubung ke Portal Pengajuan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Perkara Berjalan Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {opds.reduce((acc, o) => acc + o.activeCases, 0)} Perkara
            </div>
            <p className="text-xs text-slate-500 mt-1">Dalam proses telaah harmonisasi</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kepatuhan Integrasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">100%</div>
            <p className="text-xs text-slate-500 mt-1">Standarisasi Tata Naskah Dinas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari kode, nama OPD, atau nama PIC..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'DINAS', 'BADAN', 'SEKRETARIAT', 'INSPEKTORAT', 'KECAMATAN'].map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs h-8 ${categoryFilter === cat ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[100px] text-xs font-bold">Kode</TableHead>
                <TableHead className="text-xs font-bold">Nama Instansi</TableHead>
                <TableHead className="text-xs font-bold">Kategori</TableHead>
                <TableHead className="text-xs font-bold">Kontak & PIC</TableHead>
                <TableHead className="text-xs font-bold text-center">Akun ASN</TableHead>
                <TableHead className="text-xs font-bold text-center">Perkara Aktif</TableHead>
                <TableHead className="text-xs font-bold text-center">Status</TableHead>
                <TableHead className="w-[100px] text-xs font-bold text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500 text-xs">
                    Tidak ditemukan perangkat daerah yang sesuai kriteria pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-bold text-sky-700">
                      {item.kode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-slate-900">{item.nama}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {item.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-medium text-slate-700 border-slate-300">
                        {item.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-slate-800">{item.picName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {item.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Users className="w-3 h-3 text-slate-500" />
                        {item.userCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.activeCases > 0 ? 'default' : 'secondary'} className="text-[11px]">
                        {item.activeCases} Berkas
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <XCircle className="w-3.5 h-3.5" /> Nonaktif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-7 w-7 p-0 ${item.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                          onClick={() => handleToggleActive(item.id)}
                        >
                          {item.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOG ADD / EDIT OPD */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingOpd ? `Ubah Data OPD: ${editingOpd.nama}` : 'Tambah Organisasi Perangkat Daerah'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Daftarkan unit kerja baru di lingkungan Pemerintah Kabupaten Aceh Tamiang untuk integrasi permohonan harmonisasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Kode Instansi</Label>
                <Input 
                  placeholder="Contoh: DISHUB"
                  value={formKode}
                  onChange={(e) => setFormKode(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Kategori Instansi</Label>
                <select
                  className="w-full border p-2 rounded-md text-xs bg-white"
                  value={formKategori}
                  onChange={(e: any) => setFormKategori(e.target.value)}
                >
                  <option value="DINAS">DINAS DAERAH</option>
                  <option value="BADAN">BADAN DAERAH</option>
                  <option value="SEKRETARIAT">SEKRETARIAT DAERAH / SETWAN</option>
                  <option value="INSPEKTORAT">INSPEKTORAT DAERAH</option>
                  <option value="KECAMATAN">KECAMATAN</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nama Resmi Unit Kerja</Label>
              <Input 
                placeholder="Contoh: Dinas Perhubungan Kabupaten Aceh Tamiang"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Email Resmi Instansi</Label>
                <Input 
                  type="email"
                  placeholder="dishub@acehtamiangkab.go.id"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Nomor Telepon Dinas</Label>
                <Input 
                  placeholder="0641-31000"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Pejabat Penghubung / PIC Hukum</Label>
              <Input 
                placeholder="Nama Kepala OPD atau Kasubbag Umum / Hukum"
                value={formPic}
                onChange={(e) => setFormPic(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">
                <Save className="w-4 h-4 mr-1.5" />
                {editingOpd ? 'Perbarui OPD' : 'Simpan OPD'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
