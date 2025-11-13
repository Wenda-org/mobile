import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../components/useColorScheme';
import SearchBar from '../../components/SearchBar';
import FilterButton from '../../components/FilterButton';
import DestinationCard, { Destination } from '../../components/DestinationCard';
import { MOCK_DESTINATIONS, MOCK_CATEGORIES } from '../../data/mockDestinations';
import { useRecommendations } from '../../hooks/useRecommendations';

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Obter recomendações personalizadas
  const { recommendedDestinations, featuredDestinations, hasPreferences } = useRecommendations();

  // Categorias para filtros
  const filters = useMemo(() => [
    { id: 'all', label: t('all') || 'All', icon: 'apps' },
    ...MOCK_CATEGORIES.map(cat => ({
      id: cat.slug,
      label: cat.name,
      icon: cat.icon as any,
    }))
  ], [t]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Converter destinos mock para formato do card
  const convertToDestination = (dest: typeof MOCK_DESTINATIONS[0]): Destination => ({
    id: String(dest.id),
    name: dest.name,
    location: dest.province || dest.location,
    image: dest.images[0]?.url || '',
    rating: dest.rating,
    distance: 0, // Pode calcular com useLocation se necessário
    category: dest.category.slug,
  });

  // Filtrar destinos baseado no filtro ativo e busca
  const filteredDestinations = useMemo(() => {
    let results = MOCK_DESTINATIONS;

    // Filtrar por categoria
    if (activeFilter && activeFilter !== 'all') {
      results = results.filter(dest => dest.category.slug === activeFilter);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(dest =>
        dest.name.toLowerCase().includes(query) ||
        dest.location.toLowerCase().includes(query) ||
        dest.province.toLowerCase().includes(query)
      );
    }

    return results.map(convertToDestination);
  }, [activeFilter, searchQuery]);

  // Top destinos (mais bem avaliados)
  const topDestinations = useMemo(() => {
    return filteredDestinations
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [filteredDestinations]);

  // Destinos em destaque
  const featuredCards = useMemo(() => {
    return featuredDestinations.map(convertToDestination).slice(0, 5);
  }, [featuredDestinations]);

  // Recomendações personalizadas
  const recommendedCards = useMemo(() => {
    return recommendedDestinations.map(convertToDestination);
  }, [recommendedDestinations]);

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#136F63"
            colors={['#136F63']}
          />
        }
      >
        {/* Header */}
        <View className={`px-4 pt-12 pb-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('welcome_title')}
              </Text>
              <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('discover')}
              </Text>
            </View>
            <TouchableOpacity 
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color={isDark ? '#9CA3AF' : '#4B5563'} 
              />
            </TouchableOpacity>
          </View>

          <Text className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('welcome_desc')}
          </Text>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('search_placeholder')}
            onSearch={() => console.log('Search:', searchQuery)}
          />
        </View>

        {/* Filters */}
        <View className="py-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                className={`mr-3 px-4 py-2.5 rounded-full flex-row items-center ${
                  activeFilter === filter.id
                    ? 'bg-primary'
                    : isDark
                    ? 'bg-gray-800'
                    : 'bg-white border border-gray-200'
                }`}
                style={
                  activeFilter !== filter.id && !isDark
                    ? {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                    : {}
                }
              >
                <Ionicons
                  name={filter.icon as any}
                  size={18}
                  color={
                    activeFilter === filter.id
                      ? '#FFFFFF'
                      : isDark
                      ? '#9CA3AF'
                      : '#6B7280'
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  className={`font-semibold ${
                    activeFilter === filter.id
                      ? 'text-white'
                      : isDark
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between">
            <View 
              className={`flex-1 mr-2 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                  <Ionicons name="location" size={20} color="#136F63" />
                </View>
                <View>
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {filteredDestinations.length}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Destinations
                  </Text>
                </View>
              </View>
            </View>

            <View 
              className={`flex-1 ml-2 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-3">
                  <Ionicons name="star" size={20} color="#FFD166" />
                </View>
                <View>
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    4.7
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Avg Rating
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Featured Destinations Carousel */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <View>
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('featured_destinations')}
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Most popular attractions
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-semibold">{t('view_all')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredCards}
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
            <View>
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('top_destinations')}
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Highly rated places
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-semibold">{t('view_all')}</Text>
            </TouchableOpacity>
          </View>
          
          {topDestinations.map((destination: Destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </View>

        {/* Recommended for You */}
        {hasPreferences && recommendedCards.length > 0 && (
          <View className="px-4 mb-8">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('recommended_for_you')}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Based on your preferences
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons 
                  name="refresh" 
                  size={20} 
                  color="#136F63" 
                />
              </TouchableOpacity>
            </View>
            
            {recommendedCards.map((destination: Destination) => (
              <DestinationCard key={`rec-${destination.id}`} destination={destination} />
            ))}
          </View>
        )}

        {/* Explore More - Se não tem recomendações personalizadas */}
        {(!hasPreferences || recommendedCards.length === 0) && (
          <View className="px-4 mb-8">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Explore More
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Discover amazing places
                </Text>
              </View>
            </View>
            
            {filteredDestinations.slice(0, 5).map((destination: Destination) => (
              <DestinationCard key={`explore-${destination.id}`} destination={destination} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}