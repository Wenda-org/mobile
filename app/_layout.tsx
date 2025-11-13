import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useColorScheme } from '../components/useColorScheme';
import '../global.css';
import '../i18n';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    // Load favorites on app start
    loadFavorites();
  }, [loadFavorites]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
