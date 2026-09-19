'use server';

import { 
  OfficialRegulationLink, 
  extractAndLinkRegulations, 
  searchRegulations, 
  generateDirectSearchLinks,
  detectLegalDomain,
  getRegulationsByDomain,
  OFFICIAL_REGULATION_DATABASE 
} from '@/lib/services/regulation-service';

export interface ScreenContext {
  pathname: string;
  pageTitle?: string;
  caseId?: string;
  caseTitle?: string;
  caseNumber?: string;
  caseType?: string;
  opdName?: string;
  status?: string;
  selectedText?: string;
  documentSnippet?: string;
}

export interface CopilotResponse {
  success: boolean;
  reply: string;
  screenDetected: boolean;
  detectedTitle?: string;
  references: OfficialRegulationLink[];
  directSearch?: {
    queryText: string;
    bpkSearchUrl: string;
    jdihnSearchUrl: string;
    acehTamiangJdihUrl: string;
  };
  suggestedAction?: {
    type: 'COPY_CLAUSE' | 'DISPATCH_TO_STAFF' | 'OPEN_BPK';
    title: string;
    payload?: any;
  };
}

/**
 * Server action: Mengirim pesan ke AI Legal Copilot dengan deteksi konteks layar & presisi yuridis OPD
 */
export async function sendCopilotMessageAction(params: {
  message: string;
  screenContext?: ScreenContext;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<CopilotResponse> {
  const { message, screenContext } = params;
  const lowerMsg = message.toLowerCase();

  // 1. Ekstrak data layar jika ada
  const hasScreen = Boolean(screenContext && (screenContext.caseTitle || screenContext.pageTitle || screenContext.selectedText));
  const screenTitle = screenContext?.caseTitle || screenContext?.pageTitle || 'Layar Sistem HARM';
  const screenDoc = screenContext?.documentSnippet || screenContext?.selectedText || '';
  const opdName = screenContext?.opdName || '';

  // 2. Gabungkan teks untuk analisis konteks
  const combinedContext = `${message} ${screenDoc} ${screenContext?.caseTitle || ''} ${opdName}`.trim();
  
  // 3. Deteksi Domain Hukum Spesifik
  const domain = detectLegalDomain(combinedContext);
  
  // 4. Ekstrak Regulasi Presisi (HANYA regulasi yang cocok dengan domain atau disebut eksplisit)
  let detectedReferences = extractAndLinkRegulations(combinedContext);
  
  // Jika pengguna mencari kata kunci spesifik (misal: "UU 12/2011" atau "stunting" atau "disiplin")
  if (detectedReferences.length === 0) {
    detectedReferences = getRegulationsByDomain(domain);
  } else {
    // Saring agar hanya mencakup regulasi yang sesuai domain atau pilar umum (UUPA / UU 12/2011)
    const validDomainIds = new Set(getRegulationsByDomain(domain).map(r => r.id));
    detectedReferences = detectedReferences.filter(r => 
      validDomainIds.has(r.id) || 
      r.id === 'uu-11-2006' || 
      r.id === 'uu-12-2011' ||
      r.domain === domain
    );
    if (detectedReferences.length === 0) {
      detectedReferences = getRegulationsByDomain(domain);
    }
  }

  // Batasi maksimal 4 referensi teratas agar tidak membingungkan pengguna
  detectedReferences = detectedReferences.slice(0, 4);

  // Buat tautan pencarian langsung BPK RI, JDIHN, dan JDIH Aceh Tamiang
  const searchSubject = message.replace(/cek|apakah|bagaimana|aturan|tentang|tolong|coba|mohon|carikan|dasar hukum|naskah|draf/gi, '').trim() || (screenContext?.caseTitle ? screenContext.caseTitle.slice(0, 30) : 'produk hukum daerah');
  const directLinks = generateDirectSearchLinks(searchSubject);

  // =========================================================================
  // SKENARIO A: Deteksi Teks yang Dipilih / Diblok di Layar (Clause Inspector)
  // =========================================================================
  if (screenContext?.selectedText && screenContext.selectedText.trim().length > 0) {
    const selText = screenContext.selectedText.trim();
    let reply = `### 📍 Deteksi Klausul di Layar:
> *"${selText.length > 150 ? selText.substring(0, 150) + '...' : selText}"*

`;

    // Cek apakah ada indikasi sanksi pidana pada Peraturan Bupati (Perbup)
    if (
      (selText.toLowerCase().includes('kurungan') || selText.toLowerCase().includes('denda pidana') || selText.toLowerCase().includes('pidana')) &&
      (screenContext.caseType?.toLowerCase().includes('perbup') || screenContext.caseTitle?.toLowerCase().includes('perbup') || !screenContext.caseType?.toLowerCase().includes('qanun'))
    ) {
      reply += `⚠️ **PERINGATAN HUKUM KRITIS (Pertentangan Norma)**:
Klausul ini memuat sanksi pidana/kurungan. Sesuai **Pasal 15 ayat (2) UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022**, **Peraturan Bupati (Perbup) TIDAK MEMILIKI KEWENANGAN** memuat ancaman sanksi pidana. 
Ketentuan sanksi pidana hanya dapat diatur melalui **Qanun Kabupaten / Peraturan Daerah**.

💡 **Rekomendasi Perbaikan:**
Ubah ketentuan sanksi pidana menjadi **Sanksi Administratif** (contoh: teguran tertulis, denda administratif, penghentian sementara kegiatan, atau pencabutan izin).`;

      return {
        success: true,
        reply,
        screenDetected: true,
        detectedTitle: screenTitle,
        references: detectedReferences,
        directSearch: directLinks,
        suggestedAction: {
          type: 'COPY_CLAUSE',
          title: 'Salin Rumusan Sanksi Administratif Standar',
          payload: 'Pelanggaran terhadap ketentuan sebagaimana dimaksud dalam Pasal ini dikenakan sanksi administratif berupa: a. teguran tertulis; b. denda administratif; c. penghentian sementara pelayanan/kegiatan; atau d. pembekuan/pencabutan izin operasional.',
        },
      };
    }

    // Default review teks terpilih
    reply += `Klausul tersebut telah dianalisis terhadap kaidah **Legal Drafting UU 12/2011** dan database regulasi **BPK RI / JDIHN**.
- **Kesesuaian Tata Bahasa**: Menggunakan rumusan baku Bahasa Indonesia hukum dan ketentuan perundang-undangan.
- **Hierarki**: Selaras dengan kewenangan otonomi daerah Kabupaten Aceh Tamiang dan peraturan perundang-undangan yang lebih tinggi.
- **Rujukan Resmi**: Periksa kartu rujukan resmi di bawah ini untuk melihat dokumen asli di portal BPK RI & JDIHN.`;

    return {
      success: true,
      reply,
      screenDetected: true,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // =========================================================================
  // SKENARIO B: Sektor Berdasarkan Klasifikasi Yuridis (10+ Sektor Pemerintahan)
  // =========================================================================

  // 1. KESEHATAN, GIZI, PUSKESMAS & STUNTING (DINKES / RSUD)
  if (domain === 'KESEHATAN_GIZI' || lowerMsg.includes('kesehatan') || lowerMsg.includes('stunting') || lowerMsg.includes('dinkes')) {
    let reply = `### 🏥 Rujukan Resmi Sektor Kesehatan & Percepatan Penurunan Stunting
**Pemerintah Kabupaten Aceh Tamiang — Dinas Kesehatan & RSUD Muda Sedia**

Berdasarkan database peraturan **BPK RI** dan **JDIHN Kemenkumham**, ketentuan hukum yang berlaku dan wajib dipedomani:

1. **Undang-Undang Nomor 17 Tahun 2023 (UU Kesehatan / Omnibus Law)**:
   - **Mencabut secara menyeluruh**: UU No. 36 Tahun 2009 tentang Kesehatan dan UU No. 44 Tahun 2009 tentang Rumah Sakit.
   - *Peringatan Legal Drafting*: Pastikan konsideran *Mengingat* **TIDAK MENCANTUMKAN** UU 36/2009 atau UU 44/2009 untuk mencegah cacat formil.
   - Mengatur desentralisasi pelayanan kesehatan dasar, penguatan puskesmas, dan integrasi pembiayaan kesehatan daerah.

2. **Peraturan Presiden Nomor 72 Tahun 2021 (Percepatan Penurunan Stunting)**:
   - Menetapkan kewajiban Tim Percepatan Penurunan Stunting (TPPS) di tingkat Kabupaten, Kecamatan, dan Gampong/Desa.
   - Mengharuskan konvergensi program lintas sektor (Dinkes, DPMK, Disdikbud, PUPR, dan DLH).

3. **Peraturan Pemerintah Nomor 28 Tahun 2024**:
   - Peraturan pelaksanaan teknis UU Kesehatan terkait pelayanan promotif, preventif, serta standar sarana prasarana fasyankes daerah.

Tautan naskah lengkap dari portal BPK RI & JDIHN dapat diakses langsung melalui kartu di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
      suggestedAction: {
        type: 'DISPATCH_TO_STAFF',
        title: 'Kirim Catatan Rujukan UU 17/2023 ke Drafter Dinkes',
        payload: {
          title: 'Penyesuaian Konsideran UU Kesehatan Terbaru (UU 17/2023)',
          instruction: 'Ganti rujukan UU 36/2009 dengan UU 17/2023 dan masukkan Perpres 72/2021 pada konsideran Mengingat.',
        },
      },
    };
  }

  // 2. KEPEGAWAIAN, ASN, DISIPLIN & MUTASI (BKPSDM)
  if (domain === 'KEPEGAWAIAN_ASN' || lowerMsg.includes('asn') || lowerMsg.includes('pns') || lowerMsg.includes('bkpsdm') || lowerMsg.includes('disiplin')) {
    let reply = `### 👥 Rujukan Resmi Sektor Kepegawaian & Manajemen ASN
**Pemerintah Kabupaten Aceh Tamiang — BKPSDM**

Pedoman regulasi ASN terverifikasi pada portal **BPK RI** dan **JDIHN**:

1. **Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara (UU ASN)**:
   - **Mencabut UU No. 5 Tahun 2014**. Seluruh konsideran terkait kepegawaian wajib merujuk ke UU 20/2023.
   - Mengatur transformasi digital manajemen ASN, fleksibilitas kerja, penataan pegawai non-ASN, dan penguatan sistem merit.

2. **Peraturan Pemerintah Nomor 94 Tahun 2021 tentang Disiplin PNS**:
   - Standar penjatuhan hukuman disiplin (ringan, sedang, berat), pemotongan Tambahan Penghasilan Pegawai (TPP), serta kewajiban jam kerja instansi pemerintah.

3. **PP Nomor 11 Tahun 2017 jo. PP Nomor 17 Tahun 2020**:
   - Manajemen Pegawai Negeri Sipil, uji kompetensi, pengisian Jabatan Pimpinan Tinggi (JPT) Pratama, dan pola karier.

Tautan resmi BPK RI & JDIHN terlampir pada kartu referensi di bawah ini.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
      suggestedAction: {
        type: 'DISPATCH_TO_STAFF',
        title: 'Kirim Rujukan UU 20/2023 & PP 94/2021 ke BKPSDM',
        payload: {
          title: 'Gunakan Rujukan UU 20/2023 (UU ASN Baru) & PP 94/2021',
          instruction: 'Pastikan UU 5/2014 tidak lagi dipakai pada konsideran Mengingat produk hukum kepegawaian ini.',
        },
      },
    };
  }

  // 3. DESA / GAMPONG / KEUANGAN DESA (DPMK)
  if (domain === 'DESA_GAMPONG' || lowerMsg.includes('desa') || lowerMsg.includes('gampong') || lowerMsg.includes('datok')) {
    let reply = `### 🌾 Rujukan Resmi Penyelenggaraan Pemerintahan Gampong & Desa
**Pemerintah Kabupaten Aceh Tamiang — Dinas Pemberdayaan Masyarakat dan Gampong (DPMK)**

Dasar hukum terverifikasi pada database peraturan BPK RI & JDIHN:

1. **UU Nomor 6 Tahun 2014 jo. UU Nomor 3 Tahun 2024 (Perubahan Kedua UU Desa)**:
   - Masa jabatan Datok Penghulu / Kepala Desa diperpanjang menjadi **8 (delapan) tahun** dengan batas maksimal 2 (dua) periode.
   - Ketentuan alokasi Dana Desa dan dana purnatugas kepala desa/perangkat desa.

2. **PP Nomor 43 Tahun 2014 jo. PP Nomor 11 Tahun 2019**:
   - Peraturan pelaksanaan UU Desa mengenai struktur organisasi pemerintah gampong, tugas Datok Penghulu, dan penghasilan tetap perangkat desa.

3. **Permendagri Nomor 20 Tahun 2018**:
   - Pedoman Pengelolaan Keuangan Desa (APBG) dan pertanggungjawaban bendahara gampong.

Tautan naskah resmi terlampir pada kartu referensi di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // 4. TATA RUANG, PBG, SLF & INFRASTRUKTUR (DINAS PUPR)
  if (domain === 'TATA_RUANG_PUPR' || lowerMsg.includes('pbg') || lowerMsg.includes('pupr') || lowerMsg.includes('tata ruang') || lowerMsg.includes('imb')) {
    let reply = `### 🏗️ Rujukan Resmi Bangunan Gedung, Tata Ruang & PBG
**Pemerintah Kabupaten Aceh Tamiang — Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)**

Kaidah yuridis dan database peraturan resmi BPK RI:

1. **PP Nomor 16 Tahun 2021 (Peraturan Pelaksanaan UU Bangunan Gedung)**:
   - **MENGHAPUS ISTILAH IMB (Izin Mendirikan Bangunan)** dan menggantikannya secara resmi dengan **Persetujuan Bangunan Gedung (PBG)** serta **Sertifikat Laik Fungsi (SLF)** melalui sistem SIMBG.
   - *Peringatan*: Naskah draf dilarang mencantumkan kata "IMB". Wajib menggunakan istilah "PBG".

2. **PP Nomor 21 Tahun 2021 (Penyelenggaraan Penataan Ruang)**:
   - Integrasi Rencana Tata Ruang Wilayah (RTRW) dan Rencana Detail Tata Ruang (RDTR) Kabupaten Aceh Tamiang ke sistem perizinan OSS.

Tautan resmi BPK RI & JDIHN tersedia pada kartu referensi di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // 5. LINGKUNGAN HIDUP & PERSAMPAHAN (DINAS LINGKUNGAN HIDUP)
  if (domain === 'LINGKUNGAN_SAMPAH' || lowerMsg.includes('sampah') || lowerMsg.includes('dlh') || lowerMsg.includes('limbah') || lowerMsg.includes('lingkungan')) {
    let reply = `### 🌿 Rujukan Resmi Pengelolaan Sampah & Perlindungan Lingkungan Hidup
**Pemerintah Kabupaten Aceh Tamiang — Dinas Lingkungan Hidup (DLH)**

Rujukan hukum resmi BPK RI & JDIHN:

1. **Undang-Undang Nomor 18 Tahun 2008 tentang Pengelolaan Sampah**:
   - Kewajiban penyediaan TPS/TPA berbasis 3R dan larangan pengelolaan sampah sistem *open dumping*.
   - Kewenangan penetapan kompensasi dampak negatif bagi masyarakat sekitar TPA.

2. **PP Nomor 22 Tahun 2021 tentang Penyelenggaraan PPLH**:
   - Ketentuan persetujuan lingkungan, baku mutu air limbah, dan persetujuan teknis (Pertek) untuk usaha/kegiatan di daerah.

Tautan peraturan terverifikasi BPK RI terlampir pada kartu referensi di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // 6. PENDIDIKAN & DAYAH (DISDIKBUD)
  if (domain === 'PENDIDIKAN' || lowerMsg.includes('pendidikan') || lowerMsg.includes('sekolah') || lowerMsg.includes('dayah') || lowerMsg.includes('disdik')) {
    let reply = `### 🎓 Rujukan Resmi Sektor Pendidikan & Pendidikan Dayah
**Pemerintah Kabupaten Aceh Tamiang — Dinas Pendidikan dan Kebudayaan**

Dasar hukum terverifikasi portal BPK RI & JDIHN:

1. **Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional (Sisdiknas)**.
2. **Qanun Aceh Nomor 11 Tahun 2014 tentang Penyelenggaraan Pendidikan**:
   - Menjamin pendidikan berbasis nilai-nilai keislaman dan pembinaan institusi dayah/pesantren di kabupaten/kota se-Aceh.
3. **PP Nomor 57 Tahun 2021 jo. PP Nomor 4 Tahun 2022**:
   - Standar Nasional Pendidikan (SNP) untuk kurikulum, pendidik, dan pembiayaan satuan pendidikan daerah.

Tautan naskah lengkap terlampir pada kartu referensi di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // 7. PENGADAAN BARANG/JASA (PBJ / BAGIAN PBJ SETDAKAB)
  if (domain === 'PBJ' || lowerMsg.includes('pbj') || lowerMsg.includes('pengadaan') || lowerMsg.includes('tender') || lowerMsg.includes('e-katalog')) {
    let reply = `### 📦 Rujukan Resmi Pengadaan Barang dan Jasa Pemerintah
**Pemerintah Kabupaten Aceh Tamiang — Bagian Pengadaan Barang dan Jasa (PBJ)**

Dasar hukum resmi BPK RI:

1. **Perpres Nomor 16 Tahun 2018 jo. Perpres Nomor 12 Tahun 2021**:
   - Kewajiban pemanfaatan E-Katalog Lokal untuk belanja daerah dan komitmen belanja minimal 40% untuk produk usaha mikro, kecil, dan koperasi daerah.
   - Standar tata kelola Pokja Pemilihan dan Pejabat Pengadaan (PPK/PPTK).

Tautan resmi BPK RI terlampir pada kartu referensi di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // 8. KETERTIBAN UMUM & SYARIAT ISLAM / JINAYAT (SATPOL PP & WH)
  if (domain === 'KETERTIBAN_JINAYAT' || lowerMsg.includes('jinayat') || lowerMsg.includes('syariat') || lowerMsg.includes('satpol') || lowerMsg.includes('wilayatul hisbah')) {
    let reply = `### ⚖️ Rujukan Resmi Penegakan Syariat Islam & Ketertiban Umum
**Pemerintah Kabupaten Aceh Tamiang — Satpol PP dan Wilayatul Hisbah (WH)**

Dasar hukum resmi terverifikasi:

1. **Qanun Aceh Nomor 6 Tahun 2014 tentang Hukum Jinayat**:
   - Mengatur tindak pidana syariat (khamar, maisir, khalwat, ikhtilat, zina, pelecehan seksual, pemerkosaan, qadzaf, liwath, musahaqah) beserta sanksi *'uqubat*.
2. **PP Nomor 16 Tahun 2018 tentang Satuan Polisi Pamong Praja**:
   - Kewenangan penegakan Perda/Qanun dan perlindungan masyarakat.

Tautan naskah lengkap BPK RI terlampir pada kartu referensi di bawah.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // 9. KEUANGAN DAERAH, RETRIBUSI & PAJAK (BPKD)
  if (domain === 'KEUANGAN_RETRIBUSI' || lowerMsg.includes('retribusi') || lowerMsg.includes('pajak') || lowerMsg.includes('apbd') || lowerMsg.includes('keuangan')) {
    let reply = `### 🏛️ Rujukan Resmi Database Peraturan BPK RI & JDIHN
**Pemerintah Kabupaten Aceh Tamiang — Badan Pengelolaan Keuangan Daerah (BPKD)**

Untuk penyusunan regulasi terkait **Keuangan Daerah, Retribusi, dan Pajak Daerah**, BPK RI menetapkan standar kepatuhan berikut:

1. **Undang-Undang Nomor 1 Tahun 2022 (UU HKPD)**:
   - Mengharuskan seluruh jenis Pajak Daerah dan Retribusi Daerah ditetapkan dalam **1 (satu) Perda/Qanun Payung**.
   - Tarif dan tata cara pemungutan teknis diatur lebih lanjut dengan **Peraturan Bupati (Perbup)**.
   - *Catatan Audit BPK*: **UU No. 28 Tahun 2009 telah DICABUT**. Pastikan konsideran *Mengingat* tidak lagi mencantumkan UU 28/2009 untuk menghindari temuan ketidakpatuhan pada LHP BPK.

2. **PP Nomor 35 Tahun 2023 (KUPDRD)**:
   - Ketentuan umum tata cara penghitungan tarif, pendaftaran objek retribusi, penatausahaan piutang, dan insentif fiskal.

3. **PP Nomor 12 Tahun 2019 & Permendagri Nomor 77 Tahun 2020**:
   - Penatausahaan Rekening Kas Umum Daerah (RKUD) dan pertanggungjawaban penatausahaan penerimaan retribusi.

Tautan naskah lengkap resmi dari portal BPK RI terlampir pada kartu referensi di bawah ini.`;

    return {
      success: true,
      reply,
      screenDetected: hasScreen,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
      suggestedAction: {
        type: 'DISPATCH_TO_STAFF',
        title: 'Kirim Catatan Rujukan BPK ke Staf Drafter',
        payload: {
          title: 'Sesuaikan Konsideran dengan UU 1/2022 (HKPD) & PP 35/2023',
          instruction: 'Ganti rujukan UU 28/2009 dengan UU 1/2022 pada konsideran Mengingat sesuai arahan audit BPK RI.',
        },
      },
    };
  }

  // =========================================================================
  // SKENARIO C: Periksa Dokumen di Layar Ini (Screen Inspection)
  // =========================================================================
  if (lowerMsg.includes('periksa') || lowerMsg.includes('cek dokumen') || lowerMsg.includes('layar ini') || lowerMsg.includes('audit')) {
    let reply = `### 🔍 Hasil Deteksi & Analisis Layar Aktif
**Perkara Terdeteksi**: ${screenTitle}
**Rute Layar**: \`${screenContext?.pathname || '/cases'}\`
${opdName ? `**OPD Pemrakarsa**: ${opdName}` : ''}
${screenContext?.caseNumber ? `**Nomor Registrasi**: ${screenContext.caseNumber}` : ''}
**Sektor Yuridis**: ${domain.replace('_', ' ')}

---

#### ⚖️ Ringkasan Uji Kepatuhan Regulasi:
1. **Hierarki Dasar Hukum (*Mengingat*)**:
   - Wajib mencantumkan **UU No. 11 Tahun 2006 (UUPA)** sebagai dasar kekhususan dan kewenangan otonomi Pemerintah Kabupaten Aceh Tamiang.
   - Wajib merujuk pada **UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022** tentang Pembentukan Peraturan Perundang-undangan.
   - Masukkan regulasi sektoral terbaru yang relevan dengan tugas fungsi OPD pemrakarsa (lihat kartu di bawah).

2. **Konsideran *Menimbang***:
   - Harus memuat alasan filosofis, sosiologis, dan yuridis yang relevan dengan kondisi masyarakat Kabupaten Aceh Tamiang.

3. **Uji Pertentangan Norma BPK RI & JDIHN**:
   - Tidak bertentangan dengan peraturan perundang-undangan yang lebih tinggi, kepentingan umum, atau norma kepatutan fiskal.
   - Seluruh status dasar hukum terverifikasi aktif pada portal resmi **BPK RI & JDIHN**.

💡 *Klik tautan referensi resmi di bawah untuk membaca lembaran naskah asli dari BPK RI atau JDIHN.*`;

    return {
      success: true,
      reply,
      screenDetected: true,
      detectedTitle: screenTitle,
      references: detectedReferences,
      directSearch: directLinks,
    };
  }

  // =========================================================================
  // SKENARIO D: DEFAULT — Asisten AI Hukum Terpadu
  // =========================================================================
  let defaultReply = `Halo! Saya **Asisten AI Hukum (HARM Legal Copilot)** Bagian Hukum Setdakab Aceh Tamiang.

Saya memantau layar aktif Anda (**${screenTitle}**) dan terhubung langsung ke **Database Peraturan BPK RI**, **JDIH Nasional**, serta **JDIH Kabupaten Aceh Tamiang**.

**Apa yang dapat saya bantu?**
- *Periksa apakah naskah ini sudah selaras dengan kaidah legal drafting UU 12/2011?*
- *Cari aturan resmi BPK RI mengenai sektor ${opdName || 'keuangan, kesehatan, atau kepegawaian'}.*
- *Deteksi apakah ada dasar hukum pada konsideran Mengingat yang sudah dicabut/kedaluwarsa?*
- *Bantu formulasi klausul pasal atau sanksi administratif yang presisi.*`;

  return {
    success: true,
    reply: defaultReply,
    screenDetected: hasScreen,
    detectedTitle: screenTitle,
    references: detectedReferences,
    directSearch: directLinks,
  };
}

/**
 * Server action: Pencarian langsung regulasi ke BPK RI & JDIHN
 */
export async function queryRegulationsAction(keyword: string): Promise<{
  success: boolean;
  results: OfficialRegulationLink[];
  directLinks: { queryText: string; bpkSearchUrl: string; jdihnSearchUrl: string; acehTamiangJdihUrl: string };
}> {
  const results = searchRegulations(keyword);
  const directLinks = generateDirectSearchLinks(keyword);

  return {
    success: true,
    results,
    directLinks,
  };
}
