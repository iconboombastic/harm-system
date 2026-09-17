import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Workflow, ShieldAlert, Activity, FileStack, Database, Server } from 'lucide-react';
import { getSystemHealth } from '@/lib/actions/admin';
import { getHealthColor } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default async function AdminDashboard() {
  const health = await getSystemHealth();

  const menuItems = [
    { title: 'Manajemen Pengguna', desc: 'Kelola akses dan profil pengguna', icon: Users, href: '/admin/users' },
    { title: 'Struktur OPD', desc: 'Kelola unit kerja dan instansi', icon: Building2, href: '/admin/opd' },
    { title: 'Alur Kerja (Workflow)', desc: 'Konfigurasi template harmonisasi', icon: Workflow, href: '/admin/workflows' },
    { title: 'Manajemen SLA', desc: 'Atur target waktu penyelesaian', icon: Activity, href: '/admin/sla' },
    { title: 'Keamanan Sistem', desc: 'Pantau sesi dan riwayat masuk', icon: ShieldAlert, href: '/admin/security' },
    { title: 'Jejak Audit', desc: 'Laporan aktivitas pengguna (Audit Trail)', icon: FileStack, href: '/admin/audit' },
    { title: 'Antrean Pekerjaan', desc: 'Monitor status background jobs', icon: Database, href: '/admin/jobs' },
    { title: 'Kesehatan Sistem', desc: 'Status layanan infrastruktur', icon: Server, href: '/admin/system' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(health.database)} rounded-md inline-block px-2 py-1`}>
              {health.database}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Penyimpanan</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(health.storage)} rounded-md inline-block px-2 py-1`}>
              {health.storage}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer border-border/50 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
