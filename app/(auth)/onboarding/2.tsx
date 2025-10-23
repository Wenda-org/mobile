import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../../components/useColorScheme';

export default function Onboarding2() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <View className="flex-1 justify-between px-6 py-12">
        {/* Skip Button (Hidden on last screen) */}
        <View className="h-8" />

        {/* Content */}
        <View className="flex-1 justify-center items-center">
          {/* Illustration */}
          <View className="w-64 h-64 rounded-full bg-success/10 items-center justify-center mb-12">
            <Text className="text-8xl">�️</Text>
          </View>

          {/* Title */}
          <Text className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {t('onboarding_3_title')}
          </Text>

          {/* Description */}
          <Text className={`text-base text-center px-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            {t('onboarding_3_desc')}
          </Text>
        </View>

        {/* Bottom Navigation */}
        <View>
          {/* Progress Indicators */}
          <View className="flex-row justify-center mb-8 space-x-2">
            <View className={`w-8 h-1.5 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <View className={`w-8 h-1.5 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <View className="w-8 h-1.5 rounded-full bg-primary" />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            className="bg-primary rounded-xl py-4 items-center mb-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="text-white text-lg font-semibold">{t('get_started')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

