import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark: boolean;
  hasManualOverride: boolean;
  toggleTheme: () => void;
  setDark: (value: boolean) => void;
  resetToSystem: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      hasManualOverride: false,
      toggleTheme: () => set((state) => ({
        isDark: !state.isDark,
        hasManualOverride: true,
      })),
      setDark: (value) => set({
        isDark: value,
        hasManualOverride: true,
      }),
      resetToSystem: () => set({
        hasManualOverride: false,
      }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
