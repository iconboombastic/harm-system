'use client';

import { Plus, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function OPDPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Struktur OPD</h2>
          <p className="text-muted-foreground">Kelola Organisasi Perangkat Daerah</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah OPD
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Instansi & Unit Kerja</CardTitle>
          <CardDescription>Semua unit kerja yang terdaftar di Sistem HARM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari OPD..." className="pl-8" />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Instansi</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Jumlah Pengguna</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">SETDA</TableCell>
                <TableCell>Sekretariat Daerah</TableCell>
                <TableCell>Sekretariat</TableCell>
                <TableCell>12</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">KOMINFO</TableCell>
                <TableCell>Dinas Komunikasi dan Informatika</TableCell>
                <TableCell>Dinas</TableCell>
                <TableCell>5</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">HUKUM</TableCell>
                <TableCell>Bagian Hukum Setdakab</TableCell>
                <TableCell>Bagian</TableCell>
                <TableCell>8</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
