import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIntakeByToken } from '@/lib/actions/intake';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function TrackingResultPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await getIntakeByToken(token);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Token Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Pastikan token yang Anda masukkan benar.</p>
            <Button asChild><Link href="/tracking">Kembali</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 bg-gray-50 px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Status Pengajuan</CardTitle>
          <p className="text-sm text-muted-foreground">Token: {token}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Status Saat Ini: {result.status}</h3>
                {result.harmNumber && <p className="text-sm">No HARM: {result.harmNumber}</p>}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Riwayat Status</h4>
              <div className="space-y-4">
                {result.timeline.map((item: any, i: number) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{item.step}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full"><Link href="/tracking">Cek Token Lain</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
