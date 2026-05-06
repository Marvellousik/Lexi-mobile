import { useThemeStore } from '@/stores/themeStore';
import { lightColors, darkColors } from '@/constants/colors';

export const useTheme = () => {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  return { ...colors, isDark };
};
