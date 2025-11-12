import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '../../components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsLanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // Return to profile/settings screen
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
      {/* Header */}
      <View className={`flex-row items-center px-4 py-4 ${isDark ? 'bg-background-dark-secondary' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4 p-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
          {t('language_settings')}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-6">
        <Text className={`text-sm mb-4 px-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
          {t('select_language_subtitle')}
        </Text>

        {/* Language Options */}
        <View className="space-y-3">
          {/* Portuguese */}
          <TouchableOpacity
            onPress={() => selectLanguage('pt')}
            className={`p-4 rounded-xl flex-row items-center justify-between mb-3 ${
              isDark ? 'bg-background-dark-secondary' : 'bg-white'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Text className="text-2xl">🇦🇴</Text>
              </View>
              <View>
                <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
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
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* English */}
          <TouchableOpacity
            onPress={() => selectLanguage('en')}
            className={`p-4 rounded-xl flex-row items-center justify-between ${
              isDark ? 'bg-background-dark-secondary' : 'bg-white'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Text className="text-2xl">🇬🇧</Text>
              </View>
              <View>
                <Text className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text-light'}`}>
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
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
