'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  HardDrive, 
  ChevronRight, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationItem {
  id: string;
  type: 'DISPOSISI' | 'SLA_ALERT' | 'AI_COPILOT' | 'RAPAT' | 'DRIVE_SYNC';
  title: string;
  message: string;
  caseId?: string;
  caseNumber?: string;
  time: string;
  isRead: boolean;
  priority: 'HIGH' | 'NORMAL';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    type: 'DISPOSISI',
    title: 'Disposisi Telaahan Baru dari Kabag Hukum',
    message: 'Harap harmonisasikan klausul sanksi administratif dan sesuaikan konsideran Mengingat dengan UU 1/2022 HKPD.',
    caseId: 'case-001',
    caseNumber: 'HARM-2026-0001',
    time: '15 menit lalu',
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'NOTIF-002',
    type: 'SLA_ALERT',
    title: 'Peringatan SLA: Sisa Waktu 2 Hari Kerja',
    message: 'Raperbup Pelayanan Kesehatan Rujukan RSUD Muda Sedia mendekati batas waktu review tim hukum (Target: 24 Sep 2026).',
    caseId: 'case-002',
    caseNumber: 'HARM-2026-0002',
    time: '1 jam lalu',
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'NOTIF-003',
    type: 'AI_COPILOT',
    title: 'Telaahan Otomatis AI Copilot Selesai',
    message: 'Terdeteksi potensi pertentangan norma: UU No. 28 Tahun 2009 telah dicabut. Rekomendasi perbaikan telah disiapkan.',
    caseId: 'case-001',
    caseNumber: 'HARM-2026-0001',
    time: '3 jam lalu',
    isRead: false,
    priority: 'NORMAL'
  },
  {
    id: 'NOTIF-004',
    type: 'RAPAT',
    title: 'Undangan Rapat Pleno Harmonisasi Qanun',
    message: 'Rapat pleno pembahasan Raqan Pemilihan Datok Penghulu dijadwalkan besok pukul 09.30 WIB di Ruang Rapat Setdakab.',
    caseId: 'case-003',
    caseNumber: 'HARM-2026-0003',
    time: 'Kemarin, 14.30 WIB',
    isRead: true,
    priority: 'NORMAL'
  },
  {
    id: 'NOTIF-005',
    type: 'DRIVE_SYNC',
    title: 'Sinkronisasi Google Drive Setdakab Berhasil',
    message: 'Struktur folder resmi HARM-2026-0004 (Dinas PUPR) dan berkas bukti telah tersimpan di cloud storage terverifikasi.',
    caseId: 'case-004',
    caseNumber: 'HARM-2026-0004',
    time: 'Kemarin, 10.15 WIB',
    isRead: true,
    priority: 'NORMAL'
  }
];

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'HIGH'>('ALL');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markItemRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'HIGH') return n.priority === 'HIGH';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Pusat Pemberitahuan
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Notifikasi & Peringatan
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Pemberitahuan terkini disposisi telaahan, batas waktu SLA, rapat pleno, dan hasil verifikasi AI hukum.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllRead}
            className="rounded-xl border-slate-300 text-xs font-semibold h-9 shadow-xs hover:bg-slate-50"
          >
            <Check className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            <span>Tandai Semua Dibaca</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filter === 'UNREAD' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Belum Dibaca ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('HIGH')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filter === 'HIGH' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Prioritas Tinggi
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((item) => {
          const isUnread = !item.isRead;
          return (
            <div
              key={item.id}
              onClick={() => markItemRead(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                isUnread 
                  ? 'bg-blue-50/40 border-blue-200/90 shadow-xs' 
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Icon Tile */}
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                item.type === 'DISPOSISI' ? 'bg-violet-100 text-violet-700' :
                item.type === 'SLA_ALERT' ? 'bg-rose-100 text-rose-700' :
                item.type === 'AI_COPILOT' ? 'bg-amber-100 text-amber-700' :
                item.type === 'RAPAT' ? 'bg-indigo-100 text-indigo-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {item.type === 'DISPOSISI' && <UserCheck className="w-5 h-5" />}
                {item.type === 'SLA_ALERT' && <AlertTriangle className="w-5 h-5" />}
                {item.type === 'AI_COPILOT' && <Sparkles className="w-5 h-5" />}
                {item.type === 'RAPAT' && <Calendar className="w-5 h-5" />}
                {item.type === 'DRIVE_SYNC' && <HardDrive className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {item.title}
                    </h4>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{item.time}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.message}
                </p>

                {item.caseNumber && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      {item.caseNumber}
                    </span>
                    {item.caseId && (
                      <Link href={`/cases/${item.caseId}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 font-bold hover:bg-blue-100/50 flex items-center gap-1">
                          <span>Buka Kasus</span>
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredNotifs.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tidak ada notifikasi</h4>
            <p className="text-xs text-slate-400 mt-0.5">Semua pemberitahuan penting telah dibaca atau tidak ada yang sesuai kriteria filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
