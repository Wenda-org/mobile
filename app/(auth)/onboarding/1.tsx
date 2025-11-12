import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding1() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <View className="flex-1 justify-between px-6 py-12">
        {/* Skip Button */}
        <View className="flex-row justify-end">
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className={`text-base font-semibold ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
              {t('skip')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 justify-center items-center">
          {/* Illustration */}
          <View className="w-64 h-64 rounded-full bg-secondary/10 items-center justify-center mb-12">
            <Ionicons name="sparkles" size={120} color="#FFD166" />
          </View>

          {/* Title */}
          <Text className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            {t('onboarding_2_title')}
          </Text>

          {/* Description */}
          <Text className={`text-base text-center px-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            {t('onboarding_2_desc')}
          </Text>
        </View>

        {/* Bottom Navigation */}
        <View>
          {/* Progress Indicators */}
          <View className="flex-row justify-center mb-8 space-x-2">
            <View className={`w-8 h-1.5 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <View className="w-8 h-1.5 rounded-full bg-primary" />
            <View className={`w-8 h-1.5 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/onboarding/2')}
            className="bg-primary rounded-xl py-4 items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="text-white text-lg font-semibold">{t('next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

