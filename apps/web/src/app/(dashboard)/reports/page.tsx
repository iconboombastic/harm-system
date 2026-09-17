import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const metadata = { title: 'Laporan | HARM' };

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Laporan & Metrik</h2>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Case</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">142</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">SLA Compliance</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">94%</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Rata-rata Durasi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">4.2 Hari</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Tingkat Revisi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-500">12%</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Distribusi per OPD</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center"><span className="w-32 text-sm">Dinas Kesehatan</span><div className="h-4 bg-blue-500 rounded" style={{width: '80%'}}></div><span className="ml-2 text-xs">45</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Dinas Pendidikan</span><div className="h-4 bg-blue-500 rounded" style={{width: '60%'}}></div><span className="ml-2 text-xs">34</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Dinas PUPR</span><div className="h-4 bg-blue-500 rounded" style={{width: '40%'}}></div><span className="ml-2 text-xs">22</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Status Case</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center"><span className="w-32 text-sm">Draft</span><div className="h-4 bg-gray-500 rounded" style={{width: '30%'}}></div><span className="ml-2 text-xs">15</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Proses Verifikasi</span><div className="h-4 bg-yellow-500 rounded" style={{width: '50%'}}></div><span className="ml-2 text-xs">28</span></div>
              <div className="flex items-center"><span className="w-32 text-sm">Selesai</span><div className="h-4 bg-green-500 rounded" style={{width: '90%'}}></div><span className="ml-2 text-xs">99</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
