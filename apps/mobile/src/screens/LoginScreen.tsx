import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '@/lib/store';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const login = useAuthStore(state => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>HARM</Text>
          <Text style={styles.subtitle}>Sistem Harmonisasi Dokumen Terpadu</Text>
          <Text style={styles.department}>Pemerintah Kabupaten Aceh Tamiang</Text>
        </View>

        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Masukkan password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.toggleButton} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.toggleText}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Masuk</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.extraLarge,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.small,
  },
  subtitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.tiny,
  },
  department: {
    fontSize: FontSize.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.medium,
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSize.small,
    textAlign: 'center',
  },
  label: {
    fontSize: FontSize.medium,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    fontSize: FontSize.medium,
    marginBottom: Spacing.large,
    color: Colors.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.extraLarge,
  },
  passwordInput: {
    flex: 1,
    padding: Spacing.medium,
    fontSize: FontSize.medium,
    color: Colors.text,
  },
  toggleButton: {
    padding: Spacing.medium,
  },
  toggleText: {
    color: Colors.primary,
    fontSize: FontSize.small,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.large,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: FontSize.large,
    fontWeight: 'bold',
  },
});
