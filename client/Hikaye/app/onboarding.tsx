// import { router } from 'expo-router';
// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   FlatList,
// } from 'react-native';
// import { ThemedView } from '../components/themed-view';
// import { ThemedText } from '../components/themed-text';

// const { width, height } = Dimensions.get('window');

// interface OnboardingPage {
//   id: number;
//   image: any;
//   overlayImage: any;
//   title: string;
//   description: string;
// }

// const onboardingPages: OnboardingPage[] = [
//   {
//     id: 1,
//     image: require('../assets/images/onboarding1.png'), // Ana resim
//     overlayImage: require('../assets/images/onb1.png'), // Sayfa 1 overlay resmi
//     title: 'Ben Arty, hikâyeleri teknolojiyle buluşturan arkadaşın!',
//     description: '',
//   },
//   {
//     id: 2,
//     image: require('../assets/images/onboarding1.png'), // Ana resim
//     overlayImage: require('../assets/images/onb2.png'), // Sayfa 2 overlay resmi
//     title: 'Yapay zekâ ile özel alıştırmalar yapacak, hayal gücünü teknolojiyle buluşturacaksın.',
//     description: '',
//   },
//   {
//     id: 3,
//     image: require('../assets/images/onboarding1.png'), // Ana resim
//     overlayImage: require('../assets/images/onb3.png'), // Sayfa 3 overlay resmi
//     title: 'Okudukça da sürpriz rozetler kazanacaksın!',
//     description: '',
//   },
//   {
//     id: 4,
//     image: require('../assets/images/onboarding1.png'), // Ana resim
//     overlayImage: require('../assets/images/onb4.png'), // Sayfa 4 overlay resmi
//     title: 'Ebeveynler için de özel bir bölüm var.',
//     description: 'Güvenli analizler: okuma süresi, ilgi alanları ve gelişim raporları',
//   },
// ];

// export default function OnboardingScreen() {
//   const [showVideo, setShowVideo] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const flatListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     if (showVideo) {
//       // Video 5 saniye sürsün (gerçek video dosyası eklendiğinde bu süre video uzunluğuna göre ayarlanacak)
//       const timer = setTimeout(() => {
//         setShowVideo(false);
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [showVideo]);


//   const handleNext = () => {
//     if (currentPage < onboardingPages.length - 1) {
//       const nextPage = currentPage + 1;
//       setCurrentPage(nextPage);
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({ 
//           index: nextPage, 
//           animated: true,
//           viewPosition: 0.5
//         });
//       }, 100);
//     } else {
//       // Son sayfada login'e git
//       router.replace('/auth/login');
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 0) {
//       const prevPage = currentPage - 1;
//       setCurrentPage(prevPage);
//       setTimeout(() => {
//         flatListRef.current?.scrollToIndex({ 
//           index: prevPage, 
//           animated: true,
//           viewPosition: 0.5
//         });
//       }, 100);
//     }
//   };

//   const renderOnboardingPage = ({ item }: { item: OnboardingPage }) => (
//     <View style={styles.pageContainer}>
//       <View style={styles.overlayImageContainer}>
//         <Image source={item.overlayImage} style={styles.overlayImage} resizeMode="contain" />
//       </View>
//     </View>
//   );

//   const renderDot = (index: number) => (
//     <View
//       key={index}
//       style={[
//         styles.dot,
//         index === currentPage ? styles.activeDot : styles.inactiveDot,
//       ]}
//     />
//   );

//   if (showVideo) {
//     return (
//       <ThemedView style={styles.container}>
//         <StatusBar hidden />
        
//         <View style={styles.videoContainer}>
//           {/* Video placeholder - gerçek video dosyası eklendiğinde buraya video component'i gelecek */}
//           <View style={styles.videoPlaceholder}>
//             <ThemedText style={styles.videoText}>Açılış Videosu</ThemedText>
//           </View>
//         </View>
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView style={styles.container}>
//       <StatusBar hidden />
      

//       {/* Ana Resim - Sabit */}
//       <View style={styles.fixedImageContainer}>
//         <Image source={onboardingPages[0].image} style={styles.fixedImage} resizeMode="contain" />
//       </View>

//       {/* Onboarding Pages - Sadece Overlay Resimler */}
//       <FlatList
//         ref={flatListRef}
//         data={onboardingPages}
//         renderItem={renderOnboardingPage}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={(event) => {
//           const index = Math.round(event.nativeEvent.contentOffset.x / width);
//           setCurrentPage(index);
//         }}
//         onScrollToIndexFailed={(info) => {
//           const wait = new Promise(resolve => setTimeout(resolve, 500));
//           wait.then(() => {
//             flatListRef.current?.scrollToIndex({ 
//               index: info.index, 
//               animated: true,
//               viewPosition: 0.5
//             });
//           });
//         }}
//         getItemLayout={(data, index) => ({
//           length: width,
//           offset: width * index,
//           index,
//         })}
//         style={styles.flatList}
//       />

//       {/* Metinler - Ana Resmin Hemen Altında */}
//       <View style={styles.textContainer}>
//         <ThemedText style={styles.pageTitle}>{onboardingPages[currentPage].title}</ThemedText>
//         <ThemedText style={styles.pageDescription}>{onboardingPages[currentPage].description}</ThemedText>
//       </View>

//       {/* Navigation Buttons and Dots */}
//       <View style={styles.navigationContainer}>
//         <View style={styles.navButton}>
//           {currentPage > 0 && (
//             <TouchableOpacity 
//               style={styles.navButtonTouchable} 
//               onPress={handlePrevious}
//               activeOpacity={0.7}
//             >
//               <Image 
//                 source={require('../assets/images/geri-buton-2.png')} 
//                 style={styles.navButtonIcon}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           )}
//         </View>
        
//         {/* Dots Indicator */}
//         <View style={styles.dotsContainer}>
//           {onboardingPages.map((_, index) => renderDot(index))}
//         </View>
        
//         <TouchableOpacity 
//           style={styles.nextButton} 
//           onPress={handleNext}
//           activeOpacity={0.7}
//         >
//           <Image 
//             source={require('../assets/images/ileri-buton2.png')} 
//             style={styles.nextButtonIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </View>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   // Video Styles
//   videoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoPlaceholder: {
//     width: width * 0.8,
//     height: height * 0.4,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//   },
//   videoText: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#666',
//   },
//   // Fixed Background Image
//   fixedImageContainer: {
//     position: 'absolute',
//     top: '10%',
//     left: 0,
//     right: 0,
//     height: height * 0.6,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//     borderRadius: 15,
//     overflow: 'hidden',
//   },
//   fixedImage: {
//     width: width * 0.95,
//     height: height * 0.6,
//     borderRadius: 15,
//     overflow: 'hidden',
//   },
//   // Onboarding Pages Styles
//   flatList: {
//     flex: 1,
//     zIndex: 2,
//   },
//   pageContainer: {
//     width: width,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   overlayImageContainer: {
//     flex: 0.7,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     borderRadius: 15,
//     overflow: 'hidden',
//     marginTop: -90,
//   },
//   overlayImage: {
//     width: width * 0.85,
//     height: height * 0.5,
//     borderRadius: 15,
//     marginTop: -70,
//   },
//   textContainer: {
//     position: 'absolute',
//     top: '65%',
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     zIndex: 3,
//   },
//   pageTitle: {
//     fontSize: 18,
//     fontWeight: '400',
//     color: '#666666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   pageDescription: {
//     fontSize: 18,
//     fontWeight: '400',
//     color: '#666666',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   // Dots Indicator Styles
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginHorizontal: 6,
//   },
//   activeDot: {
//     backgroundColor: '#3ECCB4',
//   },
//   inactiveDot: {
//     backgroundColor: '#E0E0E0',
//   },
//   // Navigation Styles
//   navigationContainer: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     zIndex: 10,
//   },
//   navButton: {
//     width: 90,
//     height: 45,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   navButtonTouchable: {
//     width: 90,
//     height: 45,
//     backgroundColor: '#fff',
//     borderRadius: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     zIndex: 11,
//   },
//   navButtonIcon: {
//     width: 24,
//     height: 24,
//     tintColor: '#D0D0D0',
//   },
//   nextButton: {
//     width: 90,
//     height: 45,
//     backgroundColor: '#fff',
//     borderRadius: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     zIndex: 11,
//   },
//   nextButtonIcon: {
//     width: 24,
//     height: 24,
//     tintColor: '#D0D0D0',
//   },
// });
import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
// GIF için Image bileşeni kullanacağız

const { width, height } = Dimensions.get('window');

// ... (onboardingPages array'i aynı kalacak)
interface OnboardingPage {
  id: number;
  image: any;
  overlayImage: any;
  title: string;
  description: string;
}

const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    image: require('../assets/images/onboarding1.png'),
    overlayImage: require('../assets/images/onb1.png'),
    title: 'Ben Arty, hikâyeleri teknolojiyle buluşturan arkadaşın!',
    description: '',
  },
  {
    id: 2,
    image: require('../assets/images/onboarding1.png'),
    overlayImage: require('../assets/images/onb2.png'),
    title: 'Yapay zekâ ile özel alıştırmalar yapacak, hayal gücünü teknolojiyle buluşturacaksın.',
    description: '',
  },
  {
    id: 3,
    image: require('../assets/images/onboarding1.png'),
    overlayImage: require('../assets/images/onb3.png'),
    title: 'Okudukça da sürpriz rozetler kazanacaksın!',
    description: '',
  },
  {
    id: 4,
    image: require('../assets/images/onboarding1.png'),
    overlayImage: require('../assets/images/onb4.png'),
    title: 'Ebeveynler için de özel bir bölüm var.',
    description: 'Güvenli analizler: okuma süresi, ilgi alanları ve gelişim raporları',
  },
];


export default function OnboardingScreen() {
  const [showGif, setShowGif] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // GIF 5 saniye sonra otomatik olarak onboarding sayfalarına geçsin
  React.useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showGif]);

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: nextPage,
          animated: true,
          viewPosition: 0.5
        });
      }, 100);
    } else {
      // Son sayfada hoşgeldin ekranına git
      router.replace('/welcome');
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: prevPage,
          animated: true,
          viewPosition: 0.5
        });
      }, 100);
    }
  };

  const renderOnboardingPage = ({ item }: { item: OnboardingPage }) => (
    <View style={styles.pageContainer}>
      <View style={styles.overlayImageContainer}>
        <Image source={item.overlayImage} style={styles.overlayImage} resizeMode="contain" />
      </View>
    </View>
  );

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        index === currentPage ? styles.activeDot : styles.inactiveDot,
      ]}
    />
  );

  if (showGif) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.gifContainer}>
          <Image 
            source={require('../assets/videos/onboarding-gif.gif')} // GIF dosyanızın yolu
            style={styles.gifImage}
            resizeMode="cover"
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
        <StatusBar hidden />
        {/* ... (onboarding sayfasının geri kalanı aynı) ... */}
         {/* Ana Resim - Sabit */}
     <View style={styles.fixedImageContainer}>
       <Image source={onboardingPages[0].image} style={styles.fixedImage} resizeMode="contain" />
     </View>

     {/* Onboarding Pages - Sadece Overlay Resimler */}
     <FlatList
       ref={flatListRef}
       data={onboardingPages}
       renderItem={renderOnboardingPage}
       keyExtractor={(item) => item.id.toString()}
       horizontal
       pagingEnabled
       showsHorizontalScrollIndicator={false}
       onMomentumScrollEnd={(event) => {
         const index = Math.round(event.nativeEvent.contentOffset.x / width);
         setCurrentPage(index);
       }}
       onScrollToIndexFailed={(info) => {
         const wait = new Promise(resolve => setTimeout(resolve, 500));
         wait.then(() => {
           flatListRef.current?.scrollToIndex({ 
             index: info.index, 
             animated: true,
             viewPosition: 0.5
           });
         });
       }}
       getItemLayout={(data, index) => ({
         length: width,
         offset: width * index,
         index,
       })}
       style={styles.flatList}
     />

     {/* Metinler - Ana Resmin Hemen Altında */}
     <View style={styles.textContainer}>
       <ThemedText style={styles.pageTitle}>{onboardingPages[currentPage].title}</ThemedText>
       <ThemedText style={styles.pageDescription}>{onboardingPages[currentPage].description}</ThemedText>
     </View>

     {/* Navigation Buttons and Dots */}
     <View style={styles.navigationContainer}>
       <View style={styles.navButton}>
         {currentPage > 0 && (
           <TouchableOpacity 
             style={styles.navButtonTouchable} 
             onPress={handlePrevious}
             activeOpacity={0.7}
           >
             <Image 
               source={require('../assets/images/geri-buton-2.png')} 
               style={styles.navButtonIcon}
               resizeMode="contain"
             />
           </TouchableOpacity>
         )}
       </View>
       
       {/* Dots Indicator */}
       <View style={styles.dotsContainer}>
         {onboardingPages.map((_, index) => renderDot(index))}
       </View>
       
       <TouchableOpacity 
         style={styles.nextButton} 
         onPress={handleNext}
         activeOpacity={0.7}
       >
         <Image 
           source={require('../assets/images/ileri-buton2.png')} 
           style={styles.nextButtonIcon}
           resizeMode="contain"
         />
       </TouchableOpacity>
     </View>
    </ThemedView>
  );
}

// ... (styles nesnesi aynı)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // GIF Styles
  gifContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
  gifImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  // Fixed Background Image
  fixedImageContainer: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  fixedImage: {
    width: width * 0.95,
    height: height * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
  },
  // Onboarding Pages Styles
  flatList: {
    flex: 1,
    zIndex: 2,
  },
  pageContainer: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayImageContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: -90,
  },
  overlayImage: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 15,
    marginTop: -70,
  },
  textContainer: {
    position: 'absolute',
    top: '65%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 3,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  pageDescription: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Dots Indicator Styles
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#3ECCB4',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  // Navigation Styles
  navigationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  navButton: {
    width: 90,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonTouchable: {
    width: 90,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 11,
  },
  navButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#D0D0D0',
  },
  nextButton: {
    width: 90,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 11,
  },
  nextButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#D0D0D0',
  },
});