import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import DestinationCard from '../../components/DestinationCard';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { favorites, loadFavorites, isLoaded } = useFavoritesStore();

  useEffect(() => {
    if (!isLoaded) {
      loadFavorites();
    }
  }, [isLoaded, loadFavorites]);

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
          <Ionicons name="heart-outline" size={80} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text className={`text-xl font-bold mb-2 mt-4 text-center ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
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
            <DestinationCard 
              key={destination.id} 
              destination={{
                ...destination,
                image: destination.image || '',
              }} 
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
