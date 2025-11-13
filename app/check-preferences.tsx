import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

/**
 * This screen checks if the user has configured their preferences.
 * If not, redirects to preferences-setup.
 * If yes, redirects to main app.
 */
export default function CheckPreferencesScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkPreferences = () => {
      if (!user) {
        // Not logged in, go to login
        router.replace('/login');
        return;
      }

      const preferences = user.preferences as any;
      
      // Check if user has configured basic preferences
      const hasPreferences = preferences && (
        preferences.favoriteCategories?.length > 0 ||
        preferences.travelStyle?.length > 0 ||
        preferences.budgetRange ||
        preferences.travelWith
      );

      if (hasPreferences) {
        // User has preferences, go to main app
        router.replace('/(tabs)');
      } else {
        // User needs to configure preferences
        router.replace('/preferences-setup');
      }
    };

    // Small delay to prevent flash
    const timer = setTimeout(checkPreferences, 500);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <ActivityIndicator size="large" color="#FFD166" />
    </View>
  );
}
