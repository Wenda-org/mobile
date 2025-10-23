import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import DestinationCard, { Destination } from '../../components/DestinationCard';

// Mock favorites data
const mockFavorites: Destination[] = [
  {
    id: '1',
    name: 'Fortaleza de São Miguel',
    location: 'Luanda',
    image: 'https://via.placeholder.com/400x300',
    rating: 4.5,
    distance: 5.2,
    category: 'Historical',
  },
  {
    id: '3',
    name: 'Kalandula Falls',
    location: 'Malanje',
    image: 'https://via.placeholder.com/400x300',
    rating: 4.9,
    distance: 350.0,
    category: 'Natural',
  },
];

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [favorites] = useState<Destination[]>(mockFavorites);

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Header */}
      <View className="px-4 pt-6 pb-2">
        <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          {t('favorites')}
        </Text>
        <Text className={`text-base mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
          {favorites.length} {favorites.length === 1 ? 'destination' : 'destinations'} saved
        </Text>
      </View>

      {favorites.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">♡</Text>
          <Text className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            No favorites yet
          </Text>
          <Text className={`text-sm text-center ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Start exploring and save your favorite destinations to see them here
          </Text>
        </View>
      ) : (
        /* Favorites List */
        <ScrollView showsVerticalScrollIndicator={false} className="px-4">
          {favorites.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
