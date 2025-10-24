import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import MapView, { Marker, UrlTile, Callout, PROVIDER_DEFAULT, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import FilterButton from '../../components/FilterButton';
import { useLocation, calculateDistance } from '../../hooks/useLocation';

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
  const [radiusKm, setRadiusKm] = useState<number>(500); // Default 500 km radius
  const { location, loading, error } = useLocation();

  const filters = [
    { id: 'cultural', label: t('cultural'), icon: '🏛️' },
    { id: 'natural', label: t('natural'), icon: '🌿' },
    { id: 'historical', label: t('historical'), icon: '🏰' },
  ];

  const visiblePoints = useMemo(() => {
    let filtered = activeFilter 
      ? MOCK_POINTS.filter(p => p.category === activeFilter) 
      : MOCK_POINTS;

    // Filter by radius if user location is available
    if (location && location.coords) {
      filtered = filtered.filter(p => {
        const distance = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          p.coordinate.latitude,
          p.coordinate.longitude
        );
        return distance <= radiusKm;
      });
    }

    return filtered;
  }, [activeFilter, location, radiusKm]);

  // Determine initial map region
  const initialRegion = useMemo(() => {
    if (location?.coords) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      };
    }
    return {
      latitude: -12.5,
      longitude: 16.0,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };
  }, [location]);

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

        {/* Radius Slider */}
        {location && (
          <View className="mt-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {t('distance')} Radius
              </Text>
              <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                {radiusKm.toFixed(0)} km
              </Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={10}
              maximumValue={1000}
              step={10}
              value={radiusKm}
              onValueChange={setRadiusKm}
              minimumTrackTintColor="#136F63"
              maximumTrackTintColor="#CED0D4"
              thumbTintColor="#136F63"
            />
          </View>
        )}

        {/* Location Status */}
        {loading && (
          <Text className={`text-xs mt-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            📍 Getting your location...
          </Text>
        )}
        {error && (
          <Text className="text-xs mt-2 text-error">
            ⚠️ {error}
          </Text>
        )}
      </View>

      {/* Map with OpenStreetMap tiles */}
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* OSM tile layer */}
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
            zIndex={-1}
          />

          {/* Radius circle around user */}
          {location?.coords && (
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={radiusKm * 1000} // Convert km to meters
              fillColor="rgba(19, 111, 99, 0.1)"
              strokeColor="rgba(19, 111, 99, 0.5)"
              strokeWidth={2}
            />
          )}

          {/* Markers */}
          {visiblePoints.map((p) => (
            <Marker key={p.id} coordinate={p.coordinate} title={p.title} description={p.description}>
              <Callout>
                <View style={{ maxWidth: 240 }}>
                  <Text className="font-bold">{p.title}</Text>
                  <Text className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{p.description}</Text>
                  {location?.coords && (
                    <Text className="text-xs mt-1 text-primary">
                      {calculateDistance(
                        location.coords.latitude,
                        location.coords.longitude,
                        p.coordinate.latitude,
                        p.coordinate.longitude
                      ).toFixed(1)} km away
                    </Text>
                  )}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* OSM Attribution */}
        <View style={{ position: 'absolute', bottom: 6, right: 8, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
          <Text style={{ fontSize: 10, color: '#333' }}>© OpenStreetMap contributors</Text>
        </View>

        {/* Results counter */}
        <View 
          style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}
        >
          <Text className="text-sm font-semibold text-text-light">
            {visiblePoints.length} {visiblePoints.length === 1 ? 'place' : 'places'} found
          </Text>
        </View>
      </View>
    </View>
  );
}
