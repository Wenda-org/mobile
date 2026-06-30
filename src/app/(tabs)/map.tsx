import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDestinations } from '@/hooks/useDestinations';
import { useLocation } from '@/hooks/useLocation';
import * as Haptics from 'expo-haptics';
import { Compass, MapPin, Star, Navigation, Filter, Layers, Info } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

// Lazy import Map components for web safety
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  Callout = MapModule.Callout;
}

export default function MapTabScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { destinations, categories } = useDestinations();
  const { location, isPermissionGranted } = useLocation();

  const [selectedDest, setSelectedDest] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  const mapRef = useRef<any>(null);

  // Focus map on user location
  const centerOnUser = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleMarkerPress = (dest: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDest(dest);
    
    // Simulate route calculation
    if (location) {
      // Crude distance calculation (approximate)
      const latDiff = Math.abs(location.latitude - dest.latitude);
      const lonDiff = Math.abs(location.longitude - dest.longitude);
      const km = Math.round(Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111);
      
      const hours = Math.floor(km / 80);
      const mins = Math.round((km % 80) / 80 * 60);
      
      const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      setRouteInfo({
        distance: `${km} km`,
        duration: durationStr
      });
    }

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: dest.latitude - 0.005, // offset slightly so bottom sheet doesn't overlap
        longitude: dest.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  const getFilteredMarkers = () => {
    let list = destinations.length > 0 ? destinations : [];
    if (selectedCategory) {
      list = list.filter(d => d.categoryId === selectedCategory);
    }
    return list;
  };

  const filteredDests = getFilteredMarkers();

  // If on Web, render a beautiful custom mockup map
  if (Platform.OS === 'web') {
    return (
      <View 
        className="flex-1 bg-base-light dark:bg-base-dark items-center justify-center p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Compass size={64} color="#136F63" className="mb-4" />
        <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('map.title')} (Web Preview)
        </Text>
        <Text className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center mt-2 max-w-sm">
          O mapa interativo utiliza o Google Maps nativo e está disponível no dispositivo móvel.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-base-light dark:bg-base-dark">
      {/* Native Map View */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 1.2,
          longitudeDelta: 1.2,
        }}
        showsUserLocation={isPermissionGranted}
        showsMyLocationButton={false}
      >
        {filteredDests.map((dest) => (
          <Marker
            key={dest.id}
            coordinate={{ latitude: dest.latitude, longitude: dest.longitude }}
            onPress={() => handleMarkerPress(dest)}
            pinColor={selectedDest?.id === dest.id ? '#FFD166' : '#136F63'}
          />
        ))}
      </MapView>

      {/* Floating Header Filters */}
      <View className="absolute top-0 left-0 right-0 px-4" style={{ paddingTop: insets.top + 16 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="space-x-2"
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-full flex-row items-center border ${
              selectedCategory === null 
                ? 'bg-primary border-primary' 
                : 'bg-surface-light/95 dark:bg-surface-dark/95 border-borderSubtle-light dark:border-borderSubtle-dark'
            }`}
          >
            <Filter size={12} color={selectedCategory === null ? '#FFF' : '#8C8779'} className="mr-1.5" />
            <Text className={`text-[11px] font-bold ${selectedCategory === null ? 'text-white' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
              Todos
            </Text>
          </Pressable>

          {(categories.length > 0 ? categories : [
            { id: 'cat_1', name: 'Natureza' },
            { id: 'cat_2', name: 'História' },
            { id: 'cat_3', name: 'Aventura' }
          ]).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full border ${
                  isSelected 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface-light/95 dark:bg-surface-dark/95 border-borderSubtle-light dark:border-borderSubtle-dark'
                }`}
              >
                <Text className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Floating Control Buttons */}
      <View className="absolute right-4 bottom-32 space-y-3">
        {/* Toggle Heat Map */}
        <Pressable
          onPress={() => setShowHeatMap(!showHeatMap)}
          className={`w-12 h-12 rounded-full items-center justify-center shadow-premium ${
            showHeatMap ? 'bg-primary' : 'bg-surface-light/95 dark:bg-surface-dark/95'
          }`}
        >
          <Layers size={20} color={showHeatMap ? '#FFF' : '#136F63'} />
        </Pressable>

        {/* Center on User */}
        <Pressable
          onPress={centerOnUser}
          className="w-12 h-12 bg-surface-light/95 dark:bg-surface-dark/95 rounded-full items-center justify-center shadow-premium"
        >
          <Navigation size={20} color="#136F63" />
        </Pressable>
      </View>

      {/* Bottom Sheet Details panel */}
      {selectedDest && (
        <View 
          className="absolute bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-borderSubtle-light dark:border-borderSubtle-dark p-5 rounded-t-lg shadow-premium pb-8"
        >
          {/* Header indicator */}
          <View className="w-12 h-1 bg-borderSubtle-light dark:bg-borderSubtle-dark rounded-full mx-auto mb-4" />
          
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                {selectedDest.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={12} color="#8C8779" />
                <Text className="text-xs text-text-secondary-light dark:text-text-secondary-dark ml-1">
                  {selectedDest.province || selectedDest.location}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center bg-secondary/10 px-2.5 py-1 rounded-md">
              <Star size={12} color="#FFD166" fill="#FFD166" />
              <Text className="text-xs font-bold text-secondary-900 dark:text-secondary-400 ml-1">
                {selectedDest.rating}
              </Text>
            </View>
          </View>

          {/* Route info */}
          {routeInfo && (
            <View className="flex-row items-center bg-primary/5 dark:bg-primary/10 rounded-md p-3 mt-4 space-x-6">
              <View>
                <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark">Distância</Text>
                <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{routeInfo.distance}</Text>
              </View>
              <View>
                <Text className="text-[10px] text-text-muted-light dark:text-text-muted-dark">Tempo de Carro</Text>
                <Text className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{routeInfo.duration}</Text>
              </View>
            </View>
          )}

          {/* CTAs */}
          <View className="flex-row space-x-3 mt-5">
            <Pressable
              onPress={() => router.push(`/destination/${selectedDest.id}`)}
              className="flex-1 h-12 bg-base-light dark:bg-base-dark border border-borderSubtle-light dark:border-borderSubtle-dark items-center justify-center rounded-md active:bg-borderSubtle-light"
            >
              <Text className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">Ver Detalhes</Text>
            </Pressable>
            
            <Pressable
              onPress={() => setSelectedDest(null)}
              className="px-4 h-12 bg-error/15 items-center justify-center rounded-md"
            >
              <Text className="text-xs font-bold text-error">Fechar</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
