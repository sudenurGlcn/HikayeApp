import { default as React } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text // Text bileşenini import ediyoruz
  ,

























  TouchableOpacity,
  View
} from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

const windowWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  // Not: user ve dispatch kancalarını kullanmadığınız için geçici olarak yorum satırına aldım.
  // İhtiyaç duyduğunuzda aktif edebilirsiniz.
  // const dispatch = useDispatch();
  // const user = useSelector((state: any) => state.auth.user);

  const user = { name: 'Ceren Nur' }; // Örnek kullanıcı verisi

  const stats = {
    seviye: 2,
    alishtirma: 21,
    kitap: 14,
    currentLevelProgress: 2,
    levelGoal: 10,
    currentLevel: 3,
  };
  const booksLeft = stats.levelGoal - stats.currentLevelProgress;

  const achievements = [
    {
      title: 'Dikkatli Okur',
      date: '28 Eylül 2025',
      image: require('../../assets/images/dikkatli-okur.png'), // Resim yolunu güncelleyin
    },
    {
      title: 'Sabah Okuru',
      date: '28 Eylül 2024',
      image: require('../../assets/images/sabah-okuru.png'), // Resim yolunu güncelleyin
    },
    {
      title: 'Dedektif',
      date: '28 Eylül 2024',
      image: require('../../assets/images/dedektif.png'), // Resim yolunu güncelleyin
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
         {/* Ayarlar İkonu */}
         <TouchableOpacity style={styles.settingsButton}>
             <Image 
                source={require('../../assets/images/ayarlar.png')}
                style={styles.settingsIcon}
             />
         </TouchableOpacity>

        {/* Profil Bilgileri Alanı */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/profilAvatar.png')} // Profil resmi yolunu güncelleyin
              style={styles.avatar}
            />
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
          <ThemedText style={styles.userName}>{user?.name || 'Ceren Nur'}</ThemedText>
          <ThemedText style={styles.userHandle}>@ceren07</ThemedText>

           {/* İlerleme Çubuğu */}
           <View style={styles.progressInfoContainer}>
              <ThemedText style={styles.progressTextRight}>{stats.currentLevel}. seviye</ThemedText>
           </View>
           <View style={styles.progressBarBackground}>
               <View style={[styles.progressBarFill, { width: `${(stats.currentLevelProgress / stats.levelGoal) * 100}%` }]} />
           </View>
           <View style={styles.progressBottomContainer}>
              <ThemedText style={styles.progressTextLeft}>{stats.currentLevelProgress}/{stats.levelGoal}</ThemedText>
              <ThemedText style={styles.booksLeftText}>{booksLeft} kitap kaldı</ThemedText>
           </View>
        </View>

        {/* Genel Bakış Bölümü */}
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>GENEL BAKIŞ</ThemedText>
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <ThemedText style={styles.statValue}>{stats.seviye}</ThemedText>
                    <ThemedText style={styles.statLabel}>seviye</ThemedText>
                </View>
                 <View style={styles.statCard}>
                    <ThemedText style={styles.statValue}>{stats.alishtirma}</ThemedText>
                    <ThemedText style={styles.statLabel}>Alıştırma</ThemedText>
                </View>
                 <View style={styles.statCard}>
                    <ThemedText style={styles.statValue}>{stats.kitap}</ThemedText>
                    <ThemedText style={styles.statLabel}>kitap</ThemedText>
                </View>
            </View>
        </View>

        {/* Başarımlar Bölümü */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>BAŞARIMLAR</ThemedText>
            <TouchableOpacity onPress={() => {}}>
              <ThemedText style={styles.seeAllButton}>TÜMÜNÜ GÖR</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Image source={achievement.image} style={styles.achievementImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Arka plan rengini beyaz yaptık
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 10,
  },
   settingsIcon: {
       width: 24,
       height: 24,
       resizeMode: 'contain',
   },
  profileSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
   avatarContainer: {
     width: 120,
     height: 120,
     borderRadius: 60,
     backgroundColor: '#E0EFFF',
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 15,
     position: 'relative',
   },
  avatar: {
    width: '95%',
    height: '95%',
    borderRadius: 60,
  },
   proBadge: {
     position: 'absolute',
     top: 5,
     right: -5,
     backgroundColor: '#3ECC9C', // Canlı yeşil renk [[memory:9440910]]
     borderRadius: 12,
     paddingHorizontal: 8,
     paddingVertical: 3,
     borderWidth: 2,
     borderColor: '#FFFFFF',
   },
  proText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userHandle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    marginBottom: 20,
  },
   progressInfoContainer: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     width: '100%',
     paddingHorizontal: 5,
     marginBottom: 5,
   },
   progressBottomContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     width: '100%',
     paddingHorizontal: 5,
     marginTop: 5,
   },
   progressTextLeft: {
       color: '#9C9C9C',
       fontSize: 12,
   },
   progressTextRight: {
       color: '#9C9C9C',
       fontSize: 12,
       fontWeight: '600'
   },
   progressBarBackground: {
     height: 10,
     width: '100%',
     backgroundColor: '#D2F8EB',
     borderRadius: 5,
   },
   progressBarFill: {
     height: '100%',
     backgroundColor: '#3ECC9C', // Canlı yeşil renk [[memory:9440910]]
     borderRadius: 5,
   },
   booksLeftText: {
       color: '#9C9C9C',
       fontSize: 12
   },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
   sectionTitle: {
     fontSize: 18,
     fontFamily: 'Baloo-Regular', // Font ailesini projeye eklemeniz gerekecek
     fontWeight: '400',
     color: '#212121', // Başlıklar için siyah renk [[memory:9441308]]
   },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingVertical: 15,
      width: (windowWidth - 80) / 3, // Kartlar arası boşlukları hesaba katarak
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
  },
   statValue: {
       fontSize: 22,
       fontWeight: 'bold',
       color: '#3ECC9C' // Canlı yeşil renk [[memory:9440910]]
   },
  statLabel: {
      fontSize: 14,
      color: '#777',
      marginTop: 4,
  },
   seeAllButton: {
     fontSize: 18,
     color: '#3ECC9C', // Canlı yeşil renk [[memory:9440910]]
     fontWeight: '600',
     fontFamily: 'Baloo2-Regular', // Font ailesini projeye eklemeniz gerekecek
     textAlign: 'right',
   },
  achievementsContainer: {
    paddingVertical: 0,
    paddingRight: 0,
    paddingLeft: 20,
  },
  achievementCard: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
    width: 180,
    height: 180,
    marginRight: 2,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  achievementImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // Caption kaldırıldı
});