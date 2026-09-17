import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme';
import { supabase } from '@/lib/supabase';

export default function CaseListScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  const filters = ['Semua', 'Baru', 'Berjalan', 'Perbaikan', 'Selesai'];
  
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    // Simulated fetch
    setCases([
      { id: '1', harmNumber: 'HARM-2023-001', title: 'Rancangan Peraturan Daerah tentang Retribusi', opd: 'Dinas Pendapatan Daerah', status: 'BERJALAN', health: 'green', priority: 'TINGGI', sla: '2 hari lagi', assignee: 'Budi Santoso' },
      { id: '2', harmNumber: 'HARM-2023-002', title: 'SK Bupati Penunjukan Tim Ahli', opd: 'Bappeda', status: 'PERBAIKAN', health: 'red', priority: 'NORMAL', sla: 'Terlambat 3 hari', assignee: 'Siti Aminah' },
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CaseDetail', { id: item.id })}>
      <View style={styles.cardHeader}>
        <Text style={styles.caseNumber}>{item.harmNumber}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.healthDot, { backgroundColor: item.health === 'green' ? Colors.success : item.health === 'red' ? Colors.danger : Colors.warning }]} />
          <View style={styles.badge}><Text style={styles.badgeText}>{item.status}</Text></View>
        </View>
      </View>
      
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.opd}>{item.opd}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.footerCol}>
          <Text style={styles.label}>Prioritas</Text>
          <Text style={styles.value}>{item.priority}</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.label}>SLA</Text>
          <Text style={[styles.value, item.health === 'red' && { color: Colors.danger }]}>{item.sla}</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.label}>PIC</Text>
          <Text style={styles.value}>{item.assignee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nomor HARM, judul..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.filterScroll}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterChip, filter === item && styles.filterChipActive]}
                onPress={() => setFilter(item)}
              >
                <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={cases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>Belum ada permohonan</Text></View>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateCase')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.medium, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchInput: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.medium, padding: Spacing.medium, marginBottom: Spacing.medium },
  filterScroll: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: Spacing.medium, paddingVertical: Spacing.small, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.small },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontWeight: 'bold' },
  list: { padding: Spacing.medium },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.medium, padding: Spacing.medium, marginBottom: Spacing.medium, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.small },
  caseNumber: { fontSize: FontSize.medium, fontWeight: 'bold', color: Colors.text },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  healthDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.small },
  badge: { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.small, paddingVertical: 2, borderRadius: BorderRadius.small },
  badgeText: { fontSize: FontSize.tiny, color: Colors.primary, fontWeight: 'bold' },
  title: { fontSize: FontSize.large, fontWeight: '600', color: Colors.text, marginBottom: Spacing.tiny },
  opd: { fontSize: FontSize.medium, color: Colors.textSecondary, marginBottom: Spacing.medium },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.small },
  footerCol: { flex: 1 },
  label: { fontSize: FontSize.tiny, color: Colors.textSecondary, marginBottom: 2 },
  value: { fontSize: FontSize.small, color: Colors.text, fontWeight: '500' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.large },
  emptyText: { color: Colors.textSecondary, fontSize: FontSize.medium },
  fab: { position: 'absolute', bottom: Spacing.large, right: Spacing.large, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  fabIcon: { fontSize: 32, color: Colors.white, fontWeight: '300', marginTop: -2 },
});
