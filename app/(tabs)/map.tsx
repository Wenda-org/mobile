import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, UrlTile, Callout, PROVIDER_DEFAULT, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import FilterButton from '../../components/FilterButton';
import { useLocation, calculateDistance } from '../../hooks/useLocation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock destinations with coordinates
const MOCK_POINTS = [
  {
    id: 'fortaleza',
    title: 'Fortaleza de São Miguel',
    description: 'Historic fortress with city views',
    coordinate: { latitude: -8.8057, longitude: 13.2343 },
    category: 'historical',
    rating: 4.7,
  },
  {
    id: 'tundavala',
    title: 'Tundavala Gap',
    description: 'Stunning viewpoint near Lubango',
    coordinate: { latitude: -14.9225, longitude: 13.5053 },
    category: 'natural',
    rating: 4.9,
  },
  {
    id: 'kalandula',
    title: 'Kalandula Falls',
    description: 'One of Africa\'s largest waterfalls',
    coordinate: { latitude: -9.0686, longitude: 16.0056 },
    category: 'natural',
    rating: 4.8,
  },
  {
    id: 'museu',
    title: 'Museu Nacional de Antropologia',
    description: 'Cultural museum in Luanda',
    coordinate: { latitude: -8.8137, longitude: 13.2344 },
    category: 'cultural',
    rating: 4.5,
  },
  {
    id: 'kissama',
    title: 'Kissama National Park',
    description: 'Wildlife safari and nature reserve',
    coordinate: { latitude: -9.1667, longitude: 13.7833 },
    category: 'natural',
    rating: 4.6,
  },
];

export default function MapScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [useRadiusFilter, setUseRadiusFilter] = useState<boolean>(false);
  const [radiusKm, setRadiusKm] = useState<number>(100);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const { location, loading, error } = useLocation();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const filterHeight = useRef(new Animated.Value(1)).current;

  // Toggle filter panel animation
  const toggleFilters = () => {
    Animated.timing(filterHeight, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowFilters(!showFilters);
  };

  // Handle focus on destination when navigating from destination details
  useEffect(() => {
    if (params.focusLat && params.focusLon && mapRef.current) {
      const lat = parseFloat(params.focusLat as string);
      const lon = parseFloat(params.focusLon as string);
      
      // Animate to the destination
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }, 1000);
      }, 500);
    }
  }, [params.focusLat, params.focusLon]);

  const filters = [
    { id: 'all', label: t('all'), icon: 'apps-outline' },
    { id: 'cultural', label: t('cultural'), icon: 'business-outline' },
    { id: 'natural', label: t('natural'), icon: 'leaf-outline' },
    { id: 'historical', label: t('historical'), icon: 'library-outline' },
    { id: 'adventure', label: t('adventure'), icon: 'bicycle-outline' },
  ];

  const visiblePoints = useMemo(() => {
    let filtered = (activeFilter && activeFilter !== 'all')
      ? MOCK_POINTS.filter(p => p.category === activeFilter) 
      : MOCK_POINTS;

    // Filter by radius only if enabled and user location is available
    if (useRadiusFilter && location && location.coords) {
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
  }, [activeFilter, location, radiusKm, useRadiusFilter]);

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

  // Fit map to show all visible points
  const fitToMarkers = () => {
    if (visiblePoints.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        visiblePoints.map(p => p.coordinate),
        {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        }
      );
    }
  };

  // Get marker color based on category
  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'cultural': return '#8B5CF6';
      case 'natural': return '#10B981';
      case 'historical': return '#F59E0B';
      case 'adventure': return '#EF4444';
      default: return '#136F63';
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Collapsible Filters Panel */}
      <Animated.View 
        style={{
          maxHeight: filterHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300],
          }),
          overflow: 'hidden',
        }}
        className={`border-b ${isDark ? 'border-border-dark bg-background-dark' : 'border-border-light bg-white'}`}
      >
        <View className="px-4 py-3">
          {/* Category Filters */}
          <View className="mb-3">
            <Text className={`text-xs font-semibold mb-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('filters').toUpperCase()}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                  className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                    activeFilter === filter.id
                      ? 'bg-primary'
                      : isDark
                      ? 'bg-surface-dark border border-border-dark'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Ionicons 
                    name={filter.icon as any} 
                    size={16} 
                    color={activeFilter === filter.id ? '#fff' : isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text className={`ml-1.5 text-sm font-medium ${
                    activeFilter === filter.id
                      ? 'text-white'
                      : isDark
                      ? 'text-text-dark'
                      : 'text-text-light'
                  }`}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Distance Filter Toggle */}
          <View className="mb-2">
            <TouchableOpacity
              onPress={() => setUseRadiusFilter(!useRadiusFilter)}
              className="flex-row items-center justify-between py-2"
            >
              <View className="flex-row items-center">
                <Ionicons 
                  name="navigate-outline" 
                  size={18} 
                  color={isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-2 text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  Filter by distance
                </Text>
              </View>
              <View className={`w-12 h-6 rounded-full ${useRadiusFilter ? 'bg-primary' : 'bg-gray-300'}`}>
                <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${useRadiusFilter ? 'ml-6' : 'ml-0.5'}`} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Radius Slider (only when enabled) */}
          {useRadiusFilter && location && (
            <View className="mt-2 mb-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className={`text-xs font-semibold ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  RADIUS FROM YOUR LOCATION
                </Text>
                <Text className={`text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  {radiusKm} km
                </Text>
              </View>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={5}
                maximumValue={500}
                step={5}
                value={radiusKm}
                onValueChange={setRadiusKm}
                minimumTrackTintColor="#136F63"
                maximumTrackTintColor={isDark ? '#374151' : '#E5E7EB'}
                thumbTintColor="#136F63"
              />
            </View>
          )}

          {/* Location Status */}
          {loading && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="location-outline" size={14} color="#136F63" />
              <Text className={`text-xs ml-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                Getting your location...
              </Text>
            </View>
          )}
          {error && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
              <Text className="text-xs ml-1 text-red-500">
                {error}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Map with MapTiler tiles */}
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          pitchEnabled={true}
          rotateEnabled={true}
        >
          {/* MapTiler tile layer */}
          <UrlTile
            urlTemplate="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=WAR0kpnOyAdsQVF60SWf"
            maximumZ={19}
            flipY={false}
            zIndex={-1}
          />

          {/* Radius circle around user (only when filter is active) */}
          {useRadiusFilter && location?.coords && (
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={radiusKm * 1000}
              fillColor="rgba(19, 111, 99, 0.08)"
              strokeColor="rgba(19, 111, 99, 0.4)"
              strokeWidth={2}
            />
          )}

          {/* Markers with custom colors */}
          {visiblePoints.map((p) => (
            <Marker 
              key={p.id} 
              coordinate={p.coordinate}
              pinColor={getMarkerColor(p.category)}
            >
              <Callout 
                tooltip={false}
                onPress={() => {
                  // @ts-ignore
                  router.push(`/destination/${p.id}`);
                }}
              >
                <View className={`p-3 rounded-lg ${isDark ? 'bg-surface-dark' : 'bg-white'}`} style={{ width: 220 }}>
                  <Text className={`font-bold text-base mb-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                    {p.title}
                  </Text>
                  <Text className={`text-sm mb-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                    {p.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text className={`ml-1 text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                        {p.rating}
                      </Text>
                    </View>
                    {location?.coords && (
                      <View className="flex-row items-center">
                        <Ionicons name="navigate-outline" size={12} color="#136F63" />
                        <Text className="ml-1 text-xs text-primary font-medium">
                          {calculateDistance(
                            location.coords.latitude,
                            location.coords.longitude,
                            p.coordinate.latitude,
                            p.coordinate.longitude
                          ).toFixed(1)} km
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-primary mt-2 font-medium">
                    Tap to view details →
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* MapTiler Attribution */}
        <View 
          style={{ 
            position: 'absolute', 
            bottom: 8, 
            right: 8, 
            backgroundColor: 'rgba(255,255,255,0.9)', 
            borderRadius: 6, 
            paddingHorizontal: 8, 
            paddingVertical: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 9, color: '#666' }}>© MapTiler © OpenStreetMap</Text>
        </View>

        {/* Filter Toggle Button */}
        <TouchableOpacity
          onPress={toggleFilters}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: isDark ? '#1F2937' : '#fff',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
          className="flex-row items-center"
        >
          <Ionicons 
            name={showFilters ? 'chevron-up' : 'options-outline'} 
            size={18} 
            color="#136F63" 
          />
          <Text className={`ml-2 font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {showFilters ? 'Hide' : 'Filters'}
          </Text>
        </TouchableOpacity>

        {/* Results Counter */}
        <View 
          style={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            backgroundColor: isDark ? '#1F2937' : '#fff',
            borderRadius: 12, 
            paddingHorizontal: 14, 
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#136F63" />
            <Text className={`ml-1.5 text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {visiblePoints.length}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ position: 'absolute', bottom: 80, right: 12, gap: 12 }}>
          {/* My Location Button */}
          {location?.coords && (
            <TouchableOpacity
              onPress={() => {
                mapRef.current?.animateToRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                }, 1000);
              }}
              style={{
                backgroundColor: isDark ? '#1F2937' : '#fff',
                borderRadius: 12,
                width: 48,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons name="navigate" size={24} color="#136F63" />
            </TouchableOpacity>
          )}

          {/* Fit to Markers Button */}
          {visiblePoints.length > 1 && (
            <TouchableOpacity
              onPress={fitToMarkers}
              style={{
                backgroundColor: isDark ? '#1F2937' : '#fff',
                borderRadius: 12,
                width: 48,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons name="scan-outline" size={24} color="#136F63" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
