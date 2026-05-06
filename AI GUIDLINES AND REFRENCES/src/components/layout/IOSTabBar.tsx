import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';

const TABS = [
  { label: 'Home',    route: '/(tabs)/home',    icon: '⌂' },
  { label: 'Tools',   route: '/(tabs)/tools',   icon: '⊞' },
  { label: 'History', route: '/(tabs)/history', icon: '◷' },
  { label: 'Profile', route: '/(tabs)/profile', icon: '◯' },
] as const;

export function IOSTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const handlePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.borderTop} />
      <View style={styles.row}>
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.route.replace('/(tabs)', ''));
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tab}
              onPress={() => handlePress(tab.route)}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, active && styles.iconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // iOS-quality shadow — subtle, not Material
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8, // Android
  },
  borderTop: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5E5',
  },
  row: {
    flexDirection: 'row',
    height: 49, // iOS HIG standard tab bar height
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 44, // iOS HIG minimum touch target
  },
  icon: {
    fontSize: 22,
    color: '#8E8E93', // iOS system gray — inactive
  },
  iconActive: {
    color: colors.brand.primary,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.brand.primary,
    fontWeight: '600',
  },
});
