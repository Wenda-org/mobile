import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from './useColorScheme';
import { useTripsStore, Trip } from '../stores/useTripsStore';

interface TripSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  destination: {
    id: string;
    name: string;
    location: string;
    image: string;
    rating: number;
    category?: string;
  };
  onTripSelected?: (tripId: string) => void;
}

export default function TripSelectorModal({
  visible,
  onClose,
  destination,
  onTripSelected,
}: TripSelectorModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { trips, addDestinationToTrip, loadTrips, isLoaded } = useTripsStore();

  useEffect(() => {
    if (!isLoaded) {
      loadTrips();
    }
  }, [isLoaded, loadTrips]);

  const handleSelectTrip = (trip: Trip) => {
    // Check if destination already in trip
    const alreadyAdded = trip.destinations.some(d => d.id === destination.id);
    
    if (alreadyAdded) {
      alert('This destination is already in this trip');
      return;
    }

    addDestinationToTrip(trip.id, destination);
    onTripSelected?.(trip.id);
    onClose();
    
    // Show success feedback
    setTimeout(() => {
      alert(`Added to "${trip.name}"!`);
    }, 100);
  };

  const handleCreateNewTrip = () => {
    onClose();
    // @ts-ignore
    router.push('/trip/new');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          className={`rounded-t-3xl max-h-[80%] ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Header */}
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row justify-between items-center">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Add to Trip
              </Text>
              <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
              </TouchableOpacity>
            </View>
            <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Select a trip for "{destination.name}"
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {/* Create New Trip Button */}
            <TouchableOpacity
              onPress={handleCreateNewTrip}
              className={`mb-4 p-4 rounded-xl border-2 border-dashed ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Create New Trip
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start a new itinerary
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={isDark ? '#9CA3AF' : '#6B7280'} 
                />
              </View>
            </TouchableOpacity>

            {/* Existing Trips */}
            {trips.length === 0 ? (
              <View className="py-12 items-center">
                <Ionicons 
                  name="briefcase-outline" 
                  size={48} 
                  color={isDark ? '#4B5563' : '#D1D5DB'} 
                />
                <Text className={`text-base mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No trips yet
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Create your first trip above
                </Text>
              </View>
            ) : (
              trips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => handleSelectTrip(trip)}
                  className={`mb-3 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <Text className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {trip.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons 
                          name="calendar-outline" 
                          size={14} 
                          color={isDark ? '#9CA3AF' : '#6B7280'} 
                        />
                        <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {trip.startDate} - {trip.endDate}
                        </Text>
                      </View>
                      <View className="flex-row items-center mt-1">
                        <Ionicons 
                          name="location" 
                          size={14} 
                          color={isDark ? '#9CA3AF' : '#6B7280'} 
                        />
                        <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {trip.destinations.length} {trip.destinations.length === 1 ? 'destination' : 'destinations'}
                        </Text>
                      </View>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={isDark ? '#9CA3AF' : '#6B7280'} 
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
