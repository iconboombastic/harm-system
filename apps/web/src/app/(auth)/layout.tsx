import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Masuk - HARM Sistem Harmonisasi Dokumen Terpadu',
  description: 'Masuk ke HARM Sistem Harmonisasi Dokumen Terpadu Pemerintah Kabupaten Aceh Tamiang',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center mb-8 text-center space-y-2">
            {/* Menggunakan div sebagai placeholder logo jika tidak ada gambar */}
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-primary font-bold text-2xl">H</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sistem HARM</h1>
            <p className="text-sm text-muted-foreground">
              Harmonisasi Dokumen Terpadu<br/>
              Pemerintah Kabupaten Aceh Tamiang
            </p>
          </div>
          {children}
        </div>
        <div className="bg-muted/50 p-4 text-center text-xs text-muted-foreground border-t border-border">
          &copy; {new Date().getFullYear()} Pemerintah Kabupaten Aceh Tamiang
        </div>
      </div>
    </div>
  );
}
