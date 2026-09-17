'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Memproses...' : 'Masuk'}
    </Button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Selamat Datang Kembali</h2>
        <p className="text-sm text-muted-foreground">Masukkan kredensial Anda untuk melanjutkan</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form action={clientAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="nama@acehtamiang.go.id" 
            required 
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Kata Sandi</Label>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-primary hover:underline"
              tabIndex={-1}
            >
              Lupa sandi?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            autoComplete="current-password"
          />
        </div>
        
        <SubmitButton />
      </form>

      <div className="text-center text-sm">
        Belum memiliki akun?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
