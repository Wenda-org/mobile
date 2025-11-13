/**
 * EXEMPLO DE INTEGRAÇÃO REAL - Tela de Descoberta
 * 
 * Este é um exemplo de como integrar a API na tela de descoberta
 * Substitua o conteúdo de app/(tabs)/index.tsx por este código
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../components/useColorScheme';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import DestinationCard from '../components/DestinationCard';
import ApiTestButton from '../components/ApiTestButton';

// Importar serviços
import { destinationService, categoryService } from '../services';
import type { DestinationSummary, CategoryWithCount } from '../types/api.types';

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Estados
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Carregar categorias (uma vez)
  useEffect(() => {
    loadCategories();
  }, []);

  // Carregar destinos
  useEffect(() => {
    loadDestinations();
  }, [activeFilter, searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadDestinations = async (pageNum = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      }

      const response = await destinationService.getDestinations({
        page: pageNum,
        perPage: 20,
        categoryId: activeFilter && activeFilter !== 'all' ? activeFilter : undefined,
        search: searchQuery || undefined,
        sortBy: 'rating',
      });

      if (response.success) {
        if (append) {
          setDestinations(prev => [...prev, ...response.data]);
        } else {
          setDestinations(response.data);
        }
        setHasMore(response.meta.hasNext);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Erro ao carregar destinos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadDestinations(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadDestinations(page + 1, true);
    }
  };

  // Filtros dinâmicos baseados nas categorias da API
  const filters = [
    { id: 'all', label: t('all') || 'All', icon: 'apps' },
    ...categories.map(cat => ({
      id: cat.id,
      label: cat.name,
      icon: cat.icon || 'business',
    })),
  ];

  const featuredDestinations = destinations.filter(d => d.isFeatured).slice(0, 3);
  const topDestinations = destinations.slice(0, 4);

  if (loading && destinations.length === 0) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color="#136F63" />
        <Text className={`mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('loading') || 'Carregando destinos...'}
        </Text>
      </View>
    );
  }

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
        {/* Header com busca */}
        <View className="px-4 pt-6">
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('discover')}
          </Text>
          <Text className={`text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('discover_subtitle') || 'Explore os destinos de Angola'}
          </Text>

          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('search_placeholder')}
          />
        </View>

        {/* Filtros */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-4 px-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              label={filter.label}
              icon={filter.icon as any}
              active={activeFilter === filter.id}
              onPress={() => setActiveFilter(filter.id === activeFilter ? null : filter.id)}
            />
          ))}
        </ScrollView>

        {/* Destinos em Destaque */}
        {featuredDestinations.length > 0 && (
          <View className="mt-6">
            <View className="flex-row justify-between items-center px-4 mb-3">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('featured') || 'Em Destaque'}
              </Text>
              <TouchableOpacity>
                <Text className="text-primary font-semibold">
                  {t('see_all')}
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="px-4"
              contentContainerStyle={{ gap: 16 }}
            >
              {featuredDestinations.map((destination) => (
                <View key={destination.id} style={{ width: 280 }}>
                  <DestinationCard 
                    destination={{
                      id: destination.id,
                      name: destination.name,
                      location: destination.location,
                      image: destination.images[0]?.url || '',
                      rating: destination.rating,
                      distance: 0, // Pode calcular com geolocalização
                      category: destination.category.slug,
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Top Destinos */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('top_destinations') || 'Top Destinos'}
            </Text>
          </View>

          {topDestinations.map((destination) => (
            <DestinationCard 
              key={destination.id}
              destination={{
                id: destination.id,
                name: destination.name,
                location: destination.location,
                image: destination.images[0]?.url || '',
                rating: destination.rating,
                distance: 0,
                category: destination.category.slug,
              }}
            />
          ))}

          {/* Botão Carregar Mais */}
          {hasMore && (
            <TouchableOpacity
              onPress={loadMore}
              disabled={loading}
              className="bg-primary rounded-xl p-4 mt-4 items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold">
                  {t('load_more') || 'Carregar Mais'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Botão de teste (apenas em desenvolvimento) */}
      {__DEV__ && <ApiTestButton />}
    </View>
  );
}
