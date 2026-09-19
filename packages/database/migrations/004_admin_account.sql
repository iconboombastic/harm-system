-- ============================================================
-- 004_admin_account.sql: AUTO-SYNC PROFIL & AKTIVASI AKUN ADMIN
-- ============================================================

-- 1. Trigger agar setiap user yang signup otomatis memiliki profil di user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, role, is_active)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        COALESCE(new.raw_user_meta_data->>'role', 'STAF'),
        true
    )
    ON CONFLICT (id) DO UPDATE
    SET name = COALESCE(EXCLUDED.name, public.user_profiles.name),
        role = COALESCE(new.raw_user_meta_data->>'role', public.user_profiles.role);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Konfirmasi Email Akun Admin secara otomatis (Bypass email verification)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email IN ('m.yusuf010224@gmail.com', 'admin@acehtamiangkab.go.id');

-- 3. Tambahkan ke user_profiles dengan hak akses ADMIN
INSERT INTO public.user_profiles (id, name, role, jabatan, unit, is_active)
SELECT 
    id,
    'M. Yusuf (Administrator)',
    'ADMIN',
    'Kepala Administrator Sistem',
    'Bagian Hukum Setdakab Aceh Tamiang',
    true
FROM auth.users
WHERE email = 'm.yusuf010224@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN', is_active = true;

-- Fallback untuk akun admin alternatif jika ada
INSERT INTO public.user_profiles (id, name, role, jabatan, unit, is_active)
SELECT 
    id,
    'Administrator Sistem',
    'ADMIN',
    'Kepala Administrator Sistem',
    'Bagian Hukum Setdakab Aceh Tamiang',
    true
FROM auth.users
WHERE email = 'admin@acehtamiangkab.go.id'
ON CONFLICT (id) DO UPDATE
SET role = 'ADMIN', is_active = true;
