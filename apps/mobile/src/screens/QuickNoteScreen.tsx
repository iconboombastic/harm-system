// ============================================
// HARM Mobile — Layar Catatan Cepat
// ============================================
// Tambah catatan ke case dengan cepat dari mobile

import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

const CATEGORIES = [
  { value: 'GENERAL', label: 'Umum', icon: '📝' },
  { value: 'MEETING', label: 'Rapat', icon: '👥' },
  { value: 'COORDINATION', label: 'Koordinasi', icon: '🤝' },
  { value: 'FOLLOW_UP', label: 'Tindak Lanjut', icon: '↩️' },
  { value: 'DEADLINE', label: 'Deadline', icon: '⏰' },
  { value: 'IMPORTANT', label: 'Penting', icon: '⚠️' },
]

const NOTE_COLORS = [
  { value: '#fef9c3', label: 'Kuning' },
  { value: '#dbeafe', label: 'Biru' },
  { value: '#dcfce7', label: 'Hijau' },
  { value: '#fce7f3', label: 'Pink' },
  { value: '#f3e8ff', label: 'Ungu' },
  { value: '#fed7aa', label: 'Orange' },
]

export default function QuickNoteScreen({ route, navigation }: any) {
  const { user } = useAuthStore()
  const caseId = route?.params?.caseId || ''
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [color, setColor] = useState('#fef9c3')
  const [isPinned, setIsPinned] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim()) { Alert.alert('Error', 'Isi catatan tidak boleh kosong.'); return }
    if (!caseId) { Alert.alert('Error', 'Case ID tidak ditemukan.'); return }

    setSaving(true)
    try {
      const { error } = await supabase.from('case_notes').insert({
        case_id: caseId,
        content: content.trim(),
        category,
        color,
        is_pinned: isPinned,
        author_id: user?.id,
        visibility: 'TEAM',
      })

      if (error) throw error

      Alert.alert('Berhasil', 'Catatan berhasil disimpan!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Catatan Cepat</Text>
      <Text style={styles.subtitle}>Tambah catatan operasional untuk case ini</Text>

      {/* Kategori */}
      <Text style={styles.label}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.chip, category === cat.value && styles.chipActive]}
            onPress={() => setCategory(cat.value)}
          >
            <Text style={styles.chipIcon}>{cat.icon}</Text>
            <Text style={[styles.chipText, category === cat.value && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Warna */}
      <Text style={styles.label}>Warna</Text>
      <View style={styles.colorRow}>
        {NOTE_COLORS.map(c => (
          <TouchableOpacity
            key={c.value}
            style={[styles.colorCircle, { backgroundColor: c.value }, color === c.value && styles.colorSelected]}
            onPress={() => setColor(c.value)}
          >
            {color === c.value && <Text style={styles.colorCheck}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Konten catatan */}
      <Text style={styles.label}>Catatan *</Text>
      <TextInput
        style={[styles.noteInput, { backgroundColor: color }]}
        value={content}
        onChangeText={setContent}
        placeholder="Tulis catatan Anda di sini..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
      />

      {/* Pin toggle */}
      <TouchableOpacity style={styles.pinRow} onPress={() => setIsPinned(!isPinned)}>
        <View style={[styles.toggle, isPinned && styles.toggleActive]}>
          <View style={[styles.toggleKnob, isPinned && styles.toggleKnobActive]} />
        </View>
        <Text style={styles.pinLabel}>📌 Sematkan catatan ini</Text>
      </TouchableOpacity>

      {/* Tombol simpan */}
      <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color={Colors.textOnPrimary} />
        ) : (
          <Text style={styles.saveBtnText}>Simpan Catatan</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl * 2 },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  chipRow: { marginBottom: Spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceVariant, marginRight: Spacing.sm, gap: 4 },
  chipActive: { backgroundColor: Colors.primary },
  chipIcon: { fontSize: 16 },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  chipTextActive: { color: Colors.textOnPrimary, fontWeight: '600' },
  colorRow: { flexDirection: 'row', gap: Spacing.md },
  colorCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  colorSelected: { borderColor: Colors.primary },
  colorCheck: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  noteInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: Spacing.lg, fontSize: FontSize.md, color: Colors.text, minHeight: 160, lineHeight: 24 },
  pinRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xl, gap: Spacing.md },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: Colors.border, padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: Colors.primary },
  toggleKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.surface },
  toggleKnobActive: { alignSelf: 'flex-end' },
  pinLabel: { fontSize: FontSize.md, color: Colors.text },
  saveBtn: { marginTop: Spacing.xxl, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textOnPrimary },
})
