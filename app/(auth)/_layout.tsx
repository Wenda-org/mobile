import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark p-6">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
