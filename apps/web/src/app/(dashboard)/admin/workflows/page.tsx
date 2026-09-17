'use client';

import { Workflow, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WorkflowsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alur Kerja (Workflow)</h2>
          <p className="text-muted-foreground">Konfigurasi template proses harmonisasi</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Template Baru
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>SK Bupati</CardTitle>
                <CardDescription>Template harmonisasi Surat Keputusan Bupati</CardDescription>
              </div>
              <Badge variant="success">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm font-medium">Tahapan:</div>
              <ol className="relative border-l border-muted-foreground/20 ml-3 space-y-4">
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Drafting (Pemohon)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Verifikasi Berkas (Analis)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Harmonisasi (Drafter)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Persetujuan (Atasan)</p>
                </li>
              </ol>
              <Button variant="outline" className="w-full mt-4">Edit Template</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Peraturan Bupati (Perbup)</CardTitle>
                <CardDescription>Template harmonisasi Peraturan Bupati</CardDescription>
              </div>
              <Badge variant="success">Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm font-medium">Tahapan:</div>
              <ol className="relative border-l border-muted-foreground/20 ml-3 space-y-4">
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Drafting (Pemohon)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Verifikasi Berkas (Analis)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Harmonisasi (Drafter)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-warning rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Rapat Pembahasan (Opsional)</p>
                </li>
                <li className="pl-4 relative">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5" />
                  <p className="text-sm font-medium">Persetujuan (Kaban Hukum)</p>
                </li>
              </ol>
              <Button variant="outline" className="w-full mt-4">Edit Template</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
