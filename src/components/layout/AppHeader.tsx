import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useSidebarStore } from '@/stores/sidebarStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { ROUTE_TITLES, isHomeRoute } from '@/constants/routes';

/**
 * AppHeader
 *
 * Global header rendered above all tab screens via the Tabs navigator screenOptions.
 * Responsibilities:
 * - Display the LexiAssist wordmark on the home route
 * - Display the active screen title on all other routes
 * - Provide the hamburger trigger for the global sidebar
 *
 * Design constraints:
 * - Pure view layer: no business logic, no side effects beyond haptics
 * - All callbacks are memoized to prevent re-render thrashing in React Navigation's header
 * - Theme colors are resolved via useTheme; zero hardcoded hex values
 */
export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const c = useTheme();

  const title = useMemo(() => {
    if (isHomeRoute(pathname)) {
      return 'LexiAssist';
    }
    return ROUTE_TITLES[pathname] ?? 'LexiAssist';
  }, [pathname]);

  const isHome = useMemo(() => isHomeRoute(pathname), [pathname]);

  const handleToggleSidebar = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useSidebarStore.getState().toggleSidebar();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: c.ui.background,
          borderBottomColor: c.ui.divider,
        },
      ]}
    >
      <View style={styles.content}>
        <TouchableOpacity
          onPress={handleToggleSidebar}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={styles.iconHit}
          activeOpacity={0.7}
          accessibilityLabel="Open navigation menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={26} color={c.brand.primary} />
        </TouchableOpacity>

        <Text
          style={[
            isHome ? styles.wordmark : styles.title,
            { color: c.text.primary },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Balanced spacer to keep title centered between hit targets */}
        <View style={styles.iconHit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: sp['4'],
  },
  iconHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    ...text.h3,
    letterSpacing: 0.5,
  },
  title: {
    ...text.h3,
    letterSpacing: -0.2,
  },
});
