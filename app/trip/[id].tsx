import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../components/useColorScheme';
import { useTripsStore } from '../../stores/useTripsStore';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { getTripById, deleteTrip, removeDestinationFromTrip } = useTripsStore();
  
  const trip = getTripById(id || '');

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Trip not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-6 py-3 rounded-full">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTrip(trip.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleRemoveDestination = (destinationId: string) => {
    Alert.alert(
      'Remove Destination',
      'Remove this destination from your trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeDestinationFromTrip(trip.id, destinationId),
        },
      ]
    );
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: isDark ? '#374151' : '#F3F4F6' }}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#111827'} 
              />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                {trip.name}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {trip.startDate} - {trip.endDate}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleDelete}
            className="w-10 h-10 rounded-full items-center justify-center ml-2"
            style={{ backgroundColor: isDark ? '#374151' : '#FEE2E2' }}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Trip Stats */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row">
            <View 
              className={`flex-1 mr-2 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="location" size={24} color="#136F63" style={{ marginBottom: 8 }} />
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {trip.destinations.length}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Destinations
              </Text>
            </View>

            <View 
              className={`flex-1 ml-2 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="calendar" size={24} color="#FFD166" style={{ marginBottom: 8 }} />
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {/* Calculate days - simple version */}
                {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) || '?'}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Days
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {trip.notes && (
          <View className="px-4 pt-4">
            <View 
              className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons 
                  name="document-text" 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`text-base font-semibold ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Notes
                </Text>
              </View>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {trip.notes}
              </Text>
            </View>
          </View>
        )}

        {/* Destinations List */}
        <View className="px-4 pt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Itinerary
            </Text>
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-1">Add Place</Text>
            </TouchableOpacity>
          </View>

          {trip.destinations.length === 0 ? (
            /* Empty State */
            <View 
              className={`py-12 rounded-2xl items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons 
                name="map-outline" 
                size={64} 
                color={isDark ? '#4B5563' : '#D1D5DB'} 
              />
              <Text className={`text-base mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No destinations added yet
              </Text>
              <Text className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Start building your itinerary
              </Text>
            </View>
          ) : (
            /* Destinations List */
            <View className="space-y-3">
              {trip.destinations
                .sort((a, b) => a.order - b.order)
                .map((destination, index) => (
                  <View
                    key={destination.id}
                    className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.2 : 0.06,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row">
                      {/* Order Number */}
                      <View className="w-16 items-center justify-center bg-primary">
                        <Text className="text-white text-xl font-bold">{index + 1}</Text>
                      </View>

                      {/* Image */}
                      <Image
                        source={{ uri: destination.image }}
                        className="w-24 h-24"
                      />

                      {/* Info */}
                      <View className="flex-1 p-3 justify-center">
                        <Text className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                          {destination.name}
                        </Text>
                        <View className="flex-row items-center mb-1">
                          <Ionicons name="location-outline" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                          <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} numberOfLines={1}>
                            {destination.location}
                          </Text>
                        </View>
                        {destination.rating && (
                          <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#FFD166" />
                            <Text className={`text-sm ml-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {destination.rating.toFixed(1)}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Remove Button */}
                      <TouchableOpacity
                        onPress={() => handleRemoveDestination(destination.id)}
                        className="w-12 items-center justify-center"
                      >
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
