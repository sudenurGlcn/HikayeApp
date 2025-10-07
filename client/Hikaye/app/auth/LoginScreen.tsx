import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { authService } from '../../services/api';
import { setAuthData, setError, setLoading } from '../../store/authSlice';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
      navigation.navigate('Home');
    } catch (err: any) {
      // Backend'den gelen hata mesajını kontrol et
      let errorMessage = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      
      if (err?.response?.data) {
        const backendError = err.response.data;
        if (typeof backendError === 'string' && backendError.includes('Invalid credentials')) {
          errorMessage = 'Bilgilerinizden birisi hatalı, lütfen tekrar deneyin.';
        } else if (typeof backendError === 'string') {
          errorMessage = backendError;
        }
      }
      
      dispatch(setError(errorMessage));
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
        onPress={() => navigation.navigate('SignUp')}
        style={styles.linkContainer}
      >
        <ThemedText style={styles.link}>
          Hesabınız yok mu? Kayıt olun
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

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
