# Panduan Lengkap Aplikasi Android HARM (Sistem Harmonisasi Dokumen Terpadu)

Selamat datang di Panduan Lengkap Aplikasi Android HARM! Panduan ini dirancang khusus untuk Anda yang mungkin tidak memiliki latar belakang pemrograman (IT). Kami akan membahas langkah demi langkah, mulai dari pengenalan aplikasi hingga cara menginstal di HP Android Anda, bahkan sampai cara mempublikasikannya ke Google Play Store.

Silakan ikuti panduan ini dengan perlahan. Jika ada langkah yang kurang jelas, jangan ragu untuk mengulang membacanya.

---

## 1. Pengenalan

### Apa itu aplikasi Android HARM?
HARM (Sistem Harmonisasi Dokumen Terpadu) adalah sistem yang digunakan oleh Pemerintah Kabupaten Aceh Tamiang untuk mengelola dokumen dan perizinan. Selain versi Web yang diakses melalui komputer, kami juga menyediakan **Aplikasi Android** agar para pegawai dan pejabat bisa bekerja darimana saja, kapan saja, langsung dari genggaman tangan.

### Fitur Utama Mobile:
1. **Manajemen Tugas**: Melihat daftar pekerjaan yang harus segera diselesaikan hari ini.
2. **Approval (Persetujuan)**: Menyetujui atau menolak dokumen hanya dengan sekali tap di layar HP.
3. **Review Dokumen**: Membaca ringkasan dan detail dokumen yang diajukan sebelum memberikan persetujuan.
4. **Notifikasi Real-time**: Mendapatkan pemberitahuan seketika saat ada dokumen baru yang masuk atau status dokumen berubah.
5. **Evidence (Foto Bukti)**: Mengambil foto langsung dari kamera HP dan mengunggahnya sebagai bukti pendukung.
6. **Timeline Proses**: Melacak sudah sampai mana proses dokumen berjalan, siapa yang sudah menyetujui, dan siapa yang belum.
7. **Catatan Cepat**: Menambahkan catatan revisi atau komentar pendek terkait dokumen.

### Hubungan dengan Web App
Aplikasi mobile ini **bukan** sistem yang terpisah. Baik aplikasi web maupun aplikasi Android menggunakan **database yang sama** (berbasis Supabase). Artinya:
- Apa pun yang Anda ketik atau ubah di HP akan langsung muncul di komputer (Web).
- Apa pun yang diubah di Web akan langsung ter-update di layar HP Anda.
- Sangat sinkron dan terpadu!

---

## 2. Persiapan

Sebelum bisa membuat aplikasi Android-nya, Anda perlu menyiapkan beberapa "alat" di komputer Anda. Jangan khawatir, alat-alat ini aman dan gratis.

### Langkah-langkah Persiapan:

1. **Install Node.js**
   - Node.js adalah mesin utama yang menjalankan kode aplikasi kita.
   - Silakan merujuk pada Buku Panduan Utama HARM untuk langkah detail instalasi Node.js.
   - Pastikan Anda menggunakan versi LTS (Long Term Support).

2. **Install pnpm**
   - pnpm adalah alat bantu untuk mengunduh komponen-komponen aplikasi.
   - Buka aplikasi `Terminal` atau `Command Prompt` (CMD) di komputer Anda.
   - Ketikkan perintah ini lalu tekan Enter: `npm install -g pnpm`

3. **Install Expo CLI**
   - Expo adalah teknologi ajaib yang mengubah kode komputer menjadi aplikasi HP.
   - Di Terminal, ketik: `npm install -g expo-cli eas-cli`
   - Tekan Enter dan tunggu sampai proses selesai.

4. **Buat Akun Expo (Gratis)**
   - Buka browser (Chrome/Firefox) dan kunjungi: **https://expo.dev**
   - Klik tombol **Sign Up**.
   - Isi email, username, dan password Anda. Catat baik-baik karena nanti akan dipakai.

5. **Install Expo Go di HP Android Anda**
   - Ambil HP Android Anda.
   - Buka **Google Play Store**.
   - Cari aplikasi bernama **"Expo Go"**.
   - Install aplikasi tersebut.

6. **Koneksi WiFi**
   - **SANGAT PENTING**: Pastikan HP Anda dan Komputer Anda terhubung pada **jaringan WiFi yang sama**. Jika tidak sama, HP tidak akan bisa terhubung ke komputer.

---

## 3. Konfigurasi Database

Agar aplikasi tahu kemana harus menyimpan data, kita perlu memberikan "alamat" database.

1. Buka folder proyek HARM Anda (`C:\Users\Myusu\.gemini\antigravity\scratch\harm-system`).
2. Masuk ke folder `apps` lalu folder `mobile`.
3. Buat sebuah file baru bernama `.env`. (Pastikan titik di depan ikut ditulis, bukan `env` biasa).
4. Buka file `.env` tersebut dengan Notepad atau aplikasi teks lainnya.
5. Copy-paste teks berikut ke dalamnya:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Penjelasan Variabel:**
- `EXPO_PUBLIC_SUPABASE_URL`: Ini adalah alamat web unik dari database Supabase Anda. Ganti `https://xxxxx.supabase.co` dengan alamat asli yang Anda dapatkan saat mendaftar Supabase.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Ini adalah "kunci gembok" aman untuk mengakses data Anda. Ganti dengan teks panjang (anon key) yang ada di pengaturan Supabase Anda.

---

## 4. Menjalankan di HP (Development/Percobaan)

Sekarang mari kita coba jalankan aplikasinya di HP Anda untuk pertama kali!

1. Buka Terminal/Command Prompt di komputer.
2. Pindah ke folder mobile dengan mengetik: `cd apps/mobile` lalu tekan Enter.
3. Ketik: `pnpm install` (lalu tekan Enter). Tunggu sampai semua file berhasil didownload.
4. Ketik: `pnpm start` (atau `npx expo start`) lalu tekan Enter.
5. Anda akan melihat sebuah **QR Code** kotak besar muncul di layar Terminal Anda.
6. Ambil HP Android Anda, buka aplikasi **Expo Go**.
7. Pilih menu **Scan QR Code** di aplikasi tersebut.
8. Arahkan kamera HP ke layar komputer untuk men-scan QR Code.
9. *Voila!* Aplikasi HARM sedang dimuat di HP Anda. Tunggu sekitar 1-2 menit untuk loading pertama.

### Troubleshooting Koneksi (Jika gagal nyambung):
- Pastikan sekali lagi WiFi HP dan Komputer sama persis.
- Coba matikan Firewall atau Antivirus sementara di komputer.
- Jika QR Code masih tidak bisa discan, tekan huruf `a` di terminal komputer untuk mencoba membuka Android Emulator (jika Anda sudah menginstalnya).

---

## 5. Membuat File APK (Untuk Distribusi ke Pegawai)

Aplikasi Expo Go hanya untuk tes. Untuk membagikan aplikasi ke para pegawai, kita perlu membuat file bernama `.apk`. File ini sama seperti file `.exe` di Windows.

Ada dua cara membuat APK. Pilih salah satu saja.

### Metode 1: Dengan EAS Build (Sangat Disarankan, Mudah & Online)
Cara ini menggunakan server canggih milik Expo di internet untuk membuatkan APK. Komputer Anda tidak akan terbebani.

1. Buka Terminal di folder `apps/mobile`.
2. Ketik: `eas login` (Lalu masukkan username dan password Expo yang tadi dibuat di web).
3. Ketik: `eas build:configure` (Pilih Android, tekan enter untuk semua pilihan default).
4. Ketik: `eas build --platform android --profile apk`
5. Proses ini akan mengirim kode ke server Expo. Anda akan diberikan sebuah **Link Web**.
6. Klik link web tersebut atau buka di browser.
7. Tunggu sekitar **10 sampai 20 menit**. Silakan buat kopi dulu!
8. Jika sudah selesai, akan muncul tombol **Download**. Klik tombol itu, dan Anda akan mendapatkan file APK-nya.

### Metode 2: Build Lokal (Tanpa Internet, Butuh Komputer Canggih)
Cara ini dilakukan sepenuhnya di komputer Anda. Hanya disarankan jika Anda tidak punya internet stabil atau mengerti teknis.

1. Install **Android Studio** dari website resminya.
2. Install **JDK 17** (Java Development Kit).
3. Atur variabel lingkungan (Environment Variables) bernama `ANDROID_HOME` menunjuk ke folder instalasi Android SDK.
4. Di terminal folder `apps/mobile`, ketik: `npx expo prebuild`
5. Ketik: `cd android`
6. Ketik: `./gradlew assembleRelease`
7. Proses ini sangat membebani komputer. Jika berhasil, file APK akan tersimpan di dalam folder: `android/app/build/outputs/apk/release/`

---

## 6. Install APK di HP

Setelah memiliki file `.apk`, mari pasang di HP.

1. **Kirim File APK ke HP Anda**. Anda bisa menggunakan:
   - Kabel USB (Copy dari komputer ke folder Download HP)
   - Email (Kirim file ke email Anda sendiri, lalu buka email di HP)
   - WhatsApp (Kirim lewat WhatsApp Web)
   - Google Drive
2. Di HP Anda, cari file APK yang sudah dikirim tadi.
3. Ketuk file APK tersebut untuk membukanya.
4. HP Anda mungkin akan menampilkan peringatan keamanan: **"Install unknown apps"** atau **"Sumber tidak dikenal"**.
5. Pilih **Settings / Pengaturan**, lalu aktifkan **"Allow from this source" / "Izinkan dari sumber ini"**.
6. Kembali ke instalasi, ketuk tombol **Install / Pasang**.
7. Selesai! Aplikasi HARM kini sudah terpasang dan bisa dibuka seperti aplikasi biasa dari layar utama HP Anda.

---

## 7. Mengubah Tampilan Mobile (Customization)

Jika Anda ingin menyesuaikan tampilan aplikasi dengan ciri khas Pemerintah Kabupaten Aceh Tamiang, berikut panduannya:

### Mengubah Warna Dominan:
1. Buka file `apps/mobile/src/lib/theme.ts`.
2. Cari kode warna (misal: `#3b82f6` yang merupakan warna biru).
3. Ubah dengan kode warna Hex baru sesuai warna logo dinas Anda.

### Mengubah Nama Aplikasi (Yang muncul di HP):
1. Buka file `apps/mobile/app.json`.
2. Cari baris bertuliskan `"name": "HarmMobile"`.
3. Ubah menjadi `"name": "HARM Aceh Tamiang"`.

### Mengubah Icon Aplikasi:
1. Siapkan gambar logo berukuran **persegi sama sisi**, tepatnya 1024x1024 pixel. Simpan dengan nama `icon.png`.
2. Gantikan file lama yang ada di folder `apps/mobile/assets/icon.png` dengan file baru Anda.

### Mengubah Gambar Loading (Splash Screen):
1. Siapkan gambar panjang ke bawah berukuran 1284x2778 pixel. Namakan `splash.png`.
2. Gantikan file lama di `apps/mobile/assets/splash.png`.

### Mengubah Package Name (Identitas unik aplikasi):
1. Buka file `app.json`.
2. Cari `"android": { "package": "com.namaperusahaan.harm" }`.
3. Ubah menjadi format `com.acehtamiang.harm`.

---

## 8. Menambah Fitur Baru di Mobile

Jika di masa depan Anda menyewa programmer untuk menambah fitur, ini adalah panduan singkat untuk mereka.

### Cara Menambah Layar (Screen) Baru:
1. Buka folder `apps/mobile/src/screens/`.
2. Buat file baru, misalnya `LaporanScreen.tsx`.
3. Isi dengan kode dasar React Native:
   ```tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   export default function LaporanScreen() {
     return (
       <View style={styles.container}>
         <Text>Halaman Laporan Baru</Text>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: { flex: 1, padding: 20 },
   });
   ```
4. Daftarkan layar baru ini di file Navigasi utama (`apps/mobile/src/navigation/AppNavigator.tsx`).

### Cara Menambah Tab di Bawah (Bottom Navigation):
- Buka file navigator tab Anda, biasanya bernama `MainTabNavigator.tsx`.
- Tambahkan `<Tab.Screen name="Laporan" component={LaporanScreen} />` di dalam elemen `<Tab.Navigator>`.

### Menambah Tombol di Dashboard:
- Buka `DashboardScreen.tsx`.
- Gunakan komponen `TouchableOpacity` atau `Button` bawaan React Native.
- Berikan aksi dengan atribut `onPress={() => alert('Tombol ditekan!')}`.

---

## 9. Menghubungkan ke Web App (Sinkronisasi Data)

Anda tidak perlu melakukan langkah ekstra untuk ini!

Sistem HARM dirancang agar Mobile dan Web **Berbagi Jantung yang Sama** (Database Supabase).
- Saat seorang petugas di lapangan memfoto bukti dokumen pakai aplikasi Mobile dan menyimpannya.
- Pada detik yang sama, Kepala Dinas yang sedang membuka Web HARM di laptop ruangannya akan melihat foto tersebut muncul di layarnya.
- Begitu juga notifikasi: Jika dokumen ditolak via Web, HP petugas akan langsung bergetar menerima notifikasi.

Pastikan saja file `.env` di Web dan file `.env` di Mobile berisi URL dan Key Supabase yang SAMA PERSIS.

---

## 10. Panduan Perbaikan Masalah (Troubleshooting)

Jangan panik jika terjadi error. Berikut daftar masalah umum dan solusinya:

- **Error "Network request failed"**
  Solusi: HP Anda kehilangan koneksi internet, atau server Supabase sedang tidak bisa diakses. Cek apakah kuota data / WiFi Anda aktif.

- **Error "Invalid API key" atau tidak bisa login padahal password benar**
  Solusi: Kunci rahasia di file `.env` Anda salah, kurang satu huruf, atau ada spasi di ujungnya. Periksa kembali file `.env`!

- **Aplikasi Tiba-tiba Menutup Sendiri (Crash)**
  Solusi: Jika menggunakan Expo Go, lihat layar Terminal di komputer. Akan ada tulisan merah yang menjelaskan baris kode mana yang menyebabkan error.

- **Build APK di EAS selalu Gagal (Failed)**
  Solusi: Terkadang server Expo sedang penuh. Tunggu 1 jam dan coba perintah `eas build` lagi. Pastikan versi Node.js Anda sudah terbaru.

- **APK Tidak Bisa Diinstall ("App not installed")**
  Solusi: Anda mungkin lupa mencentang "Unknown Sources / Sumber tidak dikenal" di pengaturan keamanan HP Anda. Atau, memori HP Anda penuh. Hapus beberapa foto atau video.

- **Notifikasi (Pemberitahuan) Tidak Muncul di HP**
  Solusi: Buka pengaturan HP Anda -> Manajemen Aplikasi -> Cari HARM -> Pilih "Notifications/Pemberitahuan" -> Pastikan statusnya "ON" atau "Diizinkan".

---

## 11. Publikasi ke Google Play Store (Opsional)

Jika Anda ingin aplikasi HARM bisa di-download langsung oleh semua orang dari Play Store, ikuti langkah ini.

1. **Buat Akun Developer:**
   - Kunjungi `play.google.com/apps/publish`
   - Daftar dan bayar pendaftaran sebesar \$25 (sekitar Rp 400.000) menggunakan kartu kredit. Bayar hanya sekali seumur hidup.

2. **Buat File AAB (Android App Bundle):**
   - Play Store sekarang mewajibkan format `.aab`, bukan `.apk`.
   - Di terminal komputer, ketik: `eas build --platform android --profile production`
   - Download file AAB setelah proses build selesai.

3. **Upload ke Play Console:**
   - Masuk ke dashboard Google Play Console Anda.
   - Klik **"Create App"**.
   - Isi Nama Aplikasi (HARM Aceh Tamiang), Deskripsi, dan kategori.
   - Upload file Logo (512x512) dan beberapa screenshot layar aplikasi Anda.
   - Pergi ke menu "App Release" dan upload file `.aab` yang tadi didownload.

4. **Tunggu Review (Pemeriksaan):**
   - Setelah Anda submit, pihak Google akan memeriksa keamanan aplikasi Anda.
   - Proses ini biasanya memakan waktu **1 sampai 7 hari kerja**.
   - Jika lulus, aplikasi Anda akan otomatis muncul di Play Store!

---

## 12. FAQ (Tanya Jawab Seputar Android)

**T: Apakah aplikasi ini bisa dipakai di iPhone/iOS?**
J: Secara teknis bisa! Kode React Native yang kita buat kompatibel untuk Android dan iOS. Namun, untuk membuat file instalasi iPhone, Anda *wajib* menggunakan komputer Mac (Apple) dan membayar Akun Developer Apple sebesar \$99 / tahun.

**T: Apakah semua layanan pembuatan aplikasi ini gratis?**
J: Ya. Pembuatan kode gratis, Supabase (tier gratis) gratis, dan pembuatan APK menggunakan server Expo EAS Build gratis hingga 30 kali build setiap bulannya. Sangat cukup untuk penggunaan pemerintah daerah.

**T: Minimal HP Android versi berapa yang bisa pakai aplikasi HARM?**
J: Aplikasi ini bisa berjalan mulus di Android 6.0 (Marshmallow) ke atas. Hampir 98% HP Android yang beredar saat ini sudah menggunakan versi di atas itu.

**T: Berapa ukuran aplikasinya? Akan bikin HP lemot tidak?**
J: Ukuran file APK biasanya berkisar antara 25MB hingga 50MB. Sangat ringan dan tidak akan membuat memori HP penuh atau lemot.

**T: Apakah aplikasi HARM bisa digunakan offline (tanpa internet)?**
J: Sebagian besar fitur HARM membutuhkan internet (untuk sinkronisasi dokumen). Namun, fitur seperti menulis draf catatan sementara masih bisa diketik tanpa sinyal, dan akan terkirim otomatis begitu HP mendapatkan sinyal internet kembali.

---

*Panduan ini dibuat secara khusus untuk memandu tim IT dan Non-IT Pemerintah Kabupaten Aceh Tamiang dalam mengoperasikan dan mengelola platform Mobile HARM.*

*Terima kasih telah membaca, dan selamat menggunakan HARM!*
