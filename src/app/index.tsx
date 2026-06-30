import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/useAuthStore';
import { FadeInView } from '@/components/animated-wrappers';

export default function IndexGate() {
  const router = useRouter();
  const { user, token, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const checkNavigationGate = async () => {
      try {
        // 1. Check if language has been selected
        const languageSelected = await AsyncStorage.getItem('@wenda_language');
        if (!languageSelected) {
          router.replace('/language');
          return;
        }

        // 2. Check authentication
        if (token && user) {
          // Check if preferences setup quiz was completed
          const hasPrefs = 
            user.preferences && 
            user.preferences.preferred_categories && 
            user.preferences.preferred_categories.length > 0;
            
          if (hasPrefs) {
            router.replace('/(tabs)');
          } else {
            router.replace('/preferences-setup');
          }
        } else {
          // Go to onboarding
          router.replace('/(auth)/onboarding/0');
        }
      } catch (error) {
        router.replace('/(auth)/onboarding/0');
      }
    };

    // Add a tiny delay to ensure everything is mounted and animated
    const timer = setTimeout(() => {
      checkNavigationGate();
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, token, user]);

  return (
    <FadeInView
      duration={300}
      className="flex-1 items-center justify-center bg-base-light dark:bg-base-dark"
    >
      <View className="items-center justify-center p-8 bg-surface-light dark:bg-surface-dark rounded-full w-24 h-24 shadow-premium border border-borderSubtle-light dark:border-borderSubtle-dark">
        <ActivityIndicator size="large" color="#136F63" />
      </View>
    </FadeInView>
  );
}
