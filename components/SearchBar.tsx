import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useColorScheme } from './useColorScheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder, onSearch }: SearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center px-4 py-3 rounded-xl ${
          isDark ? 'bg-background-dark-secondary' : 'bg-background-light-secondary'
        }`}
      >
        {/* Search Icon */}
        <TouchableOpacity onPress={onSearch} className="mr-2">
          <View className="w-5 h-5 items-center justify-center">
            <View className={`text-lg ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              🔍
            </View>
          </View>
        </TouchableOpacity>

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
          className={`flex-1 text-base ${isDark ? 'text-text-dark' : 'text-text-light'}`}
          onSubmitEditing={onSearch}
        />

        {/* Filter Button */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} className="ml-2">
            <View className={`text-base ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              ✕
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
