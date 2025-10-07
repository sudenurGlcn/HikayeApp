import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { AppDispatch } from '../../store/store';
import { Story } from '../../types';
import { bookService } from '../../services/api';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>(); // ileride kullanılacak
  
  // TODO: Backend bağlantısı yapıldığında aktif edilecek
  // const { currentStory: story, isLoading, error } = useSelector((state: RootState) => state.story);
  const [story, setStory] = React.useState<Story | null>(null);
  const [isFavorite, setIsFavorite] = React.useState(false);

  // TODO: Backend bağlantısı yapıldığında aktif edilecek
  const handleToggleFavorite = async () => {
    try {
      const childId = 1; // TODO: Kullanıcıdan alınacak
      if (!story) return;
      await bookService.addFavorite({ childId, bookId: Number(story.id) });
      setIsFavorite(true);
    } catch (error) {
      console.error('Favori işlemi sırasında hata:', error);
    }
  };

  React.useEffect(() => {
    const load = async () => {
      try {
        const detail = await bookService.detail(id as string);
        const mapped: Story = {
          id: String(detail.id),
          title: detail.title,
          description: detail.description || '',
          coverImage: { uri: detail.coverImageURL } as any,
          author: (detail.authors && detail.authors.length > 0) ? (detail.authors as string[]).join(', ') : '',
          category: '',
          readTime: detail.estimatedReadingTimeMinutes || 0,
          createdAt: new Date().toISOString(),
          isLocked: false,
          chapters: detail.totalPages || 0,
          activities: detail.activityCount || 0,
        };
        setStory(mapped);
      } catch (e) {
        console.error('Detay yükleme hatası:', e);
      }
    };
    load();
  }, [id]);

  // TODO: Backend bağlantısı yapıldığında aktif edilecek
  // if (isLoading) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <ActivityIndicator size="large" color="#4CAF50" />
  //     </ThemedView>
  //   );
  // }

  // if (error) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <ThemedText style={styles.errorText}>{error}</ThemedText>
  //     </ThemedView>
  //   );
  // }

  if (!story) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Üst Arka Plan ve butonlar */}
        <ImageBackground source={story.coverImage as any} style={styles.headerBg} resizeMode="cover" imageStyle={styles.headerBgImage}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.backButton}>
              <View style={styles.backCircle}>
                <Image source={require('../../assets/images/geri-buton.png')} style={styles.backIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.8}
            >
              <View style={[styles.favoriteCircle, isFavorite && styles.favoriteCircleActive]}>
                <Image 
                  source={require('../../assets/images/favori-icon.png')} 
                  style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]} 
                />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Kitap Kapağı - ortada, üst görselin altına taşacak */}
        <View style={styles.coverWrapper}>
          <Image source={story.coverImage} style={styles.coverImage} resizeMode="cover" />
        </View>

        {/* Kitap Başlığı ve Yazar */}
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{story.title}</ThemedText>
          <ThemedText style={styles.author}>{story.author}</ThemedText>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsBox}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Image source={require('../../assets/images/bolum-icon.png')} style={styles.statIcon} />
            <View style={styles.statRow}>
              <ThemedText style={styles.statValue}>{story.chapters}</ThemedText>
              <ThemedText style={styles.statLabel}>bölüm</ThemedText>
            </View>
          </View>
          <View style={styles.statItem}>
            <Image source={require('../../assets/images/etkinlik-ıcon.png')} style={styles.statIcon} />
            <View style={styles.statRow}>
              <ThemedText style={styles.statValue}>{story.activities}</ThemedText>
              <ThemedText style={styles.statLabel}>etkinlik</ThemedText>
            </View>
          </View>
          <View style={styles.statItem}>
            <Image source={require('../../assets/images/zaman-ıcon.png')} style={styles.statIcon} />
            <View style={styles.statRow}>
              <ThemedText style={styles.statValue}>{story.readTime}</ThemedText>
              <ThemedText style={styles.statLabel}>dk</ThemedText>
            </View>
          </View>
        </View>
        </View>

        {/* Özet */}
        <View style={styles.summaryContainer}>
          <ThemedText style={styles.summaryTitle}>Özet</ThemedText>
          <ThemedText style={styles.summaryText}>{story.description}</ThemedText>
        </View>

        {/* Alt boşluk içinde buton */}
      </ScrollView>
      <View style={styles.readButtonBar}>
        <TouchableOpacity 
          style={styles.readButton}
          onPress={async () => {
            try {
              // Geçici: childId sabit; ileride kullanıcıya göre seçilecek
              const childId = 1;
              await bookService.startReading(childId, Number(story.id));
              router.push(`/reading/${story.id}`);
            } catch (error) {
              const anyErr: any = error;
              console.error('Okuma başlatılırken hata:', {
                message: anyErr?.message,
                status: anyErr?.response?.status,
                data: anyErr?.response?.data,
                url: anyErr?.config?.baseURL + anyErr?.config?.url,
              });
            }
          }}
        >
          <ThemedText style={styles.readButtonText}>HADİ OKUYALIM!</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
  },
  headerBg: {
    width: '100%',
    height: 300,
  },
  headerBgImage: {
    opacity: 0.5,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  coverWrapper: {
    alignItems: 'center',
    marginTop: -210,
  },
  coverImage: {
    width: 190,
    height: 260,
    borderRadius: 10,
    elevation: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  statsBox: {
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statItem: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 28,
    height: 28,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  statIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F5F8',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'baloo_2',
    fontWeight: '600',
    color: '#212121',
    letterSpacing: 0.25,
  },
  statLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'baloo_2',
    fontWeight: '600',
    color: '#212121',
    letterSpacing: 0.25,
    marginTop: 0,
  },
  summaryContainer: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#212121',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginLeft: 20,
  },
  readButton: {
    backgroundColor: '#3ECCB4',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    width: '70%',
    alignSelf: 'center',
  },
  readButtonBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 20,
    fontFamily: 'baloo',
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  favoriteButtonActive: {
    color: '#FF4081',
  },
  favoriteCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteCircleActive: {
    backgroundColor: '#FFE6EC',
    borderWidth: 1,
    borderColor: '#FF9DB3'
  },
  favoriteIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  favoriteIconActive: {
    tintColor: '#FF5C8A'
  },
});