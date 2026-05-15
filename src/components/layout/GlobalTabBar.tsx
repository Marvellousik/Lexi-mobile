import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';

const TabIcon = ({ routeName, color }: { routeName: string; color: string }) => {
  switch (routeName) {
    case 'home':
      return (
        <Svg width="24" height="24" viewBox="14 4 28 28" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.2965 6.38494C28.9192 5.42084 27.086 5.42084 25.7088 6.38494L18.8312 11.1992C17.6726 12.0103 17.0283 13.3728 17.1368 14.783L17.8418 23.9482C17.9748 25.6768 19.541 26.9331 21.2573 26.688L24.4269 26.2352C25.9048 26.024 27.0026 24.7583 27.0026 23.2653V21.9999C27.0026 21.4476 27.4503 20.9999 28.0026 20.9999C28.5549 20.9999 29.0026 21.4476 29.0026 21.9999V23.2653C29.0026 24.7583 30.1004 26.024 31.5783 26.2352L34.748 26.688C36.4642 26.9331 38.0304 25.6768 38.1634 23.9482L38.8684 14.783C38.9769 13.3728 38.3327 12.0103 37.174 11.1992L30.2965 6.38494ZM26.8557 8.0234C27.5443 7.54135 28.4609 7.54135 29.1495 8.0234L36.0271 12.8377C36.6064 13.2432 36.9285 13.9245 36.8743 14.6296L36.1693 23.7948C36.125 24.371 35.6029 24.7898 35.0308 24.7081L31.8612 24.2553C31.3685 24.1849 31.0026 23.763 31.0026 23.2653V21.9999C31.0026 20.343 29.6595 18.9999 28.0026 18.9999C26.3458 18.9999 25.0026 20.343 25.0026 21.9999V23.2653C25.0026 23.763 24.6367 24.1849 24.144 24.2553L20.9744 24.7081C20.4023 24.7898 19.8803 24.371 19.8359 23.7948L19.1309 14.6296C19.0767 13.9245 19.3988 13.2432 19.9781 12.8377L26.8557 8.0234Z"
            fill={color}
          />
        </Svg>
      );
    case 'chat':
      return (
        <Svg width="24" height="24" viewBox="36 9 26 26" fill="none">
          <Path d="M41.675 19.2251C41.3366 18.21 40.54 17.4134 39.5249 17.075C38.4917 16.7307 38.4917 15.2693 39.5249 14.925C40.54 14.5866 41.3366 13.79 41.675 12.7749C42.0193 11.7417 43.4807 11.7417 43.825 12.7749C44.1634 13.79 44.96 14.5866 45.9751 14.925C47.0083 15.2693 47.0083 16.7307 45.9751 17.075C44.96 17.4134 44.1634 18.21 43.825 19.2251C43.4807 20.2583 42.0193 20.2583 41.675 19.2251Z" fill={color} />
          <Path d="M49.8687 30.644C49.2765 28.8675 47.8825 27.4735 46.106 26.8813C44.298 26.2787 44.298 23.7213 46.106 23.1187C47.8825 22.5265 49.2765 21.1325 49.8687 19.356C50.4713 17.548 53.0287 17.548 53.6313 19.356C54.2235 21.1325 55.6175 22.5265 57.394 23.1187C59.202 23.7213 59.202 26.2787 57.394 26.8813C55.6175 27.4735 54.2235 28.8675 53.6313 30.644C53.0287 32.452 50.4713 32.452 49.8687 30.644Z" fill={color} />
        </Svg>
      );
    case 'history':
      return (
        <Svg width="24" height="24" viewBox="36 10 24 24" fill="none">
          <Path d="M42.5493 13C42.5493 12.4477 42.1016 12 41.5493 12C40.9971 12 40.5493 12.4477 40.5493 13V16.6C40.5493 17.1523 40.9971 17.6 41.5493 17.6H45.15C45.7023 17.6 46.15 17.1523 46.15 16.6C46.15 16.0477 45.7023 15.6 45.15 15.6H43.949C45.2866 14.5948 46.9488 14 48.75 14C53.1683 14 56.75 17.5817 56.75 22C56.75 26.4183 53.1683 30 48.75 30C44.3317 30 40.75 26.4183 40.75 22C40.75 21.4477 40.3023 21 39.75 21C39.1977 21 38.75 21.4477 38.75 22C38.75 27.5228 43.2272 32 48.75 32C54.2728 32 58.75 27.5228 58.75 22C58.75 16.4772 54.2728 12 48.75 12C46.4075 12 44.2532 12.806 42.5493 14.1542V13Z" fill={color} />
          <Path d="M48.75 18.5C48.75 17.9477 48.3023 17.5 47.75 17.5C47.1977 17.5 46.75 17.9477 46.75 18.5V23.5C46.75 24.0523 47.1977 24.5 47.75 24.5H50.75C51.3023 24.5 51.75 24.0523 51.75 23.5C51.75 22.9477 51.3023 22.5 50.75 22.5H48.75V18.5Z" fill={color} />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width="24" height="24" viewBox="36 10 24 24" fill="none">
          <Path d="M48.7511 24.5C50.6841 24.5 52.2511 22.933 52.2511 21C52.2511 19.067 50.6841 17.5 48.7511 17.5C46.8181 17.5 45.2511 19.067 45.2511 21C45.2511 22.933 46.8181 24.5 48.7511 24.5Z" fill={color} />
          <Path fillRule="evenodd" clipRule="evenodd" d="M52.7511 31.9948C53.7715 31.9347 54.6965 31.3576 55.1968 30.4569L59.0857 23.4569C59.5891 22.5509 59.5891 21.4491 59.0857 20.5431L55.1968 13.5431C54.6677 12.5907 53.6638 12 52.5743 12H44.928C43.8384 12 42.8346 12.5907 42.3055 13.5431L38.4166 20.5431C37.9132 21.4491 37.9132 22.5509 38.4166 23.4569L42.3055 30.4569C42.7896 31.3284 43.6712 31.897 44.6523 31.9873V32H52.7511V31.9948ZM44.928 14C44.5648 14 44.2302 14.1969 44.0538 14.5144L40.1649 21.5144C39.9971 21.8164 39.9971 22.1836 40.1649 22.4856L43.1892 27.9294C44.4837 27.1882 46.8709 25.9891 48.7511 26C50.6371 26.011 53.0338 27.2453 54.2876 27.9753L57.3374 22.4856C57.5052 22.1836 57.5052 21.8164 57.3374 21.5144L53.4485 14.5144C53.2721 14.1969 52.9375 14 52.5743 14H44.928Z" fill={color} />
        </Svg>
      );
    default:
      return null;
  }
};

const TABS = [
  { name: 'home', label: 'Dashboard', path: '/home' as const },
  { name: 'chat', label: 'Chat', path: '/chat' as const },
  { name: 'history', label: 'History', path: '/history' as const },
  { name: 'profile', label: 'Me', path: '/profile' as const },
];

const AUTH_PATHS = ['/login', '/register', '/email-verification'];

export default function GlobalTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Hide when not authenticated
  if (!user) return null;

  // Hide on auth screens
  if (AUTH_PATHS.includes(pathname)) return null;

  const renderContent = () => (
    <View style={styles.tabContent}>
      {TABS.map((tab) => {
        const isFocused =
          pathname === `/${tab.name}` ||
          pathname.startsWith(`/${tab.name}/`) ||
          (tab.name === 'chat' && pathname.startsWith('/tools/studybuddy/chat'));

        const onPress = () => {
          if (!isFocused) {
            router.navigate(tab.path as any);
          }
        };

        const activeColor = '#2B5D39';
        const inactiveColor = '#49454F';

        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <View style={[styles.iconPill, isFocused && styles.activePill]}>
              <TabIcon routeName={tab.name} color={isFocused ? activeColor : inactiveColor} />
            </View>
            <Text style={[styles.labelText, { color: isFocused ? activeColor : inactiveColor }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 16) }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          {renderContent()}
        </BlurView>
      ) : (
        <View style={styles.androidFallback}>
          {renderContent()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  blurContainer: {
    flex: 1,
  },
  androidFallback: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  tabContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  activePill: {
    backgroundColor: '#C3D9C9',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
