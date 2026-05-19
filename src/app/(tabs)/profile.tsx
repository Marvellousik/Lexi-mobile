import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useExitOnBack } from '@/hooks/useExitOnBack';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import * as Haptics from 'expo-haptics';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Edit Profile', route: null },
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const c = useTheme();

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: c.ui.background }]}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: c.brand.primary }]}>
            <Text style={[styles.avatarText, { color: c.text.inverse }]}>
              {user?.name?.[0] || 'U'}
            </Text>
          </View>
          <Text style={[styles.name, { color: c.text.primary }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.email, { color: c.text.muted }]}>
            {user?.email || ''}
          </Text>
        </View>

        {MENU_ITEMS.map((item) => (
          <MenuRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            onPress={() => item.route && router.push(item.route as any)}
          />
        ))}

        <TouchableOpacity
          style={[
            styles.logoutRow,
            { backgroundColor: c.text.danger, shadowColor: c.text.danger },
          ]}
          onPress={handleLogout}
          activeOpacity={0.88}
          accessible={true}
          accessibilityLabel="Log out"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={22} color={c.text.inverse} />
          <Text style={[styles.logoutText, { color: c.text.inverse }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  const c = useTheme();
  const { animatedStyle, handlers } = useAnimatedPress(0.98, 100);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.row, { backgroundColor: c.ui.cardBg }]}
        onPress={onPress || (() => {})}
        activeOpacity={0.92}
        disabled={!onPress}
        accessible={true}
        accessibilityLabel={label}
        accessibilityRole="button"
        {...handlers}
      >
        <View style={[styles.iconContainer, { backgroundColor: c.brand.primary + '1A' }]}>
          <Ionicons name={icon as any} size={20} color={c.brand.primary} />
        </View>
        <Text style={[styles.rowText, { color: c.text.primary }]}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color={c.text.muted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 120,
  },
  avatarSection: { alignItems: 'center', marginBottom: sp['8'] },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['3'],
  },
  avatarText: { fontSize: 28, fontWeight: '700' },
  name: { ...text.h3, marginBottom: sp['1'] },
  email: { ...text.body },
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
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
    padding: sp['4'],
    borderRadius: 14,
    marginTop: sp['6'],
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: { ...text.button },
});
