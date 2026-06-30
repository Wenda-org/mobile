import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInDownView, FadeInUpView } from '@/components/animated-wrappers';
import { Globe, Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const [selectedLang, setSelectedLang] = useState<'pt' | 'en'>('pt');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageSelect = async (lang: 'pt' | 'en') => {
    setSelectedLang(lang);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await i18n.changeLanguage(selectedLang);
      await AsyncStorage.setItem('@wenda_language', selectedLang);
      router.replace('/(auth)/onboarding/0');
    } catch (e) {
      // Error saving
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark justify-between px-6"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1 justify-center max-w-md mx-auto w-full">
        {/* Header */}
        <FadeInDownView duration={400} delay={100} className="items-center mb-10">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-6">
            <Globe size={32} color="#136F63" />
          </View>
          <Text className="text-3xl font-bold text-center text-text-primary-light dark:text-text-primary-dark">
            Wenda
          </Text>
          <Text className="text-sm text-center text-text-secondary-light dark:text-text-secondary-dark mt-2 px-4">
            Escolha o seu idioma de preferência para explorar Angola
          </Text>
        </FadeInDownView>

        {/* Options */}
        <FadeInDownView duration={400} delay={200} className="space-y-4">
          {/* Portuguese Card */}
          <Pressable
            onPress={() => handleLanguageSelect('pt')}
            className={`flex-row items-center justify-between p-5 rounded-md border ${
              selectedLang === 'pt'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
            }`}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🇦🇴</Text>
              <View>
                <Text className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                  Português
                </Text>
                <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  Idioma oficial de Angola
                </Text>
              </View>
            </View>
            {selectedLang === 'pt' && (
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                <Check size={14} color="#FFF" />
              </View>
            )}
          </Pressable>

          {/* English Card */}
          <Pressable
            onPress={() => handleLanguageSelect('en')}
            className={`flex-row items-center justify-between p-5 rounded-md border ${
              selectedLang === 'en'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-borderSubtle-light dark:border-borderSubtle-dark bg-surface-light dark:bg-surface-dark'
            }`}
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🇬🇧</Text>
              <View>
                <Text className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                  English
                </Text>
                <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  International Language
                </Text>
              </View>
            </View>
            {selectedLang === 'en' && (
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                <Check size={14} color="#FFF" />
              </View>
            )}
          </Pressable>
        </FadeInDownView>
      </View>

      {/* Action Button */}
      <FadeInUpView duration={400} delay={300} className="w-full max-w-md mx-auto">
        <Pressable
          onPress={handleConfirm}
          disabled={isSubmitting}
          className="w-full h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="text-base font-bold text-white">
              {selectedLang === 'pt' ? 'Confirmar e Continuar' : 'Confirm & Continue'}
            </Text>
          )}
        </Pressable>
      </FadeInUpView>
    </View>
  );
}
