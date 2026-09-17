'use client';

import { Server, Database, Cloud, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function SystemHealthPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kesehatan Sistem</h2>
          <p className="text-muted-foreground">Monitor infrastruktur dan layanan HARM</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-success/50 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-success" /> Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">SEHAT</div>
            <p className="text-xs text-muted-foreground mt-1">Supabase PostgreSQL</p>
          </CardContent>
        </Card>
        
        <Card className="border-success/50 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cloud className="h-4 w-4 text-success" /> Penyimpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">SEHAT</div>
            <p className="text-xs text-muted-foreground mt-1">Supabase Storage</p>
          </CardContent>
        </Card>

        <Card className="border-success/50 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-success" /> Autentikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">SEHAT</div>
            <p className="text-xs text-muted-foreground mt-1">Supabase Auth</p>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-warning" /> Antrean
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">PERINGATAN</div>
            <p className="text-xs text-muted-foreground mt-1">Beban tinggi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Penggunaan Sumber Daya</CardTitle>
          <CardDescription>Metrik sistem 24 jam terakhir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Kapasitas Database</span>
              <span>120 MB / 500 MB</span>
            </div>
            <Progress value={24} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Kapasitas Storage (Dokumen)</span>
              <span>4.2 GB / 50 GB</span>
            </div>
            <Progress value={8} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Batas API (Requests)</span>
              <span>85.000 / 100.000</span>
            </div>
            <Progress value={85} className="h-2 bg-destructive/20 [&>div]:bg-destructive" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { ShieldAlert } from 'lucide-react';
