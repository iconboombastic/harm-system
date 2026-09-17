import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme';
import { OFFICIAL_STATUS } from '@harm/shared';

export default function DashboardScreen() {
  const { user, profile } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ active: 0, pending: 0, criticalSla: 0, completed: 0 });
  const [cases, setCases] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    // In a real app, these would be actual API calls to Supabase
    // Simulating data fetch for the UI presentation
    setStats({
      active: 12,
      pending: 5,
      criticalSla: 2,
      completed: 18,
    });
    
    setCases([
      { id: '1', harmNumber: 'HARM-2023-001', title: 'Perbup Retribusi', status: 'DRAFT', sla: '3 hari' },
      { id: '2', harmNumber: 'HARM-2023-002', title: 'SK Tim Ahli', status: 'REVIEW', sla: 'Kritis' },
    ]);
    
    setTasks([
      { id: '1', title: 'Review Dokumen Draft', caseRef: 'HARM-2023-001', due: '14:00', priority: 'TINGGI' },
    ]);

    setActivities([
      { id: '1', actor: 'Budi Santoso', action: 'mengunggah dokumen baru', case: 'HARM-2023-001', time: '10 menit yang lalu' },
    ]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Selamat datang,</Text>
          <Text style={styles.userName}>{profile?.name || user?.email || 'Pengguna'}</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{profile?.role || 'STAF'}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: Colors.primary, borderTopWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>Case Aktif</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: Colors.warning, borderTopWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Tugas Pending</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderTopColor: Colors.danger, borderTopWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.criticalSla}</Text>
            <Text style={styles.statLabel}>SLA Kritis</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: Colors.success, borderTopWidth: 4 }]}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Selesai Bulan Ini</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perlu Tindakan</Text>
        {cases.map(c => (
          <TouchableOpacity key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.caseNumber}>{c.harmNumber}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{c.status}</Text></View>
            </View>
            <Text style={styles.caseTitle}>{c.title}</Text>
            <Text style={styles.caseSla}>SLA: {c.sla}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tugas Saya Hari Ini</Text>
        {tasks.map(t => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.taskTitle}>{t.title}</Text>
            <Text style={styles.taskRef}>{t.caseRef}</Text>
            <View style={styles.taskFooter}>
              <Text style={styles.taskDue}>Tenggat: {t.due}</Text>
              <View style={[styles.badge, { backgroundColor: Colors.dangerLight }]}><Text style={styles.badgeText}>{t.priority}</Text></View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        {activities.map(a => (
          <View key={a.id} style={styles.activityItem}>
            <Text style={styles.activityText}>
              <Text style={styles.bold}>{a.actor}</Text> {a.action} pada <Text style={styles.bold}>{a.case}</Text>
            </Text>
            <Text style={styles.activityTime}>{a.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.large, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  greeting: { fontSize: FontSize.medium, color: Colors.textSecondary },
  userName: { fontSize: FontSize.large, fontWeight: 'bold', color: Colors.text },
  roleBadge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.medium, paddingVertical: Spacing.small, borderRadius: BorderRadius.full },
  roleText: { color: Colors.primary, fontWeight: 'bold', fontSize: FontSize.small },
  statsContainer: { padding: Spacing.medium },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.medium },
  statCard: { flex: 1, backgroundColor: Colors.surface, padding: Spacing.medium, borderRadius: BorderRadius.medium, marginHorizontal: Spacing.small, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.tiny },
  statLabel: { fontSize: FontSize.small, color: Colors.textSecondary, textAlign: 'center' },
  section: { padding: Spacing.large, paddingTop: 0 },
  sectionTitle: { fontSize: FontSize.large, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.medium },
  card: { backgroundColor: Colors.surface, padding: Spacing.medium, borderRadius: BorderRadius.medium, marginBottom: Spacing.medium, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.small },
  caseNumber: { fontWeight: 'bold', color: Colors.text },
  badge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.small, paddingVertical: 2, borderRadius: BorderRadius.small },
  badgeText: { fontSize: FontSize.tiny, color: Colors.primary, fontWeight: 'bold' },
  caseTitle: { fontSize: FontSize.medium, color: Colors.text, marginBottom: Spacing.small },
  caseSla: { fontSize: FontSize.small, color: Colors.danger },
  taskTitle: { fontSize: FontSize.medium, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.tiny },
  taskRef: { fontSize: FontSize.small, color: Colors.textSecondary, marginBottom: Spacing.small },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskDue: { fontSize: FontSize.small, color: Colors.textSecondary },
  activityItem: { backgroundColor: Colors.surface, padding: Spacing.medium, borderRadius: BorderRadius.medium, marginBottom: Spacing.small, borderWidth: 1, borderColor: Colors.border },
  activityText: { fontSize: FontSize.medium, color: Colors.text, marginBottom: Spacing.tiny },
  bold: { fontWeight: 'bold' },
  activityTime: { fontSize: FontSize.small, color: Colors.textSecondary },
});
