import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = { title: 'My Work | HARM' };

export default function MyWorkPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pekerjaan Saya</h2>
      
      <Tabs defaultValue="tugas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tugas">Tugas Saya</TabsTrigger>
          <TabsTrigger value="review">Review Saya</TabsTrigger>
          <TabsTrigger value="menunggu">Menunggu</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tugas">
          <Card>
            <CardHeader><CardTitle>Daftar Tugas Aktif</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Belum ada tugas saat ini.</p></CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card>
            <CardHeader><CardTitle>Review Menunggu</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Tidak ada dokumen untuk direview.</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menunggu">
          <Card>
            <CardHeader><CardTitle>Status Menunggu</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Tidak ada item yang sedang menunggu.</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader><CardTitle>Item Overdue</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Bagus! Tidak ada item yang melewati batas waktu.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
