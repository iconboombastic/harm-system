import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Menggabungkan class CSS Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal dalam format Indonesia (misal: 11 September 2026)
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format tanggal dan waktu (misal: 11 Sep 2026, 14:30)
 */
export function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format waktu relatif (misal: 2 jam yang lalu)
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    tahun: 31536000,
    bulan: 2592000,
    minggu: 604800,
    hari: 86400,
    jam: 3600,
    menit: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / secondsInUnit);
    if (count > 0) {
      return `${count} ${unit} yang lalu`;
    }
  }
  
  return 'Baru saja';
}

/**
 * Format ukuran file (misal: 2.5 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate token pelacakan acak
 */
export function generateTrackingToken(prefix: string = 'HARM'): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `${prefix}-${dateStr}-${randomStr}`;
}

/**
 * Potong teks yang terlalu panjang
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Ambil inisial dari nama
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Warna status kesehatan sistem
 */
export function getHealthColor(status: 'SEHAT' | 'PERINGATAN' | 'KRITIS' | string) {
  switch (status.toUpperCase()) {
    case 'SEHAT': return 'text-success bg-success/10 border-success/20';
    case 'PERINGATAN': return 'text-warning bg-warning/10 border-warning/20';
    case 'KRITIS': return 'text-destructive bg-destructive/10 border-destructive/20';
    default: return 'text-muted-foreground bg-muted border-border';
  }
}

/**
 * Warna prioritas
 */
export function getPriorityColor(priority: 'RENDAH' | 'NORMAL' | 'TINGGI' | 'MENDESAK' | string) {
  switch (priority.toUpperCase()) {
    case 'RENDAH': return 'text-info bg-info/10';
    case 'NORMAL': return 'text-primary bg-primary/10';
    case 'TINGGI': return 'text-warning bg-warning/10';
    case 'MENDESAK': return 'text-destructive bg-destructive/10';
    default: return 'text-muted-foreground bg-muted';
  }
}

/**
 * Warna status pekerjaan/permohonan
 */
export function getStatusColor(status: string) {
  const s = status.toUpperCase();
  if (s.includes('SELESAI') || s === 'DISETUJUI') return 'text-success bg-success/10';
  if (s.includes('BERJALAN') || s === 'DIPROSES') return 'text-primary bg-primary/10';
  if (s.includes('PERBAIKAN') || s === 'DITOLAK') return 'text-destructive bg-destructive/10';
  if (s.includes('BARU') || s === 'MENUNGGU') return 'text-warning bg-warning/10';
  return 'text-muted-foreground bg-muted';
}

/**
 * Fungsi Debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
