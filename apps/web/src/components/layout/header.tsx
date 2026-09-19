'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  HardDrive, 
  ExternalLink, 
  ShieldCheck, 
  Send, 
  AlertTriangle, 
  Sparkles,
  Command,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { logout } from '@/lib/actions/auth';
import { getInitials } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  user: any;
}

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

export function Header({ user }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(3);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30 shrink-0 transition-all shadow-xs">
      {/* Left: Breadcrumbs & Government Insignia Badge */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Breadcrumb />
        <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200/80 text-xs text-slate-600 font-semibold">
          <div className="w-5 h-5 rounded-md bg-blue-500/15 text-blue-600 border border-blue-300/40 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-tight text-slate-800">Bagian Hukum Setdakab Aceh Tamiang</span>
        </div>
      </div>

      {/* Middle/Right: System Pulse, Global Command Search & Actions */}
      <div className="flex items-center gap-2.5 md:gap-3 ml-auto">
        {/* Heartbeat Status: BPK & JDIHN */}
        <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Terhubung BPK.RI & JDIHN</span>
        </div>

        {/* Global Search Bar (Linear / Raycast Style with ⌘K Badge) */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 text-xs w-64 transition cursor-pointer shadow-2xs group">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
          <span className="truncate flex-1 font-medium text-slate-600">Cari nomor permohonan...</span>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono text-slate-600 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>

        {/* Google Drive Enterprise Cloud Pill Button */}
        <a
          href={GDRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 transition shadow-2xs group"
          title="Folder Cloud Berkas Resmi Google Drive Pemkab Aceh Tamiang"
        >
          <div className="w-4 h-4 rounded bg-blue-600/15 flex items-center justify-center text-blue-600">
            <HardDrive className="w-3 h-3" />
          </div>
          <span>Google Drive</span>
          <ExternalLink className="w-3 h-3 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Mobile Search Icon */}
        <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:text-slate-800 rounded-xl" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
        
        {/* Notification Bell Center with Dropdown Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              title="Pusat Notifikasi & Disposisi Perkara"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-extrabold text-white ring-2 ring-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-80 sm:w-96 shadow-2xl border border-slate-200/90 p-0 rounded-2xl overflow-hidden bg-white"
            align="end"
          >
            {/* Popover Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-tight">Pusat Notifikasi Enterprise</h4>
                  <span className="text-[10px] text-slate-400">Setdakab Aceh Tamiang</span>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] text-blue-300 hover:text-white underline font-semibold transition"
                >
                  Tandai Dibaca
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 text-xs">
              {/* Notif 1: Disposisi Atasan */}
              <Link
                href="/command-center"
                onClick={() => setUnreadCount(Math.max(0, unreadCount - 1))}
                className="p-3.5 hover:bg-slate-50 transition flex items-start gap-3 block group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Send className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      Disposisi Baru dari Atasan
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">4 jam lalu</span>
                  </div>
                  <p className="font-semibold text-slate-700 text-[11px] truncate">
                    Raperbup Rencana Tata Ruang (HARM-2026-004)
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Perbaiki konsideran Menimbang huruf b agar selaras dengan UU Cipta Kerja No. 6/2023.
                  </p>
                </div>
              </Link>

              {/* Notif 2: Peringatan SLA */}
              <Link
                href="/cases"
                onClick={() => setUnreadCount(Math.max(0, unreadCount - 1))}
                className="p-3.5 hover:bg-slate-50 transition flex items-start gap-3 block group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      Peringatan Batas Waktu SLA
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-1.5 py-0.2 rounded shrink-0">Mendesak</span>
                  </div>
                  <p className="font-semibold text-slate-700 text-[11px] truncate">
                    SK Tim Seleksi Terbuka JPTP (HARM-2026-012)
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Tersisa 2 hari kerja sebelum batas waktu evaluasi 14 hari kerja berakhir.
                  </p>
                </div>
              </Link>

              {/* Notif 3: Temuan AI Copilot & BPK */}
              <Link
                href="/cases"
                onClick={() => setUnreadCount(Math.max(0, unreadCount - 1))}
                className="p-3.5 hover:bg-slate-50 transition flex items-start gap-3 block group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      Rekomendasi AI Copilot
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">Hari ini</span>
                  </div>
                  <p className="font-semibold text-slate-700 text-[11px] truncate">
                    Raperbup Retribusi Pasar (HARM-2026-007)
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Hasil uji keselarasan UU 1/2022 HKPD & rujukan naskah BPK RI siap diverifikasi.
                  </p>
                </div>
              </Link>

              {/* Notif 4: Google Drive Sync */}
              <a
                href={GDRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 hover:bg-slate-50 transition flex items-start gap-3 block group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      Sinkronisasi Google Drive
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">Kemarin</span>
                  </div>
                  <p className="font-semibold text-slate-700 text-[11px] truncate">
                    Draf Naskah Harmonisasi v2.docx
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Naskah dinas versi 2 berhasil dicadangkan ke folder Google Drive Arsip.
                  </p>
                </div>
              </a>
            </div>

            {/* Popover Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/command-center"
                className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mx-auto"
              >
                <span>Buka Seluruh Disposisi di Command Center &rarr;</span>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 px-2.5 gap-2.5 rounded-xl hover:bg-slate-100 ml-1 border border-slate-200/60 shadow-2xs">
              <Avatar className="h-7 w-7 rounded-lg ring-1 ring-slate-200">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg">
                  {getInitials(user?.full_name || user?.email || 'Admin')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left text-xs leading-tight">
                <span className="font-bold text-slate-800 truncate max-w-[120px]">
                  {user?.full_name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium capitalize">
                  {user?.role || 'Staff Drafter'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 shadow-xl border border-slate-200 rounded-2xl p-1.5" align="end">
            <DropdownMenuLabel className="font-bold text-xs text-slate-800 px-2.5 py-2">
              Akun Pegawai Setdakab
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem className="p-0">
              <Link href="/profile" className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-slate-100">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Pengaturan Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link href="/admin/system" className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-slate-100">
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                <span>Konfigurasi Sistem</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 cursor-pointer rounded-lg hover:bg-rose-50 focus:bg-rose-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar dari Aplikasi</span>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
