import os

base_path = r'C:\Users\Myusu\.gemini\antigravity\scratch\harm-system\apps\web'

files = {
    'src/app/(dashboard)/command-center/page.tsx': '''import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import StafDashboard from '@/components/command-center/staf-dashboard';
import AtasanDashboard from '@/components/command-center/atasan-dashboard';
import AdminDashboard from '@/components/command-center/admin-dashboard';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Command Center | HARM',
};

export default async function CommandCenterPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Fetch user role - assuming it's stored in app_metadata or public.users
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const role = userProfile?.role || 'STAF'; // Default for UI preview

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
      </div>
      <Suspense fallback={<div>Memuat dashboard...</div>}>
        {role === 'STAF' && <StafDashboard />}
        {role === 'ATASAN' && <AtasanDashboard />}
        {role === 'ADMIN' && <AdminDashboard />}
      </Suspense>
    </div>
  );
}
''',

    'src/components/command-center/staf-dashboard.tsx': ''''use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StafDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pekerjaan Saya</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 Case</div>
          <p className="text-xs text-muted-foreground">3 Task jatuh tempo</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5 Item</div>
          <p className="text-xs text-muted-foreground">2 Revisi masuk, 3 Draft belum selesai</p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild variant="outline"><Link href="/cases/new">Buat Permohonan</Link></Button>
          <Button asChild variant="outline"><Link href="/tasks/new">Buat Task</Link></Button>
          <Button asChild variant="outline"><Link href="/search">Cari Case</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/components/command-center/atasan-dashboard.tsx': ''''use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, FileCheck, BarChart } from 'lucide-react';

export default function AtasanDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Review Menunggu</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">Approval Queue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Case Berisiko</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">SLA kritis / dikembalikan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Workload Staf</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15 Aktif</div>
          <p className="text-xs text-muted-foreground">Rata-rata 5 case/staf</p>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/components/command-center/admin-dashboard.tsx': ''''use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Users, Database, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Server className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Normal</div>
          <p className="text-xs text-muted-foreground">API, DB, Storage aktif</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User & Roles</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">Total pengguna terdaftar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Job Queue</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5 Running</div>
          <p className="text-xs text-muted-foreground">12 Queued, 0 Failed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Error Center</CardTitle>
          <ShieldAlert className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2 Errors</div>
          <p className="text-xs text-muted-foreground">Dalam 24 jam terakhir</p>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/(dashboard)/intake/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Intake Internal | HARM',
};

export default function IntakePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Intake Management</h2>
        <div className="flex space-x-2">
          <Button asChild><Link href="/intake/public">Lihat Intake Publik</Link></Button>
          <Button asChild variant="outline"><Link href="/cases/new">Buat Case Internal</Link></Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Intake Internal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gunakan menu "Buat Case Internal" untuk membuat permohonan baru langsung ke dalam sistem.</p>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/(dashboard)/intake/public/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = {
  title: 'Intake Publik | HARM',
};

export default function PublicIntakePage() {
  // Dummy data
  const intakes = [
    { id: '1', opd: 'Dinas Kesehatan', date: '2026-09-10', status: 'PENDING', token: 'TRK-ABC123XYZ' },
    { id: '2', opd: 'Dinas Pendidikan', date: '2026-09-11', status: 'CONFIRMED', token: 'TRK-DEF456UVW' },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Daftar Intake Publik</h2>
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan dari OPD (Publik)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OPD</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Token Tracking</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intakes.map(intake => (
                <TableRow key={intake.id}>
                  <TableCell>{intake.opd}</TableCell>
                  <TableCell>{intake.date}</TableCell>
                  <TableCell>{intake.status}</TableCell>
                  <TableCell>{intake.token}</TableCell>
                  <TableCell className="space-x-2">
                    {intake.status === 'PENDING' && (
                      <>
                        <Button size="sm">Konfirmasi</Button>
                        <Button size="sm" variant="destructive">Tolak</Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/public-intake/page.tsx': ''''use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitPublicIntake } from '@/lib/actions/intake';

export default function PublicIntakeForm() {
  const [token, setToken] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await submitPublicIntake(formData);
    if (result.success && result.token) {
      setToken(result.token);
    }
  }

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Pengajuan Berhasil</CardTitle>
            <CardDescription>Simpan token tracking di bawah ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-100 rounded-lg text-2xl font-mono font-bold">{token}</div>
            <p className="mt-4 text-sm text-gray-500">Gunakan token ini pada halaman tracking untuk memantau status pengajuan Anda.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.href='/tracking'}>Cek Status Sekarang</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 bg-gray-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pra-Pendaftaran HARM</h1>
          <p className="text-gray-600 mt-2">Pemerintah Kabupaten Aceh Tamiang</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Formulir Pengajuan Dokumen</CardTitle>
            <CardDescription>Ini adalah pra-pendaftaran, bukan permohonan resmi. Nomor HARM akan diberikan setelah verifikasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opd">Nama OPD</Label>
                  <Input id="opd" name="opd" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicant_name">Nama Pemohon</Label>
                  <Input id="applicant_name" name="applicant_name" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Kontak</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Judul Dokumen</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="files">Unggah Berkas Pendukung (PDF)</Label>
                <Input id="files" name="files" type="file" multiple accept=".pdf" />
              </div>
              <Button type="submit" className="w-full">Kirim Pengajuan</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
''',

    'src/lib/actions/intake.ts': ''''use server';

export async function submitPublicIntake(formData: FormData) {
  // In a real app, parse with zod and insert to DB, then generate token
  const token = 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  return { success: true, token };
}

export async function getPublicIntakes(filters: any) {
  return [];
}

export async function confirmIntake(id: string) {
  return { success: true };
}

export async function rejectIntake(id: string, reason: string) {
  return { success: true };
}

export async function getIntakeByToken(token: string) {
  // Mock response
  if (token.startsWith('TRK-')) {
    return {
      status: 'DITERIMA',
      harmNumber: null,
      timeline: [
        { date: new Date().toISOString(), step: 'Diterima Sistem' }
      ]
    };
  }
  return null;
}
''',

    'src/app/tracking/page.tsx': ''''use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function TrackingPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      router.push(`/tracking/${token}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Lacak Status Pengajuan</CardTitle>
          <CardDescription>Masukkan Token Tracking Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input 
              placeholder="Contoh: TRK-ABC123" 
              value={token} 
              onChange={(e) => setToken(e.target.value)}
              className="flex-1"
            />
            <Button type="submit"><Search className="w-4 h-4 mr-2" />Cari</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/tracking/[token]/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIntakeByToken } from '@/lib/actions/intake';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function TrackingResultPage({ params }: { params: { token: string } }) {
  const { token } = await params;
  const result = await getIntakeByToken(token);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Token Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Pastikan token yang Anda masukkan benar.</p>
            <Button asChild><Link href="/tracking">Kembali</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 bg-gray-50 px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Status Pengajuan</CardTitle>
          <p className="text-sm text-muted-foreground">Token: {token}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Status Saat Ini: {result.status}</h3>
                {result.harmNumber && <p className="text-sm">No HARM: {result.harmNumber}</p>}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Riwayat Status</h4>
              <div className="space-y-4">
                {result.timeline.map((item: any, i: number) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{item.step}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full"><Link href="/tracking">Cek Token Lain</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/(dashboard)/my-work/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = { title: 'My Work | HARM' };

export default function MyWorkPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pekerjaan Saya</h2>
      
      <Tabs defaultValue="tugas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tugas">Tugas Saya</TabsTrigger>
          <TabsTrigger value="review">Review Saya</TabsTrigger>
          <TabsTrigger value="menunggu">Menunggu</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tugas">
          <Card>
            <CardHeader><CardTitle>Daftar Tugas Aktif</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Belum ada tugas saat ini.</p></CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card>
            <CardHeader><CardTitle>Review Menunggu</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Tidak ada dokumen untuk direview.</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menunggu">
          <Card>
            <CardHeader><CardTitle>Status Menunggu</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Tidak ada item yang sedang menunggu.</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader><CardTitle>Item Overdue</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Bagus! Tidak ada item yang melewati batas waktu.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
''',

    'src/app/(dashboard)/tasks/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = { title: 'Daftar Tugas | HARM' };

export default function GlobalTasksPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Semua Tugas</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">Gunakan filter untuk menemukan tugas (Status, Prioritas, Tanggal Jatuh Tempo)</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tugas</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">Tidak ada tugas ditemukan</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/(dashboard)/notifications/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export const metadata = { title: 'Notifikasi | HARM' };

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
        <Button variant="outline">Tandai Semua Dibaca</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5" /> Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Tidak ada notifikasi baru.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/components/layout/notification-bell.tsx': ''''use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Notifikasi (1)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Tugas Baru</span>
            <span className="text-xs text-muted-foreground">Anda ditugaskan ke Case #12345</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full text-center text-sm">Lihat Semua</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
''',

    'src/lib/actions/notifications.ts': ''''use server';

export async function getNotifications(userId: string) { return []; }
export async function markAsRead(id: string) { return { success: true }; }
export async function markAllAsRead() { return { success: true }; }
export async function getUnreadCount(userId: string) { return 0; }
export async function createNotification(userId: string, type: string, title: string, message: string, caseId?: string, actionUrl?: string) {
  return { success: true };
}
''',

    'src/app/(dashboard)/search/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const metadata = { title: 'Pencarian Global | HARM' };

export default function GlobalSearchPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pencarian</h2>
      
      <div className="flex space-x-2 mb-6">
        <Input placeholder="Cari case, dokumen, atau tugas..." className="max-w-xl" />
        <Button><Search className="h-4 w-4 mr-2"/> Cari</Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-sm">Filter Pencarian</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><label className="flex items-center space-x-2"><input type="checkbox" /> <span>Case</span></label></div>
                <div><label className="flex items-center space-x-2"><input type="checkbox" /> <span>Dokumen</span></label></div>
                <div><label className="flex items-center space-x-2"><input type="checkbox" /> <span>Evidence</span></label></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Tidak ada hasil ditemukan. Silakan masukkan kata kunci.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
''',

    'src/app/(dashboard)/evidence/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = { title: 'Evidence | HARM' };

export default function EvidenceIndexPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pusat Evidence</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Seluruh Evidence</CardTitle>
            <Input placeholder="Cari deskripsi..." className="w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Sumber</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Belum ada data evidence yang tersimpan.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
''',

    'src/app/(dashboard)/reports/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const metadata = { title: 'Laporan | HARM' };

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Laporan & Metrik</h2>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Case</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">142</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">SLA Compliance</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">94%</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Rata-rata Durasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">4.2 Hari</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Tingkat Revisi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-500">12%</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Distribusi per OPD</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center"><span className="w-32 text-sm">Dinas Kesehatan</span><div className="h-4 bg-blue-500 rounded" style={{width: '80%'}}></div><span className="ml-2 text-xs">45</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Dinas Pendidikan</span><div className="h-4 bg-blue-500 rounded" style={{width: '60%'}}></div><span className="ml-2 text-xs">34</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Dinas PUPR</span><div className="h-4 bg-blue-500 rounded" style={{width: '40%'}}></div><span className="ml-2 text-xs">22</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Status Case</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center"><span className="w-32 text-sm">Draft</span><div className="h-4 bg-gray-500 rounded" style={{width: '30%'}}></div><span className="ml-2 text-xs">15</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Proses Verifikasi</span><div className="h-4 bg-yellow-500 rounded" style={{width: '50%'}}></div><span className="ml-2 text-xs">28</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Selesai</span><div className="h-4 bg-green-500 rounded" style={{width: '90%'}}></div><span className="ml-2 text-xs">99</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
''',

    'src/app/(dashboard)/account/page.tsx': '''import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata = { title: 'Profil Akun | HARM' };

export default function AccountPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pengaturan Akun</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Perbarui informasi profil Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input id="jabatan" defaultValue="Staf Hukum" disabled />
            </div>
            <Button>Simpan Perubahan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
            <CardDescription>Ubah kata sandi Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Kata Sandi Saat Ini</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">Kata Sandi Baru</Label>
              <Input id="new" type="password" />
            </div>
            <Button variant="outline">Perbarui Kata Sandi</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
''',

    'src/lib/actions/profile.ts': ''''use server';

export async function getProfile() { return {}; }
export async function updateProfile(data: any) { return { success: true }; }
export async function changePassword(oldPass: string, newPass: string) { return { success: true }; }
export async function getNotificationPreferences() { return {}; }
export async function updateNotificationPreferences(data: any) { return { success: true }; }
export async function getActiveSessions() { return []; }
export async function revokeSession(id: string) { return { success: true }; }
''',

    'src/components/case/case-export-dialog.tsx': ''''use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function CaseExportDialog({ caseId }: { caseId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"/> Export Case</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data Case</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Metadata & Timeline</span></Label>
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Dokumen Utama</span></Label>
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Evidence & Lampiran</span></Label>
            <Label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /> <span>Log Audit</span></Label>
          </div>
          <Button className="w-full">Mulai Unduhan (ZIP)</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
''',

    'src/components/case/finalization-checklist.tsx': ''''use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FinalizationChecklist() {
  const items = [
    { label: 'Metadata lengkap', status: true },
    { label: 'Dokumen wajib tersedia', status: true },
    { label: 'Review telah diselesaikan', status: false },
    { label: 'Persetujuan selesai', status: false },
  ];

  const completed = items.filter(i => i.status).length;
  const progress = (completed / items.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Checklist Finalisasi ({Math.round(progress)}%)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-2 mt-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center space-x-2 text-sm">
              {item.status ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
''',

    'src/components/case/sla-indicator.tsx': ''''use client';

import { Clock } from 'lucide-react';

export function SLAIndicator({ remainingDays, status }: { remainingDays: number, status: 'GREEN' | 'YELLOW' | 'RED' }) {
  const colors = {
    GREEN: 'bg-green-100 text-green-800 border-green-200',
    YELLOW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    RED: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${colors[status]}`}>
      <Clock className="h-4 w-4" />
      <span>SLA: {remainingDays > 0 ? `${remainingDays} Hari Lagi` : 'Terlambat'}</span>
    </div>
  );
}
''',

    'src/components/case/health-indicator.tsx': '''import { Activity } from 'lucide-react';

export function HealthIndicator({ score }: { score: number }) {
  const isHealthy = score > 80;
  const isWarning = score > 50 && score <= 80;
  
  const color = isHealthy ? 'text-green-600 bg-green-100' : isWarning ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100';
  const label = isHealthy ? 'Sehat' : isWarning ? 'Perlu Perhatian' : 'Kritis';

  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${color}`} title={`Skor Kesehatan: ${score}/100`}>
      <Activity className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
''',

    'src/components/case/completeness-score.tsx': '''import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CompletenessScore({ metadata, docs, evidence }: { metadata: number, docs: number, evidence: number }) {
  const overall = Math.round((metadata + docs + evidence) / 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Skor Kelengkapan: {overall}%</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <div className="flex justify-between mb-1"><span>Metadata</span><span>{metadata}%</span></div>
          <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${metadata}%`}}></div></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Dokumen</span><span>{docs}%</span></div>
          <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${docs}%`}}></div></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Evidence</span><span>{evidence}%</span></div>
          <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${evidence}%`}}></div></div>
        </div>
      </CardContent>
    </Card>
  );
}
'''
}

for file_path, content in files.items():
    full_path = os.path.join(base_path, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
print('All files written successfully.')
