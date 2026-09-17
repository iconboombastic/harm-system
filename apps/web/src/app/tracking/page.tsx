'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function TrackingPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      router.push(`/tracking/${token}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Lacak Status Pengajuan</CardTitle>
          <CardDescription>Masukkan Token Tracking Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input 
              placeholder="Contoh: TRK-ABC123" 
              value={token} 
              onChange={(e) => setToken(e.target.value)}
              className="flex-1"
            />
            <Button type="submit"><Search className="w-4 h-4 mr-2" />Cari</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
