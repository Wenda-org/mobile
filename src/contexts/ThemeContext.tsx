import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'auto';

interface ThemeContextProps {
  theme: ThemeType;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorScheme: nwColorScheme, setColorScheme: setNwColorScheme } = useNativeWindColorScheme();
  const deviceColorScheme = useDeviceColorScheme();
  const [theme, setInternalTheme] = useState<ThemeType>('auto');

  useEffect(() => {
    // Load stored theme
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@wenda_theme');
        if (storedTheme) {
          const t = storedTheme as ThemeType;
          setInternalTheme(t);
          applyColorScheme(t);
        } else {
          applyColorScheme('auto');
        }
      } catch (e) {
        applyColorScheme('auto');
      }
    };
    loadTheme();
  }, []);

  const applyColorScheme = (t: ThemeType) => {
    if (t === 'auto') {
      const systemScheme = deviceColorScheme || 'light';
      setNwColorScheme(systemScheme);
    } else {
      setNwColorScheme(t);
    }
  };

  // Monitor device theme changes for 'auto'
  useEffect(() => {
    if (theme === 'auto') {
      const systemScheme = deviceColorScheme || 'light';
      setNwColorScheme(systemScheme);
    }
  }, [deviceColorScheme, theme]);

  const setTheme = async (t: ThemeType) => {
    try {
      setInternalTheme(t);
      applyColorScheme(t);
      await AsyncStorage.setItem('@wenda_theme', t);
    } catch (e) {
      // Ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeType = nwColorScheme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const effectiveScheme = nwColorScheme || deviceColorScheme || 'light';

  return (
    <ThemeContext.Provider value={{ theme, colorScheme: effectiveScheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
