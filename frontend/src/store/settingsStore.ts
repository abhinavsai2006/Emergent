/**
 * Settings Store - App preferences including dark mode
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  isDarkMode: boolean;
  themePreference: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  setThemePreference: (preference: 'light' | 'dark' | 'system') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      themePreference: 'system',
      notificationsEnabled: true,
      
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode,
        themePreference: !state.isDarkMode ? 'dark' : 'light',
      })),
      
      setThemePreference: (preference) => set({ 
        themePreference: preference,
        isDarkMode: preference === 'dark',
      }),
      
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'campus-bites-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
