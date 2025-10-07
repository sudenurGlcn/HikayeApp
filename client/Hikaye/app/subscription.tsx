

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

// ==================================================================
// === GEREKLİ BİLGİLERİ BURAYA GİR ===
const SECRET_KEY = 'secret_live_CC0sjiTg.uQVm4qAKi9SOgRFQqoelHcNiRC1VCxO6'; 
const PAYWALL_ID = 'e51761c7-98ef-4109-8f84-2a0f8018f2cf'; // Örnek ID, kendininkini yapıştır

// Adapty panelinde oluşturduğun "Custom Store" ID'si
const CUSTOM_STORE_ID = 'deneme'; // Örn: 'deneme' veya ne isim verdiysen

// Adapty panelinde oluşturduğun ürünün "Custom Store" ID'si
//const CUSTOM_PRODUCT_ID = '123456'; // Örn: '123456' veya 'hackathon_monthly_1'
// ==================================================================

export default function PaywallScreen() {
  const router = useRouter();
  const { profileId } = useLocalSearchParams<{ profileId: string }>(); 

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Bu useEffect bloğu ürünleri çekmek için doğru çalışıyor.
  useEffect(() => {
    console.log('Mevcut products state:', products); // State'i kontrol edelim
    const fetchPaywallWithServerAPI = async () => {
      if (!PAYWALL_ID || !SECRET_KEY.includes('live')) {
        Alert.alert("Yapılandırma Hatası", "Lütfen koddaki SECRET_KEY ve PAYWALL_ID alanlarını doldurun.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://api.adapty.io/api/v2/server-side-api/paywalls/${PAYWALL_ID}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Api-Key ${SECRET_KEY}`,
            },
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Adapty API Hatası:", errorData);
          throw new Error('Adapty sunucusundan paywall alınamadı.');
        }

        const data = await response.json();
        console.log('API Yanıtı:', data); // API yanıtını kontrol edelim
        console.log('Ürünler:', data.products); // Ürünleri kontrol edelim
        setProducts(data.products || []); // Eğer products undefined ise boş array kullan

      } catch (error) {
        Alert.alert("Hata", "Abonelik paketleri yüklenirken bir sorun oluştu.");
        console.error("Sunucu API Paywall hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaywallWithServerAPI();
  }, []);

  const handleServerSidePurchase = async (productId: string) => {
    if (!profileId) {
      Alert.alert("Hata", "Kullanıcı Profili ID'si bulunamadı.");
      return;
    }
    setIsPurchasing(true);

    try {
      const purchasedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(purchasedAt.getMonth() + 1); // 1 ay sonrası
      const transactionId = `hackathon-tx-${Date.now()}`; // Her seferinde benzersiz bir ID oluştur

      const response = await fetch(
        `https://api.adapty.io/api/v2/server-side-api/purchase/set/transaction/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Api-Key ${SECRET_KEY}`,
            'Content-Type': 'application/json',
            'adapty-customer-user-id': 'demo@example.com',
          },
          body: JSON.stringify({
            // Hata mesajında istenen son eksik alan eklendi
            "purchase_type": "subscription",
            "store": "custom",
            "store_product_id": productId,
            "store_transaction_id": transactionId,
            "store_original_transaction_id": transactionId, 
            "price": {
                "currency": "USD",
                "value": 0.01,
                "country": "TR"
            },
            "purchased_at": purchasedAt.toISOString(),
            "originally_purchased_at": purchasedAt.toISOString(),
            "expires_at": expiresAt.toISOString(),
            "renew_status": true,
            "is_family_shared": false,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("Adapty sunucusundan gelen ham hata yanıtı:", errorText);
        throw new Error('Adapty sunucusunda işlem kaydedilemedi.');
      }

      // Transaction başarılı olduktan sonra erişim hakkı verme
      const grantResponse = await fetch(
        `https://api.adapty.io/api/v2/server-side-api/purchase/profile/grant/access-level/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Api-Key ${SECRET_KEY}`,
            'Content-Type': 'application/json',
            'adapty-customer-user-id': 'demo@example.com',
          },
          body: JSON.stringify({
            "access_level_id": "premium",
            "starts_at": purchasedAt.toISOString(),
            "expires_at": expiresAt.toISOString()
          }),
        }
      );

      if (!grantResponse.ok) {
        const errorText = await grantResponse.text();
        console.error("Erişim hakkı verme hatası:", errorText);
        throw new Error('Erişim hakkı verilemedi.');
      }
      
      Alert.alert("Demo Başarılı!", "Satın alma işlemi başarıyla kaydedildi ve premium erişim verildi.", 
        [{ text: "Harika!", onPress: () => router.back() }]
      );

    } catch (error) {
      Alert.alert("Hata", "Simülasyon sırasında bir hata oluştu.");
      console.error("Sunucu API Satın Alma hatası:", error);
    } finally {
      setIsPurchasing(false);
    }
  };
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Premium Paketler</Text>
      {products && Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
          <Pressable
            key={product.product_id}
            style={styles.productCard}
            onPress={() => handleServerSidePurchase(product.product_id)}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.productTitle}>{product.title ?? 'Aylık Paket'}</Text>
            )}
          </Pressable>
        ))
      ) : (
        <Text>Gösterilecek ürün bulunamadı.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      gap: 15,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    productCard: {
      backgroundColor: '#007AFF',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
      minHeight: 80, 
      justifyContent: 'center',
    },
    productTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
});

// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

// // Adapty SDK'sını ve tiplerini import ediyoruz
// // HATA 1 DÜZELTMESİ: Tipleri doğrudan import etmek yerine, 'adapty' objesi üzerinden kullanacağız.
// import { adapty } from 'react-native-adapty';

// // ==================================================================
// // === GEREKLİ BİLGİLERİ BURAYA GİR ===
// const PAYWALL_ID = 'e51761c7-98ef-4109-8f84-2a0f8018f2cf'; // Adapty panelindeki Paywall ID'niz
// // ==================================================================

// export default function PaywallScreen() {
//   const router = useRouter();
//   const { profileId } = useLocalSearchParams<{ profileId: string }>();

//   const [loading, setLoading] = useState(true);
//   // HATA 1 DÜZELTMESİ: Tipleri adapty objesi üzerinden belirtiyoruz.
//   const [paywall, setPaywall] = useState<any | null>(null);
//   const [products, setProducts] = useState<any[]>([]);
//   const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

//   useEffect(() => {
//     if (profileId) {
//       try {
//         adapty.identify(profileId);
//         console.log(`Kullanıcı ${profileId} olarak tanımlandı.`);
//       } catch (error) {
//         console.error('Adapty kullanıcı tanımlama hatası:', error);
//         Alert.alert("Hata", "Kullanıcı profili tanımlanamadı.");
//       }
//     }
//   }, [profileId]);

//   useEffect(() => {
//     const fetchPaywall = async () => {
//       if (!profileId) {
//         setLoading(false);
//         return;
//       }
//       try {
//         console.log(`${PAYWALL_ID} ID'li paywall çekiliyor...`);
//         const fetchedPaywall = await adapty.getPaywall(PAYWALL_ID);
        
//         // HATA 2 DÜZELTMESİ: 'placementId' yerine 'placement' kullanıyoruz.
//         console.log('Paywall başarıyla çekildi:', fetchedPaywall.placement);
        
//         setPaywall(fetchedPaywall);
//         setProducts(fetchedPaywall.products);
//       } catch (error) {
//         Alert.alert("Hata", "Abonelik paketleri yüklenirken bir sorun oluştu.");
//         console.error("Adapty SDK Paywall hatası:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaywall();
//   }, [profileId]);

//   // HATA 1 DÜZELTMESİ: Parametre tipini 'adapty.AdaptyProduct' olarak güncelliyoruz.
//   const handlePurchase = async (product: any) => {
//     if (!product) return;

//     setIsPurchasing(product.vendorProductId);

//     try {
//       console.log(`${product.vendorProductId} ürünü için satın alma başlatılıyor...`);
//       const result = await adapty.makePurchase(product);

//       // HATA 3 DÜZELTMESİ: Satın alma sonucunda 'profile' objesinin varlığını kontrol ediyoruz.
//       // Çünkü kullanıcı işlemi iptal ederse 'result' içinde 'profile' bilgisi gelmez.
//       if ('profile' in result && result.profile?.accessLevels?.['premium']?.isActive) {
//         console.log('Satın alma başarılı! Kullanıcı artık premium.');
//         Alert.alert(
//           "Başarılı!",
//           "Premium aboneliğiniz başarıyla başlatıldı.",
//           [{ text: "Harika!", onPress: () => router.back() }]
//         );
//       } else {
//          // Bu blok, kullanıcı satın almayı iptal ettiğinde veya işlem başarısız olduğunda çalışabilir.
//          // 'result.type' üzerinden daha detaylı kontrol de yapabilirsiniz. Örn: if (result.type === 'user_cancelled')
//          console.log('Satın alma tamamlanmadı veya erişim seviyesi aktif değil.', result);
//       }

//     } catch (error: any) {
//       if (error.adaptyCode === 'paymentCancelled') {
//         console.log('Kullanıcı satın almayı iptal etti.');
//       } else {
//         Alert.alert("Hata", "Satın alma sırasında bir sorun oluştu.");
//         console.error("Adapty SDK Satın Alma hatası:", error);
//       }
//     } finally {
//       setIsPurchasing(null);
//     }
//   };

//   if (loading) {
//     return <View style={styles.container}><ActivityIndicator size="large" /></View>;
//   }
  
//   if (!profileId) {
//      return <View style={styles.container}><Text>Kullanıcı profili yüklenemedi.</Text></View>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{paywall?.name ?? 'Premium Paketler'}</Text>
//       {products.length > 0 ? (
//         products.map((product) => (
//           <Pressable
//             key={product.vendorProductId}
//             style={[styles.productCard, isPurchasing === product.vendorProductId && styles.disabledCard]}
//             onPress={() => handlePurchase(product)}
//             disabled={!!isPurchasing}
//           >
//             {isPurchasing === product.vendorProductId ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.productTitle}>
//                 {product.localizedTitle} - {product.localizedPrice}
//               </Text>
//             )}
//           </Pressable>
//         ))
//       ) : (
//         <Text>Gösterilecek ürün bulunamadı.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 20,
//       gap: 15,
//       backgroundColor: '#f5f5f7'
//     },
//     title: {
//       fontSize: 28,
//       fontWeight: 'bold',
//       marginBottom: 20,
//     },
//     productCard: {
//       backgroundColor: '#007AFF',
//       paddingVertical: 20,
//       paddingHorizontal: 30,
//       borderRadius: 14,
//       width: '90%',
//       alignItems: 'center',
//       justifyContent: 'center',
//       shadowColor: "#000",
//       shadowOffset: {
//         width: 0,
//         height: 4,
//       },
//       shadowOpacity: 0.2,
//       shadowRadius: 5,
//       elevation: 5,
//     },
//     disabledCard: {
//       backgroundColor: '#a9a9a9',
//     },
//     productTitle: {
//       color: 'white',
//       fontSize: 18,
//       fontWeight: '600',
//     },
// });