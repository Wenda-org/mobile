import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "../components/useColorScheme";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isChecking, setIsChecking] = useState(true);

  useFocusEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is authenticated
        const token = await AsyncStorage.getItem('@wenda_access_token');
        const user = await AsyncStorage.getItem('@wenda_user');
        
        // Simulate splash screen delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (token && user) {
          // User is authenticated, go to main app
          router.replace('/(tabs)');
        } else {
          // User is not authenticated, show onboarding
          router.replace('/(auth)/onboarding/0');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // On error, go to onboarding
        router.replace('/(auth)/onboarding/0');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  });

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-background-dark' : 'bg-primary'}`}>
      {/* Logo */}
      <View className="mb-8">
        <View className={`w-32 h-32 rounded-full items-center justify-center ${isDark ? 'bg-primary' : 'bg-white'}`}>
          <Text className={`text-6xl font-bold ${isDark ? 'text-white' : 'text-primary'}`}>W</Text>
        </View>
      </View>
      
      {/* App Name */}
      <Text className={`text-4xl font-bold mb-12 ${isDark ? 'text-text-dark' : 'text-white'}`}>
        Wenda
      </Text>
      
      {/* Loading Indicator */}
      <ActivityIndicator size="large" color={isDark ? '#136F63' : '#FFFFFF'} />
      
      {/* Tagline */}
      <Text className={`text-base mt-4 ${isDark ? 'text-text-dark-secondary' : 'text-white/80'}`}>
        Descubra Angola
      </Text>
    </View>
  );
}
