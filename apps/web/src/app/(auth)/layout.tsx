import type { Metadata } from 'next';
import { Shield, FileCheck, HardDrive, CheckCircle2, Award, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Masuk - HARM Sistem Harmonisasi Dokumen Terpadu',
  description: 'Portal Harmonisasi Regulasi dan Dokumen Hukum Terpadu Pemerintah Kabupaten Aceh Tamiang',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      {/* Left Column: Government Enterprise Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white border-r border-slate-800/80">
        {/* Background Subtle Grid & Glow */}
        <div className="absolute inset-0 subtle-grid-dark opacity-60 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand & Seal */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight">HARM</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Sistem Harmonisasi Dokumen Terpadu</p>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Pemerintah Kabupaten Aceh Tamiang • Bagian Hukum</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 my-auto py-12 space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white max-w-lg">
              Tata Kelola Produk Hukum Daerah yang Akuntabel, Cepat, dan Terintegrasi.
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-md leading-relaxed">
              Platform harmonisasi rancangan peraturan bupati, keputusan, dan qanun secara transparan dengan pelacakan tahapan berbasis SLA.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Standardisasi Alur Harmonisasi</h4>
                <p className="text-xs text-slate-400 mt-0.5">Penelitian formal, substansi legal drafter, hingga berita acara kesepakatan.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Arsip Cloud Google Drive Enterprise</h4>
                <p className="text-xs text-slate-400 mt-0.5">Penyimpanan berkas draf dan bukti rapat tanpa limitasi kapasitas server.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Audit Trail & Keamanan Akses</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pencatatan rekam jejak digital perbaikan dokumen sesuai standar Permenkumham.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} Setdakab Aceh Tamiang</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sistem Beroperasi Normal
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Login Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md mb-3">
              H
            </div>
            <h1 className="text-2xl font-bold text-slate-900">HARM Enterprise</h1>
            <p className="text-xs text-slate-600 mt-1">Pemerintah Kabupaten Aceh Tamiang</p>
          </div>

          {/* Children (Login Card) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-7 sm:p-9">
            {children}
          </div>

          <div className="text-center mt-6 text-xs text-slate-400">
            Aplikasi Harmonisasi Dokumen Terpadu v2.0 • Bagian Hukum Setdakab
          </div>
        </div>
      </div>
    </div>
  );
}
