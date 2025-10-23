import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import SearchBar from '../../components/SearchBar';
import FilterButton from '../../components/FilterButton';
import DestinationCard, { Destination } from '../../components/DestinationCard';

// Mock data - Replace with API calls
const mockDestinations: Destination[] = [
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
    id: '2',
    name: 'Tundavala Gap',
    location: 'Lubango',
    image: 'https://via.placeholder.com/400x300',
    rating: 4.8,
    distance: 120.5,
    category: 'Natural',
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

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { id: 'cultural', label: t('cultural'), icon: '🏛️' },
    { id: 'natural', label: t('natural'), icon: '🌿' },
    { id: 'historical', label: t('historical'), icon: '🏰' },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-2">
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {t('discover')}
          </Text>
          <Text className={`text-base mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            {t('welcome_desc')}
          </Text>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('search_placeholder')}
            onSearch={() => console.log('Search:', searchQuery)}
          />

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
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

        {/* Featured Destinations Carousel */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <Text className={`text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {t('featured_destinations')}
            </Text>
            <Text className="text-primary text-sm font-semibold">{t('view_all')}</Text>
          </View>
          
          <FlatList
            data={mockDestinations.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `featured-${item.id}`}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View style={{ width: 300, marginRight: 12 }}>
                <DestinationCard destination={item} />
              </View>
            )}
          />
        </View>

        {/* Top Destinations */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {t('top_destinations')}
            </Text>
            <Text className="text-primary text-sm font-semibold">{t('view_all')}</Text>
          </View>
          
          {mockDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </View>

        {/* Recommended for You */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {t('recommended_for_you')}
            </Text>
            <Text className="text-primary text-sm font-semibold">{t('view_all')}</Text>
          </View>
          
          {mockDestinations.slice().reverse().map((destination) => (
            <DestinationCard key={`rec-${destination.id}`} destination={destination} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

