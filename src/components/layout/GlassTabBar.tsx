import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const TABS = [
  { name: 'Home', route: '/(tabs)/home', icon: 'home' as const, iconOutline: 'home-outline' as const },
  { name: 'Tools', route: '/(tabs)/tools', icon: 'grid' as const, iconOutline: 'grid-outline' as const },
  { name: 'History', route: '/(tabs)/history', icon: 'time' as const, iconOutline: 'time-outline' as const },
  { name: 'Profile', route: '/(tabs)/profile', icon: 'person' as const, iconOutline: 'person-outline' as const },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = SCREEN_WIDTH / TABS.length;
const PILL_WIDTH = 32;

export default function GlassTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const c = useTheme();

  const isActive = (route: string) => {
    if (route === '/(tabs)/tools') {
      return pathname.startsWith('/(tabs)/tools');
    }
    return pathname === route;
  };

  const activeIndex = TABS.findIndex((tab) => isActive(tab.route));
  const pillAnim = useRef(new Animated.Value(activeIndex)).current;

  React.useEffect(() => {
    Animated.spring(pillAnim, {
      toValue: activeIndex,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  const handlePress = (route: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const pillTranslate = pillAnim.interpolate({
    inputRange: TABS.map((_, i) => i),
    outputRange: TABS.map((_, i) => i * TAB_WIDTH + (TAB_WIDTH - PILL_WIDTH) / 2),
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + sp['2'],
          backgroundColor: c.ui.background,
          borderTopColor: c.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)',
        },
      ]}
    >
      {/* Active indicator pill */}
      <Animated.View
        style={[
          styles.pill,
          {
            transform: [{ translateX: pillTranslate }],
            backgroundColor: c.brand.primary,
          },
        ]}
      />

      <View style={styles.content}>
        {TABS.map((tab, index) => {
          const active = isActive(tab.route);
          return (
            <TabItem
              key={tab.name}
              tab={tab}
              active={active}
              onPress={() => handlePress(tab.route, index)}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  active,
  onPress,
}: {
  tab: (typeof TABS)[0];
  active: boolean;
  onPress: () => void;
}) {
  const c = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.88,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.7}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityLabel={tab.name}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={active ? tab.icon : tab.iconOutline}
          size={24}
          color={active ? c.brand.primary : c.text.muted}
        />
      </Animated.View>
      <Text style={[styles.label, active && styles.labelActive, { color: active ? c.brand.primary : c.text.muted }]}>
        {tab.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
  },
  pill: {
    position: 'absolute',
    top: 0,
    width: PILL_WIDTH,
    height: 3,
    borderRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: sp['2.5'],
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: sp['1'],
    minHeight: 44,
  },
  label: {
    ...text.tabLabel,
  },
  labelActive: {
    fontWeight: '600',
  },
});
