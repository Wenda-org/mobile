import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { useColorScheme } from './useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  rightIcon,
  isPassword = false,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const secureTextEntry = isPassword && !showPassword;

  return (
    <View className="mb-4">
      {/* Label */}
      {label && (
        <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={`
          flex-row items-center
          px-4 py-3.5
          rounded-xl
          ${isDark ? 'bg-background-dark-secondary' : 'bg-background-light-secondary'}
          border
          ${hasError 
            ? 'border-red-500' 
            : isFocused 
              ? 'border-primary' 
              : isDark 
                ? 'border-border-dark' 
                : 'border-border-light'
          }
        `}
      >
        {/* Left Icon */}
        {icon && <View className="mr-3">{icon}</View>}

        {/* Input */}
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={isDark ? '#B0B3B8' : '#65676B'}
          className={`
            flex-1
            text-base
            ${isDark ? 'text-text-dark' : 'text-text-light'}
          `}
        />

        {/* Password Toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-3"
          >
            <Text className={`text-xl ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {showPassword ? '👁️' : '🔒'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Right Icon */}
        {rightIcon && !isPassword && <View className="ml-3">{rightIcon}</View>}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}

      {/* Hint */}
      {hint && !error && (
        <Text className={`text-sm mt-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
          {hint}
        </Text>
      )}
    </View>
  );
}
