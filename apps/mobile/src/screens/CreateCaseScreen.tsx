import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme';

export default function CreateCaseScreen({ navigation }: any) {
  const [form, setForm] = useState({
    judul: '',
    jenisDokumen: 'Perda', // Default
    opd: 'Dinas Kominfo', // Default
    namaPengaju: '',
    emailPengaju: '',
    prioritas: 'NORMAL',
    catatan: ''
  });

  const [files, setFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};
    if (!form.judul) newErrors.judul = 'Judul wajib diisi';
    if (!form.namaPengaju) newErrors.namaPengaju = 'Nama Pengaju wajib diisi';
    if (!form.emailPengaju) newErrors.emailPengaju = 'Email Pengaju wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      Alert.alert('Sukses', 'Permohonan berhasil dikirim', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const handleAttach = () => {
    // Mock attaching file
    setFiles([...files, `dokumen_lampiran_${files.length + 1}.pdf`]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Judul Permohonan *</Text>
      <TextInput
        style={[styles.input, errors.judul && styles.inputError]}
        placeholder="Masukkan judul dokumen"
        value={form.judul}
        onChangeText={(text) => setForm({...form, judul: text})}
      />
      {errors.judul && <Text style={styles.errorText}>{errors.judul}</Text>}

      <Text style={styles.label}>Jenis Dokumen</Text>
      <TextInput
        style={styles.input}
        value={form.jenisDokumen}
        editable={false} // Mock for picker
      />

      <Text style={styles.label}>OPD Pemrakarsa</Text>
      <TextInput
        style={styles.input}
        value={form.opd}
        editable={false} // Mock for picker
      />

      <Text style={styles.label}>Nama Pengaju *</Text>
      <TextInput
        style={[styles.input, errors.namaPengaju && styles.inputError]}
        placeholder="Nama lengkap"
        value={form.namaPengaju}
        onChangeText={(text) => setForm({...form, namaPengaju: text})}
      />
      {errors.namaPengaju && <Text style={styles.errorText}>{errors.namaPengaju}</Text>}

      <Text style={styles.label}>Email Pengaju *</Text>
      <TextInput
        style={[styles.input, errors.emailPengaju && styles.inputError]}
        placeholder="email@acehtamiangkab.go.id"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.emailPengaju}
        onChangeText={(text) => setForm({...form, emailPengaju: text})}
      />
      {errors.emailPengaju && <Text style={styles.errorText}>{errors.emailPengaju}</Text>}

      <Text style={styles.label}>Prioritas</Text>
      <TextInput
        style={styles.input}
        value={form.prioritas}
        editable={false} // Mock for picker
      />

      <Text style={styles.label}>Catatan Tambahan</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tuliskan catatan atau instruksi khusus..."
        multiline
        numberOfLines={4}
        value={form.catatan}
        onChangeText={(text) => setForm({...form, catatan: text})}
      />

      <Text style={styles.label}>Dokumen Lampiran</Text>
      {files.map((file, index) => (
        <View key={index} style={styles.fileRow}>
          <Text style={styles.fileName}>{file}</Text>
          <TouchableOpacity onPress={() => removeFile(index)}>
            <Text style={styles.removeText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.attachButton} onPress={handleAttach}>
        <Text style={styles.attachButtonText}>+ Lampirkan Dokumen</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Kirim Permohonan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.goBack()}>
          <Text style={styles.outlineButtonText}>Simpan Draft</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.large },
  label: { fontSize: FontSize.medium, fontWeight: '500', color: Colors.text, marginBottom: Spacing.tiny, marginTop: Spacing.medium },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.medium, padding: Spacing.medium, fontSize: FontSize.medium, color: Colors.text },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: FontSize.small, marginTop: Spacing.tiny },
  textArea: { height: 100, textAlignVertical: 'top' },
  fileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.medium, borderRadius: BorderRadius.medium, marginBottom: Spacing.small, borderWidth: 1, borderColor: Colors.border },
  fileName: { fontSize: FontSize.small, color: Colors.text },
  removeText: { color: Colors.danger, fontSize: FontSize.small },
  attachButton: { padding: Spacing.medium, alignItems: 'center', backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.medium, borderStyle: 'dashed', marginTop: Spacing.small },
  attachButtonText: { color: Colors.primary, fontWeight: '500' },
  actions: { marginTop: Spacing.extraLarge, gap: Spacing.medium },
  primaryButton: { backgroundColor: Colors.primary, padding: Spacing.large, borderRadius: BorderRadius.medium, alignItems: 'center' },
  primaryButtonText: { color: Colors.white, fontSize: FontSize.medium, fontWeight: 'bold' },
  outlineButton: { backgroundColor: 'transparent', padding: Spacing.large, borderRadius: BorderRadius.medium, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary },
  outlineButtonText: { color: Colors.primary, fontSize: FontSize.medium, fontWeight: 'bold' },
});
