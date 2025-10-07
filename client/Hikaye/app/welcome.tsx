import { router } from 'expo-router';
import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleSignUp = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar hidden />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/story-arty.png')} // Logo dosyanızın yolu
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Hoşgeldin Yazısı */}
      <View style={styles.welcomeContainer}>
        <ThemedText style={styles.welcomeTitle}>Hoşgeldin!</ThemedText>
        <ThemedText style={styles.welcomeDescription}>
          Hikâyelerin ve teknolojinin büyülü dünyasına katılmak için kayıt ol!
        </ThemedText>
      </View>

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.signUpButtonText}>ÜYE OL</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.signInButtonText}>GİRİŞ YAP</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 120,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.15,
  },
  welcomeContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:0,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
    height: 30,
    marginTop: 0,
  },
  welcomeDescription: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 50,
    marginTop: -10,
  },
  buttonContainer: {
    flex: 0.2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: 150,
  },
  signUpButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#3ECCB4',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {
    fontSize: 26,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  signInButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3F3F3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  signInButtonText: {
    fontSize: 26,
    fontWeight: '400',
    color: '#D0D0D0',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
});
