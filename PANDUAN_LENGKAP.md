# 📘 PANDUAN LENGKAP — SISTEM HARMONISASI DOKUMEN TERPADU (HARM)
# Pemerintah Kabupaten Aceh Tamiang

> **Versi**: 1.0
> **Tanggal**: September 2026
> **Untuk**: Pengguna TANPA background coding
> **Catatan**: Panduan ini ditulis selengkap mungkin agar Anda bisa memasang,
> menjalankan, mengubah, menambah fitur, dan memperbaiki sistem TANPA bantuan programmer.

---

## DAFTAR ISI

1. [Pengenalan Sistem](#1-pengenalan-sistem)
2. [Persiapan Komputer](#2-persiapan-komputer)
3. [Cara Memasang Sistem (Instalasi)](#3-cara-memasang-sistem)
4. [Cara Menjalankan Sistem](#4-cara-menjalankan-sistem)
5. [Cara Menggunakan Sistem](#5-cara-menggunakan-sistem)
6. [Struktur Folder Proyek](#6-struktur-folder-proyek)
7. [Cara Mengubah Tampilan](#7-cara-mengubah-tampilan)
8. [Cara Menambah Fitur Baru](#8-cara-menambah-fitur-baru)
9. [Cara Mengubah Database](#9-cara-mengubah-database)
10. [Cara Memperbaiki Error](#10-cara-memperbaiki-error)
11. [Cara Deploy ke Internet](#11-cara-deploy-ke-internet)
12. [Pengaturan Supabase](#12-pengaturan-supabase)
13. [Referensi Cepat](#13-referensi-cepat)
14. [FAQ — Pertanyaan Sering Ditanya](#14-faq)

---

## 1. PENGENALAN SISTEM

### Apa Itu HARM?

HARM (Sistem Harmonisasi Dokumen Terpadu) adalah aplikasi web untuk mengelola
permohonan harmonisasi dokumen hukum di Pemerintah Kabupaten Aceh Tamiang.

### Apa Yang Bisa Dilakukan Sistem Ini?

- **Case Management**: Mengelola permohonan dari awal sampai selesai
- **Document Management**: Upload, versioning, dan review dokumen
- **Workflow Engine**: Alur kerja otomatis sesuai jenis dokumen
- **Evidence Management**: Mengelola bukti/evidence terkait permohonan
- **Review System**: Review dan anotasi dokumen
- **Audit Trail**: Semua aktivitas tercatat dan tidak bisa dihapus
- **Notification**: Pemberitahuan otomatis
- **SLA Tracking**: Pemantauan deadline dan tenggat waktu

### Teknologi Yang Digunakan

| Komponen | Teknologi | Fungsi |
|----------|-----------|--------|
| Tampilan (Frontend) | Next.js + React | Halaman web yang dilihat pengguna |
| Desain (Styling) | Tailwind CSS | Membuat tampilan cantik |
| Database | PostgreSQL (via Supabase) | Menyimpan semua data |
| Autentikasi | Supabase Auth | Login, register, keamanan |
| Penyimpanan File | Supabase Storage | Menyimpan file/dokumen |
| Bahasa Pemrograman | TypeScript | Bahasa yang digunakan di kode |

---

## 2. PERSIAPAN KOMPUTER

### Yang Harus Diinstall

Anda perlu menginstall 3 program di komputer:

### A. Install Node.js (Versi 20 atau lebih baru)

1. Buka browser, pergi ke: https://nodejs.org
2. Klik tombol download yang bertuliskan "LTS" (yang berwarna hijau)
3. Buka file yang terdownload, klik Next terus sampai Install
4. Setelah selesai, buka **Command Prompt** atau **PowerShell**:
   - Tekan tombol `Windows` di keyboard
   - Ketik `PowerShell`
   - Klik "Windows PowerShell"
5. Ketik perintah ini dan tekan Enter:
   ```
   node --version
   ```
6. Jika muncul angka seperti `v20.x.x`, berarti berhasil

### B. Install pnpm (Package Manager)

Masih di PowerShell, ketik:
```
npm install -g pnpm
```
Tunggu sampai selesai. Lalu verifikasi:
```
pnpm --version
```
Harus muncul angka versi.

### C. Install Git (Opsional, untuk version control)

1. Buka: https://git-scm.com/downloads
2. Download dan install untuk Windows
3. Verifikasi:
   ```
   git --version
   ```

### D. Buat Akun Supabase (GRATIS)

1. Buka: https://supabase.com
2. Klik "Start your project" → Sign up dengan GitHub atau email
3. Setelah login, klik "New Project"
4. Isi:
   - **Name**: HARM System
   - **Database Password**: (buat password yang kuat, CATAT!)
   - **Region**: Southeast Asia (Singapore)
5. Klik "Create new project"
6. Tunggu sampai project siap (sekitar 1-2 menit)
7. **CATAT informasi penting ini** (ada di Settings → API):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: (kunci panjang)
   - **service_role key**: (kunci panjang — JANGAN BAGIKAN KE SIAPAPUN)

---

## 3. CARA MEMASANG SISTEM

### Langkah 1: Buka folder proyek

Buka PowerShell, lalu ketik:
```powershell
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
```

### Langkah 2: Install semua dependensi

```powershell
pnpm install
```
Tunggu sampai selesai. Proses ini mengunduh semua pustaka yang dibutuhkan.
Bisa memakan waktu 2-5 menit tergantung kecepatan internet.

### Langkah 3: Buat file konfigurasi

Salin file contoh:
```powershell
Copy-Item .env.example apps\web\.env.local
```

### Langkah 4: Isi konfigurasi

Buka file `apps\web\.env.local` dengan Notepad:
```powershell
notepad apps\web\.env.local
```

Ganti isinya dengan informasi dari Supabase Anda:
```
NEXT_PUBLIC_SUPABASE_URL=https://XXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...(anon key dari Supabase)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...(service role key dari Supabase)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HARM - Sistem Harmonisasi Dokumen Terpadu
```

Simpan file (Ctrl+S), tutup Notepad.

### Langkah 5: Setup Database

1. Buka Supabase Dashboard → Project Anda → **SQL Editor**
2. Buka file `packages/database/migrations/001_initial_schema.sql`
   - Bisa pakai Notepad: klik kanan file → Open with → Notepad
   - Atau: `notepad packages\database\migrations\001_initial_schema.sql`
3. **Salin SEMUA isi file** (Ctrl+A, Ctrl+C)
4. **Tempel di SQL Editor Supabase** (Ctrl+V)
5. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
6. Tunggu sampai muncul "Success"
7. Ulangi langkah 2-6 untuk file:
   - `002_rls_policies.sql`
   - `003_seed_data.sql`

⚠️ **PENTING**: Jalankan file SESUAI URUTAN (001 dulu, lalu 002, lalu 003)!

### Langkah 6: Buat User Admin Pertama

1. Di Supabase Dashboard → **Authentication** → **Users**
2. Klik **"Add User"** → **"Create New User"**
3. Isi:
   - Email: `admin@harm.acehtamiang.go.id` (atau email Anda)
   - Password: (buat password kuat)
4. Klik "Create User"
5. Catat **User UID** yang muncul (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
6. Pergi ke **SQL Editor**, jalankan:
   ```sql
   INSERT INTO user_profiles (id, name, jabatan, unit, role)
   VALUES (
     'PASTE_USER_UID_DISINI',
     'Administrator',
     'Admin Sistem',
     'Bagian Hukum',
     'ADMIN'
   );
   ```
   Ganti `PASTE_USER_UID_DISINI` dengan User UID dari langkah 5.

---

## 4. CARA MENJALANKAN SISTEM

### Menjalankan di Komputer Lokal (Development)

Buka PowerShell, navigasi ke folder proyek:
```powershell
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
pnpm dev
```

Tunggu sampai muncul pesan seperti:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
```

Buka browser (Chrome/Edge), ketik di address bar:
```
http://localhost:3000
```

Sistem HARM akan muncul!

### Menghentikan Sistem

Di PowerShell, tekan `Ctrl+C` untuk menghentikan.

### Menjalankan Ulang Setelah Mati

```powershell
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
pnpm dev
```

---

## 5. CARA MENGGUNAKAN SISTEM

### Login

1. Buka `http://localhost:3000`
2. Masukkan email dan password yang sudah dibuat di Supabase
3. Klik "Masuk"

### Peran Pengguna (Role)

| Role | Bisa Apa | Untuk Siapa |
|------|----------|-------------|
| **ADMIN** | Semua: kelola user, OPD, workflow, sistem | Admin IT / Kabag Hukum |
| **ATASAN** | Review, approve, lihat laporan, monitor | Kabag, Asisten, Sekda |
| **STAF** | Buat case, upload dokumen, kelola task | Staf Bagian Hukum |

### Alur Kerja Utama

```
1. INTAKE (Menerima Permohonan)
   ↓
2. VERIFIKASI (Cek kelengkapan)
   ↓
3. NOMOR HARM (Diberikan setelah verifikasi)
   ↓
4. PROSES (Sesuai workflow jenis dokumen)
   ↓
5. REVIEW (Penelaahan, harmonisasi)
   ↓
6. KEPUTUSAN (Setuju/Revisi/Ditunda)
   ↓
7. FINALISASI (Checklist lengkap)
   ↓
8. SELESAI (Arsip)
```

### Membuat Case Baru

1. Klik "Permohonan" di sidebar kiri
2. Klik tombol "Buat Permohonan Baru"
3. Isi formulir:
   - Judul permohonan
   - Jenis dokumen (Perda/Perbup/SK Bupati/Instruksi Bupati)
   - OPD pengaju
   - Nama pengaju
   - Email pengaju
4. Upload dokumen
5. Klik "Kirim Permohonan"

### Upload Dokumen

1. Buka case yang diinginkan
2. Klik tab "Dokumen"
3. Klik "Upload Dokumen"
4. Drag-and-drop file atau klik untuk memilih file
5. Pilih kategori dan jenis dokumen
6. Klik "Upload"

---

## 6. STRUKTUR FOLDER PROYEK

```
harm-system/                     ← FOLDER UTAMA
│
├── apps/
│   └── web/                     ← APLIKASI WEB (yang dilihat pengguna)
│       └── src/
│           ├── app/             ← HALAMAN-HALAMAN
│           │   ├── (auth)/      ← Halaman login & register
│           │   ├── (dashboard)/ ← Halaman utama (setelah login)
│           │   │   ├── admin/   ← Halaman admin
│           │   │   ├── cases/   ← Halaman case/permohonan
│           │   │   │   └── [caseId]/ ← Detail 1 case
│           │   │   │       ├── page.tsx      ← Tab Ikhtisar
│           │   │   │       ├── process/      ← Tab Proses
│           │   │   │       ├── documents/    ← Tab Dokumen
│           │   │   │       ├── evidence/     ← Tab Evidence
│           │   │   │       ├── timeline/     ← Tab Timeline
│           │   │   │       ├── review/       ← Tab Review
│           │   │   │       ├── notes/        ← Tab Catatan
│           │   │   │       ├── tasks/        ← Tab Tugas
│           │   │   │       ├── meetings/     ← Tab Rapat
│           │   │   │       ├── decisions/    ← Tab Keputusan
│           │   │   │       ├── relations/    ← Tab Relasi
│           │   │   │       └── activity/     ← Tab Aktivitas
│           │   │   ├── command-center/       ← Dashboard utama
│           │   │   ├── evidence/             ← Index evidence global
│           │   │   ├── intake/               ← Intake permohonan
│           │   │   ├── my-work/              ← Pekerjaan saya
│           │   │   ├── notifications/        ← Notifikasi
│           │   │   ├── reports/              ← Laporan
│           │   │   ├── search/               ← Pencarian global
│           │   │   └── tasks/                ← Daftar tugas
│           │   ├── public-intake/            ← Intake publik (tanpa login)
│           │   └── tracking/                 ← Tracking publik
│           │
│           ├── components/      ← KOMPONEN UI (bagian-bagian tampilan)
│           │   ├── ui/          ← Komponen dasar (tombol, input, card, dll)
│           │   ├── layout/      ← Sidebar, header, breadcrumb
│           │   └── command-center/ ← Dashboard per role
│           │
│           └── lib/             ← LOGIKA & FUNGSI
│               ├── actions/     ← Server Actions (logika bisnis)
│               ├── supabase/    ← Koneksi database
│               └── utils.ts     ← Fungsi bantuan
│
├── packages/
│   ├── database/                ← DATABASE
│   │   └── migrations/          ← File SQL untuk membuat tabel
│   │       ├── 001_initial_schema.sql  ← Semua tabel
│   │       ├── 002_rls_policies.sql    ← Keamanan database
│   │       └── 003_seed_data.sql       ← Data awal
│   │
│   └── shared/                  ← KODE BERSAMA
│       └── src/
│           ├── constants.ts     ← Semua konstanta (status, role, dll)
│           └── validators.ts    ← Validasi form
│
├── package.json                 ← Konfigurasi proyek
├── .env.example                 ← Contoh file konfigurasi
└── turbo.json                   ← Konfigurasi build
```

### Penjelasan Penting:
- **`.tsx` file** = file yang berisi tampilan (HTML + JavaScript)
- **`.ts` file** = file yang berisi logika (JavaScript saja)
- **`.sql` file** = file yang berisi perintah database
- **`.css` file** = file yang berisi desain/styling

---

## 7. CARA MENGUBAH TAMPILAN

### 7.1 Mengubah Warna Utama (Brand Color)

Buka file: `apps/web/src/app/globals.css`

Cari bagian `:root` dan ubah nilai warna. Warna menggunakan format HSL:
```css
:root {
  --primary: 221.2 83.2% 53.3%;     /* Warna utama (biru) */
  --primary-foreground: 210 40% 98%; /* Warna teks di atas primary */
}
```

**Contoh mengubah ke warna hijau:**
```css
--primary: 142 76% 36%;
```

**Contoh mengubah ke warna merah:**
```css
--primary: 0 84% 60%;
```

**Cara mencari kode warna HSL:**
1. Buka Google
2. Ketik "color picker HSL"
3. Pilih warna yang diinginkan
4. Catat angka H (Hue), S (Saturation), L (Lightness)
5. Format: `H S% L%`

### 7.2 Mengubah Nama Aplikasi

**Di tampilan browser (title bar):**
Buka file: `apps/web/src/app/layout.tsx`
Cari bagian:
```typescript
title: 'HARM - Sistem Harmonisasi Dokumen Terpadu'
```
Ganti teks sesuai keinginan.

**Di sidebar:**
Buka file: `apps/web/src/components/layout/sidebar.tsx`
Cari teks "HARM" dan ganti.

**Di halaman login:**
Buka file: `apps/web/src/app/(auth)/login/page.tsx`
Cari teks yang berisi nama sistem dan ganti.

### 7.3 Mengubah Teks/Label

Semua teks di aplikasi menggunakan Bahasa Indonesia.
Untuk mengubah teks, buka file halaman yang bersangkutan dan cari teksnya.

**Contoh mengubah label "Permohonan" menjadi "Pengajuan":**
1. Cari semua file yang mengandung kata "Permohonan":
   ```powershell
   cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
   findstr /s /i "Permohonan" apps\web\src\*.tsx
   ```
2. Buka setiap file yang ditemukan
3. Ganti "Permohonan" dengan "Pengajuan"
4. Simpan file

### 7.4 Mengubah Menu Sidebar

Buka file: `apps/web/src/components/layout/sidebar.tsx`

Cari bagian yang berisi daftar menu (biasanya berupa array):
```typescript
const menuItems = [
  { label: 'Command Center', href: '/command-center', icon: LayoutDashboard },
  { label: 'Permohonan', href: '/cases', icon: FileText },
  // ...tambah atau hapus item di sini
]
```

**Menambah menu baru:**
Tambahkan baris baru di array:
```typescript
{ label: 'Menu Baru Saya', href: '/halaman-baru', icon: Star },
```

**Menghapus menu:**
Hapus baris menu yang tidak diinginkan.

**Mengubah urutan menu:**
Pindahkan posisi baris dalam array.

### 7.5 Menambah Logo

1. Simpan file logo di folder: `apps/web/public/logo.png`
2. Buka `apps/web/src/components/layout/sidebar.tsx`
3. Tambahkan di bagian atas sidebar:
   ```tsx
   <Image src="/logo.png" alt="Logo" width={120} height={40} />
   ```
4. Jangan lupa tambahkan import di bagian atas file:
   ```tsx
   import Image from 'next/image'
   ```

---

## 8. CARA MENAMBAH FITUR BARU

### 8.1 Menambah Halaman Baru

**Contoh: Menambah halaman "Arsip"**

**Langkah 1: Buat file halaman**

Buat folder dan file baru:
```
apps/web/src/app/(dashboard)/arsip/page.tsx
```

Isi file:
```tsx
// Halaman Arsip
// File: apps/web/src/app/(dashboard)/arsip/page.tsx

import { createClient } from '@/lib/supabase/server'

export default async function ArsipPage() {
  const supabase = await createClient()

  // Ambil data case yang sudah diarsipkan
  const { data: cases } = await supabase
    .from('cases')
    .select('*')
    .eq('is_archived', true)
    .order('archived_at', { ascending: false })

  return (
    <div className="p-6">
      {/* Judul halaman */}
      <h1 className="text-2xl font-bold mb-6">Arsip Permohonan</h1>

      {/* Tabel data */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">No. HARM</th>
              <th className="text-left p-4">Judul</th>
              <th className="text-left p-4">Jenis</th>
              <th className="text-left p-4">Tanggal Arsip</th>
            </tr>
          </thead>
          <tbody>
            {cases?.map((caseItem) => (
              <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{caseItem.harm_number}</td>
                <td className="p-4">{caseItem.title}</td>
                <td className="p-4">{caseItem.document_type}</td>
                <td className="p-4">{caseItem.archived_at}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Jika tidak ada data */}
        {(!cases || cases.length === 0) && (
          <div className="p-8 text-center text-gray-500">
            Belum ada permohonan yang diarsipkan.
          </div>
        )}
      </div>
    </div>
  )
}
```

**Langkah 2: Tambahkan ke menu sidebar**
Buka `apps/web/src/components/layout/sidebar.tsx`, tambahkan menu item baru.

**Langkah 3: Simpan dan lihat hasilnya**
Browser akan otomatis memuat ulang (jika `pnpm dev` sedang berjalan).

### 8.2 Menambah Kolom Baru di Database

**Contoh: Menambah kolom "nomor_telepon_opd" di tabel cases**

**Langkah 1: Buat file migrasi baru**

Buat file: `packages/database/migrations/004_add_phone_column.sql`
```sql
-- Menambah kolom nomor telepon OPD ke tabel cases
ALTER TABLE cases ADD COLUMN nomor_telepon_opd VARCHAR(50);
```

**Langkah 2: Jalankan di Supabase**
1. Buka Supabase Dashboard → SQL Editor
2. Tempel SQL di atas
3. Klik "Run"

**Langkah 3: Tampilkan di form/halaman**
Buka file halaman yang relevan dan tambahkan field baru.

### 8.3 Menambah Status Baru

**Contoh: Menambah status "MENUNGGU_DPRK"**

**Langkah 1: Tambah di constants**
Buka: `packages/shared/src/constants.ts`
Cari bagian `OFFICIAL_STATUS` dan tambahkan:
```typescript
export const OFFICIAL_STATUS = {
  DIAJUKAN: 'DIAJUKAN',
  // ... status yang sudah ada ...
  MENUNGGU_DPRK: 'MENUNGGU_DPRK',  // ← TAMBAH INI
  SELESAI: 'SELESAI',
} as const
```

Tambahkan juga label-nya:
```typescript
export const OFFICIAL_STATUS_LABELS = {
  // ... yang sudah ada ...
  MENUNGGU_DPRK: 'Menunggu DPRK',  // ← TAMBAH INI
}
```

**Langkah 2: Tambah warna di utils** (opsional)
Buka: `apps/web/src/lib/utils.ts`
Cari fungsi `getStatusColor` dan tambahkan warna untuk status baru.

### 8.4 Menambah Jenis Dokumen Baru

**Contoh: Menambah "Surat Keputusan Bersama"**

**Langkah 1: Tambah di constants**
Buka: `packages/shared/src/constants.ts`
```typescript
export const DOCUMENT_TYPES = {
  PERDA: 'PERDA',
  PERBUP: 'PERBUP',
  KEPUTUSAN_BUPATI: 'KEPUTUSAN_BUPATI',
  INSTRUKSI_BUPATI: 'INSTRUKSI_BUPATI',
  SKB: 'SKB',  // ← TAMBAH INI
} as const
```

Tambahkan label:
```typescript
export const DOCUMENT_TYPE_LABELS = {
  // ... yang sudah ada ...
  SKB: 'Surat Keputusan Bersama',  // ← TAMBAH INI
}
```

**Langkah 2: Tambah validator**
Buka: `packages/shared/src/validators.ts`
Tidak perlu diubah karena validator menggunakan `Object.values(DOCUMENT_TYPES)`.

**Langkah 3: Tambah workflow template di database**
Buka Supabase SQL Editor:
```sql
INSERT INTO workflow_templates (name, document_type, description, stages) VALUES
('Workflow SKB', 'SKB', 'Prosedur untuk Surat Keputusan Bersama',
'[
  {"order": 1, "name": "Pengajuan", "role": "STAF"},
  {"order": 2, "name": "Verifikasi", "role": "KABAG"},
  {"order": 3, "name": "Review", "role": "ASISTEN"},
  {"order": 4, "name": "Persetujuan", "role": "SEKDA"}
]'::jsonb);
```

### 8.5 Menambah OPD Baru

Cara termudah — melalui SQL di Supabase:
```sql
INSERT INTO opd (kode, nama, email, phone) VALUES
('DISDUKCAPIL', 'Dinas Kependudukan dan Pencatatan Sipil',
 'disdukcapil@acehtamiangkab.go.id', '0641-31020');
```

Atau melalui halaman Admin → OPD di aplikasi (jika sudah login sebagai ADMIN).

### 8.6 Menambah User Baru

**Melalui Supabase Dashboard:**
1. Authentication → Users → Add User
2. Isi email dan password
3. Catat User UID
4. Di SQL Editor:
   ```sql
   INSERT INTO user_profiles (id, name, jabatan, unit, role)
   VALUES ('USER_UID_DISINI', 'Nama Lengkap', 'Jabatan', 'Unit Kerja', 'STAF');
   ```

**Melalui halaman Admin** (jika sudah tersedia):
1. Login sebagai ADMIN
2. Buka Admin → Users
3. Klik "Tambah User"
4. Isi formulir

### 8.7 Menambah Tab Baru di Case Workspace

**Contoh: Menambah tab "Anggaran"**

**Langkah 1: Buat file halaman**
```
apps/web/src/app/(dashboard)/cases/[caseId]/anggaran/page.tsx
```

Isi contoh:
```tsx
import { createClient } from '@/lib/supabase/server'

export default async function AnggaranPage({
  params
}: {
  params: { caseId: string }
}) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Anggaran</h2>
      <p className="text-gray-500">
        Informasi anggaran terkait case ini.
      </p>
      {/* Tambahkan konten di sini */}
    </div>
  )
}
```

**Langkah 2: Tambah tab di layout**
Buka: `apps/web/src/app/(dashboard)/cases/[caseId]/layout.tsx`
Cari bagian tab navigation dan tambahkan:
```tsx
{ label: 'Anggaran', href: `/cases/${caseId}/anggaran` },
```

### 8.8 Menambah Server Action (Logika Bisnis) Baru

**Contoh: Membuat fungsi untuk menghitung statistik OPD**

Buat file baru: `apps/web/src/lib/actions/statistics.ts`
```tsx
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOpdStatistics(opdId: string) {
  const supabase = await createClient()

  // Hitung total case untuk OPD ini
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('opd_id', opdId)

  // Hitung case yang selesai
  const { count: completedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('opd_id', opdId)
    .eq('official_status', 'SELESAI')

  return {
    success: true,
    data: {
      total: totalCases || 0,
      completed: completedCases || 0,
      active: (totalCases || 0) - (completedCases || 0),
    }
  }
}
```

Panggil dari halaman:
```tsx
import { getOpdStatistics } from '@/lib/actions/statistics'

// Di dalam komponen:
const stats = await getOpdStatistics('opd-id-disini')
```

---

## 9. CARA MENGUBAH DATABASE

### 9.1 Menambah Tabel Baru

**Contoh: Menambah tabel "surat_keluar"**

Buat file migrasi baru: `packages/database/migrations/004_tabel_surat_keluar.sql`
```sql
-- Tabel untuk mencatat surat keluar
CREATE TABLE surat_keluar (
    -- ID unik otomatis
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relasi ke case
    case_id UUID REFERENCES cases(id),

    -- Data surat
    nomor_surat VARCHAR(100) NOT NULL,
    tanggal_surat DATE NOT NULL,
    perihal TEXT NOT NULL,
    tujuan TEXT,
    penandatangan VARCHAR(255),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Aktifkan keamanan baris
ALTER TABLE surat_keluar ENABLE ROW LEVEL SECURITY;

-- Policy: semua user authenticated bisa membaca
CREATE POLICY "Users can read surat_keluar"
ON surat_keluar FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policy: STAF dan ADMIN bisa membuat
CREATE POLICY "Staff can create surat_keluar"
ON surat_keluar FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Index untuk pencarian cepat
CREATE INDEX idx_surat_keluar_case ON surat_keluar(case_id);
CREATE INDEX idx_surat_keluar_nomor ON surat_keluar(nomor_surat);

-- Trigger updated_at otomatis
CREATE TRIGGER trg_surat_keluar_updated_at
BEFORE UPDATE ON surat_keluar
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
```

Jalankan di Supabase SQL Editor.

### 9.2 Mengubah Tabel Yang Sudah Ada

**Menambah kolom:**
```sql
ALTER TABLE cases ADD COLUMN catatan_khusus TEXT;
```

**Mengubah tipe kolom:**
```sql
ALTER TABLE cases ALTER COLUMN title TYPE VARCHAR(1000);
```

**Menghapus kolom** (HATI-HATI!):
```sql
ALTER TABLE cases DROP COLUMN catatan_khusus;
```

### 9.3 Menambah Index (Mempercepat Pencarian)

```sql
-- Membuat index pada kolom yang sering dicari
CREATE INDEX idx_cases_created_by ON cases(created_by);
```

### 9.4 Backup Database

1. Buka Supabase Dashboard
2. Settings → Database
3. Backups → Download backup

Atau via SQL:
```sql
-- Export data penting
SELECT * FROM cases;  -- Salin hasilnya
```

---

## 10. CARA MEMPERBAIKI ERROR

### 10.1 Error Umum dan Solusinya

#### ❌ "Module not found"
**Penyebab**: Package belum terinstall atau path salah.
**Solusi**:
```powershell
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
pnpm install
```

#### ❌ "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Penyebab**: File `.env.local` belum dibuat atau isinya kosong.
**Solusi**: Pastikan file `apps/web/.env.local` ada dan terisi benar.

#### ❌ "relation 'cases' does not exist"
**Penyebab**: Tabel belum dibuat di database.
**Solusi**: Jalankan file `001_initial_schema.sql` di Supabase SQL Editor.

#### ❌ "new row violates row-level security policy"
**Penyebab**: User tidak punya izin untuk operasi ini.
**Solusi**:
1. Periksa role user di tabel `user_profiles`
2. Periksa policy RLS di file `002_rls_policies.sql`
3. Jika perlu, tambahkan policy baru

#### ❌ "Invalid API key"
**Penyebab**: Kunci API Supabase salah.
**Solusi**: Periksa `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`

#### ❌ Halaman blank/putih
**Penyebab**: Ada error JavaScript.
**Solusi**:
1. Buka browser → tekan F12 (Developer Tools)
2. Klik tab "Console"
3. Lihat pesan error berwarna merah
4. Cari pesan error di Google untuk solusinya

#### ❌ "TypeError: Cannot read properties of null"
**Penyebab**: Data yang diharapkan tidak ada (null/undefined).
**Solusi**: Tambahkan pengecekan null:
```tsx
// SEBELUM (error):
{data.name}

// SESUDAH (aman):
{data?.name || 'Tidak ada nama'}
```

#### ❌ Build error saat deploy
**Penyebab**: Ada error di kode TypeScript.
**Solusi**:
```powershell
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
pnpm build
```
Baca pesan error, biasanya menunjukkan file dan baris yang bermasalah.

### 10.2 Cara Debugging (Mencari Error)

**Metode 1: Baca pesan error di terminal**
Saat menjalankan `pnpm dev`, pesan error muncul di PowerShell.

**Metode 2: Buka Console di browser**
1. Buka halaman yang error
2. Tekan F12
3. Klik tab "Console"
4. Baca pesan error berwarna merah

**Metode 3: Tambahkan console.log**
Di file `.ts` atau `.tsx`, tambahkan:
```typescript
console.log('Data yang diterima:', data)
```
Hasilnya akan muncul di terminal (untuk server) atau browser console (untuk client).

**Metode 4: Periksa data di Supabase**
1. Buka Supabase Dashboard → Table Editor
2. Pilih tabel yang bermasalah
3. Periksa apakah datanya benar

### 10.3 Cara Reset Total (Jika Semua Rusak)

```powershell
# 1. Hapus semua node_modules
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\web\node_modules
Remove-Item -Recurse -Force apps\web\.next

# 2. Install ulang
pnpm install

# 3. Jalankan ulang
pnpm dev
```

Untuk reset database:
1. Buka Supabase Dashboard → SQL Editor
2. Jalankan:
   ```sql
   -- PERINGATAN: Ini menghapus SEMUA data!
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```
3. Jalankan ulang file migrasi (001, 002, 003) sesuai urutan

---

## 11. CARA DEPLOY KE INTERNET

### Opsi 1: Deploy ke Vercel (Gratis untuk proyek kecil)

**Langkah 1: Buat akun Vercel**
1. Buka https://vercel.com
2. Sign up dengan GitHub

**Langkah 2: Upload kode ke GitHub**
```powershell
cd C:\Users\Myusu\.gemini\antigravity\scratch\harm-system
git init
git add .
git commit -m "Initial commit HARM System"
```
Buat repository di GitHub, lalu:
```powershell
git remote add origin https://github.com/USERNAME/harm-system.git
git push -u origin main
```

**Langkah 3: Connect ke Vercel**
1. Di Vercel Dashboard → "Add New Project"
2. Pilih repository harm-system
3. Di "Framework Preset", pilih "Next.js"
4. Di "Root Directory", ketik: `apps/web`
5. Di "Environment Variables", tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon key Anda
   - `SUPABASE_SERVICE_ROLE_KEY` = Service role key Anda
6. Klik "Deploy"
7. Tunggu beberapa menit
8. Anda akan mendapat URL seperti: `https://harm-system.vercel.app`

### Opsi 2: Deploy dengan Docker (Self-hosted)

Untuk deploy di server sendiri, hubungi tim IT untuk menyiapkan:
- Server Linux dengan Docker
- Domain (misal: harm.acehtamiangkab.go.id)
- SSL Certificate

---

## 12. PENGATURAN SUPABASE

### Storage Buckets (Penyimpanan File)

Buat bucket untuk menyimpan file:
1. Supabase Dashboard → Storage
2. Klik "New Bucket"
3. Buat bucket:
   - `documents` - untuk dokumen permohonan
   - `evidence` - untuk file evidence
   - `avatars` - untuk foto profil user
4. Untuk setiap bucket, set security policies sesuai kebutuhan

### Email Templates

Supabase bisa mengirim email otomatis:
1. Authentication → Email Templates
2. Customize template untuk:
   - Konfirmasi email
   - Reset password
   - Magic link

### Realtime (Notifikasi Real-time)

Sudah aktif secara default. Untuk mengaktifkan per-tabel:
1. Database → Replication
2. Enable replication untuk tabel `notifications`

---

## 13. REFERENSI CEPAT

### Perintah Terminal Penting

| Perintah | Fungsi |
|----------|--------|
| `pnpm dev` | Jalankan sistem di komputer lokal |
| `pnpm build` | Compile untuk production |
| `pnpm install` | Install semua dependensi |
| `pnpm add [nama-package]` | Tambah pustaka baru |

### File-File Penting

| File | Fungsi |
|------|--------|
| `apps/web/.env.local` | Konfigurasi rahasia (API keys) |
| `packages/shared/src/constants.ts` | Semua status, role, tipe dokumen |
| `packages/shared/src/validators.ts` | Validasi form |
| `apps/web/src/app/globals.css` | Warna dan styling global |
| `apps/web/src/components/layout/sidebar.tsx` | Menu navigasi |
| `apps/web/src/lib/supabase/server.ts` | Koneksi database |

### Istilah Penting

| Istilah | Artinya |
|---------|---------|
| Component | Bagian tampilan yang bisa dipakai ulang |
| Server Action | Fungsi yang jalan di server (aman) |
| RLS (Row Level Security) | Keamanan data di level baris database |
| Migration | File SQL untuk mengubah struktur database |
| Build | Proses compile kode jadi production-ready |
| Deploy | Proses memasang ke server internet |

### Tailwind CSS — Kelas Penting

| Kelas | Efek |
|-------|------|
| `p-4` | Padding 16px semua sisi |
| `m-4` | Margin 16px semua sisi |
| `text-xl` | Teks ukuran besar |
| `font-bold` | Teks tebal |
| `bg-blue-500` | Background biru |
| `text-white` | Teks putih |
| `rounded-lg` | Sudut membulat |
| `shadow` | Efek bayangan |
| `flex` | Layout flexbox |
| `grid` | Layout grid |
| `hidden` | Sembunyikan elemen |
| `hover:bg-gray-100` | Efek saat mouse di atas |

---

## 14. FAQ — PERTANYAAN SERING DITANYA

### Q: Apakah saya perlu internet untuk mengembangkan?
**A**: Ya, untuk:
- Download packages (`pnpm install`)
- Koneksi ke Supabase (database online)
- Deploy ke Vercel

Tapi setelah `pnpm dev` berjalan, sebagian besar tampilan bisa diakses offline
(selama tidak perlu data dari database).

### Q: Bagaimana kalau saya salah mengedit file?
**A**: Jika menggunakan Git:
```powershell
git checkout -- path/ke/file.tsx
```
Ini akan mengembalikan file ke kondisi terakhir yang di-commit.

Jika tidak pakai Git, Anda perlu mengembalikan dari backup.

### Q: Berapa biaya Supabase?
**A**: Plan gratis sudah cukup untuk:
- 50,000 active users per bulan
- 500 MB database
- 1 GB file storage
- Unlimited API requests

Untuk instansi pemerintah, biasanya plan gratis sudah cukup di tahap awal.

### Q: Apakah data aman?
**A**: Ya, karena:
- Row Level Security (RLS) aktif di semua tabel
- Password di-hash (tidak disimpan sebagai teks biasa)
- HTTPS terenkripsi
- Service role key tidak pernah masuk browser
- Audit trail mencatat semua aktivitas

### Q: Bagaimana cara backup?
**A**: Supabase otomatis backup setiap hari. Untuk manual:
- Supabase Dashboard → Settings → Backups → Download

### Q: Bisa diakses dari HP?
**A**: Ya! Tampilan responsif (menyesuaikan ukuran layar).
Buka URL sistem dari browser HP.

### Q: Bagaimana jika ada error yang tidak bisa saya perbaiki?
**A**: Langkah-langkah:
1. Screenshot pesan error
2. Catat langkah apa yang Anda lakukan sebelum error
3. Buka chat AI (seperti sesi ini) dan tempel error + penjelasan
4. AI dapat membantu mencari solusinya

### Q: Bagaimana cara menambah user staf baru?
**A**:
1. Login sebagai ADMIN
2. Buka Admin → Users → Tambah User
3. Isi nama, email, password, role, dan OPD
4. Staf baru bisa langsung login

### Q: Bagaimana jika Supabase down?
**A**: Supabase memiliki uptime 99.9%.
Cek status: https://status.supabase.com
Jika down, aplikasi tidak bisa digunakan sampai Supabase kembali normal.
Untuk ketersediaan lebih tinggi, pertimbangkan self-hosted Supabase.

---

## CATATAN PENUTUP

Sistem ini dirancang untuk berkembang. Anda bisa:

✅ Menambah fitur baru dengan membuat file `.tsx` baru
✅ Mengubah tampilan dengan mengedit Tailwind CSS classes
✅ Menambah data master melalui Supabase Dashboard
✅ Mengubah workflow melalui database
✅ Menambah status, jenis dokumen, dan OPD melalui constants

Jika butuh bantuan lebih lanjut, Anda bisa:
1. Buka sesi chat AI baru dan jelaskan apa yang ingin diubah
2. Tempel kode yang bermasalah
3. AI akan membantu menulis kode yang benar

---

*Dokumen ini dibuat otomatis untuk Sistem Harmonisasi Dokumen Terpadu*
*Pemerintah Kabupaten Aceh Tamiang — 2026*
