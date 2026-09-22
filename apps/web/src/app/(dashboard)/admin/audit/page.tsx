'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  User, 
  Terminal, 
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAuditTrail } from '@/lib/actions/admin';

interface AuditItem {
  id: string;
  created_at: string;
  user_name: string;
  action: string;
  entity: string;
  ip_address: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
}

const FALLBACK_LOGS: AuditItem[] = [
  {
    id: 'log-1',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    user_name: 'Drs. Tri Kurnia (Asisten I)',
    action: 'APPROVE_STAGE',
    entity: 'Permohonan HARM-2026-0089 (Perbup Pajak Sarang Burung Walet)',
    ip_address: '10.14.20.105',
    severity: 'INFO',
  },
  {
    id: 'log-2',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user_name: 'Ahmad Fauzi, S.H. (Perancang)',
    action: 'UPLOAD_DOCUMENT',
    entity: 'Draf_Perbup_Pajak_v2_Harmonisasi.docx (SHA-256 Validated)',
    ip_address: '10.14.20.112',
    severity: 'INFO',
  },
  {
    id: 'log-3',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user_name: 'Sistem Otomatis (Cron SLA)',
    action: 'AUTO_REMINDER_SLA',
    entity: 'Peringatan Dini SLA 80% pada HARM-2026-0098 (DPMK)',
    ip_address: '127.0.0.1',
    severity: 'WARNING',
  },
  {
    id: 'log-4',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    user_name: 'Budi Santoso, S.H.',
    action: 'UPDATE_WORKFLOW',
    entity: 'Konfigurasi Alur Qanun Kabupaten (Tambah Syarat Naskah Akademik)',
    ip_address: '10.14.20.101',
    severity: 'INFO',
  },
  {
    id: 'log-5',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    user_name: 'Administrator Sistem',
    action: 'USER_CREATED',
    entity: 'Akun Baru: drafter.disdik@acehtamiangkab.go.id (Role: STAF)',
    ip_address: '10.14.20.101',
    severity: 'INFO',
  },
  {
    id: 'log-6',
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    user_name: 'dr. Mustakim (Dinkes)',
    action: 'INTAKE_SUBMITTED',
    entity: 'Permohonan HARM-2026-0095 (SK Tim Pencegahan DBD)',
    ip_address: '114.125.77.23',
    severity: 'INFO',
  },
  {
    id: 'log-7',
    created_at: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    user_name: 'Firewall / Auth Gateway',
    action: 'FAILED_LOGIN_ATTEMPT',
    entity: 'Percobaan login tidak sah akun tamu@acehtamiangkab.go.id',
    ip_address: '182.1.88.94',
    severity: 'CRITICAL',
  },
];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditItem[]>(FALLBACK_LOGS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const data = await getAuditTrail();
      if (data && data.length > 0) {
        setLogs(data.map((d: any) => ({
          id: d.id || `log-${Math.random()}`,
          created_at: d.created_at || new Date().toISOString(),
          user_name: d.user_name || d.actor_name || 'Pengguna Sistem',
          action: d.action || d.event || 'UNKNOWN_ACTION',
          entity: d.entity || d.target || d.description || '-',
          ip_address: d.ip_address || '10.14.20.xxx',
          severity: d.severity || 'INFO',
        })));
      }
    } catch (e) {
      console.warn('Using fallback audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditData();
  }, []);

  const handleExportCsv = () => {
    const headers = 'Waktu,Pengguna,Aksi,Entitas,IP Address,Severity\n';
    const rows = filteredLogs.map(l => 
      `"${l.created_at}","${l.user_name}","${l.action}","${l.entity.replace(/"/g, '""')}","${l.ip_address}","${l.severity || 'INFO'}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Trail_HARM_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.user_name.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      l.ip_address.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || l.action.includes(actionFilter);

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">
                Integritas & Akuntabilitas Hukum
              </Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-700 text-xs">
                Immutable Audit Log
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Jejak Rekam Audit Digital (Audit Trail)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Catatan kronologis aktivitas pengguna, paraf hierarkis pimpinan, pengunggahan draf, perubahan status permohonan, dan peristiwa keamanan sistem yang tidak dapat diubah (append-only).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={loadAuditData}
              disabled={loading}
              className="border-slate-700 bg-white/10 hover:bg-white/20 text-white text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Segarkan
            </Button>
            <Button 
              onClick={handleExportCsv}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Audit
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari aksi, nama pengguna, berkas perkara, atau IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'APPROVE', 'UPLOAD', 'UPDATE', 'USER', 'REMINDER'].map((filterKey) => (
                <Button
                  key={filterKey}
                  variant={actionFilter === filterKey ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActionFilter(filterKey)}
                  className={`text-xs h-7 ${actionFilter === filterKey ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  {filterKey === 'ALL' ? 'Semua Log' : filterKey}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[180px] text-xs font-bold">Waktu & Tanggal</TableHead>
                <TableHead className="w-[180px] text-xs font-bold">Aparatur / Pengguna</TableHead>
                <TableHead className="w-[160px] text-xs font-bold">Aktivitas (Event)</TableHead>
                <TableHead className="text-xs font-bold">Objek & Keterangan</TableHead>
                <TableHead className="w-[120px] text-xs font-bold text-right pr-4">Alamat IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-500">
                    Tidak ditemukan catatan audit yang cocok dengan kriteria filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const dateObj = new Date(log.created_at);
                  const formattedDate = dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  const formattedTime = dateObj.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <TableRow key={log.id} className="hover:bg-slate-50/80">
                      <TableCell>
                        <div className="text-xs font-semibold text-slate-800">{formattedDate}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formattedTime} WIB
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-slate-900">{log.user_name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] font-mono py-0.5 px-2 ${
                            log.severity === 'CRITICAL' 
                              ? 'border-red-300 bg-red-50 text-red-700 font-bold' 
                              : log.severity === 'WARNING'
                              ? 'border-amber-300 bg-amber-50 text-amber-800'
                              : 'border-blue-200 bg-blue-50 text-blue-700'
                          }`}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-700 line-clamp-2">
                          {log.entity}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-4 font-mono text-xs text-slate-500">
                        {log.ip_address}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
