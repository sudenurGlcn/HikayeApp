// import React from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import { ThemedText } from '../../components/themed-text';
// import { ThemedView } from '../../components/themed-view';

// export default function GuideScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <View style={styles.header}>
//         <ThemedText style={styles.title}>Nasıl Kullanılır?</ThemedText>
//       </View>
      
//       <ScrollView style={styles.content}>
//         <View style={styles.section}>
//           <ThemedText style={styles.sectionTitle}>1. Hikaye Okuma</ThemedText>
//           <ThemedText style={styles.sectionText}>
//             • Anasayfada bulunan hikaye kartlarına tıklayarak hikayeleri okuyabilirsiniz.{'\n'}
//             • Her hikayenin tahmini okuma süresi belirtilmiştir.{'\n'}
//             • Hikayeyi okurken ekranı yukarı-aşağı kaydırarak ilerleyebilirsiniz.
//           </ThemedText>
//         </View>

//         <View style={styles.section}>
//           <ThemedText style={styles.sectionTitle}>2. Kategoriler</ThemedText>
//           <ThemedText style={styles.sectionText}>
//             • Hikayeleri kategorilere göre filtreleyebilirsiniz.{'\n'}
//             • Her kategori farklı bir tema ve türde hikayeler içerir.{'\n'}
//             • Kategoriye tıklayarak o kategorideki tüm hikayeleri görebilirsiniz.
//           </ThemedText>
//         </View>

//         <View style={styles.section}>
//           <ThemedText style={styles.sectionTitle}>3. Arama Yapma</ThemedText>
//           <ThemedText style={styles.sectionText}>
//             • Üst kısımdaki arama çubuğunu kullanarak hikayelerde arama yapabilirsiniz.{'\n'}
//             • Hikaye adı, yazar adı veya açıklamaya göre arama yapabilirsiniz.{'\n'}
//             • Arama sonuçları anında görüntülenir.
//           </ThemedText>
//         </View>

//         <View style={styles.section}>
//           <ThemedText style={styles.sectionTitle}>4. Kütüphane</ThemedText>
//           <ThemedText style={styles.sectionText}>
//             • Beğendiğiniz hikayeleri kütüphanenize ekleyebilirsiniz.{'\n'}
//             • Kütüphanenize eklediğiniz hikayelere çevrimdışıyken de erişebilirsiniz.{'\n'}
//             • Kütüphanenizi düzenlemek için hikayeleri silebilir veya kategorize edebilirsiniz.
//           </ThemedText>
//         </View>

//         <View style={styles.section}>
//           <ThemedText style={styles.sectionTitle}>5. Profil</ThemedText>
//           <ThemedText style={styles.sectionText}>
//             • Profil bölümünden hesap ayarlarınızı yönetebilirsiniz.{'\n'}
//             • Okuma istatistiklerinizi görüntüleyebilirsiniz.{'\n'}
//             • Uygulama tercihlerinizi değiştirebilirsiniz.
//           </ThemedText>
//         </View>
//       </ScrollView>
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
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   section: {
//     marginBottom: 25,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#007AFF',
//   },
//   sectionText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#333',
//   },
// });
import React, { useState } from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    SafeAreaView,
    LayoutAnimation,
    UIManager,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Veya @expo/vector-icons

// Android'de LayoutAnimation'ı etkinleştirmek için
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Kılavuz verilerini daha yönetilebilir bir formatta tutalım
const GUIDE_SECTIONS = [
    {
        category: 'YAPAY ZEKA',
        items: [
            {
                title: 'YAPAY ZEKA NEDİR?',
                content: 'Yapay zeka, bilgisayarların akıllıymış gibi düşünmesini sağlar. Ona bir şey söylediğinde seni anlar ve sana yardım eder.'
            },
            {
                title: 'PROMPT NASIL YAZILIR?',
                content: 'Prompt, yapay zekaya verdiğimiz yönerge veya sorudur. Yani ona ne yapmasını istediğimizi söylediğimiz cümle. Yapay zekaya "Bana bir kedi resmi çiz" dersen, bu bir prompt olur.'
            },
        ],
    },
    {
        category: 'EBEVEYNLER İÇİN',
        items: [
            {
                title: 'YAPAY ZEKA ****DA NASIL KULLANILIYOR?',
                content: 'Bu bölümde ebeveynlere yönelik yapay zeka kullanımı hakkında bilgiler yer alacaktır.'
            },
            {
                title: 'VERİLER VE GÜVENLİK',
                content: 'Bu bölümde verilerin nasıl kullanıldığı ve güvenliğin nasıl sağlandığı hakkında bilgiler yer alacaktır.'
            },
        ],
    },
];


// Tek bir açılır-kapanır kutucuk bileşeni
const AccordionItem = ({ title, content, isOpen, onPress }) => {
    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity style={styles.accordionHeader} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.accordionTitle}>{title}</Text>
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#D0D0D0" />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.accordionContent}>
                    <Text style={styles.accordionContentText}>{content}</Text>
                </View>
            )}
        </View>
    );
};

export default function GuideScreen() {
    // Hangi kutucuğun açık olduğunu tutmak için state
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (title: string) => {
        // Animasyon ekleyelim
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // Tıklanan kutucuk zaten açıksa kapat, değilse aç
        setOpenSection(openSection === title ? null : title);
    };

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Alanı */}
                <View style={styles.headerBox}>
                  <ImageBackground
                    source={require('../../assets/images/guide-cloud.png')}
                    style={styles.headerBg}
                    imageStyle={styles.headerBgImage}
                    resizeMode="contain"
                  >
                  <View style={styles.header}>
                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                          try {
                            if (navigation?.canGoBack && navigation.canGoBack()) {
                              navigation.goBack();
                            } else {
                              router.replace('/(tabs)/home');
                            }
                          } catch {
                            router.replace('/(tabs)/home');
                          }
                        }}
                      >
                          <Image source={require('../../assets/images/geri-buton.png')} style={styles.backImage} />
                      </TouchableOpacity>
                  </View>
                  </ImageBackground>
                </View>
                
                {/* Ana Başlık */}
                <Text style={styles.mainTitle}>KILAVUZ</Text>
                <View style={styles.titleDivider} />

                {/* Açılır Kapanır Bölümler */}
                {GUIDE_SECTIONS.map((section, index) => (
                    <View key={index} style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>{section.category}</Text>
                        {section.items.map((item) => (
                            <AccordionItem
                                key={item.title}
                                title={item.title}
                                content={item.content}
                                isOpen={openSection === item.title}
                                onPress={() => toggleSection(item.title)}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7', // Tasarımdaki genel arka plan rengi
    },
    container: {
        flex: 1,
    },
    // Header Styles
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    // overlayCard kaldırıldı
    headerBox: {
        backgroundColor: '#E6F5F8',
        marginHorizontal: 0,
        marginTop: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingTop: 0,
        paddingBottom: 24,
        minHeight: 300,
        position: 'relative',
        overflow: 'hidden',
        // gölge/border kaldırıldı
        elevation: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        borderBottomWidth: 0,
    },
    headerBg: {
        width: '100%',
        minHeight: 300,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerBgImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        zIndex: 2,
    },
    backImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
        marginLeft: 5,
    },
    speechBubble: {
        backgroundColor: '#E0F2FE', // Açık mavi tonu
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        width: '100%',
    },
    speechBubbleTransparent: {
        backgroundColor: 'rgba(230, 245, 248, 0.55)',
        borderRadius: 12,
        padding: 12,
        width: '100%',
    },
    speechBubbleText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        lineHeight: 20,
    },
    headerImage: {
        // Artık ImageBackground kullanılıyor; bu stil rezerve bırakıldı
        width: '100%',
        height: '100%',
    },
    // Main Content Styles
    mainTitle: {
        fontSize: 18,
        fontFamily: 'baloo',
        fontWeight: '400',
        color: '#9C9C9C', // Koyu Gri
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    titleDivider: {
        height: 2,
        backgroundColor: '#9C9C9C',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 2,
    },
    categoryContainer: {
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    categoryTitle: {
        fontFamily: 'baloo',
        fontSize: 18,
        fontWeight: '400',
        color: '#212121', // SiyahmzBu
        marginBottom: 10,
    },
    // Accordion Styles
    accordionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 10,
        overflow: 'hidden', // İçerik taşmasını engellemek için
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 15,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1, // Uzun başlıkların ikondan önce sığmasını sağlar
    },
    accordionContent: {
        backgroundColor: '#FFFFFF', // Açık yeşilimsi yerine beyaz arka plan
        padding: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    accordionContentText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'baloo',
        fontWeight: '400',
        color: '#9C9C9C', // Koyu gri
        letterSpacing: 0.25,
    },
});