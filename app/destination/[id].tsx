import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { useColorScheme } from '../../components/useColorScheme';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import TripSelectorModal from '../../components/TripSelectorModal';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DESTINATIONS } from '../../data/mockDestinations';

const { width } = Dimensions.get('window');

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'nearby'>('overview');
  const [showTripSelector, setShowTripSelector] = useState(false);
  
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  // Buscar destino pelos dados mockados
  const destination = useMemo(() => {
    const dest = MOCK_DESTINATIONS.find(d => String(d.id) === id);
    if (!dest) return null;

    // Converter para o formato esperado pela tela
    return {
      id: String(dest.id),
      name: dest.name,
      location: `${dest.location}, ${dest.province}`,
      coordinate: {
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
      images: dest.images.map(img => img.url),
      rating: dest.rating,
      reviewCount: dest.reviewCount,
      category: dest.category.name,
      description: dest.description,
      openingHours: 'Aberto diariamente',
      ticketPrice: dest.isFeatured ? '1000 Kz' : 'Grátis',
      reviews: [
        { 
          id: 'r1', 
          author: 'Maria Silva', 
          rating: 5, 
          text: 'Lugar incrível! Recomendo muito.', 
          date: '2025-11-10' 
        },
        { 
          id: 'r2', 
          author: 'João Santos', 
          rating: dest.rating >= 4.5 ? 5 : 4, 
          text: 'Uma experiência maravilhosa. Vale muito a pena visitar.', 
          date: '2025-11-08' 
        },
      ],
    };
  }, [id]);

  const favorited = isFavorite(destination?.id || '');

  if (!destination) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Destination not found</Text>
      </View>
    );
  }

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFavorite(destination.id);
    } else {
      addFavorite({
        id: destination.id,
        name: destination.name,
        location: destination.location,
        image: destination.images[0],
        rating: destination.rating,
        category: destination.category,
      });
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Header with back button */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className="w-10 h-10 rounded-full bg-white/90 items-center justify-center"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }}
        >
          <Ionicons 
            name={favorited ? "heart" : "heart-outline"} 
            size={24} 
            color={favorited ? "#EF4444" : "#6B7280"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {destination.images.map((img: string, idx: number) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={{ width, height: 300 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Image Indicators */}
        <View className="flex-row justify-center py-2">
          {destination.images.map((_: any, idx: number) => (
            <View
              key={idx}
              className={`w-2 h-2 rounded-full mx-1 ${
                idx === activeImageIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Content */}
        <View className="px-4 py-4">
          {/* Title and Location */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <View className="bg-primary px-3 py-1 rounded-full mr-2">
                <Text className="text-white text-xs font-semibold">{destination.category}</Text>
              </View>
            </View>
            
            <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {destination.name}
            </Text>
            
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text className={`text-base ml-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                {destination.location}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="star" size={18} color="#FFD166" />
              <Text className={`text-base font-semibold ml-1 mr-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {destination.rating.toFixed(1)}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                ({destination.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row mb-4">
            {(['overview', 'reviews', 'nearby'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-3 border-b-2 ${
                  activeTab === tab ? 'border-primary' : 'border-gray-300'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    activeTab === tab
                      ? 'text-primary'
                      : isDark
                      ? 'text-text-dark-secondary'
                      : 'text-text-light-secondary'
                  }`}
                >
                  {t(tab)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <View>
              <Text className={`text-base mb-4 leading-6 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {destination.description}
              </Text>

              <View className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-background-dark-secondary' : 'bg-background-light-secondary'}`}>
                <View className="flex-row justify-between mb-2">
                  <Text className={`font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                    Opening Hours
                  </Text>
                  <Text className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                    {destination.openingHours}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className={`font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                    Ticket Price
                  </Text>
                  <Text className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                    {destination.ticketPrice}
                  </Text>
                </View>
              </View>

              {/* Embedded Map */}
              <View className="h-48 rounded-xl overflow-hidden mb-4">
                <MapView
                  provider={PROVIDER_DEFAULT}
                  style={{ flex: 1 }}
                  initialRegion={{
                    ...destination.coordinate,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  mapType="none"
                >
                  <UrlTile
                    urlTemplate="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=WAR0kpnOyAdsQVF60SWf"
                    maximumZ={19}
                    flipY={false}
                    zIndex={1}
                  />
                  <Marker coordinate={destination.coordinate} title={destination.name} />
                </MapView>
              </View>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mb-2"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }}
                onPress={() => {
                  // Navigate to map tab with focus on this destination
                  router.push({
                    // @ts-ignore
                    pathname: '/(tabs)/map',
                    params: {
                      focusLat: destination.coordinate.latitude,
                      focusLon: destination.coordinate.longitude,
                      destinationId: destination.id,
                    }
                  });
                }}
              >
                <Text className="text-white text-base font-semibold">{t('open_on_map')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`rounded-xl py-4 items-center border-2 border-primary ${
                  isDark ? 'bg-background-dark' : 'bg-white'
                }`}
                onPress={() => setShowTripSelector(true)}
              >
                <Text className="text-primary text-base font-semibold">{t('add_to_trip')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View>
              {destination.reviews.map((review: any) => (
                <View
                  key={review.id}
                  className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-background-dark-secondary' : 'bg-background-light-secondary'}`}
                >
                  <View className="flex-row justify-between mb-2">
                    <Text className={`font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                      {review.author}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={14} color="#FFD166" />
                      <Text className={`text-sm font-semibold ml-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                        {review.rating}
                      </Text>
                    </View>
                  </View>
                  <Text className={`text-sm mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                    {review.text}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                    {review.date}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'nearby' && (
            <View className="items-center py-8">
              <Text className="text-4xl mb-2">🗺️</Text>
              <Text className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Nearby places feature coming soon
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TripSelectorModal
        visible={showTripSelector}
        onClose={() => setShowTripSelector(false)}
        destination={{
          id: destination.id,
          name: destination.name,
          location: destination.location,
          image: destination.images[0],
          rating: destination.rating,
          category: destination.category,
        }}
      />
    </View>
  );
}
