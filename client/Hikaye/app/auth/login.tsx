import { router } from 'expo-router';
import type { AxiosError } from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { authService } from '../../services/api';
import { setAuthData, setError, setLoading } from '../../store/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      dispatch(setError('Lütfen tüm alanları doldurun'));
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await authService.login({ email, password });
      dispatch(setAuthData(response));
      // Ana ekrana yönlendir
      router.replace('/(tabs)/home');
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const status = axiosErr.response?.status;
      const data = axiosErr.response?.data as any;
      console.log('Login error:', { status, data });
      const backendMessage = (typeof data === 'string') ? data : (data?.message || data?.title || data?.error);
      dispatch(setError(backendMessage || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Giriş Yap</ThemedText>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Giriş Yap</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/auth/register')}
        style={styles.linkContainer}
      >
        <ThemedText style={styles.link}>
          Hesabınız yok mu? Kayıt olun
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#007AFF',
  },
});
