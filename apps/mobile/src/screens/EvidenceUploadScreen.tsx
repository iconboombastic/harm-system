// ============================================
// HARM Mobile — Layar Upload Evidence
// ============================================
// Upload evidence langsung dari HP (kamera / galeri / file)

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

const CATEGORIES = [
  { value: 'SURAT', label: 'Surat' },
  { value: 'FOTO', label: 'Foto' },
  { value: 'NOTULEN', label: 'Notulen' },
  { value: 'DAFTAR_HADIR', label: 'Daftar Hadir' },
  { value: 'DISPOSISI', label: 'Disposisi' },
  { value: 'HASIL_FASILITASI', label: 'Hasil Fasilitasi' },
  { value: 'BUKTI_REGISTRASI', label: 'Bukti Registrasi' },
  { value: 'DOKUMEN_PENDUKUNG', label: 'Dokumen Pendukung' },
  { value: 'OTHER', label: 'Lainnya' },
]

export default function EvidenceUploadScreen({ route, navigation }: any) {
  const { user } = useAuthStore()
  const caseId = route?.params?.caseId || ''
  const [category, setCategory] = useState('FOTO')
  const [source, setSource] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  // Ambil foto dari kamera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Aplikasi membutuhkan akses kamera untuk mengambil foto.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    })
    if (!result.canceled && result.assets[0]) {
      setSelectedFile({ uri: result.assets[0].uri, name: `evidence_${Date.now()}.jpg`, type: 'image/jpeg' })
    }
  }

  // Pilih dari galeri
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Aplikasi membutuhkan akses galeri.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setSelectedFile({ uri: result.assets[0].uri, name: result.assets[0].fileName || `image_${Date.now()}.jpg`, type: 'image/jpeg' })
    }
  }

  // Pilih file dokumen
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' })
    if (!result.canceled && result.assets[0]) {
      setSelectedFile({ uri: result.assets[0].uri, name: result.assets[0].name, type: result.assets[0].mimeType || 'application/octet-stream' })
    }
  }

  // Upload evidence
  const handleUpload = async () => {
    if (!selectedFile) { Alert.alert('Error', 'Pilih file terlebih dahulu.'); return }
    if (!description.trim()) { Alert.alert('Error', 'Deskripsi wajib diisi.'); return }
    if (!caseId) { Alert.alert('Error', 'Case ID tidak ditemukan.'); return }

    setUploading(true)
    try {
      // 1. Upload file ke Supabase Storage
      const filePath = `evidence/${caseId}/${Date.now()}_${selectedFile.name}`
      const response = await fetch(selectedFile.uri)
      const blob = await response.blob()

      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, blob, { contentType: selectedFile.type })

      if (uploadError) throw uploadError

      // 2. Simpan metadata ke database
      const { error: dbError } = await supabase.from('case_evidence').insert({
        case_id: caseId,
        category,
        source,
        description,
        file_path: filePath,
        mime_type: selectedFile.type,
        confidentiality: 'INTERNAL',
        created_by: user?.id,
        date: new Date().toISOString(),
        actor_id: user?.id,
      })

      if (dbError) throw dbError

      Alert.alert('Berhasil', 'Evidence berhasil diupload!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error: any) {
      Alert.alert('Gagal Upload', error.message || 'Terjadi kesalahan saat upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Upload Evidence</Text>
      <Text style={styles.subtitle}>Tambahkan bukti/evidence dari HP Anda</Text>

      {/* Kategori */}
      <Text style={styles.label}>Kategori *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.categoryChip, category === cat.value && styles.categoryActive]}
            onPress={() => setCategory(cat.value)}
          >
            <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sumber */}
      <Text style={styles.label}>Sumber</Text>
      <TextInput style={styles.input} value={source} onChangeText={setSource} placeholder="Contoh: Rapat DPRK, Surat OPD" placeholderTextColor={Colors.textTertiary} />

      {/* Deskripsi */}
      <Text style={styles.label}>Deskripsi *</Text>
      <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} placeholder="Jelaskan evidence ini..." placeholderTextColor={Colors.textTertiary} multiline numberOfLines={3} textAlignVertical="top" />

      {/* Tombol pilih file */}
      <Text style={styles.label}>File / Foto *</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.pickBtn} onPress={takePhoto}>
          <Text style={styles.pickBtnIcon}>📷</Text>
          <Text style={styles.pickBtnText}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
          <Text style={styles.pickBtnIcon}>🖼️</Text>
          <Text style={styles.pickBtnText}>Galeri</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickBtn} onPress={pickDocument}>
          <Text style={styles.pickBtnIcon}>📎</Text>
          <Text style={styles.pickBtnText}>File</Text>
        </TouchableOpacity>
      </View>

      {/* Preview file terpilih */}
      {selectedFile && (
        <View style={styles.preview}>
          {selectedFile.type?.startsWith('image') ? (
            <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.filePreview}>
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.removeFile}>
            <Text style={styles.removeText}>✕ Hapus</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tombol upload */}
      <TouchableOpacity style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]} onPress={handleUpload} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color={Colors.textOnPrimary} />
        ) : (
          <Text style={styles.uploadBtnText}>Upload Evidence</Text>
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
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text },
  textarea: { minHeight: 80 },
  categoryRow: { marginBottom: Spacing.sm },
  categoryChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceVariant, marginRight: Spacing.sm },
  categoryActive: { backgroundColor: Colors.primary },
  categoryText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  categoryTextActive: { color: Colors.textOnPrimary, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: Spacing.md },
  pickBtn: { flex: 1, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderStyle: 'dashed' },
  pickBtnIcon: { fontSize: 28, marginBottom: Spacing.xs },
  pickBtnText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
  preview: { marginTop: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  previewImage: { width: '100%', height: 200 },
  filePreview: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  fileIcon: { fontSize: 32 },
  fileName: { flex: 1, fontSize: FontSize.sm, color: Colors.text },
  removeFile: { padding: Spacing.md, alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border },
  removeText: { fontSize: FontSize.sm, color: Colors.error, fontWeight: '500' },
  uploadBtn: { marginTop: Spacing.xl, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center' },
  uploadBtnDisabled: { opacity: 0.6 },
  uploadBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textOnPrimary },
})
