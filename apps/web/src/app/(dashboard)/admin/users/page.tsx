'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Data statis untuk demo (akan diganti dengan data dari server action)
const dummyUsers = [
  { id: '1', name: 'Ahmad Fauzi', email: 'ahmad@acehtamiang.go.id', role: 'ADMIN', opd: 'Sekretariat Daerah', status: 'Aktif' },
  { id: '2', name: 'Budi Santoso', email: 'budi@acehtamiang.go.id', role: 'ATASAN', opd: 'Dinas Kominfo', status: 'Aktif' },
  { id: '3', name: 'Citra Kirana', email: 'citra@acehtamiang.go.id', role: 'DRAFTER', opd: 'Bagian Hukum', status: 'Nonaktif' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pengguna</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran (Role)</TableHead>
              <TableHead>Unit Kerja (OPD)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.opd}</TableCell>
                <TableCell>
                  {user.status === 'Aktif' ? (
                    <span className="flex items-center text-success text-sm">
                      <CheckCircle className="mr-1 h-3 w-3" /> Aktif
                    </span>
                  ) : (
                    <span className="flex items-center text-destructive text-sm">
                      <XCircle className="mr-1 h-3 w-3" /> Nonaktif
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit Profil</DropdownMenuItem>
                      <DropdownMenuItem>Ubah Peran</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        {user.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
