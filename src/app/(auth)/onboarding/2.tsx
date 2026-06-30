import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInDownView, FadeInUpView } from '@/components/animated-wrappers';
import { CalendarRange } from 'lucide-react-native';

export default function OnboardingStepTwo() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 bg-base-light dark:bg-base-dark justify-between px-6"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
    >
      {/* Top Header Row */}
      <View className="flex-row justify-between items-center w-full max-w-md mx-auto">
        <Text className="text-xl font-bold text-primary">Wenda</Text>
        <View className="px-3 py-1 opacity-0">
          <Text className="text-xs">{t('common.skip')}</Text>
        </View>
      </View>

      {/* Main Content Illustration & Text */}
      <View className="flex-1 justify-center items-center max-w-md mx-auto w-full">
        <FadeInDownView
          duration={600}
          className="w-full aspect-square max-w-[280px] rounded-lg bg-primary/10 items-center justify-center mb-10 shadow-premium relative overflow-hidden border border-borderSubtle-light dark:border-borderSubtle-dark"
        >
          <View className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 translate-x-6 -translate-y-6" />
          <View className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/10 -translate-x-12 translate-y-12" />
          <CalendarRange size={84} color="#136F63" />
        </FadeInDownView>

        {/* Text */}
        <FadeInDownView duration={600} delay={200} className="items-center px-4">
          <Text className="text-2xl font-bold text-center text-text-primary-light dark:text-text-primary-dark">
            {t('onboarding.step_2_title')}
          </Text>
          <Text className="text-sm text-center text-text-secondary-light dark:text-text-secondary-dark mt-4 leading-relaxed">
            {t('onboarding.step_2_desc')}
          </Text>
        </FadeInDownView>
      </View>

      {/* Bottom Footer Section */}
      <View className="w-full max-w-md mx-auto">
        {/* Progress Dots */}
        <View className="flex-row justify-center items-center mb-8 space-x-2">
          <View className="w-2 h-2 rounded-full bg-borderSubtle-light dark:bg-borderSubtle-dark" />
          <View className="w-2 h-2 rounded-full bg-borderSubtle-light dark:bg-borderSubtle-dark" />
          <View className="w-6 h-2 rounded-full bg-primary" />
        </View>

        {/* Action Buttons */}
        <FadeInUpView duration={600} delay={300} className="flex-row space-x-4">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 h-14 bg-surface-light dark:bg-surface-dark items-center justify-center rounded-md border border-borderSubtle-light dark:border-borderSubtle-dark active:bg-base-light dark:active:bg-base-dark"
          >
            <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              {t('common.back')}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            className="flex-1 h-14 bg-primary items-center justify-center rounded-md active:bg-primary-600 shadow-premium"
          >
            <Text className="text-base font-bold text-white">
              {t('onboarding.get_started')}
            </Text>
          </Pressable>
        </FadeInUpView>
      </View>
    </View>
  );
}
