import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { bookService } from '../services/api';

interface ReadingProgress {
  story: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    author: string;
    category: string;
    readTime: number;
    createdAt: string;
    isLocked: boolean;
  };
  currentPage: number;
  lastReadAt: string;
  progress: number;
}

export default function ContinueReadingScreen() {
  const [continueReading, setContinueReading] = useState<ReadingProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContinueReading();
  }, []);

  const fetchContinueReading = async () => {
    try {
      setIsLoading(true);
      const childId = 1; // TODO: Gerçek childId'yi al
      const inProgress = await bookService.inProgressByChild(childId);

      const mapped: ReadingProgress[] = (inProgress || []).map((b: any) => ({
        story: {
          id: String(b.bookId || b.BookId || b.id || b.Id),
          title: b.title || b.Title || '',
          description: '',
          coverImage: b.coverImageURL || b.CoverImageURL || '',
          author: (b.authorNames || b.AuthorNames || [])[0] || '',
          category: '',
          readTime: 0,
          createdAt: new Date().toISOString(),
          isLocked: false,
        },
        currentPage: b.currentPageNumber || b.CurrentPageNumber || 0,
        lastReadAt: new Date().toISOString(),
        progress: Math.round(b.readingProgressPercentage ?? b.ReadingProgressPercentage ?? b.progressPercentage ?? b.ProgressPercentage ?? 0),
      }));

      setContinueReading(mapped);
    } catch (error) {
      console.error('Devam eden kitaplar yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryPress = (storyId: string) => {
    router.push(`/reading/${storyId}`);
  };

  const renderContinueReadingItem = (item: ReadingProgress) => (
    <TouchableOpacity
      key={item.story.id}
      style={styles.continueCard}
      onPress={() => handleStoryPress(item.story.id)}
    >
      <Image source={{ uri: item.story.coverImage }} style={styles.continueCardImage} />
      <View style={styles.continueCardInfo}>
        <View>
          <Text style={styles.continueCardTitle}>{item.story.title}</Text>
          <Text style={styles.continueCardAuthor}>{item.story.author}</Text>
        </View>
        <View style={styles.progressWrapper}>
          <Text style={styles.progressText}>%{item.progress}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
          </View>
        </View>
      </View>
      <View style={styles.continueCardActions}>
        <TouchableOpacity>
          <Image source={require('../assets/images/cancel-buton.png')} style={styles.cancelIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.continueButtonText}>DEVAM ET</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3ECCB4" />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Image source={require('../assets/images/geri-buton.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Başlık */}
          <View style={styles.titleSection}>
            <ThemedText style={styles.title}>Devam Eden Hikayeler</ThemedText>
          </View>

          {/* Çizgi */}
          <View style={styles.divider} />

          {/* Kitaplar Listesi */}
          <View style={styles.booksSection}>
            {continueReading.length > 0 ? (
              continueReading.map(item => renderContinueReadingItem(item))
            ) : (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateText}>
                  Henüz devam eden hikayeniz bulunmuyor.
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(26, 26, 26, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  booksSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  continueCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(26, 26, 26, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  continueCardImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  continueCardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  continueCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  continueCardAuthor: {
    fontSize: 12,
    color: '#9C9C9C',
    marginBottom: 8,
  },
  progressWrapper: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3ECCB4',
    borderRadius: 3,
  },
  continueCardActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  cancelIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  continueButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3ECCB4',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9C9C9C',
    textAlign: 'center',
  },
});
