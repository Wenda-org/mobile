import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { useColorScheme } from '../../components/useColorScheme';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import TripSelectorModal from '../../components/TripSelectorModal';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock destination data (in real app, fetch from API)
const MOCK_DESTINATIONS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Fortaleza de São Miguel',
    location: 'Luanda',
    coordinate: { latitude: -8.8057, longitude: 13.2343 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fortaleza_de_S%C3%A3o_Miguel_de_Luanda.jpg/800px-Fortaleza_de_S%C3%A3o_Miguel_de_Luanda.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/S%C3%A3o_Miguel_Fort.jpg/800px-S%C3%A3o_Miguel_Fort.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Luanda_Bay.jpg/800px-Luanda_Bay.jpg',
    ],
    rating: 4.5,
    reviewCount: 342,
    category: 'Historical',
    description: 'The Fortress of São Miguel is a historic Portuguese fortress located in Luanda, Angola. Built in 1576, it offers stunning views of the city and harbor. This iconic landmark showcases colonial architecture and houses the Museum of the Armed Forces.',
    openingHours: 'Mon-Sat: 9:00 AM - 5:00 PM',
    ticketPrice: '500 Kz',
    reviews: [
      { id: 'r1', author: 'Maria Silva', rating: 5, text: 'Amazing historical site! The views are breathtaking.', date: '2025-10-15' },
      { id: 'r2', author: 'João Santos', rating: 4, text: 'Great place to learn about Angolan history.', date: '2025-10-10' },
      { id: 'r3', author: 'Ana Costa', rating: 5, text: 'Must-visit when in Luanda. Very well preserved.', date: '2025-10-05' },
    ],
  },
  '2': {
    id: '2',
    name: 'Tundavala Gap',
    location: 'Lubango',
    coordinate: { latitude: -14.9225, longitude: 13.5053 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Tundavala_gap.jpg/800px-Tundavala_gap.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Lubango_landscape.jpg/800px-Lubango_landscape.jpg',
    ],
    rating: 4.8,
    reviewCount: 256,
    category: 'Natural',
    description: 'Tundavala Gap is a spectacular viewpoint near Lubango offering panoramic views of the surrounding landscape. The dramatic cliff drops 1000 meters, providing one of Angola\'s most stunning natural vistas. Perfect for photography and nature lovers.',
    openingHours: 'Open 24/7',
    ticketPrice: 'Free',
    reviews: [
      { id: 'r4', author: 'Pedro Lopes', rating: 5, text: 'Absolutely stunning! One of the best viewpoints I\'ve ever seen.', date: '2025-10-20' },
      { id: 'r5', author: 'Sofia Martins', rating: 5, text: 'Words cannot describe the beauty. A must-see!', date: '2025-10-18' },
    ],
  },
  '3': {
    id: '3',
    name: 'Kalandula Falls',
    location: 'Malanje',
    coordinate: { latitude: -9.0686, longitude: 16.0056 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Quedas_de_Calandula.jpg/800px-Quedas_de_Calandula.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Kalandula_waterfalls.jpg/800px-Kalandula_waterfalls.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Angola_waterfall.jpg/800px-Angola_waterfall.jpg',
    ],
    rating: 4.9,
    reviewCount: 512,
    category: 'Natural',
    description: 'Kalandula Falls is one of the largest waterfalls in Africa, with a height of 105 meters and width of 400 meters. Located on the Lucala River, it\'s a spectacular natural wonder and a major tourist attraction in Angola.',
    openingHours: 'Daily: 8:00 AM - 6:00 PM',
    ticketPrice: '1000 Kz',
    reviews: [
      { id: 'r6', author: 'Carlos Mendes', rating: 5, text: 'Magnificent! The power and beauty of nature at its best.', date: '2025-10-22' },
      { id: 'r7', author: 'Lucia Fernandes', rating: 5, text: 'Worth the journey. Absolutely breathtaking!', date: '2025-10-21' },
      { id: 'r8', author: 'Miguel Oliveira', rating: 4, text: 'Amazing falls. Bring a camera!', date: '2025-10-19' },
    ],
  },
  'fortaleza': {
    id: 'fortaleza',
    name: 'Fortaleza de São Miguel',
    location: 'Luanda',
    coordinate: { latitude: -8.8057, longitude: 13.2343 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fortaleza_de_S%C3%A3o_Miguel_de_Luanda.jpg/800px-Fortaleza_de_S%C3%A3o_Miguel_de_Luanda.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/S%C3%A3o_Miguel_Fort.jpg/800px-S%C3%A3o_Miguel_Fort.jpg',
    ],
    rating: 4.7,
    reviewCount: 342,
    category: 'historical',
    description: 'Historic fortress with city views. Built in 1576, it offers stunning views of the city and harbor.',
    openingHours: 'Mon-Sat: 9:00 AM - 5:00 PM',
    ticketPrice: '500 Kz',
    reviews: [
      { id: 'r1', author: 'Maria Silva', rating: 5, text: 'Amazing historical site!', date: '2025-10-15' },
    ],
  },
  'tundavala': {
    id: 'tundavala',
    name: 'Tundavala Gap',
    location: 'Lubango, Huíla',
    coordinate: { latitude: -14.9225, longitude: 13.5053 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Tundavala_gap.jpg/800px-Tundavala_gap.jpg',
    ],
    rating: 4.9,
    reviewCount: 256,
    category: 'natural',
    description: 'Stunning viewpoint near Lubango with dramatic cliff drops 1000 meters.',
    openingHours: 'Open 24/7',
    ticketPrice: 'Free',
    reviews: [
      { id: 'r4', author: 'Pedro Lopes', rating: 5, text: 'Absolutely stunning!', date: '2025-10-20' },
    ],
  },
  'kalandula': {
    id: 'kalandula',
    name: 'Kalandula Falls',
    location: 'Malanje',
    coordinate: { latitude: -9.0686, longitude: 16.0056 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Quedas_de_Calandula.jpg/800px-Quedas_de_Calandula.jpg',
    ],
    rating: 4.8,
    reviewCount: 512,
    category: 'natural',
    description: 'One of Africa\'s largest waterfalls. Height of 105 meters and width of 400 meters.',
    openingHours: 'Daily: 8:00 AM - 6:00 PM',
    ticketPrice: '1000 Kz',
    reviews: [
      { id: 'r6', author: 'Carlos Mendes', rating: 5, text: 'Magnificent!', date: '2025-10-22' },
    ],
  },
  'museu': {
    id: 'museu',
    name: 'Museu Nacional de Antropologia',
    location: 'Luanda',
    coordinate: { latitude: -8.8137, longitude: 13.2344 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Museu_Nacional_de_Antropologia.jpg/800px-Museu_Nacional_de_Antropologia.jpg',
    ],
    rating: 4.5,
    reviewCount: 178,
    category: 'cultural',
    description: 'Cultural museum in Luanda showcasing Angolan anthropology and heritage.',
    openingHours: 'Tue-Sun: 10:00 AM - 6:00 PM',
    ticketPrice: '300 Kz',
    reviews: [
      { id: 'r9', author: 'Isabel Ramos', rating: 4, text: 'Great cultural experience!', date: '2025-10-12' },
    ],
  },
  'kissama': {
    id: 'kissama',
    name: 'Kissama National Park',
    location: 'Bengo',
    coordinate: { latitude: -9.1667, longitude: 13.7833 },
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Kissama_National_Park.jpg/800px-Kissama_National_Park.jpg',
    ],
    rating: 4.6,
    reviewCount: 289,
    category: 'natural',
    description: 'Wildlife safari and nature reserve. Home to elephants, giraffes, and many other species.',
    openingHours: 'Daily: 6:00 AM - 6:00 PM',
    ticketPrice: '2000 Kz',
    reviews: [
      { id: 'r10', author: 'Ricardo Alves', rating: 5, text: 'Amazing wildlife!', date: '2025-10-08' },
    ],
  },
};

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
  const destination = MOCK_DESTINATIONS[id || '1'];
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
