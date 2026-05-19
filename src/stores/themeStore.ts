import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  hasManualOverride: boolean;
  toggleTheme: () => void;
  setDark: (value: boolean) => void;
  resetToSystem: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
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
}));
