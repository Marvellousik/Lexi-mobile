import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { lightColors, darkColors } from '@/constants/colors';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const manualOverride = useThemeStore((s) => s.isDark);
  const hasManualOverride = useThemeStore((s) => s.hasManualOverride);

  const isDark = hasManualOverride ? manualOverride : systemColorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return useMemo(() => ({ ...colors, isDark }), [colors, isDark]);
};
