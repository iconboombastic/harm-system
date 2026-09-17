import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme';

export default function CaseDetailScreen({ route }: any) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Ikhtisar');

  const tabs = ['Ikhtisar', 'Dokumen', 'Evidence', 'Tugas', 'Timeline', 'Review', 'Keputusan', 'Catatan'];

  const caseData = {
    harmNumber: 'HARM-2023-001',
    title: 'Rancangan Peraturan Daerah tentang Retribusi',
    status: 'BERJALAN',
    health: 'green',
    sla: '2 hari lagi',
    opd: 'Dinas Pendapatan Daerah',
    pengaju: 'Ahmad Yani',
    pic: 'Budi Santoso',
    tahap: 'Review Substansi',
    prioritas: 'TINGGI'
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.harmNumber}>{caseData.harmNumber}</Text>
        <Text style={styles.title}>{caseData.title}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.badge, { backgroundColor: Colors.primaryLight }]}>
            <Text style={styles.badgeText}>{caseData.status}</Text>
          </View>
          <View style={[styles.healthDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.sla}>{caseData.sla}</Text>
        </View>
      </View>

      <View style={styles.quickInfo}>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>OPD:</Text><Text style={styles.infoValue}>{caseData.opd}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Pengaju:</Text><Text style={styles.infoValue}>{caseData.pengaju}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>PIC:</Text><Text style={styles.infoValue}>{caseData.pic}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Tahap:</Text><Text style={styles.infoValue}>{caseData.tahap}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoLabel}>Prioritas:</Text><Text style={styles.infoValue}>{caseData.prioritas}</Text></View>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'Ikhtisar' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tindakan Selanjutnya</Text>
              <Text style={styles.cardText}>Review draft peraturan dan berikan catatan perbaikan.</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kelengkapan</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '80%' }]} />
              </View>
              <Text style={styles.progressText}>80% Selesai</Text>
            </View>
          </View>
        )}
        
        {activeTab !== 'Ikhtisar' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Konten {activeTab} akan tampil di sini</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.large, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  harmNumber: { fontSize: FontSize.small, color: Colors.textSecondary, fontWeight: 'bold', marginBottom: Spacing.tiny },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.small },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { paddingHorizontal: Spacing.small, paddingVertical: 2, borderRadius: BorderRadius.small, marginRight: Spacing.small },
  badgeText: { fontSize: FontSize.tiny, color: Colors.primary, fontWeight: 'bold' },
  healthDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.small },
  sla: { fontSize: FontSize.small, color: Colors.textSecondary },
  quickInfo: { padding: Spacing.large, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoRow: { flexDirection: 'row', marginBottom: Spacing.tiny },
  infoLabel: { width: 80, fontSize: FontSize.small, color: Colors.textSecondary },
  infoValue: { flex: 1, fontSize: FontSize.small, color: Colors.text, fontWeight: '500' },
  tabsContainer: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: Spacing.small },
  tab: { paddingHorizontal: Spacing.large, paddingVertical: Spacing.small },
  activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { color: Colors.textSecondary, fontSize: FontSize.medium },
  activeTabText: { color: Colors.primary, fontWeight: 'bold' },
  content: { flex: 1, padding: Spacing.large },
  card: { backgroundColor: Colors.surface, padding: Spacing.medium, borderRadius: BorderRadius.medium, marginBottom: Spacing.medium, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: FontSize.medium, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.small },
  cardText: { fontSize: FontSize.medium, color: Colors.text },
  progressBarBg: { height: 8, backgroundColor: Colors.border, borderRadius: 4, marginVertical: Spacing.small },
  progressBarFill: { height: 8, backgroundColor: Colors.success, borderRadius: 4 },
  progressText: { fontSize: FontSize.small, color: Colors.textSecondary, textAlign: 'right' },
  placeholderContainer: { padding: Spacing.xlarge, alignItems: 'center' },
  placeholderText: { color: Colors.textSecondary, fontSize: FontSize.medium },
  fab: { position: 'absolute', bottom: Spacing.large, right: Spacing.large, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  fabIcon: { fontSize: 24, color: Colors.white },
});
