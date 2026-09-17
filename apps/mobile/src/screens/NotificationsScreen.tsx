// ============================================
// HARM Mobile — Layar Notifikasi
// ============================================

import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { EmptyState, LoadingScreen } from '@/components'

const NOTIF_ICONS: Record<string, string> = {
  TASK_ASSIGNED: '📋',
  TASK_OVERDUE: '⚠️',
  REVISION_REQUESTED: '✏️',
  REVISION_SUBMITTED: '📄',
  REVIEW_REQUESTED: '🔍',
  APPROVAL_REQUESTED: '✅',
  SLA_WARNING: '⏰',
  SLA_OVERDUE: '🔴',
  EVIDENCE_GAP: '📎',
  MEETING: '👥',
  EXTERNAL_RESPONSE: '📨',
  ACCOUNT_SECURITY: '🔒',
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  return date.toLocaleDateString('id-ID')
}

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setNotifications(data)
  }, [user])

  useEffect(() => { fetchNotifications().finally(() => setLoading(false)) }, [fetchNotifications])

  const onRefresh = async () => { setRefreshing(true); await fetchNotifications(); setRefreshing(false) }

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllAsRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('user_id', user.id).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const handlePress = (notif: any) => {
    if (!notif.is_read) markAsRead(notif.id)
    if (notif.case_id) {
      navigation.navigate('Permohonan', { screen: 'CaseDetail', params: { caseId: notif.case_id } })
    }
  }

  if (loading) return <LoadingScreen />

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <View style={styles.container}>
      {/* Header aksi */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Tandai Semua Dibaca ({unreadCount})</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifItem, !item.is_read && styles.notifUnread]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.notifIcon}>{NOTIF_ICONS[item.type] || '📌'}</Text>
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, !item.is_read && styles.notifTitleBold]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
              <Text style={styles.notifTime}>{timeAgo(item.created_at)}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListEmptyComponent={<EmptyState icon="🔔" title="Tidak Ada Notifikasi" description="Notifikasi baru akan muncul di sini." />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  markAllBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  markAllText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600', textAlign: 'right' },
  list: { paddingBottom: Spacing.xxxl },
  notifItem: { flexDirection: 'row', padding: Spacing.lg, alignItems: 'flex-start', gap: Spacing.md, backgroundColor: Colors.surface },
  notifUnread: { backgroundColor: '#eff6ff' },
  notifIcon: { fontSize: 24, marginTop: 2 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: FontSize.md, color: Colors.text, marginBottom: 2 },
  notifTitleBold: { fontWeight: '700' },
  notifMessage: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  notifTime: { fontSize: FontSize.xs, color: Colors.textTertiary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6 },
  separator: { height: 1, backgroundColor: Colors.divider },
})
