// components/SearchBar.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  isDark?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  isDark = false,
}: SearchBarProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3 mb-5 rounded-2xl border
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#aaa' : '#555'}
        className={`flex-1 text-base ${isDark ? 'text-white' : 'text-black'}`}
      />
      <TouchableOpacity
        onPress={onSearch}
        className="ml-3 w-8 h-8 items-center justify-center rounded-full bg-primary/10"
      >
        <Text className={`text-lg ${isDark ? 'text-primary-light' : 'text-primary-dark'}`}>
          <Ionicons
            name="search"
            size={20}
            color={isDark ? '#888' : '#555'}
          />
        </Text>
      </TouchableOpacity>
    </View>
  );
}
