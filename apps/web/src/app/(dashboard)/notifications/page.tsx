import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export const metadata = { title: 'Notifikasi | HARM' };

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
        <Button variant="outline">Tandai Semua Dibaca</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5" /> Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Tidak ada notifikasi baru.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
