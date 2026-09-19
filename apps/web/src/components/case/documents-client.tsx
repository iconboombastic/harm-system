'use client';

import React, { useState } from 'react';
import { ExternalLink, HardDrive, Upload, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { linkGoogleDriveDocument, uploadDocument } from '@/lib/actions/documents';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  category: string;
  source: string;
  storage_path?: string;
  created_at?: string;
}

export function DocumentsClient({ caseId, initialDocs }: { caseId: string; initialDocs: DocumentItem[] }) {
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocs || []);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for Drive link
  const [driveTitle, setDriveTitle] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [driveCategory, setDriveCategory] = useState('SUBSTANSI');
  const [driveType, setDriveType] = useState('DRAFT');

  async function handleAddDriveLink(e: React.FormEvent) {
    e.preventDefault();
    if (!driveTitle || !driveUrl) return;

    setLoading(true);
    try {
      const res = await linkGoogleDriveDocument(caseId, driveTitle, driveUrl, driveCategory, driveType);
      if (res.success && res.data) {
        setDocs([res.data as DocumentItem, ...docs]);
        setIsDriveOpen(false);
        setDriveTitle('');
        setDriveUrl('');
      } else {
        alert(res.error || 'Gagal menautkan Google Drive');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await uploadDocument(caseId, formData);
      if (res.success && res.data) {
        setDocs([res.data as DocumentItem, ...docs]);
        setIsUploadOpen(false);
      } else {
        alert(res.error || 'Gagal mengunggah file');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner Integrasi Google Drive */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Penyimpanan Terintegrasi Google Drive</h3>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1 inline text-emerald-600" /> Aktif
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              Berkas tersimpan di Google Drive Pemkab Aceh Tamiang untuk efisiensi kuota dan keamanan berkas tanpa limit.
            </p>
          </div>
        </div>

        <a
          href={GDRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-blue-700 font-medium text-sm rounded-lg border border-blue-300 shadow-sm transition-colors whitespace-nowrap"
        >
          <span>Buka Folder Google Drive</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daftar Dokumen Kasus</h2>
            <p className="text-sm text-gray-500">Seluruh berkas naskah, draf regulasi, dan lampiran permohonan</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Modal Tautkan Google Drive */}
            <Dialog open={isDriveOpen} onOpenChange={setIsDriveOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  <HardDrive className="w-4 h-4 mr-2 text-blue-600" /> Tautkan Google Drive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleAddDriveLink}>
                  <DialogHeader>
                    <DialogTitle>Tautkan Dokumen dari Google Drive</DialogTitle>
                    <DialogDescription>
                      Masukkan link berkas atau folder Google Drive. Dokumen langsung dapat dibuka tanpa membebani penyimpanan lokal.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="driveTitle">Nama / Judul Dokumen</Label>
                      <Input
                        id="driveTitle"
                        placeholder="Contoh: Draf Raperbup Versi Harmonisasi.docx"
                        value={driveTitle}
                        onChange={(e) => setDriveTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="driveUrl">Tautan (URL) Google Drive</Label>
                      <Input
                        id="driveUrl"
                        placeholder="https://drive.google.com/file/d/..."
                        value={driveUrl}
                        onChange={(e) => setDriveUrl(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Pastikan akses berkas/folder diatur ke "Siapa saja yang memiliki link dapat melihat".
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="driveType">Tipe Dokumen</Label>
                        <select
                          id="driveType"
                          className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                          value={driveType}
                          onChange={(e) => setDriveType(e.target.value)}
                        >
                          <option value="DRAFT">Draf Naskah</option>
                          <option value="PERMOHONAN">Surat Permohonan</option>
                          <option value="REVISI">Naskah Revisi</option>
                          <option value="BERITA_ACARA">Berita Acara</option>
                          <option value="SK_FINAL">Naskah Final</option>
                          <option value="LAMPIRAN">Lampiran</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="driveCategory">Kategori</Label>
                        <select
                          id="driveCategory"
                          className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                          value={driveCategory}
                          onChange={(e) => setDriveCategory(e.target.value)}
                        >
                          <option value="SUBSTANSI">Substansi</option>
                          <option value="LEGAL">Legal Drafter</option>
                          <option value="FORMAL">Administrasi Formal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDriveOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {loading ? 'Menyimpan...' : 'Simpan Tautan'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Modal Upload File Langsung */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="w-4 h-4 mr-2" /> Upload Dokumen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleFileUpload}>
                  <DialogHeader>
                    <DialogTitle>Unggah Berkas Dokumen</DialogTitle>
                    <DialogDescription>
                      Unggah file dokumen fisik (PDF, Word, Scan).
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="file">Pilih Berkas</Label>
                      <Input id="file" name="file" type="file" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="type">Tipe Dokumen</Label>
                        <select id="type" name="type" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                          <option value="PERMOHONAN">Surat Permohonan</option>
                          <option value="DRAFT">Draf Naskah</option>
                          <option value="REVISI">Naskah Revisi</option>
                          <option value="BERITA_ACARA">Berita Acara</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="category">Kategori</Label>
                        <select id="category" name="category" className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                          <option value="SUBSTANSI">Substansi</option>
                          <option value="LEGAL">Legal Drafter</option>
                          <option value="FORMAL">Administrasi Formal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {loading ? 'Mengunggah...' : 'Unggah File'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-600">Nama Dokumen</th>
                <th className="px-6 py-3 font-medium text-gray-600">Penyimpanan</th>
                <th className="px-6 py-3 font-medium text-gray-600">Tipe & Kategori</th>
                <th className="px-6 py-3 font-medium text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada dokumen yang terdaftar untuk permohonan ini.
                  </td>
                </tr>
              ) : (
                docs.map((doc) => {
                  const isGdrive =
                    doc.source === 'GOOGLE_DRIVE' ||
                    (doc.storage_path && doc.storage_path.startsWith('http'));

                  return (
                    <tr key={doc.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-xs md:max-w-md">{doc.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isGdrive ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 font-normal">
                            <HardDrive className="w-3 h-3 mr-1 inline" /> Google Drive
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-normal">
                            Internal Storage
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <span className="font-medium text-gray-700">{doc.type}</span>
                        <span className="mx-1.5 text-gray-300">•</span>
                        <span>{doc.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent('harm:inspect-document', {
                                  detail: {
                                    title: doc.title,
                                    type: doc.type,
                                    category: doc.category,
                                  },
                                })
                              );
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition shadow-2xs"
                            title="Audit dokumen ini dengan AI Copilot BPK/JDIH"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Audit AI</span>
                          </button>

                          {isGdrive ? (
                            <a
                              href={doc.storage_path || GDRIVE_FOLDER_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm"
                            >
                              <span>Buka di Google Drive</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm">
                              Unduh
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
