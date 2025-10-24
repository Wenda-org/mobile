import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import MapView, { Marker, UrlTile, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import FilterButton from '../../components/FilterButton';

// Mock destinations with coordinates
const MOCK_POINTS = [
  {
    id: 'fortaleza',
    title: 'Fortaleza de São Miguel',
    description: 'Historic fortress with city views',
    coordinate: { latitude: -8.8057, longitude: 13.2343 }, // Luanda
    category: 'historical',
  },
  {
    id: 'tundavala',
    title: 'Tundavala Gap',
    description: 'Stunning viewpoint near Lubango',
    coordinate: { latitude: -14.9225, longitude: 13.5053 },
    category: 'natural',
  },
  {
    id: 'kalandula',
    title: 'Kalandula Falls',
    description: 'One of Africa\'s largest waterfalls',
    coordinate: { latitude: -9.0686, longitude: 16.0056 },
    category: 'natural',
  },
];

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

  const visiblePoints = useMemo(() => {
    return activeFilter ? MOCK_POINTS.filter(p => p.category === activeFilter) : MOCK_POINTS;
  }, [activeFilter]);

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Filters */}
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

      {/* Map with OpenStreetMap tiles */}
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: -12.5,
            longitude: 16.0,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
          showsUserLocation={false}
        >
          {/* OSM tile layer */}
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
            zIndex={-1}
          />

          {/* Markers */}
          {visiblePoints.map((p) => (
            <Marker key={p.id} coordinate={p.coordinate} title={p.title} description={p.description}>
              <Callout>
                <View style={{ maxWidth: 240 }}>
                  <Text className="font-bold">{p.title}</Text>
                  <Text className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{p.description}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* OSM Attribution */}
        <View style={{ position: 'absolute', bottom: 6, right: 8, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontSize: 10, color: '#333' }}>© OpenStreetMap contributors</Text>
        </View>
      </View>
    </View>
  );
}
