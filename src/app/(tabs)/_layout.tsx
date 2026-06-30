import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Compass, Rss, Map, Calendar, Heart, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { colorScheme } = useTheme();
  const { t } = useTranslation();
  
  const activeColor = '#136F63';
  const inactiveColor = colorScheme === 'dark' ? '#8C8779' : '#8C8779';
  const tabBg = colorScheme === 'dark' ? 'rgba(22, 25, 16, 0.85)' : 'rgba(255, 255, 255, 0.92)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? 'rgba(242, 238, 230, 0.08)' : 'rgba(26, 24, 20, 0.08)',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : tabBg,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarBackground: Platform.OS === 'ios' ? () => (
          <BlurView 
            tint={colorScheme === 'dark' ? 'dark' : 'light'} 
            intensity={60} 
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          />
        ) : undefined,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.featured') || 'Descobrir',
          tabBarIcon: ({ color, size }) => <Compass size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Rss size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Map size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: t('trips.title') || 'Roteiros',
          tabBarIcon: ({ color, size }) => <Calendar size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites.title') || 'Favoritos',
          tabBarIcon: ({ color, size }) => <Heart size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title') || 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
