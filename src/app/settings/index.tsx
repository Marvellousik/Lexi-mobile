import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/themeStore';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function SettingsScreen() {
  const router = useRouter();
  const c = useTheme();
  const { isDark, toggleTheme } = useThemeStore();

  const SETTINGS_ITEMS = [
    {
      icon: isDark ? 'sunny-outline' : 'moon-outline',
      label: 'Dark Mode',
      action: toggleTheme,
      toggle: true,
      toggleValue: isDark,
    },
    { icon: 'notifications-outline', label: 'Notifications', action: () => {}, toggle: false },
    { icon: 'lock-closed-outline', label: 'Privacy', action: () => {}, toggle: false },
    { icon: 'information-circle-outline', label: 'About', action: () => {}, toggle: false },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={c.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ height: sp['6'] }} />

        {SETTINGS_ITEMS.map((item) => (
          <SettingRow key={item.label} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  item,
}: {
  item: {
    icon: string;
    label: string;
    action: () => void;
    toggle: boolean;
    toggleValue?: boolean;
  };
}) {
  const c = useTheme();
  const { animatedStyle, handlers } = useAnimatedPress(0.98, 100);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.row, { backgroundColor: c.ui.cardBg }]}
        onPress={item.action}
        activeOpacity={0.92}
        accessible={true}
        accessibilityLabel={item.label}
        accessibilityRole={item.toggle ? 'switch' : 'button'}
        accessibilityState={{ selected: item.toggleValue }}
        {...handlers}
      >
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(61,122,82,0.1)' }]}>
          <Ionicons name={item.icon as any} size={20} color={c.brand.primary} />
        </View>
        <Text style={[styles.rowText, { color: c.text.primary }]}>{item.label}</Text>
        {item.toggle ? (
          <Ionicons
            name={item.toggleValue ? 'toggle' : 'toggle-outline'}
            size={26}
            color={item.toggleValue ? c.brand.primary : c.text.muted}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={c.text.muted} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['4'],
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    ...text.h1,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp['4'],
    borderRadius: 12,
    marginBottom: sp['2'],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sp['3'],
  },
  rowText: { flex: 1, ...text.body, fontWeight: '500' },
});
