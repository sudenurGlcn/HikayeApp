import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { AppDispatch } from '../../store/store';

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  // TODO: Backend bağlantısı yapıldığında aktif edilecek
  // const { currentBlog: blog, isLoading, error } = useSelector((state: RootState) => state.story);
  const [blog, setBlog] = React.useState({
    id: '1',
    title: 'Balina İletişimi ve Yapay Zeka',
    summary: 'Bilim insanları balınaların konuşmalarını anlamak için yapay zekâdan yardım alıyor.',
    content: `Balina iletişimi, deniz biyologlarının uzun zamandır üzerinde çalıştığı gizemli bir konu. Son yıllarda yapay zeka teknolojisindeki gelişmeler, bu gizemli dili çözme konusunda umut verici sonuçlar ortaya koyuyor.

Araştırmacılar, derin öğrenme algoritmalarını kullanarak balina seslerini analiz ediyor ve farklı ses kalıplarını sınıflandırıyor. Bu sayede balinaların hangi durumlarda nasıl iletişim kurduğunu daha iyi anlayabiliyoruz.

Yapay zeka, sadece sesleri sınıflandırmakla kalmıyor, aynı zamanda bu seslerin olası anlamlarını da tahmin etmeye çalışıyor. Örneğin, tehlike durumlarında çıkarılan sesler, sosyal etkileşim sırasında kullanılan sesler ve yön bulma sırasında çıkarılan sesler arasındaki farkları tespit edebiliyor.

Bu araştırmalar, sadece balina iletişimini anlamak için değil, aynı zamanda deniz ekosistemini korumak için de önemli. Balinaların davranışlarını ve iletişim şekillerini daha iyi anlayarak, onları tehdit eden faktörlere karşı daha etkili koruma yöntemleri geliştirebiliriz.`,
     image: require('../../assets/images/Arty.png'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    readTime: 5,
    author: 'Dr. Deniz Yılmaz',
    tags: ['Bilim', 'Teknoloji', 'Deniz Yaşamı'],
  });

  React.useEffect(() => {
    // TODO: Backend bağlantısı yapıldığında aktif edilecek
    // dispatch(fetchBlogDetail(id as string));
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

  if (!blog) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Blog Resmi */}
        <View style={styles.imageContainer}>
          <Image source={blog.image} style={styles.coverImage} resizeMode="cover" />
        </View>

        {/* Blog Başlığı ve Meta Bilgiler */}
        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>{blog.title}</ThemedText>
          
          <View style={styles.metaContainer}>
            <ThemedText style={styles.author}>{blog.author}</ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.readTime}>{blog.readTime} dk okuma</ThemedText>
          </View>

          <View style={styles.tagsContainer}>
            {blog.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>

          {/* Blog İçeriği */}
          <ThemedText style={styles.content}>{blog.content}</ThemedText>
        </View>
      </ScrollView>
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
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
  dot: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  readTime: {
    fontSize: 16,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
