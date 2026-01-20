/**
 * Theme Hook - Access theme values and dark mode state
 */

import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../theme/colors';
import { useSettingsStore } from '../store/settingsStore';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, themePreference } = useSettingsStore();
  
  // Determine actual dark mode state
  const isActuallyDark = themePreference === 'system' 
    ? systemColorScheme === 'dark' 
    : isDarkMode;
  
  const theme: Theme = isActuallyDark ? darkTheme : lightTheme;
  
  return {
    theme,
    isDark: isActuallyDark,
    colors: theme,
  };
};
