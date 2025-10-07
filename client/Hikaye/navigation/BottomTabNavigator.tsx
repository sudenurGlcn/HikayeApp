import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AnalysisScreen from '../components/AnalysisScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
      }}
    >
      <Tab.Screen
        name="AnaSayfa"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/images/home-icon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4CAF50' : '#757575',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Kütüphane"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/images/library-icon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4CAF50' : '#757575',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/images/profile-icon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4CAF50' : '#757575',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Analiz"
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/images/analysis-icon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#4CAF50' : '#757575',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
