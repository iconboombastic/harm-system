'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('Email atau kata sandi salah.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-left">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Masuk ke Portal Internal</h2>
        <p className="text-xs text-slate-500">
          Akses khusus pejabat pimpinan dan staf perancang peraturan perundang-undangan.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Kedinasan</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m.yusuf010224@gmail.com" 
            required 
            autoComplete="email"
            className="h-10 text-sm border-slate-200 focus-visible:ring-blue-600"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Kata Sandi</Label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-blue-600 hover:underline"
              tabIndex={-1}
            >
              Lupa sandi?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••••••"
            required 
            autoComplete="current-password"
            className="h-10 text-sm border-slate-200 focus-visible:ring-blue-600 font-mono"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memverifikasi Kredensial...
            </>
          ) : (
            'Masuk ke Dashboard'
          )}
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Akses Layanan OPD</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <Link 
            href="/public-intake" 
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 transition group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">📄</span>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">Pra-Pendaftaran Permohonan OPD</div>
                <div className="text-[11px] text-slate-500">Ajukan draf produk hukum baru tanpa akun</div>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-blue-600 text-xs font-semibold">Buka ↗</span>
          </Link>

          <Link 
            href="/tracking" 
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🔍</span>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-800">Pelacakan Status & Token Resi</div>
                <div className="text-[11px] text-slate-500">Pantau progres dan unggah revisi dokumen</div>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 text-xs font-semibold">Lacak ↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
