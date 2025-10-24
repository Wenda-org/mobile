import { Tabs } from "expo-router";
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native'; // 👈 importa Text
import '../../global.css';
import '../../i18n';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#136F63',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E4E6EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: t('discover'),
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: t('map'),
          tabBarIcon: ({ color }) => <TabIcon icon="🗺️" color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="favorites" 
        options={{ 
          title: t('favorites'),
          tabBarIcon: ({ color }) => <TabIcon icon="❤️" color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="two" 
        options={{ 
          title: t('profile'),
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }} 
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <Text
      style={{
        fontSize: 24,
        color,
        opacity: color === '#136F63' ? 1 : 0.6,
      }}
    >
      {icon}
    </Text>
  );
}
