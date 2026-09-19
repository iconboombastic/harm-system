'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, CheckCircle, XCircle, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getUsers, createUser, deactivateUser } from '@/lib/actions/admin';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('STAF');
  const [newJabatan, setNewJabatan] = useState('Penyusun Rancangan Peraturan');
  const [newUnit, setNewUnit] = useState('Bagian Hukum Setdakab');

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getUsers();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers([
          { id: '1', name: 'Administrator Sistem', email: 'admin@acehtamiangkab.go.id', role: 'ADMIN', unit: 'Bagian Hukum', is_active: true },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      const res = await createUser({
        name: newName,
        email: newEmail,
        password: newPassword || 'AcehTamiang2026!',
        role: newRole,
        jabatan: newJabatan,
        unit: newUnit,
      });

      if (res?.error) {
        setFormError(res.error);
      } else {
        setDialogOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        await loadUsers();
      }
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-sm text-muted-foreground">Kelola akun staf dan pimpinan internal Bagian Hukum.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Tambah Akun Staf / Pimpinan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Akun Pengguna Baru</DialogTitle>
            </DialogHeader>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="name">Nama Lengkap & Gelar</Label>
                <Input
                  id="name"
                  required
                  placeholder="Contoh: Budi Santoso, S.H."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Dinas / Akun</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="budi@acehtamiangkab.go.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Kata Sandi Awal</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Default: AcehTamiang2026!"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className="text-[11px] text-muted-foreground">Kosongkan untuk kata sandi default: <code>AcehTamiang2026!</code></span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="role">Peran (Role)</Label>
                  <select
                    id="role"
                    className="w-full border p-2 rounded-md text-sm"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="STAF">STAF (Pengkaji / Drafter)</option>
                    <option value="ATASAN">ATASAN (Kabag / Kasubbag)</option>
                    <option value="ADMIN">ADMIN (Administrator)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="unit">Unit Kerja</Label>
                  <Input
                    id="unit"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Akun'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau peran..."
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
              <TableHead>Unit Kerja</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Memuat daftar pengguna...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Tidak ada pengguna yang cocok.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'ATASAN' ? 'outline' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.unit || 'Bagian Hukum'}</TableCell>
                  <TableCell>
                    {user.is_active !== false ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="mr-1 h-3 w-3" /> Aktif
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 text-sm">
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
                        <DropdownMenuItem onClick={() => deactivateUser(user.id)}>
                          {user.is_active !== false ? 'Nonaktifkan' : 'Aktifkan'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
