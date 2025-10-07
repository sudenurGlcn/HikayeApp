import { router } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     FlatList,
//     Image,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { ThemedText } from '../../components/themed-text';
// import { ThemedView } from '../../components/themed-view';
// import { ReadingProgress, Story, UserLibrary } from '../../types';

// type TabType = 'continue' | 'finished' | 'favorites';

// export default function LibraryScreen() {
//   const [activeTab, setActiveTab] = useState<TabType>('continue');
//   const [library, setLibrary] = useState<UserLibrary>({
//     continueReading: [],
//     finished: [],
//     favorites: [],
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchUserLibrary();
//   }, []);

//   const fetchUserLibrary = async () => {
//     try {
//       setIsLoading(true);
//       // TODO: Backend bağlantısı yapıldığında aktif edilecek
//       // const data = await storyService.getUserLibrary();
//       // setLibrary(data);

//       // Geçici mock data
//       setLibrary({
//         continueReading: [
//           {
//             story: {
//               id: '1',
//               title: 'Küçük Prens',
//               description: 'Evrensel bir klasik...',
//               coverImage: 'https://example.com/image.jpg',
//               author: 'Antoine de Saint-Exupéry',
//               category: 'Klasik',
//               readTime: 30,
//               createdAt: new Date().toISOString(),
//               isLocked: false,
//             },
//             currentPage: 15,
//             lastReadAt: new Date().toISOString(),
//             progress: 45,
//           },
//         ],
//         finished: [],
//         favorites: [],
//       });
//     } catch (error) {
//       console.error('Kütüphane verisi çekme hatası:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStoryPress = (storyId: string) => {
//     router.push(`/story/${storyId}`);
//   };

//   const renderContinueReadingItem = ({ item }: { item: ReadingProgress }) => (
//     <TouchableOpacity
//       style={styles.storyCard}
//       onPress={() => handleStoryPress(item.story.id)}
//     >
//       <Image
//         source={{ uri: item.story.coverImage }}
//         style={styles.coverImage}
//         resizeMode="cover"
//       />
//       <View style={styles.storyInfo}>
//         <ThemedText style={styles.storyTitle}>{item.story.title}</ThemedText>
//         <ThemedText style={styles.storyAuthor}>{item.story.author}</ThemedText>
//         <View style={styles.progressContainer}>
//           <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
//           <ThemedText style={styles.progressText}>{item.progress}%</ThemedText>
//         </View>
//         <ThemedText style={styles.lastRead}>
//           Son okuma: {new Date(item.lastReadAt).toLocaleDateString('tr-TR')}
//         </ThemedText>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderStoryItem = ({ item }: { item: Story }) => (
//     <TouchableOpacity
//       style={styles.storyCard}
//       onPress={() => handleStoryPress(item.id)}
//     >
//       <Image
//         source={{ uri: item.coverImage }}
//         style={styles.coverImage}
//         resizeMode="cover"
//       />
//       <View style={styles.storyInfo}>
//         <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
//         <ThemedText style={styles.storyAuthor}>{item.author}</ThemedText>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//         </View>
//       );
//     }

//     switch (activeTab) {
//       case 'continue':
//         return (
//           <FlatList
//             data={library.continueReading}
//             renderItem={renderContinueReadingItem}
//             keyExtractor={(item) => item.story.id}
//             contentContainerStyle={styles.list}
//           />
//         );
//       case 'finished':
//         return (
//           <FlatList
//             data={library.finished}
//             renderItem={renderStoryItem}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={styles.list}
//           />
//         );
//       case 'favorites':
//         return (
//           <FlatList
//             data={library.favorites}
//             renderItem={renderStoryItem}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={styles.list}
//           />
//         );
//     }
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <View style={styles.header}>
//         <ThemedText style={styles.title}>Kütüphanem</ThemedText>
//       </View>

//       <View style={styles.tabs}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'continue' && styles.activeTab]}
//           onPress={() => setActiveTab('continue')}
//         >
//           <ThemedText style={styles.tabText}>Devam Ediyor</ThemedText>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'finished' && styles.activeTab]}
//           onPress={() => setActiveTab('finished')}
//         >
//           <ThemedText style={styles.tabText}>Tamamlanan</ThemedText>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
//           onPress={() => setActiveTab('favorites')}
//         >
//           <ThemedText style={styles.tabText}>Favoriler</ThemedText>
//         </TouchableOpacity>
//       </View>

//       {renderContent()}
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     paddingTop: 40,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   tabs: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#007AFF',
//   },
//   tabText: {
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   list: {
//     padding: 20,
//   },
//   storyCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 15,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   coverImage: {
//     width: 100,
//     height: 150,
//   },
//   storyInfo: {
//     flex: 1,
//     padding: 15,
//   },
//   storyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   storyAuthor: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   progressContainer: {
//     height: 20,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 5,
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: '#4CAF50',
//   },
//   progressText: {
//     position: 'absolute',
//     width: '100%',
//     textAlign: 'center',
//     lineHeight: 20,
//     fontSize: 12,
//     color: '#000',
//   },
//   lastRead: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 5,
//   },
// });
import React, { useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
// Kendi projenizdeki doğru yoldan import ettiğinizden emin olun
import { ReadingProgress, Story, UserLibrary } from '../../types'; 
import { bookService, categoryService } from '../../services/api';

// Öneri kitapları için Story tipini de içerecek şekilde UserLibrary tipini genişletelim
interface ExtendedUserLibrary extends UserLibrary {
    recommendations: Story[];
}

// Kategoriler için bir tip oluşturalım
interface Category {
    id: string;
    name: string;
    icon: any; // ImageSource olarak require() döner
}


// Dinamik kategoriler backend'den gelecek
// const CATEGORIES: Category[] = [ ... ]

export default function LibraryScreen() {
    const [library, setLibrary] = useState<ExtendedUserLibrary>({
        continueReading: [],
        finished: [],
        favorites: [],
        recommendations: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('tumu');
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryBooks, setCategoryBooks] = useState<Story[]>([]);

    // Favoriler için varsayılan icon ekle
    const getCategoryIcon = (categoryName: string): any => {
        const name = categoryName.toLowerCase();
        const iconMap: { [key: string]: any } = {
            'hayvanlar': require('../../assets/images/hayvanlar.png'),
            'klasikler': require('../../assets/images/klasikler.png'),
            'macera': require('../../assets/images/macera.png'),
            'sihirli': require('../../assets/images/sihirli.png'),
            'mizah': require('../../assets/images/mizah.png'),
            'gizem': require('../../assets/images/gizem.png'),
            'dedektif': require('../../assets/images/dedektif.png'),
            'yaşam': require('../../assets/images/yasam.png'),
            'yaşam hikayesi': require('../../assets/images/yasam.png'),
            'analiz': require('../../assets/images/Analiz.png'),
            'favoriler': require('../../assets/images/favori-kategoriler.png'),
        };
        return iconMap[name] || require('../../assets/images/tumu.png');
    };

    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryService.all();
            const mapped: Category[] = (res || []).map((c: any) => ({
                id: String(c.id || c.Id),
                name: c.categoryName || c.CategoryName || '',
                icon: getCategoryIcon(c.categoryName || c.CategoryName || ''),
            }));
            // "Tümü" ve "Favoriler" sanal kategorilerini başa ekle
            setCategories([
                { id: 'tumu', name: 'Tümü', icon: require('../../assets/images/tumu.png') },
                { id: 'favoriler', name: 'Favoriler', icon: require('../../assets/images/favori-kategoriler.png') },
                ...mapped,
            ]);
        } catch (e) {
            console.error('Kategoriler alınamadı:', e);
            // Hata durumunda en azından Tümü göster
            setCategories([{ id: 'tumu', name: 'Tümü', icon: require('../../assets/images/tumu.png') }]);
        }
    }, []);

    const fetchUserLibrary = useCallback(async () => {
        try {
            setIsLoading(true);
            // Geçici: childId sabit; auth/child seçiminden bağlanabilir
            const childId = 1;
            const inProgress = await bookService.inProgressByChild(childId);

            const continueReading: ReadingProgress[] = (inProgress || []).map((b: any) => ({
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

            setLibrary((prev) => ({
                ...prev,
                continueReading,
            }));
        } catch (error) {
            console.error('Kütüphane verisi çekme hatası:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCategoryBooks = useCallback(async () => {
        try {
            setIsLoading(true);
            const childId = 1;

            let books: any[] = [];

            if (selectedCategory === 'tumu') {
                books = await bookService.latest(20);
            } else if (selectedCategory === 'favoriler') {
                books = await bookService.favoritesByChild(childId);
            } else {
                // Backend'ten gelen kategori ID'sini kullan
                const category = categories.find(c => c.id === selectedCategory);
                if (category && category.id !== 'tumu' && category.id !== 'favoriler') {
                    const categoryId = Number(category.id);
                    books = await bookService.byCategory(categoryId);
                }
            }

            // Boş array geldiyse veya null/undefined ise boş liste olarak ayarla
            if (!books || !Array.isArray(books) || books.length === 0) {
                setCategoryBooks([]);
                return;
            }

            const mapped: Story[] = books.map((b: any) => ({
                id: String(b.bookId || b.BookId || b.id || b.Id),
                title: b.title || b.Title || '',
                description: '',
                coverImage: b.coverImageURL || b.CoverImageURL || '',
                author: (b.authorNames || b.AuthorNames || [])[0] || '',
                category: '',
                readTime: 0,
                createdAt: new Date().toISOString(),
                isLocked: false,
            }));

            setCategoryBooks(mapped);
        } catch (error) {
            // Hata durumunda boş liste ayarla, kullanıcıya hata mesajı verme
            console.log('Kategori için kitap bulunamadı:', selectedCategory);
            console.error('Kategori için kitap bulunamadı:', error);
            setCategoryBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, categories]);

    useEffect(() => {
        fetchUserLibrary();
        fetchCategories();
    }, [fetchUserLibrary, fetchCategories]);

    useEffect(() => {
        if (categories.length > 0) {
            fetchCategoryBooks();
        }
    }, [selectedCategory, categories, fetchCategoryBooks]);

    const handleStoryPress = (storyId: string) => {
        router.push(`/story/${storyId}`);
    };

    // OKUMAYA DEVAM ET KARTI
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
                    <Image source={require('../../assets/images/cancel-buton.png')} style={styles.cancelIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.continueButtonText}>DEVAM ET</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // KATEGORİ FİLTRESİ
    const renderCategoryItem = ({ item }: { item: Category }) => {
        const isSelected = selectedCategory === item.id;
        return (
            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(item.id)}
            >
                <View style={[styles.categoryIconContainer, isSelected && styles.categoryIconSelected]}>
                    <Image source={item.icon} style={styles.categoryIconImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
        );
    };
    
    // NE OKUSAM KARTI (GRID)
    const renderRecommendationItem = ({ item }: { item: Story }) => (
         <TouchableOpacity
            style={styles.recommendationCard}
            onPress={() => handleStoryPress(item.id)}
        >
            <View style={styles.recommendationImageContainer}>
                <Image source={{ uri: item.coverImage }} style={styles.recommendationImage} resizeMode="cover"/>
            </View>
            <Text style={styles.recommendationTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00C49A" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    
                    
                    {/* --- OKUMAYA DEVAM ET BÖLÜMÜ --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>OKUMAYA DEVAM ET</Text>
                            <TouchableOpacity onPress={() => router.push('/continue-reading')}>
                                <Text style={styles.seeAllText}>TÜMÜNÜ GÖR</Text>
                            </TouchableOpacity>
                        </View>
                        {library.continueReading.slice(0, 2).map(item => renderContinueReadingItem(item))}
                    </View>

                    {/* --- NE OKUSAM? BÖLÜMÜ --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>NE OKUSAM?</Text>
                        </View>
                        <FlatList
                            data={categories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryList}
                        />
                        <FlatList
                            data={categoryBooks}
                            renderItem={renderRecommendationItem}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F3F3',
    },
    container: {
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
    },
    screenTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#888',
        textAlign: 'center',
        marginVertical: 15,
    },
    section: {
        marginTop: 10,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginTop: 80,
    },
    seeAllText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3ECCB4', // İstenen yeşil ton
        marginTop: 80,
    },
    // Continue Reading Card Styles
    continueCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        minHeight: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginTop: 10,
    },
    continueCardImage: {
        width: 70,
        height: 90,
        borderRadius: 8,
    },
    continueCardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between', // Dikeyde boşlukları dağıt
        paddingVertical: 2, // Dikeyde hafif boşluk
        alignSelf: 'stretch', // Kendisini ebeveynin yüksekliğine uzatmasını sağlar
    },
    continueCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    continueCardAuthor: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    progressWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
    },
    progressBarContainer: {
        width: '85%',
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginTop: 4,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#00C49A',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        fontWeight: 'bold'
    },
    continueCardActions: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        alignSelf: 'stretch', // Kendisini ebeveynin yüksekliğine uzatmasını sağlar
        paddingVertical: 2, // Dikeyde hafif boşluk
    },
    closeButton: {
        fontSize: 24,
        color: '#AAA',
        fontWeight: 'bold',
    },
    cancelIcon: {
        width: 16,
        height: 16,
    },
    continueButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00C49A',
    },
    // Category Filter Styles
    categoryList: {
        paddingVertical: 10,
        marginBottom: 15,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    categoryIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryIconSelected: {
        borderColor: '#00C49A',
        shadowColor: '#00C49A',
        shadowOpacity: 0.3,
    },
    categoryIcon: {
        fontSize: 32,
    },
    categoryIconImage: {
        width: 50,
        height: 50,
    },
    categoryName: {
        fontSize: 12,
        color: '#666',
    },
    // Recommendation Grid Styles
    recommendationCard: {
        width: '48%',
        marginBottom: 20,
    },
    recommendationImageContainer: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        backgroundColor: '#F3F3F3', 
    },
    recommendationImage: {
        width: '100%',
        aspectRatio: 2 / 3, 
        borderRadius: 12,
    },
    recommendationTitle: {
        marginTop: 35,
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        fontWeight: '500',
    },
});