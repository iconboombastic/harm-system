/**
 * Google Drive Enterprise Storage Service
 * Pemerintah Kabupaten Aceh Tamiang (Bagian Hukum Setdakab)
 * 
 * Mengelola struktur direktori hierarkis terstandarisasi, penamaan file baku,
 * kontrol akses bertingkat, dan enkripsi integritas berkas (SHA-256).
 */

export interface FolderNode {
  code: string;
  name: string;
  description: string;
  securityLevel: 'READ_ONLY_LOCKED' | 'RESTRICTED_LEGAL' | 'INTERNAL_WORK' | 'ARCHIVE_IMMUTABLE';
  lockStatus?: 'TERKUNCI' | 'TERBUKA' | 'PERMANEN';
  subfolders?: string[];
  allowedRoles: ('ADMIN' | 'REVIEWER' | 'STAFF' | 'OPD')[];
}

export const HARM_GDRIVE_STRUCTURE = {
  rootName: 'HARM — ROOT',
  stages: [
    {
      code: '00',
      name: '00 - MENUNGGU VERIFIKASI',
      description: 'Berkas permohonan masuk dari OPD sebelum uji formil dan kelengkapan berkas.',
      securityLevel: 'RESTRICTED_LEGAL',
      lockStatus: 'TERBUKA',
      allowedRoles: ['ADMIN', 'STAFF', 'OPD'],
    },
    {
      code: '01',
      name: '01 - DOKUMEN ASLI',
      description: 'Draf naskah awal & Surat Pengantar asli dari Kepala OPD. Terkunci read-only untuk bukti autentikasi.',
      securityLevel: 'READ_ONLY_LOCKED',
      lockStatus: 'TERKUNCI',
      allowedRoles: ['ADMIN', 'REVIEWER', 'STAFF'],
    },
    {
      code: '02',
      name: '02 - REVIEW',
      description: 'Catatan telaahan hukum, matriks rekomendasi, dan kajian yuridis tim perancang.',
      securityLevel: 'INTERNAL_WORK',
      lockStatus: 'TERBUKA',
      subfolders: ['Review_01', 'Review_02', 'Review_03'],
      allowedRoles: ['ADMIN', 'REVIEWER', 'STAFF'],
    },
    {
      code: '03',
      name: '03 - REVISI',
      description: 'Draf perubahan naskah per pasal hasil rapat pembahasan dan harmonisasi.',
      securityLevel: 'INTERNAL_WORK',
      lockStatus: 'TERBUKA',
      subfolders: ['Koreksi_Rev-1', 'Koreksi_Rev-2', 'Koreksi_Rev-3'],
      allowedRoles: ['ADMIN', 'REVIEWER', 'STAFF'],
    },
    {
      code: '04',
      name: '04 - EVIDENCE',
      description: 'Seluruh bukti dukung fisik/digital pendukung keabsahan formil proses harmonisasi.',
      securityLevel: 'RESTRICTED_LEGAL',
      lockStatus: 'TERBUKA',
      subfolders: [
        'Surat',
        'Berita Acara',
        'Notulen',
        'Foto Rapat',
        'Fasilitasi',
        'Registrasi',
        'Dokumen Pendukung',
      ],
      allowedRoles: ['ADMIN', 'REVIEWER', 'STAFF', 'OPD'],
    },
    {
      code: '05',
      name: '05 - FINAL',
      description: 'Naskah bersih akhir yang telah disetujui, siap pembubuhan paraf hierarkis dan TTE Bupati.',
      securityLevel: 'READ_ONLY_LOCKED',
      lockStatus: 'TERKUNCI',
      allowedRoles: ['ADMIN', 'REVIEWER'],
    },
    {
      code: '99',
      name: '99 - ARSIP',
      description: 'Salinan resmi naskah yang telah diundangkan di Lembaran Daerah dan tersimpan di JDIH.',
      securityLevel: 'ARCHIVE_IMMUTABLE',
      lockStatus: 'PERMANEN',
      allowedRoles: ['ADMIN', 'REVIEWER', 'STAFF'],
    },
  ] as FolderNode[],
};

/**
 * Format nama folder permohonan: [HARM-ID] - [Judul Permohonan Ringkas]
 */
export function generateCaseFolderName(harmNumber: string, title: string): string {
  const cleanHarm = (harmNumber || 'HARM-2026-0001').trim();
  const cleanTitle = (title || 'Permohonan Produk Hukum')
    .replace(/[/\\?%*:|"<>]/g, '-')
    .slice(0, 45)
    .trim();
  return `${cleanHarm} - ${cleanTitle}`;
}

/**
 * Standar Penamaan File Baku:
 * [HARM-ID]_[KODE-TAHAP]_[KATEGORI-SUB]_[JUDUL-SINGKAT]_[VERSI]_[TANGGAL].[EXT]
 * Contoh: HARM-2026-0001_04-EVIDENCE_Notulen_Pleno-Tarif_v1_20260918.pdf
 */
export function generateStandardFileName(
  harmNumber: string,
  stageCode: string,
  subCategory: string,
  docTitle: string,
  version: number = 1,
  ext: string = 'pdf'
): string {
  const harm = (harmNumber || 'HARM-2026-0001').replace(/[^a-zA-Z0-9-]/g, '');
  const sub = subCategory ? `_${subCategory.replace(/[^a-zA-Z0-9]/g, '-')}` : '';
  const title = docTitle
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const cleanExt = ext.replace(/^\./, '').toLowerCase();

  return `${harm}_${stageCode}${sub}_${title}_v${version}_${dateStr}.${cleanExt}`;
}

/**
 * Hash Checksum Validator (Simulasi SHA-256 untuk mendeteksi integritas dokumen)
 */
export function generateMockSha256(filename: string, size: number): string {
  let hash = 0;
  const str = `${filename}-${size}-harm-tamiang-integrity`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${hex.slice(0, 8)}`;
}
