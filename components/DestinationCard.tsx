import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from './useColorScheme';
import { useRouter } from 'expo-router';

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

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to destination details
      // router.push(`/destination/${destination.id}`);
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
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-primary/10">
            <Text className="text-6xl">📍</Text>
          </View>
        )}
        
        {/* Category Badge */}
        {destination.category && (
          <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">{destination.category}</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full items-center justify-center">
          <Text className="text-lg">♡</Text>
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
          <Text className="text-sm mr-1">📍</Text>
          <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            {destination.location}
          </Text>
        </View>

        {/* Rating and Distance */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm mr-1">⭐</Text>
            <Text className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
              {destination.rating.toFixed(1)}
            </Text>
          </View>
          
          {destination.distance && (
            <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {destination.distance.toFixed(1)} km
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
