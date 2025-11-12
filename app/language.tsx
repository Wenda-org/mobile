import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // Navigate into the auth-grouped onboarding route
    router.push('/(auth)/onboarding/0');
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <View className="mb-12">
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-4">
            {/* <Image
              source={require("../assets/images/logo.png")}
            /> */}
            <Text className="text-white text-4xl font-bold">W</Text>
          </View>
          <Text className={`text-3xl font-bold text-center ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
            Wenda
          </Text>
        </View>

        {/* Title */}
        <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          {t('select_language')}
        </Text>
        <Text className={`text-base mb-12 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
          {t('select_language_subtitle')}
        </Text>

        {/* Language Options */}
        <View className="w-full max-w-md space-y-4">
          {/* Portuguese */}
          <TouchableOpacity
            onPress={() => selectLanguage('pt')}
            className={`w-full p-5 rounded-xl flex-row items-center justify-between mb-4 ${
              isDark ? 'bg-background-dark-secondary' : 'bg-white border border-border-light-subtle'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Text className="text-3xl">🇦🇴</Text>
              </View>
              <View>
                <Text className={`text-lg font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  Português
                </Text>
                <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  Portuguese
                </Text>
              </View>
            </View>
            <View className={`w-6 h-6 rounded-full border-2 ${
              i18n.language === 'pt' 
                ? 'bg-primary border-primary' 
                : isDark 
                  ? 'border-border-dark' 
                  : 'border-border-light'
            }`}>
              {i18n.language === 'pt' && (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* English */}
          <TouchableOpacity
            onPress={() => selectLanguage('en')}
            className={`w-full p-5 rounded-xl flex-row items-center justify-between ${
              isDark ? 'bg-background-dark-secondary' : 'bg-white border border-border-light-subtle'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Text className="text-3xl">🇬🇧</Text>
              </View>
              <View>
                <Text className={`text-lg font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
                  English
                </Text>
                <Text className={`text-sm ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                  Inglês
                </Text>
              </View>
            </View>
            <View className={`w-6 h-6 rounded-full border-2 ${
              i18n.language === 'en' 
                ? 'bg-primary border-primary' 
                : isDark 
                  ? 'border-border-dark' 
                  : 'border-border-light'
            }`}>
              {i18n.language === 'en' && (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

