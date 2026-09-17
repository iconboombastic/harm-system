// ============================================
// HARM Mobile — Layar Profil & Pengaturan
// ============================================

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { InfoRow, LoadingScreen } from '@/components'

export default function ProfileScreen() {
  const { user, profile, logout } = useAuthStore()
  const [stats, setStats] = useState({ total: 0, active: 0, done: 0, avgDays: 0 })
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    if (!user) return
    const { count: total } = await supabase.from('cases').select('*', { count: 'exact', head: true }).or(`assignee_id.eq.${user.id},case_owner_id.eq.${user.id}`)
    const { count: active } = await supabase.from('cases').select('*', { count: 'exact', head: true }).or(`assignee_id.eq.${user.id},case_owner_id.eq.${user.id}`).neq('official_status', 'SELESAI')
    const { count: done } = await supabase.from('case_tasks').select('*', { count: 'exact', head: true }).eq('assignee_id', user.id).eq('status', 'DONE')
    setStats({ total: total || 0, active: active || 0, done: done || 0, avgDays: 0 })
  }

  useEffect(() => { fetchStats() }, [user])

  const onRefresh = async () => { setRefreshing(true); await fetchStats(); setRefreshing(false) }

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ])
  }

  if (!profile) return <LoadingScreen />

  const initials = profile.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()
  const roleLabel = { STAF: 'Staf', ATASAN: 'Atasan', ADMIN: 'Administrator' }[profile.role] || profile.role

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}>
      {/* Header Profil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{roleLabel}</Text>
        </View>
        {profile.jabatan && <Text style={styles.jabatan}>{profile.jabatan}</Text>}
        {profile.unit && <Text style={styles.unit}>{profile.unit}</Text>}
      </View>

      {/* Informasi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi</Text>
        <View style={styles.card}>
          <InfoRow label="Email" value={user?.email || '-'} />
          <InfoRow label="Telepon" value={profile.phone || '-'} />
          <InfoRow label="Jabatan" value={profile.jabatan || '-'} />
          <InfoRow label="Unit" value={profile.unit || '-'} />
        </View>
      </View>

      {/* Statistik */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik Saya</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Case</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.primary }]}>{stats.active}</Text>
            <Text style={styles.statLabel}>Case Aktif</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>{stats.done}</Text>
            <Text style={styles.statLabel}>Tugas Selesai</Text>
          </View>
        </View>
      </View>

      {/* Menu Pengaturan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        <View style={styles.card}>
          <MenuItem icon="🔔" label="Notifikasi" onPress={() => {}} />
          <MenuItem icon="🔒" label="Ubah Password" onPress={() => {}} />
          <MenuItem icon="ℹ️" label="Tentang Aplikasi" onPress={() => Alert.alert('HARM Mobile', 'Versi 1.0.0\nSistem Harmonisasi Dokumen Terpadu\nPemkab Aceh Tamiang')} />
        </View>
      </View>

      {/* Tombol Keluar */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing.xxxl * 2 }} />
    </ScrollView>
  )
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: { alignItems: 'center', paddingTop: Spacing.xxxl, paddingBottom: Spacing.xl, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarText: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textOnPrimary },
  name: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  roleBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, marginBottom: Spacing.xs },
  roleText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  jabatan: { fontSize: FontSize.sm, color: Colors.textSecondary },
  unit: { fontSize: FontSize.sm, color: Colors.textTertiary },
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  statsGrid: { flexDirection: 'row', gap: Spacing.md },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statNumber: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: Spacing.xs },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  menuIcon: { fontSize: 20, marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  menuArrow: { fontSize: FontSize.xl, color: Colors.textTertiary },
  logoutBtn: { marginHorizontal: Spacing.lg, marginTop: Spacing.xl, backgroundColor: Colors.error + '10', borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '30' },
  logoutText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.error },
})
