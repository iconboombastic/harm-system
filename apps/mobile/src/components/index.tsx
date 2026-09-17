// ============================================
// HARM Mobile — Komponen Reusable
// ============================================

import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'

// ----- STATUS BADGE -----
// Badge berwarna menampilkan status case
export function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const color = getStatusColor(status)
  const label = getStatusLabel(status)
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.badgeText, { color }, size === 'sm' && styles.badgeTextSm]}>{label}</Text>
    </View>
  )
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DIAJUKAN: '#3b82f6',
    MENUNGGU_VERIFIKASI_OPD: '#f59e0b',
    DITOLAK: '#dc2626',
    MENUNGGU_REVIEW: '#8b5cf6',
    PERLU_PERBAIKAN: '#f97316',
    MENUNGGU_REVIEW_ULANG: '#8b5cf6',
    SELESAI: '#16a34a',
    TODO: '#94a3b8',
    IN_PROGRESS: '#3b82f6',
    BLOCKED: '#dc2626',
    DONE: '#16a34a',
    CANCELLED: '#6b7280',
    OPEN: '#f59e0b',
    RESOLVED: '#16a34a',
  }
  return map[status] || '#6b7280'
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DIAJUKAN: 'Diajukan',
    MENUNGGU_VERIFIKASI_OPD: 'Menunggu Verifikasi',
    DITOLAK: 'Ditolak',
    MENUNGGU_REVIEW: 'Menunggu Review',
    PERLU_PERBAIKAN: 'Perlu Perbaikan',
    MENUNGGU_REVIEW_ULANG: 'Review Ulang',
    SELESAI: 'Selesai',
    TODO: 'Belum Dikerjakan',
    IN_PROGRESS: 'Sedang Dikerjakan',
    BLOCKED: 'Terblokir',
    DONE: 'Selesai',
    CANCELLED: 'Dibatalkan',
  }
  return map[status] || status
}

// ----- HEALTH DOT -----
// Titik berwarna menunjukkan kesehatan case
export function HealthDot({ health }: { health: string }) {
  const color = { GREEN: Colors.healthGreen, BLUE: Colors.healthBlue, AMBER: Colors.healthAmber, RED: Colors.healthRed, DONE: Colors.disabled }[health] || Colors.disabled
  return <View style={[styles.healthDot, { backgroundColor: color }]} />
}

// ----- PRIORITY BADGE -----
export function PriorityBadge({ priority }: { priority: string }) {
  const color = { LOW: Colors.priorityLow, NORMAL: Colors.priorityNormal, HIGH: Colors.priorityHigh, CRITICAL: Colors.priorityCritical }[priority] || Colors.priorityNormal
  const label = { LOW: 'Rendah', NORMAL: 'Normal', HIGH: 'Tinggi', CRITICAL: 'Kritis' }[priority] || priority
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.badgeText, { color, fontSize: FontSize.xs }]}>{label}</Text>
    </View>
  )
}

// ----- SLA COUNTDOWN -----
export function SlaCountdown({ deadline }: { deadline: string | null }) {
  if (!deadline) return <Text style={styles.slaNone}>-</Text>
  const now = new Date()
  const target = new Date(deadline)
  const diffMs = target.getTime() - now.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays)
    return <Text style={[styles.slaText, { color: Colors.error }]}>Terlambat {overdueDays} hari</Text>
  }
  if (diffHours < 24) {
    return <Text style={[styles.slaText, { color: Colors.warning }]}>{diffHours} jam lagi</Text>
  }
  if (diffDays <= 3) {
    return <Text style={[styles.slaText, { color: Colors.warning }]}>{diffDays} hari lagi</Text>
  }
  return <Text style={[styles.slaText, { color: Colors.success }]}>{diffDays} hari lagi</Text>
}

// ----- CASE CARD -----
export function CaseCard({ caseData, onPress }: { caseData: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.harmNumber}>{caseData.harm_number || 'Draft'}</Text>
        <HealthDot health={caseData.health || 'GREEN'} />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{caseData.title}</Text>
      <Text style={styles.cardSubtitle}>{caseData.opd?.nama || caseData.document_type}</Text>
      <View style={styles.cardFooter}>
        <StatusBadge status={caseData.official_status || 'DIAJUKAN'} size="sm" />
        <SlaCountdown deadline={caseData.sla_deadline} />
      </View>
    </TouchableOpacity>
  )
}

// ----- TASK CARD -----
export function TaskCard({ task, onToggle, onPress }: { task: any; onToggle?: () => void; onPress?: () => void }) {
  const isDone = task.status === 'DONE'
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isDone
  return (
    <TouchableOpacity style={[styles.card, isOverdue && styles.cardOverdue]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.taskRow}>
        <TouchableOpacity onPress={onToggle} style={[styles.checkbox, isDone && styles.checkboxDone]}>
          {isDone && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>{task.title}</Text>
          {task.case_title && <Text style={styles.cardSubtitle}>{task.case_title}</Text>}
          <View style={styles.taskMeta}>
            {task.due_date && (
              <Text style={[styles.taskDate, isOverdue && { color: Colors.error }]}>
                {isOverdue ? '⚠ ' : '📅 '}{new Date(task.due_date).toLocaleDateString('id-ID')}
              </Text>
            )}
            <PriorityBadge priority={task.priority || 'NORMAL'} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ----- EMPTY STATE -----
export function EmptyState({ icon = '📋', title, description }: { icon?: string; title: string; description?: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description && <Text style={styles.emptyDesc}>{description}</Text>}
    </View>
  )
}

// ----- LOADING SCREEN -----
export function LoadingScreen({ message = 'Memuat...' }: { message?: string }) {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  )
}

// ----- SECTION HEADER -----
export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>Lihat Semua →</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

// ----- INFO ROW -----
export function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : null]}>{value || '-'}</Text>
    </View>
  )
}

// ----- STYLES -----
const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
  badgeSm: { paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: FontSize.sm, fontWeight: '600' },
  badgeTextSm: { fontSize: FontSize.xs },
  healthDot: { width: 10, height: 10, borderRadius: 5 },
  slaNone: { fontSize: FontSize.xs, color: Colors.textTertiary },
  slaText: { fontSize: FontSize.xs, fontWeight: '600' },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  cardOverdue: { borderLeftWidth: 3, borderLeftColor: Colors.error },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  harmNumber: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs },
  cardSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  taskTitle: { fontSize: FontSize.md, fontWeight: '500', color: Colors.text, marginBottom: 2 },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textTertiary },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  taskDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxxl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  emptyDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.xxl },
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: Spacing.lg, fontSize: FontSize.md, color: Colors.textSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, marginTop: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  infoValue: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text, maxWidth: '60%', textAlign: 'right' },
})
