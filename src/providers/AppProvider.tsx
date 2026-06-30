import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../contexts/ThemeContext';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n'; // Import i18n to initialize it

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </View>
  );
};

export default AppProvider;
