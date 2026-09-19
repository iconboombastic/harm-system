'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Inbox, 
  ShieldCheck, 
  Users2, 
  BarChart3, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  HardDrive, 
  ExternalLink, 
  UserCog, 
  Clock, 
  GitBranch, 
  FileCode2, 
  Activity, 
  LogOut, 
  Sparkles,
  Scale,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { logout } from '@/lib/actions/auth';

interface SidebarProps {
  userRole: string;
}

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = userRole === 'ADMIN' || userRole === 'ATASAN';

  const operationalNav = [
    { 
      name: 'Command Center', 
      href: '/command-center', 
      icon: LayoutDashboard,
      color: 'text-blue-400',
      activeBg: 'from-blue-600/25 to-blue-600/5',
      tileClass: 'bg-blue-500/15 text-blue-400 border-blue-400/30'
    },
    { 
      name: 'Permohonan Kasus', 
      href: '/cases', 
      icon: FileText,
      color: 'text-amber-400',
      activeBg: 'from-amber-600/25 to-amber-600/5',
      tileClass: 'bg-amber-500/15 text-amber-400 border-amber-400/30'
    },
    { 
      name: 'Tugas & Disposisi', 
      href: '/tasks', 
      icon: Briefcase,
      color: 'text-violet-400',
      activeBg: 'from-violet-600/25 to-violet-600/5',
      tileClass: 'bg-violet-500/15 text-violet-400 border-violet-400/30'
    },
  ];

  const workflowNav = [
    { 
      name: 'Intake Berkas OPD', 
      href: '/intake', 
      icon: Inbox,
      color: 'text-sky-400',
      activeBg: 'from-sky-600/25 to-sky-600/5',
      tileClass: 'bg-sky-500/15 text-sky-400 border-sky-400/30'
    },
    { 
      name: 'Evidence & Bukti', 
      href: '/evidence', 
      icon: ShieldCheck,
      color: 'text-emerald-400',
      activeBg: 'from-emerald-600/25 to-emerald-600/5',
      tileClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30'
    },
    { 
      name: 'Rapat Harmonisasi', 
      href: '/meetings', 
      icon: Users2,
      color: 'text-indigo-400',
      activeBg: 'from-indigo-600/25 to-indigo-600/5',
      tileClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-400/30'
    },
  ];

  const analyticsNav = [
    { 
      name: 'Laporan Eksekutif', 
      href: '/reports', 
      icon: BarChart3,
      color: 'text-amber-400',
      activeBg: 'from-amber-600/25 to-amber-600/5',
      tileClass: 'bg-amber-500/15 text-amber-400 border-amber-400/30'
    },
    { 
      name: 'Pencarian Cerdas', 
      href: '/search', 
      icon: Search,
      color: 'text-blue-400',
      activeBg: 'from-blue-600/25 to-blue-600/5',
      tileClass: 'bg-blue-500/15 text-blue-400 border-blue-400/30'
    },
  ];

  const adminNav = [
    { name: 'Kelola Pengguna', href: '/admin/users', icon: UserCog },
    { name: 'Kebijakan SLA', href: '/admin/sla', icon: Clock },
    { name: 'Alur Kerja (SOP)', href: '/admin/workflows', icon: GitBranch },
    { name: 'Audit Trail & Log', href: '/admin/audit', icon: FileCode2 },
    { name: 'Kesehatan & Backup', href: '/admin/system', icon: Activity },
  ];

  return (
    <>
      {/* Mobile Toggle Button (Positioned at bottom-left to prevent collision with Floating AI Copilot) */}
      <div className="md:hidden fixed bottom-5 left-5 z-50">
        <Button 
          size="icon" 
          className="rounded-2xl h-12 w-12 bg-slate-900 hover:bg-slate-800 text-white shadow-2xl ring-2 ring-blue-500/50" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-slate-200 border-r border-slate-800/80 transition-all duration-300 select-none shadow-2xl",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Insignia Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
          {!collapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Aceh Tamiang Emblem Crest Representation */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-blue-700 flex items-center justify-center p-0.5 shadow-lg shadow-blue-500/20 ring-1 ring-white/25">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Scale className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">HARM</span>
                  <span className="text-[9px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    SETDAKAB
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-300 truncate">
                  Kab. Aceh Tamiang
                </span>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-blue-700 flex items-center justify-center p-0.5 mx-auto shadow-md ring-1 ring-white/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-xl ml-auto shrink-0 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Perluas Menu" : "Ciutkan Menu"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800/60">
          {/* Operasional Utama */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>PORTAL UTAMA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            )}
            <nav className="space-y-1.5">
              {operationalNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/command-center' && pathname.startsWith(item.href));
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                      isActive 
                        ? cn("bg-gradient-to-r text-white shadow-md border-l-[3px] border-blue-500 ring-1 ring-white/10", item.activeBg)
                        : "text-slate-300 hover:bg-slate-900/90 hover:text-white border-l-[3px] border-transparent",
                      collapsed && "justify-center px-0 py-3"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    {/* High-Caliber Dual-tone Icon Tile */}
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-105",
                      item.tileClass,
                      isActive && "scale-105 shadow-sm"
                    )}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>

                    {!collapsed && <span className="truncate tracking-tight">{item.name}</span>}

                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Harmonisasi & Ruang Kerja */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>HARMONISASI & PROSES</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            )}
            <nav className="space-y-1.5">
              {workflowNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                      isActive 
                        ? cn("bg-gradient-to-r text-white shadow-md border-l-[3px] border-emerald-500 ring-1 ring-white/10", item.activeBg)
                        : "text-slate-300 hover:bg-slate-900/90 hover:text-white border-l-[3px] border-transparent",
                      collapsed && "justify-center px-0 py-3"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-105",
                      item.tileClass,
                      isActive && "scale-105 shadow-sm"
                    )}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>

                    {!collapsed && <span className="truncate tracking-tight">{item.name}</span>}

                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Analitik & Arsip Cloud */}
          <div>
            {!collapsed && (
              <div className="px-3 mb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>INTELIGENSI & ARSIP</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
            )}
            <nav className="space-y-1.5">
              {analyticsNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                      isActive 
                        ? cn("bg-gradient-to-r text-white shadow-md border-l-[3px] border-amber-500 ring-1 ring-white/10", item.activeBg)
                        : "text-slate-300 hover:bg-slate-900/90 hover:text-white border-l-[3px] border-transparent",
                      collapsed && "justify-center px-0 py-3"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-105",
                      item.tileClass,
                      isActive && "scale-105 shadow-sm"
                    )}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>

                    {!collapsed && <span className="truncate tracking-tight">{item.name}</span>}

                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                    )}
                  </Link>
                );
              })}

              {/* Google Drive Enterprise Live Storage Widget */}
              <div className="pt-2">
                <a
                  href={GDRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex flex-col p-3 rounded-xl bg-gradient-to-br from-slate-900/90 to-blue-950/40 border border-blue-500/25 hover:border-blue-400/50 shadow-md transition-all duration-200",
                    collapsed && "items-center px-2 py-3"
                  )}
                  title="Folder Arsip Terpadu Google Drive Pemkab Aceh Tamiang"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <HardDrive className="h-3.5 w-3.5" />
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white tracking-tight">Google Drive Cloud</span>
                          <span className="text-[10px] text-blue-300/80">Arsip Setdakab Aktif</span>
                        </div>
                      )}
                    </div>
                    {!collapsed && (
                      <ExternalLink className="h-3.5 w-3.5 text-blue-400/70 group-hover:text-blue-300 transition-colors" />
                    )}
                  </div>

                  {!collapsed && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Sinkronisasi Real-Time
                      </span>
                      <span className="font-mono text-emerald-400">100% OK</span>
                    </div>
                  )}
                </a>
              </div>
            </nav>
          </div>

          {/* Tata Kelola Admin */}
          {isAdmin && (
            <div>
              {!collapsed && (
                <div className="px-3 mb-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>TATA KELOLA ADMIN</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>
              )}
              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href));
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150",
                        isActive 
                          ? "bg-slate-900 text-white font-semibold border-l-[3px] border-rose-500 shadow-sm" 
                          : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border-l-[3px] border-transparent",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <IconComponent className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Executive User Status Dock */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-sm",
            collapsed && "justify-center px-0"
          )}>
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {userRole === 'ADMIN' ? 'AD' : userRole === 'ATASAN' ? 'AT' : 'ST'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
            </div>

            {!collapsed && (
              <div className="flex flex-col truncate flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-200 truncate">Bagian Hukum Setdakab</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-semibold">Aktif</span>
                  <span className="text-slate-600">•</span>
                  <Badge variant="outline" className="h-4 px-1.5 text-[9px] bg-slate-800 border-slate-700 text-amber-300 font-mono font-semibold">
                    {userRole}
                  </Badge>
                </div>
              </div>
            )}

            {!collapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => logout()}
                className="h-7 w-7 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg shrink-0 transition-colors"
                title="Keluar dari Sistem"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
