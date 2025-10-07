import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';

// ---- ADAPTY İÇİN GEREKLİ IMPORT'LAR ----
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { adapty } from 'react-native-adapty';
// ------------------------------------------

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '../store/store';

export const unstable_settings = {
  initialRouteName: 'onboarding',
  // Tüm alt rotaları da belirtelim
  '(tabs)': {
    initialRouteName: 'home',
  },
};

// ==================================================================
// 1. ADAPTY AKTİVASYONU (Bileşen Dışında)
// ==================================================================
const adaptyPublicKey = Constants.expoConfig?.extra?.adaptyPublicKey;

if (!adaptyPublicKey) {
  console.error("Adapty Public SDK Key bulunamadı!");
} else {
  adapty.activate(adaptyPublicKey, {
    observerMode: false,
    logLevel: 'verbose',
  });
  console.log("✅ Adapty aktivasyon süreci başlatıldı.");
}
// ==================================================================

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const pathname = usePathname();

  // Onboarding, welcome veya auth sayfalarında auth guard'ı devre dışı bırak
  if (pathname === '/onboarding' || pathname === '/welcome' || pathname.startsWith('/auth')) {
    return (
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="reading/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="continue-reading" options={{ headerShown: false }} />
        <Stack.Screen name="blog" options={{ headerShown: false }} />
        <Stack.Screen name="guide" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // Auth guard: kullanıcı giriş yapmadıysa onboarding'e yönlendir
  if (!isAuthenticated) {
    return <Redirect href="/onboarding" />;
  }

  // ==================================================================
  // 2. ADAPTY DOĞRULAMASI (Bileşen İçinde)
  // ==================================================================
  useEffect(() => {
    const verifyAdaptyConnection = async () => {
      try {
        const profile = await adapty.getProfile();
        console.log("✅ Adapty Profili Başarıyla Alındı! Profile ID:", profile.profileId);
      } catch (error) {
        console.error("❌ Adapty profili alınırken hata oluştu:", error);
      }
    };

    verifyAdaptyConnection();

    const unsubscribe = adapty.addEventListener('onLatestProfileLoad', (profile) => {
      console.log("🔔 Adapty Event Listener: Yeni profil bilgisi geldi!", profile.profileId);
    });

    return () => {
      unsubscribe.remove();
    };
  }, []);
  // ==================================================================

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}