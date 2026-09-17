// ============================================
// HARM Mobile — Layar Pencarian
// ============================================

import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { StatusBadge, EmptyState } from '@/components'

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const search = useCallback(async (text: string) => {
    if (text.length < 2) { setResults([]); setHasSearched(false); return }
    setSearching(true)
    setHasSearched(true)

    // Cari di beberapa tabel sekaligus
    const [casesRes, tasksRes, evidenceRes] = await Promise.all([
      supabase.from('cases').select('id, harm_number, title, official_status, document_type').or(`title.ilike.%${text}%,harm_number.ilike.%${text}%`).limit(10),
      supabase.from('case_tasks').select('id, title, status, case_id').ilike('title', `%${text}%`).limit(5),
      supabase.from('case_evidence').select('id, description, category, case_id').ilike('description', `%${text}%`).limit(5),
    ])

    const combined: any[] = []
    casesRes.data?.forEach(item => combined.push({ ...item, _type: 'case' }))
    tasksRes.data?.forEach(item => combined.push({ ...item, _type: 'task' }))
    evidenceRes.data?.forEach(item => combined.push({ ...item, _type: 'evidence' }))

    setResults(combined)
    setSearching(false)
  }, [])

  // Debounce
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const handleTextChange = (text: string) => {
    setQuery(text)
    if (timer) clearTimeout(timer)
    setTimer(setTimeout(() => search(text), 300))
  }

  const handleItemPress = (item: any) => {
    Keyboard.dismiss()
    const caseId = item._type === 'case' ? item.id : item.case_id
    if (caseId) {
      navigation.navigate('Permohonan', { screen: 'CaseDetail', params: { caseId } })
    }
  }

  const getTypeLabel = (type: string) => {
    return { case: '📁 Case', task: '📋 Tugas', evidence: '📎 Evidence' }[type] || type
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari case, tugas, evidence..."
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={handleTextChange}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setHasSearched(false) }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hasil pencarian */}
      {!hasSearched ? (
        <View style={styles.hint}>
          <Text style={styles.hintIcon}>🔍</Text>
          <Text style={styles.hintText}>Ketik minimal 2 karakter untuk mencari</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item._type}-${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleItemPress(item)} activeOpacity={0.6}>
              <Text style={styles.resultType}>{getTypeLabel(item._type)}</Text>
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item._type === 'case' ? `${item.harm_number || 'Draft'} — ${item.title}` : item.title || item.description}
              </Text>
              {item.official_status && <StatusBadge status={item.official_status} size="sm" />}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searching
              ? <View style={styles.hint}><Text style={styles.hintText}>Mencari...</Text></View>
              : <EmptyState icon="🔍" title="Tidak Ditemukan" description={`Tidak ada hasil untuk "${query}"`} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  searchIcon: { fontSize: 18, marginRight: Spacing.sm },
  searchInput: { flex: 1, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.text },
  clearBtn: { fontSize: 18, color: Colors.textTertiary, padding: Spacing.sm },
  hint: { alignItems: 'center', paddingTop: Spacing.xxxl * 3 },
  hintIcon: { fontSize: 48, marginBottom: Spacing.lg },
  hintText: { fontSize: FontSize.md, color: Colors.textSecondary },
  list: { paddingBottom: Spacing.xxxl },
  resultItem: { padding: Spacing.lg, backgroundColor: Colors.surface },
  resultType: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: Spacing.xs },
  resultTitle: { fontSize: FontSize.md, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  separator: { height: 1, backgroundColor: Colors.divider },
})
