import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
          {/* Illustration with Gradient */}
          <View className="mb-12">
            <View className={`w-72 h-72 rounded-full items-center justify-center ${
              isDark ? 'bg-success/10' : 'bg-success/5'
            }`}>
              <View className="w-56 h-56 rounded-full bg-success/20 items-center justify-center">
                <View className="w-40 h-40 rounded-full bg-success/30 items-center justify-center">
                  <Ionicons name="calendar" size={100} color="#10b981" />
                </View>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className={`text-4xl font-bold text-center mb-4 px-6 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Planeje Sua Jornada
          </Text>

          {/* Description */}
          <Text className={`text-lg text-center px-8 leading-7 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Organize suas viagens, salve seus destinos favoritos e crie roteiros inesquecíveis
          </Text>
        </View>

        {/* Bottom Navigation */}
        <View>
          {/* Progress Indicators */}
          <View className="flex-row justify-center mb-8 gap-2">
            <View className={`w-2 h-2 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <View className={`w-2 h-2 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <View className="w-10 h-2 rounded-full bg-primary" />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            className="bg-primary rounded-2xl py-4 items-center mb-3"
            style={{
              shadowColor: '#136F63',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white text-lg font-bold">{t('get_started')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

