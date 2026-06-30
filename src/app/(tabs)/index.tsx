import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, RefreshControl, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/hooks/useAuth';
import { useDestinations } from '@/hooks/useDestinations';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Search, Compass, MapPin, Star, Sparkles, CloudSun } from 'lucide-react-native';

const MOCK_FEATURED = [
  {
    id: 'dest_1',
    name: 'Fendas da Tundavala',
    location: 'Lubango, Huíla',
    imageUrl: 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=400',
    rating: 4.8,
  },
  {
    id: 'dest_2',
    name: 'Quedas de Kalandula',
    location: 'Kalandula, Malanje',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    rating: 4.9,
  },
  {
    id: 'dest_3',
    name: 'Miradouro da Lua',
    location: 'Belas, Luanda',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
    rating: 4.7,
  }
];

export default function DiscoverHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { destinations, categories, isLoadingDestinations, refetchDestinations } = useDestinations();
  const { recommendations, isLoading: isLoadingRecs } = useRecommendations(4);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchDestinations();
    setRefreshing(false);
  };

  const handleCardPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/destination/${id}`);
  };

  // Filtered destinations list
  const getFilteredDestinations = () => {
    let list = destinations.length > 0 ? destinations : [];
    if (selectedCategory) {
      list = list.filter(d => d.categoryId === selectedCategory);
    }
    if (searchQuery) {
      list = list.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  };

  const filteredDests = getFilteredDestinations();

  return (
    <ScrollView 
      className="flex-1 bg-base-light dark:bg-base-dark"
      style={{ paddingTop: insets.top }}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#136F63" />
      }
    >
      {/* Header Profile Greeting */}
      <View className="flex-row justify-between items-center px-6 mt-6">
        <View>
          <Text className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
            Angola Guia Inteligente
          </Text>
          <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
            {t('home.greeting', { name: user?.name ? user.name.split(' ')[0] : 'Viajante' })}
          </Text>
        </View>
        <Pressable 
          onPress={() => router.push('/(tabs)/profile')}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-light dark:bg-surface-dark items-center justify-center"
        >
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} className="w-full h-full" contentFit="cover" />
          ) : (
            <Text className="text-lg font-bold text-primary">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Weather Info Card */}
      <View className="mx-6 mt-5 bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md p-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <CloudSun size={24} color="#136F63" className="mr-3" />
          <View>
            <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
              Luanda, Angola
            </Text>
            <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mt-0.5">
              28°C • Parcialmente Nublado
            </Text>
          </View>
        </View>
        <Text className="text-xs text-primary font-bold">Cacimbo 🍂</Text>
      </View>

      {/* Search Bar */}
      <View className="mx-6 mt-6">
        <View className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md px-4 h-14 shadow-sm">
          <Search size={20} color="#8C8779" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('home.search_placeholder')}
            placeholderTextColor="#8C8779"
            className="flex-1 ml-3 text-text-primary-light dark:text-text-primary-dark text-base"
          />
        </View>
      </View>

      {/* Categories Horizontal Selector */}
      <View className="mt-8">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            className={`px-5 py-3 rounded-full mr-3 border ${
              selectedCategory === null 
                ? 'bg-primary border-primary' 
                : 'bg-surface-light dark:bg-surface-dark border-borderSubtle-light dark:border-borderSubtle-dark'
            }`}
          >
            <Text className={`text-xs font-semibold ${selectedCategory === null ? 'text-white' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
              Todos
            </Text>
          </Pressable>

          {(categories.length > 0 ? categories : [
            { id: 'cat_1', name: 'Natureza' },
            { id: 'cat_2', name: 'História' },
            { id: 'cat_3', name: 'Aventura' },
            { id: 'cat_4', name: 'Praias' }
          ]).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`px-5 py-3 rounded-full mr-3 border ${
                  isSelected 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface-light dark:bg-surface-dark border-borderSubtle-light dark:border-borderSubtle-dark'
                }`}
              >
                <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* AI Recommendations Section */}
      <View className="mt-8">
        <View className="flex-row items-center justify-between px-6 mb-4">
          <View className="flex-row items-center">
            <Sparkles size={18} color="#FFD166" className="mr-2" />
            <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              {t('home.recommended')}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/check-preferences')}>
            <Text className="text-xs font-bold text-primary">Sintonizar IA</Text>
          </Pressable>
        </View>

        {isLoadingRecs ? (
          <View className="px-6 flex-row space-x-4">
            <View className="w-48 h-32 bg-surface-light dark:bg-surface-dark rounded-md" />
            <View className="w-48 h-32 bg-surface-light dark:bg-surface-dark rounded-md" />
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {recommendations.length > 0 ? (
              recommendations.map((dest) => (
                <Pressable
                  key={dest.id}
                  onPress={() => handleCardPress(dest.id)}
                  className="w-48 bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md overflow-hidden mr-4 shadow-sm"
                >
                  <View className="w-full h-28 bg-primary/10">
                    {dest.images && dest.images.length > 0 ? (
                      <Image source={{ uri: dest.images[0].url }} className="w-full h-full" contentFit="cover" />
                    ) : (
                      <View className="flex-1 items-center justify-center"><Compass size={24} color="#136F63" /></View>
                    )}
                  </View>
                  <View className="p-3">
                    <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
                      {dest.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={10} color="#8C8779" />
                      <Text className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark ml-1" numberOfLines={1}>
                        {dest.province || dest.location}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <Star size={10} color="#FFD166" fill="#FFD166" />
                        <Text className="text-[10px] font-bold text-text-primary-light dark:text-text-primary-dark ml-1">
                          {dest.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              // Local mock recommendations fallback
              MOCK_FEATURED.map((dest) => (
                <Pressable
                  key={dest.id}
                  onPress={() => handleCardPress(dest.id)}
                  className="w-48 bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md overflow-hidden mr-4 shadow-sm"
                >
                  <Image source={{ uri: dest.imageUrl }} className="w-full h-28" contentFit="cover" />
                  <View className="p-3">
                    <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
                      {dest.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={10} color="#8C8779" />
                      <Text className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark ml-1" numberOfLines={1}>
                        {dest.location}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <Star size={10} color="#FFD166" fill="#FFD166" />
                        <Text className="text-[10px] font-bold text-text-primary-light dark:text-text-primary-dark ml-1">
                          {dest.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Featured Destinations List */}
      <View className="mt-8 px-6">
        <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          {searchQuery ? 'Resultados da Pesquisa' : t('home.featured')}
        </Text>

        <View className="space-y-4">
          {(searchQuery || selectedCategory ? filteredDests : (destinations.length > 0 ? destinations : [])).length > 0 ? (
            (searchQuery || selectedCategory ? filteredDests : destinations).map((dest) => (
              <Pressable
                key={dest.id}
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
                  <View>
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
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Star size={12} color="#FFD166" fill="#FFD166" />
                      <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark ml-1">
                        {dest.rating || '4.5'}
                      </Text>
                    </View>
                    <Text className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {dest.category?.name || 'Visita'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            // Local mockup fallback destinations
            MOCK_FEATURED.map((dest) => (
              <Pressable
                key={dest.id}
                onPress={() => handleCardPress(dest.id)}
                className="flex-row bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md overflow-hidden shadow-sm p-3 h-28 mb-3"
              >
                <Image source={{ uri: dest.imageUrl }} className="w-24 h-full rounded-md mr-3" contentFit="cover" />
                <View className="flex-1 justify-between py-1">
                  <View>
                    <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark" numberOfLines={1}>
                      {dest.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={10} color="#8C8779" />
                      <Text className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark ml-1" numberOfLines={1}>
                        {dest.location}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Star size={12} color="#FFD166" fill="#FFD166" />
                      <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark ml-1">
                        {dest.rating}
                      </Text>
                    </View>
                    <Text className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Natureza
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
