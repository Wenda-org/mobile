import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '@/providers/AppProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});

function NavigationStack() {
  const { colorScheme } = useTheme();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize auth session
        await initializeAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // Splash already hidden
        }
      }
    }

    prepare();
  }, []);

  if (!appIsReady || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-base-light dark:bg-base-dark">
        <ActivityIndicator size="large" color="#136F63" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#0F1109' : '#FAF8F3',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="language" />
      <Stack.Screen name="(auth)/onboarding/0" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(auth)/onboarding/1" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(auth)/onboarding/2" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(auth)/confirm" />
      <Stack.Screen name="preferences-setup" options={{ gestureEnabled: false }} />
      <Stack.Screen name="check-preferences" />
      <Stack.Screen name="edit-preferences" />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="destination/[id]" />
      <Stack.Screen name="trip/[id]" />
      <Stack.Screen name="trip/new" />
      <Stack.Screen name="settings/language" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <NavigationStack />
    </AppProvider>
  );
}
