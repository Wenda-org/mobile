import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../global.css';
import '../i18n';

export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
