import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Intake Internal | HARM',
};

export default function IntakePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Intake Management</h2>
        <div className="flex space-x-2">
          <Button asChild><Link href="/intake/public">Lihat Intake Publik</Link></Button>
          <Button asChild variant="outline"><Link href="/cases/new">Buat Case Internal</Link></Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Intake Internal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gunakan menu "Buat Case Internal" untuk membuat permohonan baru langsung ke dalam sistem.</p>
        </CardContent>
      </Card>
    </div>
  );
}
