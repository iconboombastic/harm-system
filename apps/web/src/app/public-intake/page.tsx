'use client';

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
