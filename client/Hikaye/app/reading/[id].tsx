import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Image, Modal } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityScreen from '../../components/ActivityScreen';
import { bookService } from '../../services/api';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface Chapter {
  id: number;
  title: string;
  content: string;
  image: any;
}

export default function ReadingScreen() {
  const { id } = useLocalSearchParams();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showActivity, setShowActivity] = useState(false);
  const [pageText, setPageText] = useState<string>('');
  const [pageImage, setPageImage] = useState<string | null>(null);
  // const [pageId, setPageId] = useState<number | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string>('Günlük okuma limitine ulaştınız.');
  const [activityData, setActivityData] = useState<any | null>(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCantAccessScreen, setShowCantAccessScreen] = useState(false);

  useEffect(() => {
    const loadFirst = async () => {
      try {
        const childId = 1;
        const resp = await bookService.startReading(childId, Number(id));
        console.log('start-reading response:', resp);
        // BookPageResponseDto alanları: pageNumber, pageType, contentData{textContent, imageURL}
        setCurrentChapter(resp.pageNumber || resp.PageNumber || 1);
        setPageText(
          resp.contentData?.textContent ??
          resp.contentData?.TextContent ??
          resp.textContent ??
          resp.TextContent ??
          ''
        );
        setPageImage(
          resp.contentData?.imageURL ??
          resp.contentData?.ImageURL ??
          resp.imageUrl ??
          resp.ImageUrl ??
          null
        );
        setShowActivity(resp.pageType === 'Activity');
        const tp = resp.totalPages ?? resp.TotalPages ?? resp.totalPageCount ?? resp.TotalPageCount ?? resp.totalPage ?? resp.TotalPage ?? null;
        if (tp) setTotalPages(tp);
        const currentPage = resp.pageNumber ?? resp.PageNumber ?? 0;
        const isLast = (resp.isLastPage ?? resp.IsLastPage ?? resp.isLast ?? resp.IsLast ?? false) || (tp ? currentPage >= tp : false);
        setIsLastPage(!!isLast);
        
        // LimitReached kontrolü
        if (resp.pageType === 'LimitReached') {
          setLimitMessage('Günlük sayfa limitine ulaştınız. Yarın tekrar deneyin.');
          setLimitModalVisible(true);
          return;
        }
        
        // CantAccess kontrolü
        if (resp.pageType === 'CantAccess') {
          setShowCantAccessScreen(true);
          return;
        }
        if (resp.pageType === 'Activity') {
          setActivityData(resp.activityData || resp.ActivityData || null);
          setPageText('');
          setPageImage(null);
          return;
        } else {
          setActivityData(null);
        }
        if (
          !(
            resp.contentData?.textContent || resp.contentData?.TextContent ||
            resp.contentData?.imageURL || resp.contentData?.ImageURL ||
            resp.textContent || resp.TextContent ||
            resp.imageUrl || resp.ImageUrl
          ) && resp.pageType !== 'Activity'
        ) {
          // İçerik yoksa genel uyarı göster
          setLimitMessage('İçerik şu anda yüklenemedi. Günlük limit dolu olabilir.');
          setLimitModalVisible(true);
          return;
        }
      } catch (e) {
        const anyErr: any = e;
        const status = anyErr?.response?.status;
        const msg = anyErr?.response?.data?.message || anyErr?.message || '';
        const code = anyErr?.response?.data?.code;
        if (status === 429 || code === 'DailyLimitExceeded' || (msg && msg.toLowerCase().includes('günlük') && msg.toLowerCase().includes('limit'))) {
          setLimitMessage('Günlük sayfa limitine ulaştınız. Yarın tekrar deneyin.');
          setLimitModalVisible(true);
          return;
        }
        console.error('İlk sayfa yüklenemedi:', e);
      }
    };
    loadFirst();
  }, [id]);

  const handleNextChapter = async () => {
    try {
      const childId = 1;
      const resp = await bookService.navigatePage({
        bookId: Number(id),
        currentPageNumber: currentChapter,
        direction: 'Next',
        childId,
      });
      console.log('navigate next response:', resp);
      // LimitReached kontrolü
      if (resp.pageType === 'LimitReached') {
        setLimitMessage('Günlük sayfa limitine ulaştınız. Yarın tekrar deneyin.');
        setLimitModalVisible(true);
        return;
      }
      
      // CantAccess kontrolü
      if (resp.pageType === 'CantAccess') {
        setShowCantAccessScreen(true);
        return;
      }
      
      if (resp.pageType === 'Activity') {
        setShowActivity(true);
        setActivityData(resp.activityData || resp.ActivityData || null);
        setPageText('');
        setPageImage(null);
        setCurrentChapter(resp.pageNumber || resp.PageNumber);
      } else {
        setShowActivity(false);
        setActivityData(null);
        setCurrentChapter(resp.pageNumber || resp.PageNumber);
        const tp = resp.totalPages ?? resp.TotalPages ?? resp.totalPageCount ?? resp.TotalPageCount ?? resp.totalPage ?? resp.TotalPage ?? totalPages;
        if (tp && !totalPages) setTotalPages(tp);
        const currentPage = resp.pageNumber ?? resp.PageNumber ?? 0;
        const isLast = (resp.isLastPage ?? resp.IsLastPage ?? resp.isLast ?? resp.IsLast ?? false) || (tp ? currentPage >= tp : false);
        setIsLastPage(!!isLast);
        // GetBookPageResponseDto.ContentData alanları: textContent, imageURL (camelCase dönüşümlü)
        setPageText(resp.contentData?.textContent ?? resp.contentData?.TextContent ?? resp.textContent ?? resp.TextContent ?? '');
        setPageImage(resp.contentData?.imageURL ?? resp.contentData?.ImageURL ?? resp.imageUrl ?? resp.ImageUrl ?? null);
        if (!resp.contentData && !resp.textContent && !resp.TextContent) {
          setLimitMessage('İçerik şu anda yüklenemedi. Günlük limit dolu olabilir.');
          setLimitModalVisible(true);
          return;
        }
      }
    } catch (e) {
      const anyErr: any = e;
      const status = anyErr?.response?.status;
      const msg = anyErr?.response?.data?.message || anyErr?.message || '';
      const code = anyErr?.response?.data?.code;
      if (status === 429 || code === 'DailyLimitExceeded' || (msg && msg.toLowerCase().includes('günlük') && msg.toLowerCase().includes('limit'))) {
        setLimitMessage('Günlük sayfa limitine ulaştınız. Yarın tekrar deneyin.');
        setLimitModalVisible(true);
        return;
      }
      console.error('Sonraki sayfa hatası:', e);
    }
  };

  const handlePreviousChapter = async () => {
    try {
      if (currentChapter <= 1) return;
      const childId = 1;
      const resp = await bookService.navigatePage({
        bookId: Number(id),
        currentPageNumber: currentChapter,
        direction: 'Previous',
        childId,
      });
      console.log('navigate prev response:', resp);
      // LimitReached kontrolü
      if (resp.pageType === 'LimitReached') {
        setLimitMessage('Günlük sayfa limitine ulaştınız. Yarın tekrar deneyin.');
        setLimitModalVisible(true);
        return;
      }
      
      // CantAccess kontrolü
      if (resp.pageType === 'CantAccess') {
        setShowCantAccessScreen(true);
        return;
      }
      
      if (resp.pageType === 'Activity') {
        // Geri giderken sayfa bir etkinlikse etkinliği aç
        setShowActivity(true);
        setActivityData(resp.activityData || resp.ActivityData || null);
        setPageText('');
        setPageImage(null);
        setCurrentChapter(resp.pageNumber || resp.PageNumber);
        return;
      } else {
        setShowActivity(false);
        setActivityData(null);
        setCurrentChapter(resp.pageNumber || resp.PageNumber);
        const tp = resp.totalPages ?? resp.TotalPages ?? resp.totalPageCount ?? resp.TotalPageCount ?? resp.totalPage ?? resp.TotalPage ?? totalPages;
        if (tp && !totalPages) setTotalPages(tp);
        const currentPage = resp.pageNumber ?? resp.PageNumber ?? 0;
        const isLast = (resp.isLastPage ?? resp.IsLastPage ?? resp.isLast ?? resp.IsLast ?? false) || (tp ? currentPage >= tp : false);
        setIsLastPage(!!isLast);
        setPageText(resp.contentData?.textContent ?? resp.contentData?.TextContent ?? resp.textContent ?? resp.TextContent ?? '');
        setPageImage(resp.contentData?.imageURL ?? resp.contentData?.ImageURL ?? resp.imageUrl ?? resp.ImageUrl ?? null);
        if (!resp.contentData && !resp.textContent && !resp.TextContent) {
          setLimitMessage('İçerik şu anda yüklenemedi. Günlük limit dolu olabilir.');
          setLimitModalVisible(true);
          return;
        }
      }
    } catch (e) {
      const anyErr: any = e;
      const status = anyErr?.response?.status;
      const msg = anyErr?.response?.data?.message || anyErr?.message || '';
      const code = anyErr?.response?.data?.code;
      if (status === 429 || code === 'DailyLimitExceeded' || (msg && msg.toLowerCase().includes('günlük') && msg.toLowerCase().includes('limit'))) {
        setLimitMessage('Günlük sayfa limitine ulaştınız. Yarın tekrar deneyin.');
        setLimitModalVisible(true);
        return;
      }
      console.error('Önceki sayfa hatası:', e);
    }
  };

  // const handleSaveProgress = () => {
  //   // Burada ilerlemeyi kaydetme işlemi yapılacak
  //   console.log('İlerleme kaydedildi:', currentChapter);
  // };

  if (showActivity && activityData) {
    return (
      <ThemedView style={styles.container}>
        <ActivityScreen
          activity={activityData}
          chapterNumber={currentChapter}
          activityId={(activityData as any)?.activityId || (activityData as any)?.ActivityId || (activityData as any)?.id || (activityData as any)?.Id}
          onClose={() => {
            // Çarpıya basınca etkinliği kapatıp sonraki sayfaya geç
            setShowActivity(false);
            setActivityData(null);
            handleNextChapter();
          }}
          onPrev={handlePreviousChapter}
          onComplete={() => {
            setShowActivity(false);
            setActivityData(null);
            handleNextChapter();
          }}
        />
      </ThemedView>
    );
  }

  if (showCantAccessScreen) {
    return (
      <ThemedView style={styles.container}>
        {/* Üst ikonlar - ActivityScreen ile aynı */}
        <View style={styles.headerAbsolute}>
          <TouchableOpacity onPress={() => router.replace(`/story/${id}`)} style={styles.headerButton}>
            <Image source={require('../../assets/images/cancel-buton.png')} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.headerButtonRight]}>
            <Image source={require('../../assets/images/ayarlar.png')} style={styles.headerIconLarge} />
          </TouchableOpacity>
        </View>

        {/* Görsel wrapper - gri arka plan */}
        <View style={styles.imageWrapper}>
          <View style={styles.cantAccessGrayBackground} />
        </View>

        {/* Ana içerik */}
        <ScrollView style={styles.content}>
          <View style={styles.cantAccessContainer}>
            {/* Bölüm numarası */}
            {typeof currentChapter === 'number' && (
              <ThemedText style={styles.chapterTitle}>{currentChapter}. Bölüm</ThemedText>
            )}
            
            {/* Şimdi Sıra Sende bölümü */}
            <View style={styles.activityTitleContainer}>
              <Image source={require('../../assets/images/etkinlik-icon.png')} style={styles.activityIcon} />
              <ThemedText style={styles.activityTitle}>ŞİMDİ SIRA SENDE!</ThemedText>
            </View>
            
            <ThemedText style={styles.cantAccessMessage}>
              Bu etkinlik sayfasına erişmek için Premium üyelik gereklidir.
            </ThemedText>
            
            {/* Kelime seçim kutusu - boş */}
            <View style={styles.cantAccessWordBox}>
              <View style={styles.cantAccessWordBoxHeader}>
                <ThemedText style={styles.cantAccessWordBoxHeaderText}>Yapay Zeka Promptu:</ThemedText>
              </View>
              <View style={styles.cantAccessWordBoxContent}>
                {/* Boş alan */}
              </View>
            </View>
            
            {/* Alt butonlar */}
            <View style={styles.cantAccessBottomButtons}>
              <TouchableOpacity 
                style={styles.cantAccessUpgradeButton}
                onPress={() => {
                  // Yükselt butonu işlevi
                  console.log('Yükselt butonuna tıklandı');
                }}
              >
                <ThemedText style={styles.cantAccessUpgradeButtonText}>
                  YÜKSELT
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cantAccessSkipButton}
                onPress={() => router.replace(`/story/${id}`)}
              >
                <ThemedText style={styles.cantAccessSkipButtonText}>
                  Atla
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  if (!pageText && !showActivity && !limitModalVisible) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText style={{ marginBottom: 12 }}>Bölüm bulunamadı</ThemedText>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => router.replace(`/story/${id}`)}
        >
          <ThemedText style={styles.modalButtonText}>Geri Dön</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {limitModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Bugünkü Limitine ulaştın!</ThemedText>
            <ThemedText style={styles.modalText}>Yarın ücretsiz kullanmaya devam edebilirsin!</ThemedText>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setLimitModalVisible(false);
                  router.replace(`/story/${id}`);
                }}
              >
                <ThemedText style={styles.modalButtonText}>TAMAM</ThemedText>
              </TouchableOpacity>
              <Image
                  source={require('../../assets/images/dur-arty.png')}
                  style={styles.modalImage}
                />
            
            </View>
          </View>
        </View>
      )}
      {/* Üst ikonlar ve görsel - Activity benzeri */}
      <View style={styles.headerAbsolute}>
        <TouchableOpacity onPress={() => router.replace(`/story/${id}`)} style={styles.headerButton}>
          <Image source={require('../../assets/images/cancel-buton.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={[styles.headerButton, styles.headerButtonRight]}>
          <Image source={require('../../assets/images/ayarlar.png')} style={styles.headerIconLarge} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageWrapper}>
        <Image
          source={pageImage ? { uri: pageImage } : require('../../assets/images/kitap1.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Bölüm Başlığı */}
        <ThemedText style={styles.chapterTitle}>{currentChapter}. Bölüm</ThemedText>

        {/* Önceden sayfa resmi burada idi; artık üst arka planda gösteriliyor */}

        {/* Bölüm İçeriği */}
        <View style={styles.textContainer}>
          <ThemedText style={styles.chapterText}>
            {pageText}
          </ThemedText>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          onPress={handlePreviousChapter}
          style={[styles.navButton, currentChapter === 1 && styles.disabledButton]}
          disabled={currentChapter === 1}
        >
          <Image source={require('../../assets/images/geri-buton-2.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={async () => {
            if (isLastPage) {
              try {
                const childId = 1; // TODO: Gerçek childId'yi al
                await bookService.completeBook(childId, Number(id));
                console.log('Kitap tamamlandı');
              } catch (error) {
                console.error('Kitap tamamlama hatası:', error);
              }
              router.replace(`/story/${id}`);
            } else {
              handleNextChapter();
            }
          }}
          style={[styles.navButton, isLastPage && styles.finishButton]}
        >
          {isLastPage ? (
            <ThemedText style={styles.finishText}>BİTİR</ThemedText>
          ) : (
            <Image source={require('../../assets/images/ileri-buton2.png')} style={styles.navIcon} />
          )}
        </TouchableOpacity>
      </View>

      {/* Okuma Ayarları Modal */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalSettingsOverlay}>
          <View style={styles.modalSettings}>
            <View style={styles.modalSettingsContent}>
              <View style={styles.fontSizeContainer}>
                <Image source={require('../../assets/images/okuma1.png')} style={styles.fontSizeIcon} />
                <View style={styles.fontSizeLineContainer}>
                  <View style={styles.fontSizeLine} />
                  <View style={styles.fontSizeDot} />
                </View>
                <Image source={require('../../assets/images/okuma2.png')} style={styles.fontSizeIconLarge} />
              </View>
              <View style={styles.settingRow}>
                <ThemedText style={styles.modalSettingsLabel}>Disleksi Modu</ThemedText>
                <TouchableOpacity 
                  style={[styles.toggleButton, dyslexiaMode && styles.toggleButtonActive]}
                  onPress={() => setDyslexiaMode(!dyslexiaMode)}
                >
                  <View style={[styles.toggleThumb, dyslexiaMode && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingRow}>
                <ThemedText style={styles.modalSettingsLabel}>Karanlık Mod</ThemedText>
                <TouchableOpacity 
                  style={[styles.toggleButton, darkMode && styles.toggleButtonActive]}
                  onPress={() => setDarkMode(!darkMode)}
                >
                  <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalSettingsButtons}>
              <TouchableOpacity 
                onPress={() => setSettingsModalVisible(false)}
                style={styles.modalSettingsCancelButton}
              >
                <ThemedText style={styles.modalSettingsCancelButtonText}>İPTAL</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setSettingsModalVisible(false)}
                style={styles.modalSettingsConfirmButton}
              >
                <ThemedText style={styles.modalSettingsConfirmButtonText}>ONAYLA</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAbsolute: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonRight: { marginTop: 5 },
  headerIcon: { width: 20, height: 20, resizeMode: 'contain' },
  headerIconLarge: { width: 24, height: 24, resizeMode: 'contain' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
  },
  headerBg: {
    width: '100%',
    height: 0,
  },
  backButton: { padding: 10 },
  saveButton: { padding: 10 },
  saveButtonText: {
    fontSize: 24,
  },
  backButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  imageWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 90,
    borderRadius: 15,
    overflow: 'hidden',
    height: 300,
  },
  topImage: { width: '100%', height: 300, borderRadius: 15 },
  chapterTitle: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: 'gentium_basic',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.25,
    textAlign: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chapterImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  textContainer: {
    backgroundColor: '#F3F3F3',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
  },
  chapterText: {
    fontSize: 17,
    lineHeight: 20,
    fontFamily: 'gentium_basic',
    fontWeight: '400',
    color: '#9C9C9C',
    letterSpacing: 0.25,
    textAlign: 'justify',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'transparent',
  },
  navButton: {
    width: 91,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: 'rgba(26, 26, 26, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.4,
  },
  navIcon: { width: 24, height: 24, resizeMode: 'contain' },
  finishText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishButton: {
    backgroundColor: '#3ECCB4',
  },
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#F3F3F3',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
   
    maxHeight: '20%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: -50
  },
  modalButton: {
    backgroundColor: '#3ECCB4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth:50,
    maxWidth:120,
    marginBottom: 0
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  modalImageContainer: {
    marginLeft: 8,
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20
  },
  // Settings Modal Styles
  modalSettingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSettings: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
    height: '35%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalSettingsContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  modalSettingsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  modalSettingsCancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 37,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  modalSettingsCancelButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  modalSettingsConfirmButton: {
    flex: 1,
    backgroundColor: '#3ECCB4',
    paddingVertical: 12,
    borderRadius: 37,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalSettingsConfirmButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalSettingsLabel: {
    fontSize: 26,
    lineHeight: 20,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#333',
    letterSpacing: 0.25,
    marginRight: 15,
    flexWrap: 'nowrap',
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 60,
  },
  fontSizeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  fontSizeIconLarge: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  fontSizeLineContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  fontSizeDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3ECCB4',
    left: '25%',
    transform: [{ translateX: -6 }],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#3ECCB4',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  // CantAccess Screen Styles - ActivityScreen ile aynı yapı
  cantAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cantAccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  cantAccessMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  cantAccessButton: {
    backgroundColor: '#3ECCB4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  cantAccessButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cantAccessGrayBackground: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    height: '100%',
  },
  activityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  activityTitle: {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#3ECC9C',
  },
  // Alt butonlar
  cantAccessBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  cantAccessUpgradeButton: {
    flex: 1,
    backgroundColor: '#3ECCB4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
  },
  cantAccessUpgradeButtonText: {
    fontSize: 26,
    lineHeight: 20,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  cantAccessSkipButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cantAccessSkipButtonText: {
    fontSize: 21,
    lineHeight: 20,
    fontFamily: 'roboto',
    fontWeight: '700',
    color: '#9E9E9E', // AkGriIkonlar rengi
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  // Kelime seçim kutusu - ActivityScreen ile aynı
  cantAccessWordBox: {
    minHeight: 160,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 15,
    padding: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(26,26,26,0.08)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: 'relative',
  },
  cantAccessWordBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cantAccessWordBoxHeaderText: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '700',
  },
  cantAccessWordBoxContent: {
    flex: 1,
    minHeight: 100,
  },
});