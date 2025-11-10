import { Tabs } from "expo-router";
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../components/useColorScheme';
import '../../global.css';
import '../../i18n';

export default function TabsLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#136F63',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: t('discover'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "compass" : "compass-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: t('map'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "map" : "map-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="favorites" 
        options={{ 
          title: t('favorites'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "heart" : "heart-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: t('profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }} 
      />
    </Tabs>
  );
}
