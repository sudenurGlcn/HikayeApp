import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { adapty } from 'react-native-adapty';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

// Adapty'nin initialize edildiğinden emin olalım
adapty.activate('public_live_TUxYUIzJ');

const PAYWALL_ID = 'e51761c7-98ef-4109-8f84-2a0f8018f2cf';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00695C',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#004D40',
    marginBottom: 16,
    width: '80%',
  },
  howButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  howButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artyImage: {
    width: 80,
    height: 80,
    position: 'absolute',
    right: 20,
    top: 40,
  },
  cardContainer: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#E0F2F1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00695C',
  },
  cardDescription: {
    fontSize: 14,
    color: '#004D40',
    marginBottom: 12,
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
});

const PremiumCard = ({ title }: { title: string }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Önce mevcut paywall'ları listeleyelim
      const paywalls = await adapty.getPaywalls();
      console.log('Mevcut Paywall\'lar:', paywalls);

      // Eğer paywall varsa ilkini kullanalım
      const paywall = paywalls[0] || await adapty.getPaywall(PAYWALL_ID);
      if (!paywall || !paywall.products || paywall.products.length === 0) {
        throw new Error('Ürün bulunamadı');
      }

      // İlk ürünü seç (varsayılan olarak)
      const product = paywall.products[0];
      // @ts-ignore - Adapty tiplerindeki uyumsuzluğu geçici olarak görmezden geliyoruz
      const result = await adapty.makePurchase(product);

      if ('profile' in result && result.profile?.accessLevels?.['premium']?.isActive) {
        Alert.alert(
          "Başarılı!",
          "Premium aboneliğiniz başarıyla başlatıldı.",
          [{ text: "Harika!", onPress: () => router.replace('/(tabs)/analytics') }]
        );
      } else {
        throw new Error('Satın alma işlemi tamamlanamadı');
      }
    } catch (error: any) {
      if (error?.adaptyCode === 'paymentCancelled') {
        console.log('Kullanıcı satın almayı iptal etti');
      } else {
        Alert.alert("Hata", "Premium pakete yükseltme sırasında bir sorun oluştu.");
        console.error("Adapty Satın Alma Hatası:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          <TouchableOpacity onPress={() => console.log(`${title} info clicked`)}>
            {/* <Image
              source={require('../../assets/images/Arty.png')}
              style={styles.infoIcon}
            /> */}
          </TouchableOpacity>
        </View>
      </View>
      <ThemedText style={styles.cardDescription}>
        Detaylı analizler için İbibik Pro&apos;ya yükselt
      </ThemedText>
      <TouchableOpacity 
        style={[styles.upgradeButton, loading && styles.disabledButton]} 
        onPress={handleUpgrade}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.upgradeButtonText}>Şimdi Yükselt</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function AnalyticsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>ARTY Ebeveynlerin de Yanında!</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            ARTY, güvenli yapay zeka analiziyle çocuğunuzun gelişimini görüntü kılar.
          </ThemedText>
          <TouchableOpacity 
            style={styles.howButton} 
            onPress={() => router.push('/guide')}
          >
            <ThemedText style={styles.howButtonText}>Nasıl?</ThemedText>
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/Arty.png')}
            style={styles.artyImage}
            resizeMode="contain"
          />
        </View>

        <PremiumCard title="Okur Kişiliği" />
        <PremiumCard title="Günlük Kullanım Süresi" />
        <PremiumCard title="En Çok Tüketilen Tür" />
        <PremiumCard title="Okuma Alışkanlığı Gelişimi" />
        <PremiumCard title="Odak Süresi" />
      </ScrollView>
    </ThemedView>
  );
}