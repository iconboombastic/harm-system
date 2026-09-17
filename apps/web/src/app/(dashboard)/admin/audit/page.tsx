'use client';

import { Search, FileStack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AuditPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Jejak Audit</h2>
          <p className="text-muted-foreground">Log aktivitas pengguna dalam sistem</p>
        </div>
        <Button variant="outline">
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari aksi, pengguna, atau entitas..." className="pl-8" />
            </div>
            <Input type="date" className="w-auto" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Entitas</TableHead>
                <TableHead>Detail IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>11 Sep 2026, 14:30</TableCell>
                <TableCell>Ahmad Fauzi</TableCell>
                <TableCell className="font-medium text-primary">UPDATE_STATUS</TableCell>
                <TableCell>Permohonan #HARM-1234</TableCell>
                <TableCell className="text-muted-foreground text-xs">192.168.1.100</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>11 Sep 2026, 13:15</TableCell>
                <TableCell>Budi Santoso</TableCell>
                <TableCell className="font-medium text-success">CREATE_USER</TableCell>
                <TableCell>User ID: 8291</TableCell>
                <TableCell className="text-muted-foreground text-xs">114.120.45.22</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>11 Sep 2026, 10:05</TableCell>
                <TableCell>Sistem</TableCell>
                <TableCell className="font-medium text-warning">AUTO_REMINDER</TableCell>
                <TableCell>SLA Peringatan #HARM-1230</TableCell>
                <TableCell className="text-muted-foreground text-xs">127.0.0.1</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
