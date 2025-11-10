import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../components/useColorScheme';
import { useTripsStore } from '../../stores/useTripsStore';

export default function NewTripScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { addTrip } = useTripsStore();

  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
    }

    if (!startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate.trim()) {
      newErrors.endDate = 'End date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTrip = () => {
    if (!validate()) return;

    addTrip({
      name: tripName.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      notes: notes.trim(),
      destinations: [],
    });

    // Navigate back to trips list
    router.back();
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
        <View className="flex-row items-center mb-2">
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
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create New Trip
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Trip Name */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Trip Name *
          </Text>
          <TextInput
            value={tripName}
            onChangeText={setTripName}
            placeholder="e.g., Summer Adventure in Luanda"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            className={`px-4 py-3.5 rounded-xl text-base ${
              isDark 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}
            style={
              !isDark ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              } : {}
            }
          />
          {errors.tripName && (
            <Text className="text-red-500 text-sm mt-1">{errors.tripName}</Text>
          )}
        </View>

        {/* Start Date */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Start Date *
          </Text>
          <TouchableOpacity
            className={`px-4 py-3.5 rounded-xl flex-row items-center justify-between ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
            style={
              !isDark ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              } : {}
            }
          >
            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className={`flex-1 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
          {errors.startDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.startDate}</Text>
          )}
        </View>

        {/* End Date */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            End Date *
          </Text>
          <TouchableOpacity
            className={`px-4 py-3.5 rounded-xl flex-row items-center justify-between ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
            style={
              !isDark ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              } : {}
            }
          >
            <TextInput
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className={`flex-1 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
          {errors.endDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.endDate}</Text>
          )}
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Notes (Optional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes or details about your trip..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className={`px-4 py-3.5 rounded-xl text-base ${
              isDark 
                ? 'bg-gray-800 text-white border border-gray-700' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}
            style={
              !isDark ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
                minHeight: 100,
              } : { minHeight: 100 }
            }
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateTrip}
          className="bg-primary py-4 rounded-xl items-center mb-8"
          style={{
            shadowColor: '#136F63',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-white text-base font-semibold">Create Trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
