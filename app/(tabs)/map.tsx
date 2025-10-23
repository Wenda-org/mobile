import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import FilterButton from '../../components/FilterButton';

export default function MapScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { id: 'cultural', label: t('cultural'), icon: '🏛️' },
    { id: 'natural', label: t('natural'), icon: '🌿' },
    { id: 'historical', label: t('historical'), icon: '🏰' },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Filters - Fixed at top */}
      <View className="px-4 py-3 border-b border-border-light dark:border-border-dark">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              active={activeFilter === filter.id}
              onPress={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View className="flex-1 items-center justify-center bg-primary/5">
        <View className="items-center px-8">
          <Text className="text-6xl mb-4">🗺️</Text>
          <Text className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {t('map')}
          </Text>
          <Text className={`text-sm text-center mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Interactive map view will be implemented here with react-native-maps
          </Text>
          
          {/* Mock Location Markers */}
          <View className="w-full space-y-2">
            <View className="bg-white dark:bg-background-dark-secondary p-3 rounded-lg">
              <Text className={`font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                📍 Fortaleza de São Miguel
              </Text>
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Luanda • 5.2 km
              </Text>
            </View>
            
            <View className="bg-white dark:bg-background-dark-secondary p-3 rounded-lg">
              <Text className={`font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                📍 Tundavala Gap
              </Text>
              <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Lubango • 120.5 km
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Sheet Placeholder */}
      <View 
        className={`absolute bottom-0 left-0 right-0 p-4 rounded-t-2xl ${
          isDark ? 'bg-background-dark-secondary' : 'bg-white'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View className="w-12 h-1 bg-border-light dark:bg-border-dark rounded-full self-center mb-3" />
        <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          Tap on markers to view details
        </Text>
      </View>
    </View>
  );
}
