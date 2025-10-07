// import React, { useState } from 'react';
// import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { ThemedText } from './themed-text';

// interface Category {
//   id: string;
//   name: string;
//   options: string[];
// }

// interface ActivityScreenProps {
//   onComplete: () => void;
//   isLastChapter?: boolean;
//   chapterNumber?: number;
//   onClose?: () => void;
//   onPrev?: () => void;
//   activity: {
//     ImageURL?: string;
//     imageURL?: string;
//     QuestionText?: string;
//     questionText?: string;
//     WordCategories?: { categoryName: string; words: string[] }[];
//     wordCategories?: { categoryName: string; words: string[] }[];
//   };
// }

// export default function ActivityScreen({ onComplete, isLastChapter = false, activity, chapterNumber, onClose, onPrev }: ActivityScreenProps) {
//   const onBack = () => {
//     if (onClose) {
//       onClose();
//     }
//   };
//   const getColorForType = (type: string): string => {
//     switch (type) {
//       case 'character':
//         return '#4CAF50'; // Yeşil
//       case 'color':
//         return '#FF69B4'; // Pembe
//       case 'texture':
//         return '#2196F3'; // Mavi
//       case 'shape':
//         return '#FF5722'; // Turuncu
//       default:
//         return '#9E9E9E'; // Gri
//     }
//   };
//   const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);
//   const [prompt, setPrompt] = useState<string>('');
//   const [showHint, setShowHint] = useState(false);
//   const [activeCategory, setActiveCategory] = useState<string>('character');
//   const [artyInfo, setArtyInfo] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedWords, setSelectedWords] = useState<{id: string; text: string; type: string}[]>([]);
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

//   const windowWidth = Dimensions.get('window').width;

//   const mappedCategories: Category[] = (activity.wordCategories || activity.WordCategories || []).map((c) => ({
//     id: c.categoryName.toLowerCase(),
//     name: c.categoryName,
//     options: c.words,
//   }));
//   const categories: Category[] = mappedCategories.length > 0 ? mappedCategories : [];

//   // Kategori sekmeleri için renk paleti (1-4)
//   const categoryPalette = ['#3BDAA4', '#A98BC0', '#84BEC9', '#FFB6B6'];

//   // Seçili kelimelerin prompt içindeki pill'lerinde kategoriye göre renk döndürür
//   const getPaletteColorByCategoryId = (categoryId: string): string => {
//     const idx = categories.findIndex(c => c.id === categoryId);
//     const safeIdx = idx >= 0 ? idx : 0;
//     return categoryPalette[safeIdx % categoryPalette.length];
//   };

//   const handleOptionSelect = (categoryId: string, option: string) => {
//     setSelectedOptions(prev => ({
//       ...prev,
//       [categoryId]: option,
//     }));
//   };

//   const generateImage = async () => {
//     try {
//       setLoading(true);
      
//       // Seçilen kelimeleri doğru sırada birleştir
//       const orderedWords = selectedWords.map(word => word.text);
//       const promptText = orderedWords.join(' ');
//       setPrompt(promptText);
      
//       // Sıralamayı kontrol et
//       const isValidOrder = validateWordOrder(selectedWords);
      
//       if (!isValidOrder) {
//         Alert.alert(
//           "Hatalı Sıralama",
//           "Lütfen kelimeleri doğru sırada dizin: Karakter > Renk > Doku > Biçim"
//         );
//         return;
//       }
      
//       // TODO: Gemini API entegrasyonu yapılacak
//       await new Promise(resolve => setTimeout(resolve, 2000)); // Simüle edilmiş yükleme süresi
//       setGeneratedImage('generated_image_url');
//     } catch (error) {
//       console.error('Görsel oluşturma hatası:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateWordOrder = (words: {type: string}[]): boolean => {
//     const expectedOrder = ['character', 'color', 'texture', 'shape'];
//     const currentOrder = words.map(word => word.type);
    
//     if (currentOrder.length !== expectedOrder.length) {
//       return false;
//     }
    
//     return expectedOrder.every((type, index) => currentOrder[index] === type);
//   };

//   const renderCategoryOptions = (category: Category) => (
//     <View key={category.id} style={styles.categorySection}>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
//         {category.options.map(option => (
//           <TouchableOpacity
//             key={option}
//             style={[
//               styles.optionButton,
//               selectedOptions[category.id] === option && styles.selectedOption,
//             ]}
//             onPress={() => handleOptionSelect(category.id, option)}
//           >
//             <ThemedText style={[
//               styles.optionText,
//               selectedOptions[category.id] === option && styles.selectedOptionText
//             ]}>
//               {option}
//             </ThemedText>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );

//   if (generatedImage) {
//     return (
//       <ScrollView style={styles.container}>
//         <View style={styles.headerContainer}>
//           <ThemedText style={styles.title}>GÖRSEL OLUŞTURULDU!</ThemedText>
//           <ThemedText style={styles.subtitle}>Tebrikler! Sayende Sude Engeli Aşabildi!</ThemedText>
//         </View>

//         <View style={styles.generatedImageContainer}>
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#4CAF50" />
//               <ThemedText style={styles.loadingText}>Görsel Oluşturuluyor...</ThemedText>
//             </View>
//           ) : (
//             <View style={styles.imageWrapper}>
//               <Image 
//                 source={require('../assets/images/kitap1.png')}
//                 style={styles.topImage}
//                 resizeMode="cover"
//               />
//             </View>
//           )}
//         </View>

//         <View style={styles.textContainer}>
//           <ThemedText style={styles.storyText}>
//             Orman gittikçe karanlıklaştı. Ağaçların dalları gökyüzünü kapatıyor, kuş sesleri bile susmuş gibiydı. Sude uzun süre yürüdü. Ayakları yorulmuştu ama kalbinde cesaret vardı. Bir süre sonra karşısına devasa bir taş duvar çıktı. Duvar o kadar yüksekti ki bulutlara kadar uzanıyordu. Sude yukarıya baktı, aşağıya baktı, ama geçecek hiçbir yol göremedi.
//           </ThemedText>
//         </View>

//         <View style={styles.artyInfoContainer}>
//           <Image 
//             source={require('../assets/images/Arty.png')}
//             style={styles.artyInfoImage}
//             resizeMode="contain"
//           />
//           <View style={styles.artyInfoTextContainer}>
//             <ThemedText style={styles.artyInfoTitle}> Arty&apos;den Bilgiler</ThemedText>
//             <ThemedText style={styles.artyInfoText}>
//               {artyInfo || "Yapay zeka sanatı, insanların hayal gücü ile bilgisayarların işlem gücünü birleştirerek yepyeni sanat eserleri ortaya çıkarır!"}
//             </ThemedText>
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={[styles.nextButton, isLastChapter && styles.finishButton]}
//           onPress={async () => {
//             try {
//               // TODO: Backend entegrasyonu yapıldığında yorum satırlarını kaldırın
//               /*
//               if (isLastChapter) {
//                 await completeStory({
//                   id: 'story_1', // Hikaye ID'si backend'den gelmeli
//                   chapter: 1,    // Bölüm numarası backend'den gelmeli
//                   title: 'Sude\'nin Macerası' // Hikaye başlığı backend'den gelmeli
//                 });
//               }
//               */
//               onComplete();
//             } catch (error) {
//               console.error('Hikaye tamamlama hatası:', error);
//               // Hata durumunda kullanıcıya bilgi verilebilir
//             }
//           }}
//         >
//           <ThemedText style={styles.nextButtonText}>
//             {isLastChapter ? 'Bitir' : '→'}
//           </ThemedText>
//         </TouchableOpacity>
//       </ScrollView>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.headerButton} onPress={onBack}>
//           <Image source={require('../assets/images/cancel-buton.png')} style={styles.headerIcon} />
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.headerButton, styles.headerButtonRight]} onPress={() => {}}>
//           <Image source={require('../assets/images/ayarlar.png')} style={styles.headerIconLarge} />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.imageWrapper}>
//         <Image 
//           source={(activity as any).imageURL || (activity as any).ImageURL ? { uri: ((activity as any).imageURL || (activity as any).ImageURL) as string } : require('../assets/images/kitap1.png')}
//           style={styles.topImage}
//           resizeMode="cover"
//         />
//       </View>
      
//       {typeof chapterNumber === 'number' && (
//         <ThemedText style={styles.chapterTitle}>{chapterNumber}. Bölüm</ThemedText>
//       )}
//       <View style={styles.activityTitleContainer}>
//         <Image source={require('../assets/images/etkinlik-icon.png')} style={styles.activityIcon} />
//         <ThemedText style={styles.activityTitle}>ŞİMDİ SIRA SENDE!</ThemedText>
//       </View>
//       {((activity as any).questionText || (activity as any).QuestionText) && (
//         <ThemedText style={styles.questionText}>
//           {(activity as any).questionText || (activity as any).QuestionText}
//         </ThemedText>
//       )}
//       {/* subtitle removed */}

//       <View style={styles.categoriesContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
//           {categories.map((category, idx) => {
//             const paletteColor = categoryPalette[idx % categoryPalette.length];
//             const isActive = category.id === activeCategory;
//             return (
//             <TouchableOpacity
//               key={category.id}
//               style={[
//                 styles.categoryTab,
//                 { borderColor: paletteColor },
//                 isActive && [styles.activeTab, { backgroundColor: paletteColor, borderColor: paletteColor }]
//               ]}
//               onPress={() => setActiveCategory(category.id)}
//             >
//               <ThemedText style={[
//                 styles.categoryTabText,
//                 { color: paletteColor },
//                 isActive && styles.activeTabText
//               ]}>
//                 {category.name}
//               </ThemedText>
//             </TouchableOpacity>
//           );})}
//         </ScrollView>

//         <View style={styles.optionsContainer}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
//             {(() => {
//               const activeIdx = categories.findIndex(c => c.id === activeCategory);
//               const paletteColor = categoryPalette[activeIdx % categoryPalette.length] || '#3BDAA4';
//               return categories
//                 .find(c => c.id === activeCategory)
//                 ?.options.map((option, index) => {
//                   const isSelected = selectedWords.some(word => word.text === option && word.type === activeCategory);
//                   return (
//                     <TouchableOpacity
//                       key={index}
//                       style={[
//                         styles.optionButton,
//                         { borderColor: '#EAEAEA', backgroundColor: isSelected ? paletteColor : '#FFFFFF' },
//                       ]}
//                       onPress={() => {
//                         const existingWordIndex = selectedWords.findIndex(
//                           word => word.text === option && word.type === activeCategory
//                         );
//                         if (existingWordIndex !== -1) {
//                           const newWords = [...selectedWords];
//                           newWords.splice(existingWordIndex, 1);
//                           setSelectedWords(newWords);
//                         } else {
//                           const newWord = {
//                             id: `${activeCategory}-${Date.now()}`,
//                             text: option,
//                             type: activeCategory
//                           };
//                           setSelectedWords([...selectedWords, newWord]);
//                         }
//                       }}
//                     >
//                       <ThemedText style={[styles.optionText, { color: isSelected ? '#FFFFFF' : '#9C9C9C' }]}>{option}</ThemedText>
//                     </TouchableOpacity>
//                   );
//                 });
//             })()}
//           </ScrollView>
//         </View>

//         <View style={styles.dropZoneContainer}>
//           <View style={styles.promptHeaderRow}>
//             <ThemedText style={styles.promptHeaderText}>Yapay Zeka Promptu:</ThemedText>
//             <TouchableOpacity onPress={() => setSelectedWords([])}>
//               <Image source={require('../assets/images/cancel-buton.png')} style={styles.eraserIcon} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.promptRow}> 
//             {selectedWords.map(w => (
//               <View key={w.id} style={[styles.pill, { backgroundColor: getPaletteColorByCategoryId(w.type) }]}> 
//                 <ThemedText style={styles.pillText}>{w.text}</ThemedText>
//               </View>
//             ))}
//           </View>
//           <View style={styles.promptFixedRow}>
//             <ThemedText style={styles.ellipsisText}>... bir</ThemedText>
//             <TouchableOpacity style={styles.questionPill} onPress={() => setShowHint(true)}>
//               <ThemedText style={styles.questionPillText}>?</ThemedText>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>


      

//       <View style={styles.actionsRow}>
//         <TouchableOpacity 
//           onPress={onPrev}
//           style={styles.prevButton}
//         >
//           <Image source={require('../assets/images/geri-buton-2.png')} style={styles.navIcon} />
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={[
//             styles.generateButton,
//             Object.keys(selectedOptions).length < 3 && styles.disabledButton
//           ]} 
//           onPress={generateImage}
//           disabled={Object.keys(selectedOptions).length < 3}
//         >
//           <ThemedText style={styles.buttonText}>GÖRSELLEŞTİR!</ThemedText>
//         </TouchableOpacity>
//       </View>

//       {showHint && (
//         <View style={styles.hintContainer}>
//           <Image 
//             source={require('../assets/images/Arty.png')}
//             style={styles.artyImage}
//             resizeMode="contain"
//           />
//           <ThemedText style={styles.hintText}>
//             İpucu: Sude değişken geçebilmek için küçücük bir hayvana dönüşmeli!
//           </ThemedText>
//         </View>
//       )}
//     </ScrollView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     marginTop: 10,
//   },
//   header: {
//     position: 'absolute',
//     top: 12,
//     left: 0,
//     right: 0,
//     zIndex: 2,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//   },
//   headerButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerButtonRight: {
//     marginTop: 5,
//   },
//   headerIcon: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//   },
//   headerIconLarge: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
//   dropZoneContainer: {
//     minHeight: 160,
//     marginHorizontal: 16,
//     marginTop: 5,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ECECEC',
//     borderRadius: 15,
//     padding: 12,
//     backgroundColor: '#FFFFFF',
//     shadowColor: 'rgba(26,26,26,0.08)',
//     shadowOpacity: 1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//     position: 'relative',
//   },
//   promptHeaderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   promptHeaderText: {
//     fontSize: 12,
//     color: '#212121',
//     fontWeight: '700',
//   },
//   eraserIcon: {
//     width: 18,
//     height: 18,
//     opacity: 0.6,
//     resizeMode: 'contain',
//   },
//   promptRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     alignItems: 'center',
//   },
//   promptFixedRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     alignSelf: 'flex-end',
//     marginTop: 8,
//   },
//   pill: {
//     paddingHorizontal: 16,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pillText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },
//   ellipsisPill: {
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     paddingHorizontal: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   ellipsisText: {
//     color: '#9C9C9C',
//   },
//   questionPill: {
//     width: 64,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   questionPillText: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: 'bold',
//   },
//   dropZone: {
//     minHeight: 80,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   wordCard: {
//     padding: 15,
//     marginHorizontal: 5,
//     borderRadius: 10,
//     minWidth: 80,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   wordText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   draggingWord: {
//     opacity: 0.7,
//     transform: [{ scale: 1.1 }],
//   },
//   selectedWordCard: {
//     opacity: 0.7,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   topImage: {
//     width: '100%',
//     height: 300,
//     marginBottom: 0,
//     borderRadius: 15,
    
//   },
//   imageWrapper: {
//     marginHorizontal: 16,
//     marginBottom: 20,
//     marginTop: 60,
//     borderRadius: 15,
//     overflow: 'hidden',

//   },
//   headerContainer: {
//     padding: 20,
//     paddingTop: 40,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   chapterTitle: {
//     fontSize: 25,
//     fontFamily: 'baloo',
//     fontWeight: '400',
//     color: '#212121',
//     textAlign: 'center',
//     marginBottom: 6,
//   },
//   activityTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   activityIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 8,
//     resizeMode: 'contain',
//   },
//   activityTitle: {
//     fontSize: 18,
//     lineHeight: 20,
//     fontFamily: 'baloo',
//     fontWeight: '400',
//     color: '#3ECC9C',
//     textAlign: 'center',
//     letterSpacing: 0.25,
//   },
//   subtitle: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   questionText: {
//     fontSize: 16,
//     lineHeight: 20,
//     fontFamily: 'baloo',
//     fontWeight: '400',
//     color: '#212121',
//     textAlign: 'center',
//     marginHorizontal: 20,
//     marginBottom: 12,
//   },
//   categoriesContainer: {
//     marginBottom: 20,
//   },
//   categoryTabs: {
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   categoryTab: {
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     marginRight: 10,
//     borderRadius: 15,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     height: 36,
//   },
//   activeTab: {
//     // backgroundColor dynamic per-category
//   },
//   categoryTabText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   categorySection: {
//     marginBottom: 15,
//   },
//   optionsScroll: {
//     paddingHorizontal: 15,
//     marginLeft: 15,
//   },
//   optionsContainer: {
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   optionButton: {
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     marginRight: 10,
//     borderRadius: 15,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     minWidth: 100,
//     height: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectedOption: {
//     backgroundColor: '#4CAF50',
//   },
//   optionText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   selectedOptionText: {
//     color: '#fff',
//   },
//   hintContainer: {
//     backgroundColor: '#E0F2F1',
//     padding: 15,
//     marginHorizontal: 20,
//     marginBottom: 20,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   hintText: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   generateButton: {
//     backgroundColor: '#4CAF50',
//     margin: 0,
//     padding: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     backgroundColor: '#ccc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   retryButton: {
//     backgroundColor: '#4CAF50',
//     marginTop: 20,
//     padding: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//     marginHorizontal: 20,
//   },
//   actionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//   },
//   prevButton: {
//     width: 91,
//     height: 47,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 36,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     shadowColor: 'rgba(26, 26, 26, 0.08)',
//     shadowOpacity: 1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 4,
//   },
//   navIcon: { width: 24, height: 24, resizeMode: 'contain' },
//   hintOverActions: {
//     alignItems: 'flex-end',
//     paddingHorizontal: 20,
//     marginBottom: 55,
//   },
//   hintButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E0F2F1',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   hintButtonText: {
//     fontSize: 20,
//     color: '#4CAF50',
//     fontWeight: 'bold',
//   },
//   artyImage: {
//     width: 60,
//     height: 60,
//     marginRight: 10,
//   },
//   textContainer: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     padding: 20,
//     marginTop: -20,
//   },
//   storyText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#333',
//   },
//   nextButton: {
//     position: 'absolute',
//     right: 20,
//     bottom: 20,
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   nextButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   finishButton: {
//     width: 100,
//     backgroundColor: '#4CAF50',
//   },
//   promptContainer: {
//     padding: 20,
//   },
//   promptText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   generatedImageContainer: {
//     width: '100%',
//     height: 300,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#4CAF50',
//   },
//   artyInfoContainer: {
//     backgroundColor: '#E0F2F1',
//     padding: 20,
//     marginHorizontal: 20,
//     marginVertical: 20,
//     borderRadius: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   artyInfoImage: {
//     width: 80,
//     height: 80,
//     marginRight: 15,
//   },
//   artyInfoTextContainer: {
//     flex: 1,
//   },
//   artyInfoTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 8,
//   },
//   artyInfoText: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//   },
// });
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { activitiesService } from '../services/api';
import { api } from '../services/api';

interface Category {
  id: string;
  name: string;
  options: string[];
}

interface ActivityScreenProps {
  onComplete: () => void;
  isLastChapter?: boolean;
  chapterNumber?: number;
  onClose?: () => void;
  onPrev?: () => void;
  activityId?: number;
  activity: {
    ImageURL?: string;
    imageURL?: string;
    QuestionText?: string;
    questionText?: string;
    WordCategories?: { categoryName: string; words: string[] }[];
    wordCategories?: { categoryName: string; words: string[] }[];
  };
}

export default function ActivityScreen({ onComplete, isLastChapter = false, activity, chapterNumber, onClose, onPrev, activityId }: ActivityScreenProps) {
  const onBack = () => {
    if (onClose) {
      onClose();
    }
  };
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('character');
  const [artyInfo, setArtyInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWords, setSelectedWords] = useState<{id: string; text: string; type: string}[]>([]);
  const [adviceText, setAdviceText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{ isCorrect: boolean; feedback: string; generatedImageUrl?: string } | null>(null);
  const [hintText, setHintText] = useState<string>('');

  const mappedCategories: Category[] = (activity.wordCategories || activity.WordCategories || []).map((c) => ({
    id: c.categoryName.toLowerCase(),
    name: c.categoryName,
    options: c.words,
  }));
  const categories: Category[] = mappedCategories.length > 0 ? mappedCategories : [];
  const firstCategoryId = categories[0]?.id;

  // Kategori sekmeleri için renk paleti
  const categoryPalette = ['#3BDAA4', '#A98BC0', '#84BEC9', '#FFB6B6'];

  // Seçili kelimelerin prompt içindeki pill'lerinde kategoriye göre renk döndürür
  const getPaletteColorByCategoryId = (categoryId: string): string => {
    const idx = categories.findIndex(c => c.id === categoryId);
    const safeIdx = idx >= 0 ? idx : 0;
    return categoryPalette[safeIdx % categoryPalette.length];
  };

  const generateImage = async () => {
    try {
      setLoading(true);
      setEvaluation(null);
      
      const orderedWords = selectedWords.map(word => word.text);
      const promptText = orderedWords.join(' ');
      setPrompt(promptText);
      
      // TODO: Gerekirse kelime sıralama kontrolü burada yapılabilir.
      // Tasarım 4 sabit kutucuk olduğu için sıralama kontrolü şimdilik gereksiz olabilir.
      
      // TODO: Gemini API entegrasyonu yapılacak
      await new Promise(resolve => setTimeout(resolve, 5000)); // Simüle: 5 saniyelik yükleme süresi
      // TODO: Backend entegrasyonu: değerlendirme yanıtını burada alacağız
      // Şimdilik örnek başarısız senaryo ile test
      const simulated = { isCorrect: false, feedback: "Yeşil ejderha gerçek bir hayvan değildir ve genellikle 10 cm'den çok daha büyüktür.", generatedImageUrl: '' };
      setEvaluation(simulated);
      setGeneratedImage('generated_image_url');
    } catch (error) {
      console.error('Görsel oluşturma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // İpucu tıklandığında backend'den hint çek ve görsel üstüne yaz
  useEffect(() => {
    const fetchHint = async () => {
      try {
        const anyAct: any = activity as any;
        const activityIdCandidate = activityId || anyAct?.activityId || anyAct?.ActivityId || anyAct?.id || anyAct?.Id || chapterNumber;
        console.log('[ActivityScreen] hint fetch start', { activityIdCandidate, from: { activityIdProp: activityId, activityKeys: { activityId: anyAct?.activityId, ActivityId: anyAct?.ActivityId, id: anyAct?.id, Id: anyAct?.Id }, chapterNumber } });
        if (!activityIdCandidate) {
          console.warn('[ActivityScreen] No activity id for hint');
          return;
        }
        const res = await activitiesService.getHint(Number(activityIdCandidate));
        console.log('[ActivityScreen] hint fetch ok', res);
        setHintText(res.hintText || '');
      } catch (e) {
        console.error('[ActivityScreen] hint fetch error', e);
        setHintText('');
      }
    };
    if (showHint) fetchHint();
  }, [showHint, activity, activityId, chapterNumber]);

  // Loading başlayınca Arty tavsiyesi çek
  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await api.get('/DidYouKnow/random');
        const data = res.data;
        const text = data?.text || data?.content || data?.message || '';
        setAdviceText(text);
      } catch (e) {
        setAdviceText('Hayal gücünü kullan, gerçek olmasına gerek yok.');
      }
    };
    if (loading) {
      fetchAdvice();
    }
  }, [loading]);
  
  // Değerlendirme ekranı (success/fail)
  if (evaluation && !loading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onBack}>
              <Image source={require('../assets/images/cancel-buton.png')} style={styles.headerIcon} />
          </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, styles.headerButtonRight]} onPress={() => {}}>
              <Image source={require('../assets/images/ayarlar.png')} style={styles.headerIconLarge} />
            </TouchableOpacity>
    </View>

          <View style={styles.imageWrapper}>
            <Image 
              source={evaluation.generatedImageUrl ? { uri: evaluation.generatedImageUrl } : ( (activity as any).imageURL || (activity as any).ImageURL ? { uri: ((activity as any).imageURL || (activity as any).ImageURL) as string } : require('../assets/images/kitap1.png') )}
              style={styles.topImage}
              resizeMode="cover"
            />
        </View>

          {typeof chapterNumber === 'number' && (
            <ThemedText style={styles.chapterTitle}>{chapterNumber}. Bölüm</ThemedText>
          )}

          <View style={styles.loadingTextsContainer}>
            <View style={styles.loadingTitleRow}>
              <Image source={require('../assets/images/etkinlik-icon.png')} style={styles.loadingIcon} />
              <ThemedText style={styles.loadingTitle}>GÖRSEL OLUŞTURULDU</ThemedText>
          </View>
        </View>

          {/* Sonuç mesajı */}
          <View style={styles.resultMessageBox}>
            <ThemedText style={styles.resultMessageText}>
              {evaluation.isCorrect ? 'Tebrikler! Hikâyeye devam edebiliriz.' : 'Ah hayır, sanırım bu işe yaramadı.'}
          </ThemedText>
        </View>
          {!evaluation.isCorrect && (
            <ThemedText style={styles.feedbackBadge}>Prompt’unu güncelleyip tekrar denemek ister misin?</ThemedText>
          )}

          {/* Prompt özet kutusu (seçilenler) */}
          <View style={styles.dropZoneContainer}>
            <View style={styles.promptHeaderRow}>
              <ThemedText style={styles.promptHeaderText}>Yapay Zeka Promptu:</ThemedText>
          </View>
            {/* Kategorilerden seçilen kelimeleri aynı etkinlik stilinde göster */}
            <View style={styles.promptRow}>
              {(() => {
                const gridWords = selectedWords.filter(w => w.type !== firstCategoryId);
                const lastFilledIndex = Math.max(0, gridWords.length - 1);
                return Array.from({ length: 6 }).map((_, index) => {
                  const word = gridWords[index];
                  if (word) {
                    return (
                      <View key={word.id} style={styles.pillWrapper}>
                        <View style={[styles.pill, { backgroundColor: getPaletteColorByCategoryId(word.type) }]}>
                          <ThemedText style={styles.pillText}>{word.text}</ThemedText>
        </View>
                        {index !== lastFilledIndex && <ThemedText style={styles.commaText}>,</ThemedText>}
                      </View>
                    );
                  }
                  return (
                    <View key={index} style={styles.pillWrapper}>
                      <View style={styles.placeholderBox} />
                    </View>
                  );
                });
              })()}
            </View>
            {/* Alt sağ sabit: ... bir + ilk kategori */}
            <View style={styles.promptFixedRow}>
              <ThemedText style={styles.ellipsisText}>... bir</ThemedText>
              {(() => {
                const firstSelected = selectedWords.find(w => w.type === firstCategoryId);
                if (firstSelected) {
                  return (
                    <View style={styles.pillWrapper}>
                      <View style={[styles.pill, { backgroundColor: getPaletteColorByCategoryId(firstSelected.type) }]}>
                        <ThemedText style={styles.pillText}>{firstSelected.text}</ThemedText>
                      </View>
                    </View>
                  );
                }
                return (
                  <View style={styles.pillWrapper}>
                    <View style={styles.placeholderBox}>
                      <ThemedText style={styles.questionMarkText}>?</ThemedText>
                    </View>
                  </View>
                );
              })()}
            </View>
          </View>

          {/* Butonlar */}
          <View style={styles.resultButtonsRow}>
            {evaluation.isCorrect ? (
              <>
                <TouchableOpacity style={styles.prevButton} onPress={onPrev}>
                  <Image source={require('../assets/images/geri-buton-2.png')} style={styles.navIcon} />
        </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                  <ThemedText style={styles.primaryButtonText}>{isLastChapter ? 'BİTİR' : 'DEVAM ET'}</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.primaryButton} onPress={() => { setEvaluation(null); setGeneratedImage(null); }}>
                  <ThemedText style={styles.primaryButtonText}>TEKRARLA</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                  <ThemedText style={styles.secondaryButtonText}>ATLA</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
      </ScrollView>
        </View>
    );
  }

  // Yükleme ekranı: üst kısım aynı, alt içerik sade
  if (loading) {
  return (
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentLoading}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onBack}>
            <Image source={require('../assets/images/cancel-buton.png')} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.headerButtonRight]} onPress={() => {}}>
            <Image source={require('../assets/images/ayarlar.png')} style={styles.headerIconLarge} />
          </TouchableOpacity>
        </View>

        <View style={styles.imageWrapper}>
      <Image 
            source={(activity as any).imageURL || (activity as any).ImageURL ? { uri: ((activity as any).imageURL || (activity as any).ImageURL) as string } : require('../assets/images/kitap1.png')}
        style={styles.topImage}
        resizeMode="cover"
            blurRadius={14}
          />
          <View style={styles.imageOverlay} />
          </View>

        {typeof chapterNumber === 'number' && (
          <ThemedText style={styles.chapterTitle}>{chapterNumber}. Bölüm</ThemedText>
        )}

        <View style={styles.loadingTextsContainer}>
          <View style={styles.loadingTitleRow}>
            <Image source={require('../assets/images/etkinlik-icon.png')} style={styles.loadingIcon} />
            <ThemedText style={styles.loadingTitle}>{generatedImage ? 'GÖRSEL OLUŞTURULDU' : 'GÖRSELLEŞTİRİLİYOR...'}</ThemedText>
          </View>
          <ThemedText style={styles.loadingSubtitle}>Bu biraz vakit alabilir.</ThemedText>
      </View>

       

      </ScrollView>
      <View style={styles.fixedActionsRow}>
              <TouchableOpacity
          onPress={onPrev}
          style={styles.prevButton}
        >
          <Image source={require('../assets/images/geri-buton-2.png')} style={styles.navIcon} />
              </TouchableOpacity>
        <View style={styles.loadingArtyContainer}>
          <View style={styles.adviceBubbleBorder} />
          <Image source={require('../assets/images/etkinlik-boloncuk.png')} style={styles.adviceBubble} resizeMode="stretch" />
          <View style={styles.adviceBubbleTextWrap}>
            <ThemedText style={styles.adviceBubbleTitle}>ARTY’den Tavsiyeler</ThemedText>
            <ThemedText style={styles.adviceBubbleText} numberOfLines={2}>
              {adviceText || 'Hayal gücünü kullan, gerçek olmasına gerek yok.'}
            </ThemedText>
          </View>
          <Image source={require('../assets/images/arty-loading.png')} style={styles.loadingArty} resizeMode="contain" />
        </View>
      </View>
      </View>
    );
  }

  // Ana aktivite ekranı
  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onBack}>
          <Image source={require('../assets/images/cancel-buton.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerButton, styles.headerButtonRight]} onPress={() => {}}>
          <Image source={require('../assets/images/ayarlar.png')} style={styles.headerIconLarge} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageWrapper}>
        <Image 
          source={(activity as any).imageURL || (activity as any).ImageURL ? { uri: ((activity as any).imageURL || (activity as any).ImageURL) as string } : require('../assets/images/kitap1.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
        {!showHint ? (
          <TouchableOpacity style={styles.hintBadge} onPress={() => setShowHint(true)}>
            <Image source={require('../assets/images/etkinlik-hint.png')} style={styles.hintBadgeIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.hintBadge}>
            <Image source={require('../assets/images/arty-loading.png')} style={styles.hintArty} />
            <Image source={require('../assets/images/hint.png')} style={styles.hintOverlayIcon} />
            <View style={styles.hintTextWrap}>
              <ThemedText style={styles.hintText}>{hintText || 'İpucu yükleniyor...'}</ThemedText>
            </View>
          </View>
        )}
      </View>

      {typeof chapterNumber === 'number' && (
        <ThemedText style={styles.chapterTitle}>{chapterNumber}. Bölüm</ThemedText>
      )}
      <View style={styles.activityTitleContainer}>
        <Image source={require('../assets/images/etkinlik-icon.png')} style={styles.activityIcon} />
        <ThemedText style={styles.activityTitle}>ŞİMDİ SIRA SENDE!</ThemedText>
          </View>
      {((activity as any).questionText || (activity as any).QuestionText) && (
        <ThemedText style={styles.questionText}>
          {(activity as any).questionText || (activity as any).QuestionText}
        </ThemedText>
      )}

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          {categories.map((category, idx) => {
            const paletteColor = categoryPalette[idx % categoryPalette.length];
            const isActive = category.id === activeCategory;
            return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                  { borderColor: paletteColor },
                  isActive && [styles.activeTab, { backgroundColor: paletteColor, borderColor: paletteColor }]
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <ThemedText style={[
                styles.categoryTabText,
                  { color: paletteColor },
                  isActive && styles.activeTabText
              ]}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
            );})}
        </ScrollView>

        <View style={styles.optionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
            {(() => {
              const activeCat = categories.find(c => c.id === activeCategory);
              if (!activeCat) return null;

              const activeIdx = categories.findIndex(c => c.id === activeCategory);
              const paletteColor = categoryPalette[activeIdx % categoryPalette.length] || '#3BDAA4';
              
              return activeCat.options.map((option, index) => {
                  const isSelected = selectedWords.some(word => word.text === option && word.type === activeCategory);
                  return (
                <TouchableOpacity
                  key={index}
                  style={[
                        styles.optionButton,
                        { borderColor: '#EAEAEA', backgroundColor: isSelected ? paletteColor : '#FFFFFF' },
                  ]}
                  onPress={() => {
                    const existingWordIndex = selectedWords.findIndex(
                      word => word.text === option && word.type === activeCategory
                    );
                    if (existingWordIndex !== -1) {
                          // Seçimi kaldır
                      const newWords = [...selectedWords];
                      newWords.splice(existingWordIndex, 1);
                      setSelectedWords(newWords);
                    } else {
                          // İlk kategori tek seçim: önce o kategoriye ait varsa temizle
                          if (activeCategory === firstCategoryId) {
                            const cleared = selectedWords.filter(w => w.type !== firstCategoryId);
                            setSelectedWords([...cleared, { id: `${activeCategory}-${Date.now()}`, text: option, type: activeCategory }]);
                          } else {
                            setSelectedWords([...selectedWords, { id: `${activeCategory}-${Date.now()}`, text: option, type: activeCategory }]);
                          }
                        }
                      }}
                    >
                      <ThemedText style={[styles.optionText, { color: isSelected ? '#FFFFFF' : '#9C9C9C' }]}>{option}</ThemedText>
                </TouchableOpacity>
                  );
                });
            })()}
          </ScrollView>
        </View>

        <View style={styles.dropZoneContainer}>
            <View style={styles.promptHeaderRow}>
                <ThemedText style={styles.promptHeaderText}>Yapay Zeka Promptu:</ThemedText>
            <TouchableOpacity onPress={() => setSelectedWords([])}>
                <Image source={require('../assets/images/silgi-icon.png')} style={styles.eraserIcon} />
                </TouchableOpacity>
      </View>

            <View style={styles.promptRow}>
                {(() => {
                  const gridWords = selectedWords.filter(w => w.type !== firstCategoryId);
                  const lastFilledIndex = Math.max(0, gridWords.length - 1);
                  return Array.from({ length: 6 }).map((_, index) => {
                    const word = gridWords[index];
                    if (word) {
                        return (
                          <View key={word.id} style={styles.pillWrapper}>
                            <View style={[styles.pill, { backgroundColor: getPaletteColorByCategoryId(word.type) }]}>
                              <ThemedText style={styles.pillText}>{word.text}</ThemedText>
                            </View>
                            {index !== lastFilledIndex && <ThemedText style={styles.commaText}>,</ThemedText>}
                          </View>
                        );
                    } else {
                        return (
                          <View key={index} style={styles.pillWrapper}>
                            <View style={styles.placeholderBox} />
                          </View>
                        );
                    }
                  });
                })()}
            </View>

            <View style={styles.promptFixedRow}>
                <ThemedText style={styles.ellipsisText}>... bir</ThemedText>
                {(() => {
                  const firstSelected = selectedWords.find(w => w.type === firstCategoryId);
                  if (firstSelected) {
                    return (
                      <View style={styles.pillWrapper}>
                        <View style={[styles.pill, { backgroundColor: getPaletteColorByCategoryId(firstSelected.type) }]}>
                          <ThemedText style={styles.pillText}>{firstSelected.text}</ThemedText>
                        </View>
                      </View>
                    );
                  }
                  return (
                    <View style={styles.pillWrapper}>
                      <View style={styles.placeholderBox}>
                        <ThemedText style={styles.questionMarkText}>?</ThemedText>
                      </View>
                    </View>
                  );
                })()}
            </View>
        </View>
      </View>

    </ScrollView>

    {!loading && (
    <View style={styles.fixedActionsRow}>
      <TouchableOpacity 
        onPress={onPrev}
        style={styles.prevButton}
      >
        <Image source={require('../assets/images/geri-buton-2.png')} style={styles.navIcon} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.generateButton,
          (!selectedWords.find(w => w.type === firstCategoryId)) && styles.disabledButton
        ]} 
        onPress={generateImage}
        disabled={!selectedWords.find(w => w.type === firstCategoryId)}
      >
        <ThemedText style={styles.buttonText}>GÖRSELLEŞTİR!</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Alttaki eski ipucu bölümü kaldırıldı */}
        </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  scrollContentLoading: {
    paddingBottom: 40,
  },
  header: {
    position: 'absolute',
    top: 12,
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
  headerButtonRight: {
    marginTop: 5,
  },
  headerIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerIconLarge: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dropZoneContainer: {
    minHeight: 160,
    marginHorizontal: 16,
    marginTop: 5,
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
  promptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promptHeaderText: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '700',
  },
  eraserIcon: {
    width: 18,
    height: 18,
    opacity: 0.6,
    resizeMode: 'contain',
  },
  promptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pillWrapper: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptFixedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  pill: {
    width: '100%',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  commaText: {
    marginLeft: 6,
    color: '#9C9C9C',
    fontWeight: '700',
  },
  placeholderBox: {
    width: '100%',
    height: 36,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsisText: {
    color: '#9C9C9C',
  },
  questionPill: {
    width: 64,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionPillText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  questionMarkText: {
    color: '#9C9C9C',
    fontWeight: '700',
  },
  topImage: {
    width: '100%',
    height: 300,
    marginBottom: 0,
    borderRadius: 15,
  },
  imageWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 60,
    borderRadius: 15,
    overflow: 'hidden',
  },
  hintBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBadgeIcon: { width: 64, height: 64, resizeMode: 'contain' },
  hintArty: { position: 'absolute', width: 96, height: 96, resizeMode: 'contain' },
  hintOverlayIcon: { position: 'absolute', width: 220, height: 150, resizeMode: 'contain', marginTop: -150, marginLeft: -150 },
  hintTextWrap: {
    position: 'absolute',
    right: 12,
    bottom: 84,
    maxWidth: 300,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    left: -150,
  },
  // hintText: {
  //   fontSize: 12,
  //   color: '#212121',
  // },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.25)'
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chapterTitle: {
    fontSize: 25,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 6,
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
    textAlign: 'center',
    letterSpacing: 0.25,
  },
  loadingTextsContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  loadingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  loadingTitle: {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#3ECC9C',
  },
  loadingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9C9C9C',
  },
  adviceCard: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: 'rgba(26,26,26,0.08)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  adviceTitle: {
    color: '#4FC3F7',
    fontWeight: '700',
    marginBottom: 6,
  },
  adviceText: {
    color: '#666',
    marginBottom: 4,
  },
  adviceExample: {
    color: '#9C9C9C',
  },
  loadingBottomRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingArty: {
    width: 100,
    height: 100,
  },
  adviceBubbleBorder: {
    position: 'absolute',
    left: -50,
    right: 90,
    bottom: 54,
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F3F3F3',
    zIndex: -1,
  },
  adviceBubble: {
    position: 'absolute',
    left: -150,
    right: 0,
    bottom: 70,
    height: 120,
    zIndex: 0,
    width: 350,
  },
  adviceBubbleTextWrap: {
    position: 'absolute',
    left: -120,
    right: 0,
    bottom: 106,
    zIndex: 1,
    width: 320,
  },
  adviceBubbleTitle: {
    fontSize: 16,
    color: '#4FC3F7',
    fontWeight: '700',
    marginBottom: 2,
  },
  adviceBubbleText: {
    fontSize: 16,
    color: '#666',
  },
  loadingArtyContainer: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 90,
    position: 'relative',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'baloo',
    fontWeight: '400',
    color: '#212121',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryTabs: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  categoryTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    height: 36,
  },
  activeTab: {},
  categoryTabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  optionsScroll: {
    paddingHorizontal: 15,
  },
  optionsContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  optionButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    minWidth: 100,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  hintContainer: {
    backgroundColor: '#E0F2F1',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
 
  generateButton: {
    backgroundColor: '#3ECCB4',
    margin: 0,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: 180,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#9C9C9C', // Pasif halde daha soluk bir yeşil
  },
  resultMessageBox: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  resultMessageText: {
    fontSize: 14,
    color: '#212121',
  },
  resultButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#3ECCB4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 140,
    marginTop: 30,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 140,
    marginTop: 30,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '700',
  },
  feedbackCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  feedbackBadge: {
    color: '#9C9C9C',
    fontWeight: '700',
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 12,
    width: '60%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  feedbackText: {
    color: '#666',
    marginHorizontal: 18,
    marginBottom: 15,
    lineHeight: 20,
    marginTop: 12,

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsRow: {
    display: 'none',
  },
  fixedActionsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 90,
  },
  prevButton: {
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
  navIcon: { width: 24, height: 24, resizeMode: 'contain' },
  artyImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  textContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  finishButton: {
    width: 100,
    backgroundColor: '#4CAF50',
  },
  generatedImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  artyInfoContainer: {
    backgroundColor: '#E0F2F1',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artyInfoImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  artyInfoTextContainer: {
    flex: 1,
  },
  artyInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  artyInfoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});