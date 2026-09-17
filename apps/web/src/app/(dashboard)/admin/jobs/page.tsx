'use client';

import { Activity, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function JobsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Antrean Pekerjaan</h2>
          <p className="text-muted-foreground">Monitor background jobs (Email, Notifikasi, dsb)</p>
        </div>
        <Button variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Pekerjaan Diproses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">1,402</div>
            <p className="text-xs text-muted-foreground">Selesai (Hari ini)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Gagal (Hari ini)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Antrean Terbaru</CardTitle>
          <CardDescription>Daftar eksekusi tugas latar belakang</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pekerjaan</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waktu Dibuat</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">job_98x21</TableCell>
                <TableCell>EMAIL_NOTIFICATION</TableCell>
                <TableCell><Badge variant="outline" className="text-primary border-primary">PROCESSING</Badge></TableCell>
                <TableCell>Baru saja</TableCell>
                <TableCell><Button variant="ghost" size="sm">Batalkan</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">job_98x20</TableCell>
                <TableCell>DOCUMENT_GENERATION</TableCell>
                <TableCell><Badge variant="success">COMPLETED</Badge></TableCell>
                <TableCell>2 menit lalu</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">job_98x19</TableCell>
                <TableCell>DATA_SYNC_SUPABASE</TableCell>
                <TableCell><Badge variant="destructive">FAILED</Badge></TableCell>
                <TableCell>15 menit lalu</TableCell>
                <TableCell><Button variant="ghost" size="sm">Coba Lagi</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
