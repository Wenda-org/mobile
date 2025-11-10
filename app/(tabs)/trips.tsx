import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../components/useColorScheme';
import { useTripsStore } from '../../stores/useTripsStore';

export default function TripsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { trips, loadTrips, isLoaded } = useTripsStore();

  useEffect(() => {
    if (!isLoaded) {
      loadTrips();
    }
  }, [isLoaded, loadTrips]);

  const handleCreateTrip = () => {
    // @ts-ignore - route will be created
    router.push('/trip/new');
  };

  const handleTripPress = (tripId: string) => {
    // @ts-ignore - route will be created
    router.push(`/trip/${tripId}`);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate} - ${endDate}`;
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
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('my_trips')}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCreateTrip}
            className="bg-primary w-12 h-12 rounded-full items-center justify-center"
            style={{
              shadowColor: '#136F63',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {trips.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <View className={`w-32 h-32 rounded-full items-center justify-center mb-6 ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Ionicons 
              name="calendar-outline" 
              size={64} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </View>
          <Text className={`text-2xl font-bold mb-3 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            No trips yet
          </Text>
          <Text className={`text-base text-center mb-8 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Start planning your perfect Angolan adventure by creating your first trip
          </Text>
          <TouchableOpacity
            onPress={handleCreateTrip}
            className="bg-primary px-8 py-4 rounded-full flex-row items-center"
            style={{
              shadowColor: '#136F63',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white text-base font-semibold">Create Your First Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Trips List */
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 pt-4">
          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => handleTripPress(trip.id)}
              className={`mb-4 rounded-2xl overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              {/* Trip Images Preview */}
              {trip.destinations.length > 0 && (
                <View className="h-40 flex-row">
                  {trip.destinations.slice(0, 3).map((dest, index) => (
                    <Image
                      key={dest.id}
                      source={{ uri: dest.image }}
                      className={`flex-1 ${index > 0 ? 'ml-0.5' : ''}`}
                      style={{ opacity: 1 - (index * 0.15) }}
                    />
                  ))}
                </View>
              )}

              {/* Trip Info */}
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className={`text-xl font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {trip.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons 
                        name="calendar-outline" 
                        size={14} 
                        color={isDark ? '#9CA3AF' : '#6B7280'} 
                      />
                      <Text className={`text-sm ml-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={24} 
                    color={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                </View>

                {/* Destinations Count */}
                <View className="flex-row items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="location" size={16} color="#136F63" />
                    <Text className={`text-sm ml-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {trip.destinations.length} {trip.destinations.length === 1 ? 'destination' : 'destinations'}
                    </Text>
                  </View>
                  
                  {trip.notes && (
                    <View className="flex-row items-center">
                      <Ionicons 
                        name="document-text-outline" 
                        size={16} 
                        color={isDark ? '#9CA3AF' : '#6B7280'} 
                      />
                      <Text className={`text-sm ml-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Has notes
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Add bottom padding */}
          <View className="h-6" />
        </ScrollView>
      )}
    </View>
  );
}
