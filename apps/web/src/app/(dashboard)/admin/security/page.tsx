'use client';

import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function SecurityPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Keamanan Sistem</h2>
          <p className="text-muted-foreground">Pantau aktivitas login dan sesi pengguna</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sesi Aktif Terakhir</CardTitle>
              <CardDescription>Daftar pengguna yang login dalam 24 jam terakhir</CardDescription>
            </div>
            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              Akhiri Semua Sesi
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Browser / OS</TableHead>
                <TableHead>Terakhir Aktif</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ahmad@acehtamiang.go.id</TableCell>
                <TableCell>192.168.1.100</TableCell>
                <TableCell>Chrome / Windows</TableCell>
                <TableCell>Baru saja</TableCell>
                <TableCell><Badge variant="success">Online</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-destructive">Putuskan</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">budi@acehtamiang.go.id</TableCell>
                <TableCell>114.120.45.22</TableCell>
                <TableCell>Safari / macOS</TableCell>
                <TableCell>2 jam lalu</TableCell>
                <TableCell><Badge variant="secondary">Idle</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-destructive">Putuskan</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
