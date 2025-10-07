import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
// TODO: Backend bağlantısı yapıldığında aktif edilecek
// import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// import { fetchGuideContent } from '../../store/guideSlice';
// import { AppDispatch } from '../../store/store';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Category, Story } from '../../types';
import { api, bookService } from '../../services/api';

export default function HomeScreen() {
  // const dispatch = useDispatch<AppDispatch>();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Kullanıcı bilgisini global store'dan al
  const user = useSelector((state: any) => state.auth?.user);

  // TODO: Backend bağlantısı yapıldığında aktif edilecek
  // const { stories, filteredStories, isLoading, error, didYouKnow } = useSelector((state: RootState) => state.story);

  useEffect(() => {
    fetchInitialData();
    fetchDidYouKnow();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Backend'den son eklenen kitapları çek
      const latest = await bookService.latest(8);
      // API BookHomeDto alanlarını UI Story tipine map'leyelim
      const mapped: Story[] = latest.map((b: any) => ({
        id: String(b.id),
        title: b.title,
        description: b.description || '',
        coverImage: { uri: b.coverImageURL } as any,
        author: (b.authors && b.authors.length > 0) ? (b.authors as string[]).join(', ') : '',
        category: b.category || '',
        readTime: b.readTime || 0,
        createdAt: b.createdAt || new Date().toISOString(),
        isLocked: false,
        chapters: b.chapters || 0,
        activities: b.activities || 0,
      }));

      setStories(mapped);
      setFilteredStories(mapped);

      // TODO: Backend bağlantısı yapıldığında aktif edilecek
      // setCategories([
      //   {
      //     id: '1',
      //     name: 'Macera',
      //     icon: '🗺️',
      //     description: 'Heyecan dolu hikayeler',
      //   },
      //   {
      //     id: '2',
      //     name: 'Fantastik',
      //     icon: '🦄',
      //     description: 'Hayal gücünü zorlayan hikayeler',
      //   },
      //   // Diğer kategoriler...
      // ]);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [didYouKnow, setDidYouKnow] = useState<string>('');
  const [didYouKnowImage, setDidYouKnowImage] = useState<string | null>(null);
  const [showFactModal, setShowFactModal] = useState(false);
  const fetchDidYouKnow = async () => {
    try {
      const url = '/DidYouKnow/random';
      console.log('[DidYouKnow][axios] GET', api.defaults.baseURL + url);
      const res = await api.get<string | { infoText?: string; InfoText?: string; info?: string; text?: string; imageURL?: string; ImageURL?: string; imageUrl?: string; ImageUrl?: string }>(url);
      const data = res.data as any;
      setDidYouKnow(
        typeof data === 'string'
          ? data
          : (data?.infoText || data?.InfoText || data?.info || data?.text || '')
      );
      const img = data?.imageURL || data?.ImageURL || data?.imageUrl || data?.ImageUrl || null;
      setDidYouKnowImage(img);
      console.log('[DidYouKnow][axios] OK');
    } catch (e: any) {
      const cfg = e?.config || {};
      const fullUrl = (cfg.baseURL || '') + (cfg.url || '');
      console.error('[DidYouKnow][axios] ERROR', {
        url: fullUrl,
        method: cfg.method,
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message,
      });
    }
  };

  const handleStoryPress = (storyId: string) => {
    router.push(`/story/${storyId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // TODO: Backend bağlantısı yapıldığında aktif edilecek
    // if (query.trim() === '') {
    //   dispatch(fetchStories());
    // } else {
    //   dispatch(searchStories(query));
    // }

    // Geçici olarak client-side arama
    if (query.trim() === '') {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(story =>
        story.title.toLowerCase().includes(query.toLowerCase()) ||
        story.author.toLowerCase().includes(query.toLowerCase()) ||
        story.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStories(filtered);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const CARD_WIDTH = 160;
  const SPACING = 5;

  const renderStoryCard = ({ item, index }: { item: Story; index: number }) => {
    const isActive = index === activeIndex;
    
    return (
      <TouchableOpacity
        style={[
          styles.storyCard,
          isActive && styles.activeStoryCard
        ]}
        onPress={() => handleStoryPress(item.id)}
      >
         <Image
           source={item.coverImage}
           style={styles.coverImage}
           resizeMode="cover"
         />
        <View style={styles.storyInfo}>
          <ThemedText style={[styles.storyTitle, isActive && styles.activeText]}>
            {item.title}
          </ThemedText>
          <ThemedText style={[styles.storyAuthor, isActive && styles.activeText]}>
            {item.author}
          </ThemedText>
          {/* <ThemedText style={styles.storyMeta}>
            {item.readTime} dk okuma süresi
          </ThemedText> */}
        </View>
      </TouchableOpacity>
    );
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + SPACING * 2));
    if (index >= 0 && index < stories.length) {
      setActiveIndex(index);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: CARD_WIDTH + SPACING * 2,
    offset: (CARD_WIDTH + SPACING * 2) * index,
    index,
  });

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <ThemedText style={styles.categoryIcon}>{item.icon}</ThemedText>
      <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>
            Merhaba, {user?.name || 'Misafir'}!
          </ThemedText>
          <ThemedText style={styles.subtitle}>Bugün ne okuyalım ?</ThemedText>
          <View style={styles.searchContainer}>
            
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="kitap ismi, yazar, kategori.."
                placeholderTextColor="#9C9C9C"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <Image
                source={require('../../assets/images/search-icon.png')}
                style={styles.searchIcon}
              />
            </View>
            <TouchableOpacity
              style={styles.guideButton}
              // TODO: Backend bağlantısı yapıldığında aktif edilecek
              onPress={() => router.replace('../guide')}
              // onPress={() => {
              //   dispatch(fetchGuideContent())
              //     .unwrap()
              //     .then(() => router.replace('../guide'))
              //     .catch((error) => {
              //       console.error('Kılavuz yüklenirken hata:', error);
              //     });
              // }}
            >
              <View style={styles.guideWrapper}>
                <Image
                  source={require('../../assets/images/kılavuz-elips.png')}
                  style={styles.guideEllipse}
                  resizeMode="contain"
                />
                <Image
                  source={require('../../assets/images/guide-icon.png')}
                  style={styles.guideIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Kategoriler</ThemedText>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoryList}
          />
        </View> */}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {searchQuery ? 'Arama Sonuçları' : 'Yeni Hikayeler'}
          </ThemedText>
          {searchQuery ? (
            <View style={styles.searchResultsList}>
              {filteredStories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.searchStoryCard}
                  onPress={() => handleStoryPress(item.id)}
                >
                  <Image
                    source={item.coverImage}
                    style={styles.searchCoverImage}
                    resizeMode="cover"
                  />
                  <View style={styles.searchStoryInfo}>
                    <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.storyAuthor}>{item.author}</ThemedText>
                  
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={filteredStories}
              renderItem={renderStoryCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.storyList,
                { paddingHorizontal: (SPACING * 2) }
              ]}
              onScroll={handleScroll}
              snapToInterval={CARD_WIDTH + SPACING * 2}
              snapToAlignment="start"
              decelerationRate="fast"
              getItemLayout={getItemLayout}
              initialNumToRender={stories.length}
              maxToRenderPerBatch={stories.length}
            />
          )}
        </View>

        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.factCard}>
              <View style={styles.factContent}>
                <Image 
                  source={require('../../assets/images/Arty.png')}
                  style={styles.artyImage}
                  resizeMode="contain"
                />
                <View style={styles.factTextContainer}>
                  <ThemedText style={styles.factTitle}>
                    Bunu Biliyor Muydun?
                  </ThemedText>
                  <ThemedText style={styles.factText}>
                    {didYouKnow || '...'}
                  </ThemedText>
                  <TouchableOpacity 
                    style={styles.readMoreButton}
                    onPress={() => setShowFactModal(true)}
                  >
                    <ThemedText style={styles.readMoreText}>DEVAMINI OKU</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* Bottom Sheet Modal - Bunu Biliyor Muydun? */}
        <Modal
          transparent
          animationType="slide"
          visible={showFactModal}
          onRequestClose={() => setShowFactModal(false)}
        >
          <View style={styles.sheetOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setShowFactModal(false)} style={styles.sheetCloseBtn}>
                  <Image source={require('../../assets/images/cancel-buton.png')} style={styles.sheetCloseIcon} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.sheetContent}>
                <Image source={didYouKnowImage ? { uri: didYouKnowImage } : require('../../assets/images/Arty.png')} style={styles.sheetImage} resizeMode="cover" />
                <ThemedText style={styles.sheetTitle}>BUNU BİLİYOR MUYDUN?</ThemedText>
                <ThemedText style={styles.sheetParagraph}>{didYouKnow || '...'}</ThemedText>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#9C9C9C', // FF9C9C9C
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingRight: 30, // İkon için yer bırak
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 15,
  },
  guideButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  guideEllipse: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  guideIcon: {
    width: 20,
    height: 20,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    width: 100,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
  },
  storyList: {
    paddingHorizontal: 15,
  },
  searchResultsList: {
    paddingHorizontal: 15,
  },
  searchStoryCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchCoverImage: {
    width: 100,
    height: 140,
  },
  searchStoryInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  storyCard: {
    width: 160,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    transform: [{ scale: 0.95 }],
  },
  activeStoryCard: {
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    transform: [{ scale: 1 }],
  },
  activeText: {
    // Renk değiştirmiyoruz; sadece vurguyu boyut/gölge ile veriyoruz
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  storyInfo: {
    padding: 10,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#212121',
  },
  storyAuthor: {
    fontSize: 14,
    color: '#9C9C9C',
    marginBottom: 4,
  },
  storyMeta: {
    fontSize: 12,
    color: '#999',
  },
  factCard: {
    backgroundColor: '#F3F3F3',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  factContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  artyImage: {
    width: 130,
    height: 130,
    marginTop: -60,
  },
  factTextContainer: {
    flex: 1,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  factText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#666',
    marginBottom: 10,
  },
  readMoreButton: {
    backgroundColor: '#3ECC9C',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignSelf: 'center',
    minWidth: 240,
    alignItems: 'center',
    marginLeft: -150,
    marginTop: 15,
  },
  readMoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#F3F3F3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '95%',
    overflow: 'hidden',
  },
  sheetHeader: {
    alignItems: 'flex-start',
    padding: 12,
  },
  sheetCloseBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCloseIcon: { width: 20, height: 20, resizeMode: 'contain' },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sheetImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  sheetParagraph: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  sheetSubTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  sheetBulletList: {
    gap: 6,
    marginBottom: 12,
  },
  sheetBullet: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});