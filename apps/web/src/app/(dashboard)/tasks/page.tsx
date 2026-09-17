import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = { title: 'Daftar Tugas | HARM' };

export default function GlobalTasksPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Semua Tugas</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">Gunakan filter untuk menemukan tugas (Status, Prioritas, Tanggal Jatuh Tempo)</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tugas</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">Tidak ada tugas ditemukan</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
