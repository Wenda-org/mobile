import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from './useColorScheme';
import { useRouter } from 'expo-router';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { Ionicons } from '@expo/vector-icons';

export interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  distance?: number;
  category?: string;
}

interface DestinationCardProps {
  destination: Destination;
  onPress?: () => void;
}

export default function DestinationCard({ destination, onPress }: DestinationCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(destination.id);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to destination details
      router.push(`/destination/${destination.id}`);
    }
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    if (favorited) {
      removeFavorite(destination.id);
    } else {
      addFavorite({
        id: destination.id,
        name: destination.name,
        location: destination.location,
        image: destination.image,
        rating: destination.rating,
        category: destination.category,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`rounded-xl overflow-hidden mb-4 ${
        isDark ? 'bg-background-dark-secondary' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Image */}
      <View className="w-full h-48 bg-border-light">
        {destination.image ? (
          <Image
            source={{ uri: destination.image }}
            className="w-full h-full"
            resizeMode="cover"
            onError={(error) => console.log('Image load error:', destination.name, error.nativeEvent.error)}
            onLoad={() => console.log('Image loaded:', destination.name)}
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-primary/10">
            <Ionicons name="location" size={80} color="#136F63" />
          </View>
        )}
        
        {/* Category Badge */}
        {destination.category && (
          <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">{destination.category}</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity 
          onPress={handleToggleFavorite}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full items-center justify-center"
        >
          <Ionicons 
            name={favorited ? "heart" : "heart-outline"} 
            size={20} 
            color={favorited ? "#EF4444" : "#6B7280"} 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Name */}
        <Text className={`text-lg font-bold mb-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          {destination.name}
        </Text>

        {/* Location */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text className={`text-sm ml-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            {destination.location}
          </Text>
        </View>

        {/* Rating and Distance */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD166" />
            <Text className={`text-sm font-semibold ml-1 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {destination.rating.toFixed(1)}
            </Text>
          </View>
          
          {destination.distance !== undefined && (
            <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {destination.distance.toFixed(1)} km
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
