import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from './useColorScheme';

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: string;
}

export default function FilterButton({ label, active = false, onPress, icon }: FilterButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${
        active
          ? 'bg-primary'
          : isDark
          ? 'bg-background-dark-secondary border border-border-dark'
          : 'bg-white border border-border-light'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {icon && <Text className="mr-1">{icon}</Text>}
      <Text
        className={`text-sm font-semibold ${
          active ? 'text-white' : isDark ? 'text-text-dark' : 'text-text-light'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
