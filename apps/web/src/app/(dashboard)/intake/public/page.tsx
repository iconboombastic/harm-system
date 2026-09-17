import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const metadata = {
  title: 'Intake Publik | HARM',
};

export default function PublicIntakePage() {
  // Dummy data
  const intakes = [
    { id: '1', opd: 'Dinas Kesehatan', date: '2026-09-10', status: 'PENDING', token: 'TRK-ABC123XYZ' },
    { id: '2', opd: 'Dinas Pendidikan', date: '2026-09-11', status: 'CONFIRMED', token: 'TRK-DEF456UVW' },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Daftar Intake Publik</h2>
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan dari OPD (Publik)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OPD</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Token Tracking</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intakes.map(intake => (
                <TableRow key={intake.id}>
                  <TableCell>{intake.opd}</TableCell>
                  <TableCell>{intake.date}</TableCell>
                  <TableCell>{intake.status}</TableCell>
                  <TableCell>{intake.token}</TableCell>
                  <TableCell className="space-x-2">
                    {intake.status === 'PENDING' && (
                      <>
                        <Button size="sm">Konfirmasi</Button>
                        <Button size="sm" variant="destructive">Tolak</Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
