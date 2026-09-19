'use client';

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Sliders, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Smartphone, 
  Laptop, 
  Key, 
  Mail, 
  Phone, 
  Building2, 
  BadgeCheck, 
  Save, 
  HardDrive, 
  ExternalLink, 
  LogOut, 
  Check, 
  Eye, 
  EyeOff, 
  Download, 
  RefreshCw,
  QrCode
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  UserAccountData, 
  UserSessionItem, 
  UserActivityItem, 
  updateProfile, 
  changePassword 
} from '@/lib/actions/profile';

const GDRIVE_FOLDER_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1W0CuEM8y3rJdUMqVzJ931ACJfnMjoJk9?usp=sharing';

interface AccountClientProps {
  initialProfile: UserAccountData;
  initialSessions: UserSessionItem[];
  initialActivities: UserActivityItem[];
}

export default function AccountClient({
  initialProfile,
  initialSessions,
  initialActivities,
}: AccountClientProps) {
  const [profile, setProfile] = useState<UserAccountData>(initialProfile);
  const [sessions, setSessions] = useState<UserSessionItem[]>(initialSessions);
  const [activities] = useState<UserActivityItem[]>(initialActivities);

  // Profile Edit State
  const [name, setName] = useState(profile.name);
  const [nip, setNip] = useState(profile.nip);
  const [jabatan, setJabatan] = useState(profile.jabatan);
  const [pangkat, setPangkat] = useState(profile.pangkat);
  const [unit, setUnit] = useState(profile.unit);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification Preferences State
  const [prefNewIntake, setPrefNewIntake] = useState(profile.preferences?.email_new_intake ?? true);
  const [prefSlaWarning, setPrefSlaWarning] = useState(profile.preferences?.email_sla_warning ?? true);
  const [prefReviewerNotes, setPrefReviewerNotes] = useState(profile.preferences?.email_reviewer_notes ?? true);
  const [prefWeeklyDigest, setPrefWeeklyDigest] = useState(profile.preferences?.email_weekly_digest ?? false);
  const [prefWhatsapp, setPrefWhatsapp] = useState(profile.preferences?.whatsapp_alerts ?? true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsSuccessMsg, setPrefsSuccessMsg] = useState('');

  // 2FA Mockup State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  // Password Strength Calculation
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Belum diisi', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Lemah', color: 'bg-red-500' };
    if (score <= 50) return { score, label: 'Cukup', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Kuat', color: 'bg-blue-500' };
    return { score: 100, label: 'Sangat Kuat (Standar Enterprise)', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(newPassword);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');

    const res = await updateProfile({
      name,
      nip,
      jabatan,
      pangkat,
      unit,
      phone,
      bio,
    });

    setIsSavingProfile(false);
    if (res.success) {
      setProfile((prev) => ({ ...prev, name, nip, jabatan, pangkat, unit, phone, bio }));
      setProfileSuccessMsg('Profil kedinasan Anda berhasil diperbarui dan disinkronkan ke seluruh sistem!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    }
  };

  // Handle Save Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok!' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Kata sandi baru minimal harus 8 karakter!' });
      return;
    }

    setIsSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSavingPassword(false);

    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Kata sandi Anda berhasil diperbarui dengan aman!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Gagal mengubah kata sandi' });
    }
  };

  // Handle Save Notification Preferences
  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    setPrefsSuccessMsg('');

    const res = await updateProfile({
      preferences: {
        email_new_intake: prefNewIntake,
        email_sla_warning: prefSlaWarning,
        email_reviewer_notes: prefReviewerNotes,
        email_weekly_digest: prefWeeklyDigest,
        whatsapp_alerts: prefWhatsapp,
        system_theme: profile.preferences?.system_theme || 'dark',
        date_format: profile.preferences?.date_format || 'DD MMMM YYYY',
      },
    });

    setIsSavingPrefs(false);
    if (res.success) {
      setPrefsSuccessMsg('Preferensi notifikasi enterprise berhasil disimpan!');
      setTimeout(() => setPrefsSuccessMsg(''), 4000);
    }
  };

  // Handle Revoke Session
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.is_current));
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Executive Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 subtle-grid-dark opacity-20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar with Status Badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-600/30 border-2 border-white/20">
                {profile.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            {/* User Meta Information */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  {profile.name}
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Akun ASN Terverifikasi</span>
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs">
                  {profile.role}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium flex flex-wrap items-center gap-2">
                <span>{profile.jabatan}</span>
                <span className="opacity-40">•</span>
                <span>NIP. {profile.nip}</span>
              </p>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.unit}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href={GDRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Arsip Google Drive</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* 5 Enterprise Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1.5 rounded-xl h-auto flex flex-wrap gap-1 shadow-xs">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profil Pengguna</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Keamanan & Sandi</span>
          </TabsTrigger>

          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifikasi</span>
          </TabsTrigger>

          <TabsTrigger
            value="preferences"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferensi Sistem</span>
          </TabsTrigger>

          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
          >
            <History className="w-3.5 h-3.5" />
            <span>Aktivitas Saya</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFIL PENGGUNA */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Informasi Pribadi & Kedinasan
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Data identitas resmi perancang hukum untuk penatausahaan telaah produk hukum daerah.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {profileSuccessMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                      Nama Lengkap & Gelar *
                    </Label>
                    <Input
                      id="fullName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="nip" className="text-xs font-semibold text-slate-700">
                      NIP (Nomor Induk Pegawai)
                    </Label>
                    <Input
                      id="nip"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                      Alamat Email Kedinasan
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="text-xs bg-slate-50 text-slate-500 pr-24"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Terverifikasi
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                      Nomor WhatsApp / Kontak Cepat
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="jabatan" className="text-xs font-semibold text-slate-700">
                      Jabatan Kedinasan
                    </Label>
                    <Input
                      id="jabatan"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pangkat" className="text-xs font-semibold text-slate-700">
                      Pangkat / Golongan Ruang
                    </Label>
                    <Input
                      id="pangkat"
                      value={pangkat}
                      onChange={(e) => setPangkat(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="unit" className="text-xs font-semibold text-slate-700">
                      Unit Kerja / Perangkat Daerah
                    </Label>
                    <Input
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="bio" className="text-xs font-semibold text-slate-700">
                      Keahlian & Fokus Telaahan Regulasi
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: KEAMANAN & KREDENSIAL */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password Card */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Pembaruan Kata Sandi
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pastikan akun Anda menggunakan kata sandi yang kuat dan tidak digunakan di layanan lain.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {passwordMsg && (
                <div
                  className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-5 max-w-xl">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</Label>
                  <Input
                    type="password"
                    placeholder="Masukkan kata sandi lama Anda"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-slate-700">Kata Sandi Baru</Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                    </button>
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter (kombinasi huruf & angka)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="text-xs"
                  />

                  {/* Password Strength Bar */}
                  {newPassword && (
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Kekuatan Sandi:</span>
                        <span className="font-semibold text-slate-700">{strength.label}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                        <span className={newPassword.length >= 8 ? 'text-emerald-600 font-semibold' : ''}>
                          ✓ Min. 8 Karakter
                        </span>
                        <span className={/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-semibold' : ''}>
                          ✓ Huruf Besar (A-Z)
                        </span>
                        <span className={/[0-9]/.test(newPassword) ? 'text-emerald-600 font-semibold' : ''}>
                          ✓ Mengandung Angka (0-9)
                        </span>
                        <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-600 font-semibold' : ''}>
                          ✓ Simbol Khusus (!@#$)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</Label>
                  <Input
                    type="password"
                    placeholder="Ketik ulang kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSavingPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  <Key className="w-4 h-4 mr-1.5" />
                  <span>{isSavingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication (2FA) */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Autentikasi Dua Faktor (2FA / MFA)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Tingkatkan keamanan akun perancang hukum dengan kode OTP dari Google Authenticator.
                  </CardDescription>
                </div>
                <Badge className={twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}>
                  {twoFactorEnabled ? '2FA Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white mt-0.5">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Aplikasi Authenticator (TOTP)</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Gunakan Google Authenticator atau Microsoft Authenticator untuk menghasilkan kode 6-digit saat login.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="text-xs border-slate-300"
                >
                  {twoFactorEnabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA Sekarang'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Device Sessions Card */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Sesi Perangkat Aktif
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Daftar perangkat dan browser yang saat ini memiliki akses login ke akun Anda.
                </CardDescription>
              </div>

              {sessions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevokeAllOtherSessions}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  <span>Cabut Semua Sesi Lain</span>
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-5 space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 mt-0.5">
                      {sess.device.includes('Android') ? (
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Laptop className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{sess.device}</h4>
                        {sess.is_current && (
                          <Badge className="bg-emerald-500 text-white text-[10px] py-0 px-2">
                            Sesi Ini
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {sess.browser} • {sess.os}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        IP: {sess.ip_address} ({sess.location}) • {sess.last_active}
                      </p>
                    </div>
                  </div>

                  {!sess.is_current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Cabut Sesi
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PREFERENSI NOTIFIKASI */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Pusat Preferensi Notifikasi Enterprise
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Atur pengiriman pemberitahuan otomatis agar Anda tidak tertinggal telaah penting dan batas waktu regulasi.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {prefsSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{prefsSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notifikasi Email Kedinasan
                </h4>

                {/* Option 1: Permohonan Baru Masuk */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5 max-w-xl">
                    <Label className="text-xs font-bold text-slate-900 cursor-pointer">
                      Permohonan Baru dari OPD
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Terima email instan ketika OPD selesai mengunggah naskah rancangan dan bukti kelengkapan via portal intake.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefNewIntake}
                    onChange={(e) => setPrefNewIntake(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Option 2: Peringatan SLA */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5 max-w-xl">
                    <Label className="text-xs font-bold text-slate-900 cursor-pointer">
                      Peringatan Batas Waktu Harmonisasi (SLA Warning)
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Dapatkan peringatan kritis saat berkas perkara tersisa kurang dari 3 hari kerja dari target 14 hari kerja.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefSlaWarning}
                    onChange={(e) => setPrefSlaWarning(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Option 3: Disposisi Reviewer */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5 max-w-xl">
                    <Label className="text-xs font-bold text-slate-900 cursor-pointer">
                      Disposisi & Sticky Note Baru dari Reviewer / Atasan
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Pemberitahuan langsung ketika pimpinan mengirimkan arahan perbaikan pasal ke papan Notion Anda.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefReviewerNotes}
                    onChange={(e) => setPrefReviewerNotes(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Option 4: Rekap Mingguan */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5 max-w-xl">
                    <Label className="text-xs font-bold text-slate-900 cursor-pointer">
                      Ringkasan Kinerja & Evaluasi Mingguan
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Laporan rekapitulasi jumlah permohonan selesai, berkas revisi, dan matriks produktivitas setiap hari Senin.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefWeeklyDigest}
                    onChange={(e) => setPrefWeeklyDigest(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-3">
                  Pemberitahuan Tambahan
                </h4>

                {/* Option 5: WhatsApp Gateway */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="space-y-0.5 max-w-xl">
                    <Label className="text-xs font-bold text-slate-900 cursor-pointer">
                      Notifikasi Cepat via WhatsApp Gateway
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Kirimkan pemberitahuan perkara berstatus mendesak ke nomor WhatsApp {profile.phone}.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefWhatsapp}
                    onChange={(e) => setPrefWhatsapp(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSavingPrefs}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingPrefs ? 'Menyimpan...' : 'Simpan Preferensi Notifikasi'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PREFERENSI SISTEM */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold text-slate-900">
                Preferensi Sistem & Lingkungan Kerja
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Sesuaikan format dokumen hukum, zona waktu, dan tautan penyimpanan cloud resmi.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Standar Format Tanggal Dokumen
                  </Label>
                  <select
                    defaultValue="DD MMMM YYYY"
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="DD MMMM YYYY">17 September 2026 (Standar Tata Naskah Dinas RI)</option>
                    <option value="YYYY-MM-DD">2026-09-17 (ISO Standard)</option>
                    <option value="DD/MM/YYYY">17/09/2026 (Numerik Ringkas)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Zona Waktu Operasional</Label>
                  <select
                    defaultValue="Asia/Jakarta"
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Asia/Jakarta">WIB (Waktu Indonesia Barat - UTC+7)</option>
                    <option value="Asia/Makassar">WITA (Waktu Indonesia Tengah - UTC+8)</option>
                    <option value="Asia/Jayapura">WIT (Waktu Indonesia Timur - UTC+9)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Tema Tampilan Antarmuka</Label>
                  <select
                    defaultValue="system"
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="system">Mengikuti Pengaturan Sistem Operasi</option>
                    <option value="dark">Enterprise Deep Slate (Gelap)</option>
                    <option value="light">GovTech Clean Light (Terang)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Penyimpanan Cloud Berkas Hukum
                  </Label>
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-700 font-medium">Google Drive Setdakab</span>
                    <a
                      href={GDRIVE_FOLDER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Buka Folder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: AKTIVITAS SAYA (AUDIT TRAIL) */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Rekam Jejak Aktivitas Akun (Audit Trail)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Log keamanan dan transparansi tindakan yang dilakukan oleh akun Anda dalam sistem HARM.
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-300 flex items-center gap-1.5"
                onClick={() => alert('Mengunduh berkas log audit aktivitas dalam format CSV...')}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Riwayat (CSV)</span>
              </Button>
            </CardHeader>

            <CardContent className="pt-5">
              <div className="divide-y divide-slate-100">
                {activities.map((act) => (
                  <div key={act.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-100 text-slate-800 text-[10px] font-mono py-0 px-2 border-none">
                          {act.action}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900">{act.target}</span>
                      </div>
                      <p className="text-xs text-slate-600">{act.details}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        {act.created_at}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        IP: {act.ip_address}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
