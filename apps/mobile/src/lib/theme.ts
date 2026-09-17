// ============================================
// HARM Mobile — Tema & Warna
// ============================================
// Semua warna dan ukuran yang digunakan di aplikasi mobile
// Ubah di sini untuk mengubah tampilan seluruh aplikasi

export const Colors = {
  // Warna utama (brand)
  primary: '#1e40af',        // Biru tua
  primaryLight: '#3b82f6',   // Biru terang
  primaryDark: '#1e3a8a',    // Biru gelap

  // Background
  background: '#f8fafc',     // Abu sangat terang
  surface: '#ffffff',         // Putih
  surfaceVariant: '#f1f5f9', // Abu terang

  // Teks
  text: '#0f172a',           // Hampir hitam
  textSecondary: '#64748b',  // Abu
  textTertiary: '#94a3b8',   // Abu terang
  textOnPrimary: '#ffffff',  // Putih

  // Status
  success: '#16a34a',        // Hijau
  warning: '#f59e0b',        // Kuning/Orange
  error: '#dc2626',          // Merah
  info: '#0ea5e9',           // Biru muda

  // Health
  healthGreen: '#16a34a',
  healthBlue: '#2563eb',
  healthAmber: '#f59e0b',
  healthRed: '#dc2626',

  // Priority
  priorityLow: '#94a3b8',
  priorityNormal: '#3b82f6',
  priorityHigh: '#f59e0b',
  priorityCritical: '#dc2626',

  // Border & divider
  border: '#e2e8f0',
  divider: '#f1f5f9',

  // Others
  disabled: '#cbd5e1',
  overlay: 'rgba(0, 0, 0, 0.5)',
  badge: '#ef4444',
  white: '#ffffff',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
} as const

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  // Aliases
  tiny: 4,
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  extraLarge: 24,
} as const

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  title: 34,
  // Aliases
  tiny: 11,
  small: 13,
  medium: 15,
  large: 17,
  extraLarge: 24,
} as const

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
  // Aliases
  small: 6,
  medium: 10,
  large: 14,
} as const
