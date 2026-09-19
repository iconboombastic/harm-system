'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldCheck, ArrowRight, HelpCircle, FileText } from 'lucide-react';

export default function TrackingPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/tracking/${token.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 subtle-grid-dark opacity-50 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">HARM Enterprise</span>
              <Badge variant="outline" className="text-[10px] bg-blue-500/15 text-blue-300 border-blue-500/30">
                Portal Pelacakan
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">Bagian Hukum Setdakab Aceh Tamiang</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/public-intake" className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition">
            + Pengajuan Baru
          </Link>
          <Link href="/login" className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60 transition">
            Login Internal
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Lacak Status Harmonisasi Dokumen
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Ketik nomor token resi permohonan Anda untuk memantau disposisi, telaah hukum, dan hasil rapat secara transparan.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-200">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Nomor Token Resi Pengajuan (TRK)
                </label>
                <div className="relative">
                  <Input 
                    placeholder="Contoh: TRK-ABC123" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    className="h-12 text-base font-mono font-bold tracking-wider pl-4 pr-12 border-slate-300 focus-visible:ring-blue-600 bg-slate-50/70"
                    autoFocus
                    required
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md"
              >
                <span>Cari Dokumen Permohonan</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-600">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Di mana saya menemukan Nomor Token?</span>
                <span className="text-[11px] text-slate-500">
                  Nomor token 6-karakter (diawali <em>TRK-</em>) tertera pada <strong>Tanda Terima Resmi</strong> saat Anda mengajukan dokumen melalui formulir online HARM.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        &copy; {new Date().getFullYear()} Bagian Hukum Sekretariat Daerah Kabupaten Aceh Tamiang
      </footer>
    </div>
  );
}
