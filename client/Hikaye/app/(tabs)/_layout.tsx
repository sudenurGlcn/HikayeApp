import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3ECC9C',
        headerShown: false,
        tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#F3F3F3',
            borderTopWidth: 1,
            borderTopColor: '#F3F3F3',
            height: 92,
            paddingTop: 15,
            paddingBottom: 15,
         
          },
          tabBarIconStyle: {
            marginBottom: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 0,
          },
      }}>
     <Tabs.Screen
  name="home"
  options={{
    title: 'Keşfet',
    tabBarIcon: ({ color, size }) => ( // size ve color prop'larını alıyoruz
      <Image
        source={require('../../assets/images/Keşfet.png')}
        style={{
          width: size,    // Genişliği buradan alıyoruz
          height: size,   // Yüksekliği buradan alıyoruz
          tintColor: color  // Aktif/pasif rengi buradan alıyoruz
        }}
      />
    ),
  }}
/>
      <Tabs.Screen
        name="library"
        options={{
          title: 'Kütüphane',
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('../../assets/images/Kütüphane.png')}
            style={{
              width: size,    // Genişliği buradan alıyoruz
              height: size,   // Yüksekliği buradan alıyoruz
              tintColor: color  // Aktif/pasif rengi buradan alıyoruz
            }}
          />
        ),
      }}
    />
     <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analiz',
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('../../assets/images/Analiz.png')}
            style={{
              width: size,    // Genişliği buradan alıyoruz
              height: size,   // Yüksekliği buradan alıyoruz
              tintColor: color  // Aktif/pasif rengi buradan alıyoruz
            }}
          />
        ),
      }}
    />
     
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('../../assets/images/profil.png')}
            style={{
              width: size,    // Genişliği buradan alıyoruz
              height: size,   // Yüksekliği buradan alıyoruz
              tintColor: color  // Aktif/pasif rengi buradan alıyoruz
            }}
          />
        ),
        }}
      />
    </Tabs>
  );
}