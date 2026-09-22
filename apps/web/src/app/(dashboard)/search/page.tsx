import GlobalSearchClient from '@/components/search/global-search-client';

export const metadata = { 
  title: 'Pencarian Cerdas | HARM - Bagian Hukum Setdakab Aceh Tamiang',
  description: 'Pencarian lintas kasus permohonan, dokumen, dan basis data peraturan resmi BPK RI & JDIHN'
};

export default function GlobalSearchPage() {
  return <GlobalSearchClient />;
}
