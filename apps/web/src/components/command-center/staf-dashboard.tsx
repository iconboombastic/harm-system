'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StafDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pekerjaan Saya</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 Case</div>
          <p className="text-xs text-muted-foreground">3 Task jatuh tempo</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5 Item</div>
          <p className="text-xs text-muted-foreground">2 Revisi masuk, 3 Draft belum selesai</p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild variant="outline"><Link href="/cases/new">Buat Permohonan</Link></Button>
          <Button asChild variant="outline"><Link href="/tasks/new">Buat Task</Link></Button>
          <Button asChild variant="outline"><Link href="/search">Cari Case</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
