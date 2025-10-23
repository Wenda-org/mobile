import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useColorScheme } from './useColorScheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-4',
    md: 'py-3.5 px-6',
    lg: 'py-4 px-8',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return isDark ? 'bg-background-dark-secondary' : 'bg-background-light-secondary';
      case 'outline':
        return `border-2 ${isDark ? 'border-border-dark bg-transparent' : 'border-border-light bg-transparent'}`;
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-primary';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-white font-semibold';
      case 'secondary':
        return isDark ? 'text-text-dark font-semibold' : 'text-text-light font-semibold';
      case 'outline':
        return `${isDark ? 'text-text-dark' : 'text-primary'} font-semibold`;
      case 'ghost':
        return 'text-primary font-semibold';
      default:
        return 'text-white font-semibold';
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${getVariantClasses()}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl
        flex-row items-center justify-center
        ${isDisabled ? 'opacity-50' : ''}
      `}
      style={
        variant === 'primary' && !isDisabled
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }
          : undefined
      }
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#1877F2'} />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`${getTextClasses()} ${textSizeClasses[size]}`}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
