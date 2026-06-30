import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/theme';

export function useTheme() {
  const { colorScheme } = useThemeContext();
  return Colors[colorScheme || 'light'];
}

