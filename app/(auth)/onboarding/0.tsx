import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Onboarding0() {
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
          {/* Illustration with Gradient */}
          <View className="mb-12">
            <View className={`w-72 h-72 rounded-full items-center justify-center ${
              isDark ? 'bg-primary/10' : 'bg-primary/5'
            }`}>
              <View className="w-56 h-56 rounded-full bg-primary/20 items-center justify-center">
                <View className="w-40 h-40 rounded-full bg-primary/30 items-center justify-center">
                  <Ionicons name="map" size={100} color="#136F63" />
                </View>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className={`text-4xl font-bold text-center mb-4 px-6 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Descubra Angola
          </Text>

          {/* Description */}
          <Text className={`text-lg text-center px-8 leading-7 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
            Explore os destinos mais incríveis e crie memórias inesquecíveis em cada canto do país
          </Text>
        </View>

        {/* Bottom Navigation */}
        <View>
          {/* Progress Indicators */}
          <View className="flex-row justify-center mb-8 gap-2">
            <View className="w-10 h-2 rounded-full bg-primary" />
            <View className={`w-2 h-2 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
            <View className={`w-2 h-2 rounded-full ${isDark ? 'bg-border-dark' : 'bg-border-light'}`} />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/onboarding/1')}
            className="bg-primary rounded-2xl py-4 items-center"
            style={{
              shadowColor: '#136F63',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white text-lg font-bold">{t('next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

