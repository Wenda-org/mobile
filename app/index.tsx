import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useColorScheme } from "../components/useColorScheme";

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useFocusEffect(() => {
    // Simulate loading/checking auth state
    const timeout = setTimeout(() => { 
      // TODO: Check if user is authenticated
      // If authenticated, go to /(tabs)
      // If not, go to /language
      // router.replace('/language');
      router.replace('/(tabs)');
    }, 1500);
    
    return () => clearTimeout(timeout);
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
    </View>
  );
}
