// ============================================
// HARM Mobile — Layar Tugas Saya
// ============================================
// Menampilkan semua tugas yang ditugaskan ke user

import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { TaskCard, EmptyState, LoadingScreen } from '@/components'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'today', label: 'Hari Ini' },
  { key: 'overdue', label: 'Terlambat' },
  { key: 'done', label: 'Selesai' },
]

export default function TasksScreen({ navigation }: any) {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  const fetchTasks = useCallback(async () => {
    if (!user) return
    let query = supabase
      .from('case_tasks')
      .select('*, cases:case_id(harm_number, title)')
      .eq('assignee_id', user.id)
      .order('due_date', { ascending: true })

    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    if (activeFilter === 'today') {
      query = query.gte('due_date', todayStart.toISOString()).lte('due_date', today.toISOString()).neq('status', 'DONE')
    } else if (activeFilter === 'overdue') {
      query = query.lt('due_date', todayStart.toISOString()).neq('status', 'DONE')
    } else if (activeFilter === 'done') {
      query = query.eq('status', 'DONE')
    }

    const { data, error } = await query
    if (!error && data) {
      setTasks(data.map((t: any) => ({
        ...t,
        case_title: t.cases?.harm_number ? `${t.cases.harm_number} — ${t.cases.title}` : t.cases?.title,
      })))
    }
  }, [user, activeFilter])

  useEffect(() => { fetchTasks().finally(() => setLoading(false)) }, [fetchTasks])

  const onRefresh = async () => { setRefreshing(true); await fetchTasks(); setRefreshing(false) }

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE'
    await supabase.from('case_tasks').update({
      status: newStatus,
      completed_at: newStatus === 'DONE' ? new Date().toISOString() : null,
    }).eq('id', taskId)
    fetchTasks()
  }

  if (loading) return <LoadingScreen />

  const emptyMessages: Record<string, { icon: string; title: string; desc: string }> = {
    all: { icon: '✅', title: 'Tidak Ada Tugas', desc: 'Semua tugas sudah selesai!' },
    today: { icon: '📅', title: 'Tidak Ada Tugas Hari Ini', desc: 'Tidak ada tugas yang jatuh tempo hari ini.' },
    overdue: { icon: '🎉', title: 'Tidak Ada Yang Terlambat', desc: 'Semua tugas selesai tepat waktu!' },
    done: { icon: '📋', title: 'Belum Ada Tugas Selesai', desc: 'Tugas yang selesai akan muncul di sini.' },
  }

  return (
    <View style={styles.container}>
      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => { setActiveFilter(f.key); setLoading(true) }}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => toggleTask(item.id, item.status)}
            onPress={() => item.case_id && navigation.navigate('CaseDetail', { caseId: item.case_id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListEmptyComponent={
          <EmptyState
            icon={emptyMessages[activeFilter].icon}
            title={emptyMessages[activeFilter].title}
            description={emptyMessages[activeFilter].desc}
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceVariant },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: Colors.textOnPrimary },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
})
