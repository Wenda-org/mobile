import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, TextInput, Image, Modal, Linking, Platform } from 'react-native';
import MapView, { Marker, UrlTile, Callout, PROVIDER_DEFAULT, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import FilterButton from '../../components/FilterButton';
import { useLocation, calculateDistance } from '../../hooks/useLocation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Map style types
type MapStyle = 'streets' | 'satellite' | 'topo';

// Mock destinations with coordinates and real images
const MOCK_POINTS = [
  {
    id: 'fortaleza',
    title: 'Fortaleza de São Miguel',
    description: 'Historic fortress with city views',
    coordinate: { latitude: -8.8057, longitude: 13.2343 },
    category: 'historical',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580974852861-c381510bc98a?w=800&h=600&fit=crop',
    location: 'Luanda',
  },
  {
    id: 'tundavala',
    title: 'Tundavala Gap',
    description: 'Stunning viewpoint near Lubango',
    coordinate: { latitude: -14.9225, longitude: 13.5053 },
    category: 'natural',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    location: 'Lubango, Huíla',
  },
  {
    id: 'kalandula',
    title: 'Kalandula Falls',
    description: 'One of Africa\'s largest waterfalls',
    coordinate: { latitude: -9.0686, longitude: 16.0056 },
    category: 'natural',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=600&fit=crop',
    location: 'Malanje',
  },
  {
    id: 'museu',
    title: 'Museu Nacional de Antropologia',
    description: 'Cultural museum in Luanda',
    coordinate: { latitude: -8.8137, longitude: 13.2344 },
    category: 'cultural',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop',
    location: 'Luanda',
  },
  {
    id: 'kissama',
    title: 'Kissama National Park',
    description: 'Wildlife safari and nature reserve',
    coordinate: { latitude: -9.1667, longitude: 13.7833 },
    category: 'natural',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
    location: 'Bengo',
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
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<typeof MOCK_POINTS[0] | null>(null);
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

  // Get MapTiler URL based on style
  const getMapTileUrl = (style: MapStyle): string => {
    const apiKey = 'WAR0kpnOyAdsQVF60SWf';
    switch (style) {
      case 'satellite':
        return `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${apiKey}`;
      case 'topo':
        return `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${apiKey}`;
      default:
        return `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`;
    }
  };

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

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

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
  }, [activeFilter, location, radiusKm, useRadiusFilter, searchQuery]);

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

  // Open route in external maps app
  const openRoute = (destination: typeof MOCK_POINTS[0], mode: 'walking' | 'driving') => {
    const { latitude, longitude } = destination.coordinate;
    const label = encodeURIComponent(destination.title);
    
    if (Platform.OS === 'ios') {
      // Apple Maps
      const modeParam = mode === 'walking' ? 'w' : 'd';
      Linking.openURL(`http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=${modeParam}&q=${label}`);
    } else {
      // Google Maps
      const modeParam = mode === 'walking' ? 'walking' : 'driving';
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=${modeParam}`);
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Collapsible Filters Panel */}
      <Animated.View 
        style={{
          maxHeight: filterHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 400],
          }),
          overflow: 'hidden',
        }}
        className={`border-b ${isDark ? 'border-border-dark bg-background-dark' : 'border-border-light bg-white'}`}
      >
        <View className="px-4 py-3">
          {/* Search Bar */}
          <View className={`flex-row items-center mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-surface-dark' : 'bg-gray-100'}`}>
            <Ionicons name="search-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <TextInput
              className={`flex-1 ml-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}
              placeholder={t('search_placeholder')}
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            )}
          </View>

          {/* Map Style Selector */}
          <View className="mb-3">
            <Text className={`text-xs font-semibold mb-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              MAP STYLE
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setMapStyle('streets')}
                className={`flex-1 px-3 py-2.5 rounded-lg flex-row items-center justify-center ${
                  mapStyle === 'streets' ? 'bg-primary' : isDark ? 'bg-surface-dark' : 'bg-gray-100'
                }`}
              >
                <Ionicons 
                  name="map-outline" 
                  size={16} 
                  color={mapStyle === 'streets' ? '#fff' : isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-1.5 text-sm font-medium ${
                  mapStyle === 'streets' ? 'text-white' : isDark ? 'text-text-dark' : 'text-text-light'
                }`}>
                  Streets
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setMapStyle('satellite')}
                className={`flex-1 px-3 py-2.5 rounded-lg flex-row items-center justify-center ${
                  mapStyle === 'satellite' ? 'bg-primary' : isDark ? 'bg-surface-dark' : 'bg-gray-100'
                }`}
              >
                <Ionicons 
                  name="globe-outline" 
                  size={16} 
                  color={mapStyle === 'satellite' ? '#fff' : isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-1.5 text-sm font-medium ${
                  mapStyle === 'satellite' ? 'text-white' : isDark ? 'text-text-dark' : 'text-text-light'
                }`}>
                  Satellite
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMapStyle('topo')}
                className={`flex-1 px-3 py-2.5 rounded-lg flex-row items-center justify-center ${
                  mapStyle === 'topo' ? 'bg-primary' : isDark ? 'bg-surface-dark' : 'bg-gray-100'
                }`}
              >
                <Ionicons 
                  name="trending-up-outline" 
                  size={16} 
                  color={mapStyle === 'topo' ? '#fff' : isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-1.5 text-sm font-medium ${
                  mapStyle === 'topo' ? 'text-white' : isDark ? 'text-text-dark' : 'text-text-light'
                }`}>
                  Topo
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
          mapType="none"
          loadingEnabled={true}
          loadingBackgroundColor={isDark ? '#1F2937' : '#F3F4F6'}
        >
          {/* MapTiler tile layer */}
          <UrlTile
            key={mapStyle}
            urlTemplate={getMapTileUrl(mapStyle)}
            maximumZ={19}
            flipY={false}
            zIndex={1}
            opacity={1.0}
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
              onPress={() => setSelectedPlace(p)}
            />
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

      {/* Place Detail Card (Bottom Sheet) */}
      {selectedPlace && (
        <View 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            backgroundColor: isDark ? '#1F2937' : '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setSelectedPlace(null)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: isDark ? '#374151' : '#F3F4F6',
              borderRadius: 20,
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="close" size={20} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>

          {/* Place Image */}
          <Image
            source={{ uri: selectedPlace.image }}
            style={{
              width: '100%',
              height: 180,
              borderRadius: 16,
              marginBottom: 16,
            }}
            resizeMode="cover"
          />

          {/* Place Info */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 pr-4">
              <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {selectedPlace.title}
              </Text>
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={14} color="#136F63" />
                <Text className={`text-sm ml-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  {selectedPlace.location}
                </Text>
              </View>
            </View>
            
            <View className="bg-primary px-3 py-1.5 rounded-full flex-row items-center">
              <Ionicons name="star" size={14} color="#fff" />
              <Text className="text-white font-bold ml-1">
                {selectedPlace.rating}
              </Text>
            </View>
          </View>

          <Text className={`text-sm mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            {selectedPlace.description}
          </Text>

          {/* Distance */}
          {location?.coords && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="navigate" size={16} color="#136F63" />
              <Text className={`text-sm ml-2 font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                {calculateDistance(
                  location.coords.latitude,
                  location.coords.longitude,
                  selectedPlace.coordinate.latitude,
                  selectedPlace.coordinate.longitude
                ).toFixed(1)} km away
              </Text>
            </View>
          )}

          {/* Route Options */}
          <View className="mb-4">
            <Text className={`text-xs font-semibold mb-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              GET DIRECTIONS
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => openRoute(selectedPlace, 'walking')}
                className={`flex-1 py-3 rounded-lg flex-row items-center justify-center ${
                  isDark ? 'bg-surface-dark' : 'bg-gray-100'
                }`}
              >
                <Ionicons name="walk-outline" size={20} color="#136F63" />
                <Text className={`ml-2 text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  Walking
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openRoute(selectedPlace, 'driving')}
                className={`flex-1 py-3 rounded-lg flex-row items-center justify-center ${
                  isDark ? 'bg-surface-dark' : 'bg-gray-100'
                }`}
              >
                <Ionicons name="car-outline" size={20} color="#136F63" />
                <Text className={`ml-2 text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  Driving
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                setSelectedPlace(null);
                // @ts-ignore
                router.push(`/destination/${selectedPlace.id}`);
              }}
              className="flex-1 bg-primary rounded-xl py-3.5 items-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text className="text-white font-semibold text-base">
                View Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (mapRef.current) {
                  mapRef.current.animateToRegion({
                    latitude: selectedPlace.coordinate.latitude,
                    longitude: selectedPlace.coordinate.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }, 500);
                }
              }}
              className={`px-5 rounded-xl py-3.5 items-center justify-center ${
                isDark ? 'bg-surface-dark' : 'bg-gray-100'
              }`}
            >
              <Ionicons name="locate" size={24} color="#136F63" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
