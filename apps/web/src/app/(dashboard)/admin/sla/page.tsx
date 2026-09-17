'use client';

import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function SLAPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen SLA</h2>
          <p className="text-muted-foreground">Service Level Agreement (Target Waktu)</p>
        </div>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Waktu Default</CardTitle>
            <CardDescription>Atur target waktu (dalam jam kerja) untuk setiap tahapan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Verifikasi Berkas (Analis)</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={24} className="w-24" />
                  <span className="text-sm text-muted-foreground">Jam</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Proses Harmonisasi (Drafter)</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={72} className="w-24" />
                  <span className="text-sm text-muted-foreground">Jam</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Persetujuan Berjenjang (Atasan)</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={48} className="w-24" />
                  <span className="text-sm text-muted-foreground">Jam</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Revisi oleh Pemohon</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={120} className="w-24" />
                  <span className="text-sm text-muted-foreground">Jam (Batas otomatis kadaluarsa)</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
