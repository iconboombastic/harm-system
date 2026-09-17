import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
