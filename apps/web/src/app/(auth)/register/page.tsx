'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { register } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Memproses...' : 'Daftar'}
    </Button>
  );
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Buat Akun Baru</h2>
        <p className="text-sm text-muted-foreground">Lengkapi data di bawah ini untuk mendaftar</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form action={clientAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input 
            id="fullName" 
            name="fullName" 
            placeholder="John Doe" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="nama@acehtamiang.go.id" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            minLength={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            required 
            minLength={6}
          />
        </div>
        
        <SubmitButton />
      </form>

      <div className="text-center text-sm">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
