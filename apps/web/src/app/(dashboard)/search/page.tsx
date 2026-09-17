import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const metadata = { title: 'Pencarian Global | HARM' };

export default function GlobalSearchPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Pencarian</h2>
      
      <div className="flex space-x-2 mb-6">
        <Input placeholder="Cari case, dokumen, atau tugas..." className="max-w-xl" />
        <Button><Search className="h-4 w-4 mr-2"/> Cari</Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-sm">Filter Pencarian</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><label className="flex items-center space-x-2"><input type="checkbox" /> <span>Case</span></label></div>
                <div><label className="flex items-center space-x-2"><input type="checkbox" /> <span>Dokumen</span></label></div>
                <div><label className="flex items-center space-x-2"><input type="checkbox" /> <span>Evidence</span></label></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Tidak ada hasil ditemukan. Silakan masukkan kata kunci.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
