import React from 'react';
import { View, Text, ScrollView, Pressable, Platform, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { FadeInDownView } from '@/components/animated-wrappers';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, Compass, MapPin, Star } from 'lucide-react-native';

export default function FavoritesTabScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavorites();

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchFavorites();
  };

  const handleCardPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/destination/${id}`);
  };

  const handleUnfavorite = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await removeFavorite(id);
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('favorites.title')}
        </Text>
        <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
          {t('favorites.subtitle')}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 mt-4"
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#136F63" />
        }
      >
        {favorites.length > 0 ? (
          <View className="space-y-4">
            {favorites.map((dest) => (
              <FadeInDownView
                key={dest.id}
                duration={400}
              >
                <Pressable
                  onPress={() => handleCardPress(dest.id)}
                  className="flex-row bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md overflow-hidden shadow-sm p-3 h-28"
                >
                  <View className="w-24 h-full bg-primary/10 rounded-md overflow-hidden mr-3">
                    {dest.images && dest.images.length > 0 ? (
                      <Image source={{ uri: dest.images[0].url }} className="w-full h-full" contentFit="cover" />
                    ) : (
                      <View className="flex-1 items-center justify-center"><Compass size={24} color="#136F63" /></View>
                    )}
                  </View>
                  <View className="flex-1 justify-between py-1">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-2">
                        <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
                          {dest.name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <MapPin size={10} color="#8C8779" />
                          <Text className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark ml-1" numberOfLines={1}>
                            {dest.province || dest.location}
                          </Text>
                        </View>
                      </View>
                      
                      <Pressable 
                        onPress={() => handleUnfavorite(dest.id)}
                        className="p-1 -mt-1 -mr-1"
                      >
                        <Heart size={18} color="#EF476F" fill="#EF476F" />
                      </Pressable>
                    </View>
                    
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Star size={12} color="#FFD166" fill="#FFD166" />
                        <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark ml-1">
                          {dest.rating || '4.5'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </FadeInDownView>
            ))}
          </View>
        ) : (
          /* Empty State */
          <FadeInDownView className="flex-1 items-center justify-center py-20 px-4">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
              <Heart size={36} color="#EF476F" fill="transparent" />
            </View>
            <Text className="text-lg font-bold text-center text-text-primary-light dark:text-text-primary-dark">
              Nenhum favorito salvo
            </Text>
            <Text className="text-sm text-center text-text-secondary-light dark:text-text-secondary-dark mt-2 leading-relaxed max-w-xs">
              {t('favorites.empty_state')}
            </Text>
          </FadeInDownView>
        )}
      </ScrollView>
    </View>
  );
}
