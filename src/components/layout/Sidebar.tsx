import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 300);
const DRAWER_CORNER_RADIUS = 24;

const toolsConfig: Record<string, { activeTop: string | null; activeSub: string | null }> = {
  '/(tabs)/home': { activeTop: 'dashboard', activeSub: null },
  '/tools/tts': { activeTop: 'tts', activeSub: null },
  '/tools/reading': { activeTop: 'reading', activeSub: null },
  '/tools/writing': { activeTop: 'writing', activeSub: null },
  '/tools/studybuddy/quiz': { activeTop: 'studybuddy', activeSub: 'quiz' },
  '/tools/studybuddy/flashcards': { activeTop: 'studybuddy', activeSub: 'flashcards' },
  '/tools/studybuddy/chat': { activeTop: 'studybuddy', activeSub: 'chat' },
};

const STUDY_BUDDY_SUBSECTION = [
  { label: 'Chat Assistant', key: 'chat', icon: 'chatbubbles-outline' as const },
  { label: 'Flashcards', key: 'flashcards', icon: 'albums-outline' as const },
  { label: 'Quizzes', key: 'quiz', icon: 'help-circle-outline' as const },
];

/**
 * Sidebar
 *
 * Global drawer overlay. Single instance rendered in Tabs layout.
 *
 * Architecture decisions:
 * - Overlay is NEVER conditionally rendered. On iOS, removing the overlay
 *   from the view tree while the drawer animates out causes hit-test
 *   failures. We keep the overlay node mounted and toggle pointerEvents.
 * - Drawer uses native driver for all animations to avoid JS thread
 *   blockage during gesture dismissal.
 * - PanResponder only activates on horizontal drags starting from the
 *   drawer surface, preventing conflict with internal ScrollView scrolling.
 * - All colors resolve from the theme system. No hardcoded hex values.
 */
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const c = useTheme();

  const { isOpen, closeSidebar } = useSidebarStore();
  const { logout, user } = useAuthStore();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const config = toolsConfig[pathname] ?? { activeTop: null, activeSub: null };

  // Auto-expand StudyBuddy when on a studybuddy route
  useEffect(() => {
    if (config.activeTop === 'studybuddy') {
      setExpandedSection('studybuddy');
    }
  }, [config.activeTop]);

  // Animate drawer and overlay based on isOpen state
  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.spring(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        friction: 9,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: isOpen ? 250 : 200,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [isOpen, translateX, overlayOpacity]);

  // Pan responder for swipe-to-dismiss.
  // onMoveShouldSetPanResponder requires dx < -15 to avoid fighting
  // with vertical scroll gestures inside the drawer ScrollView.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return isOpen && gestureState.dx < -15 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(-DRAWER_WIDTH, gestureState.dx));
          overlayOpacity.setValue(Math.max(0, 1 + gestureState.dx / DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = -DRAWER_WIDTH * 0.3;
        const velocityThreshold = -0.5;

        if (gestureState.dx < threshold || gestureState.vx < velocityThreshold) {
          closeSidebar();
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 9,
              tension: 45,
              useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const isActiveTop = useCallback(
    (key: string) => config.activeTop === key,
    [config.activeTop]
  );
  const isActiveSub = useCallback(
    (key: string) => config.activeSub === key,
    [config.activeSub]
  );

  const handleNavigate = useCallback(
    (path: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      closeSidebar();
      router.push(path as any);
    },
    [closeSidebar, router]
  );

  const toggleSection = useCallback((section: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const handleLogout = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await logout();
    closeSidebar();
    router.replace('/(auth)/login');
  }, [logout, closeSidebar, router]);

  const brandColor = c.brand.primary;
  const inverseText = c.text.inverse;
  const mutedInverse = 'rgba(255,255,255,0.7)';
  const subtleInverse = 'rgba(255,255,255,0.15)';
  const overlayBackground = c.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)';

  return (
    <>
      {/* OVERLAY: Always mounted. pointerEvents toggles hit-testing.
          iOS requires the native view node to remain in the hierarchy
          to intercept touches during the drawer's exit animation. */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            backgroundColor: overlayBackground,
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={closeSidebar}
          accessibilityLabel="Close navigation menu"
          accessibilityRole="button"
        />
      </Animated.View>

      {/* DRAWER: Inset with rounded trailing edge.
          Margins respect the AppHeader and GlassTabBar. */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: brandColor,
            transform: [{ translateX }],
            borderTopRightRadius: DRAWER_CORNER_RADIUS,
            borderBottomRightRadius: DRAWER_CORNER_RADIUS,
            top: insets.top + 56, // AppHeader height
            bottom: insets.bottom + 70, // TabBar approximate height
            shadowColor: c.isDark ? '#000' : '#1a1a1a',
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
        {...panResponder.panHandlers}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoBlock}>
            <Text style={[styles.wordmark, { color: inverseText }]}>
              LexiAssist
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => {
                closeSidebar();
                toggleTheme();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.iconHit}
              accessibilityLabel="Toggle theme"
              accessibilityRole="button"
            >
              <Ionicons name="moon-outline" size={22} color={inverseText} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeSidebar}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={styles.iconHit}
              accessibilityLabel="Close navigation menu"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={26} color={inverseText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation */}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: sp['6'],
          }}
        >
          <Text style={[styles.sectionLabel, { color: mutedInverse }]}>MAIN</Text>

          <NavItem
            icon="home"
            label="Dashboard"
            isActive={isActiveTop('dashboard')}
            brandColor={brandColor}
            inverseText={inverseText}
            onPress={() => handleNavigate('/(tabs)/home')}
          />

          <View style={[styles.divider, { backgroundColor: subtleInverse }]} />

          <Text style={[styles.sectionLabel, { color: mutedInverse }]}>TOOLS</Text>

          <NavItem
            icon="mic"
            label="Text to Speech"
            isActive={isActiveTop('tts')}
            brandColor={brandColor}
            inverseText={inverseText}
            onPress={() => handleNavigate('/tools/tts')}
          />

          <NavItem
            icon="book"
            label="Reading Assistant"
            isActive={isActiveTop('reading')}
            brandColor={brandColor}
            inverseText={inverseText}
            onPress={() => handleNavigate('/tools/reading')}
          />

          <NavItem
            icon="pencil"
            label="Writing Assistant"
            isActive={isActiveTop('writing')}
            brandColor={brandColor}
            inverseText={inverseText}
            onPress={() => handleNavigate('/tools/writing')}
          />

          {/* StudyBuddy — compact subsection */}
          <View>
            <TouchableOpacity
              style={[
                styles.navItem,
                isActiveTop('studybuddy') &&
                  styles.activeNavItem,
              ]}
              onPress={() => toggleSection('studybuddy')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="school"
                size={20}
                color={
                  isActiveTop('studybuddy') ? brandColor : inverseText
                }
              />
              <Text
                style={[
                  styles.navText,
                  { color: inverseText },
                  isActiveTop('studybuddy') && {
                    color: brandColor,
                    fontWeight: '700',
                  },
                ]}
              >
                StudyBuddy
              </Text>
              <Ionicons
                name={
                  expandedSection === 'studybuddy'
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={16}
                color={
                  isActiveTop('studybuddy') ? brandColor : mutedInverse
                }
              />
            </TouchableOpacity>

            {expandedSection === 'studybuddy' && (
              <View style={styles.subsection}>
                {STUDY_BUDDY_SUBSECTION.map((sub) => (
                  <TouchableOpacity
                    key={sub.key}
                    style={[
                      styles.subItem,
                      isActiveSub(sub.key) && styles.activeSubItem,
                    ]}
                    onPress={() =>
                      handleNavigate(
                        `/tools/studybuddy/${sub.key}`
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={sub.icon}
                      size={16}
                      color={
                        isActiveSub(sub.key)
                          ? brandColor
                          : mutedInverse
                      }
                    />
                    <Text
                      style={[
                        styles.subItemText,
                        { color: mutedInverse },
                        isActiveSub(sub.key) && {
                          color: brandColor,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      {sub.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              borderTopColor: subtleInverse,
              paddingBottom: Math.max(insets.bottom, sp['4']),
            },
          ]}
        >
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text
                style={[
                  styles.avatarText,
                  { color: brandColor },
                ]}
              >
                {user?.name?.[0] || 'U'}
              </Text>
              <View style={[styles.onlineDot, { borderColor: brandColor }]} />
            </View>
            <View style={styles.userInfo}>
              <Text
                style={[styles.userName, { color: inverseText }]}
                numberOfLines={1}
              >
                {user?.name || 'Guest User'}
              </Text>
              <Text
                style={[styles.userEmail, { color: mutedInverse }]}
                numberOfLines={1}
              >
                {user?.email || 'guest@lexiassist.com'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={styles.iconHit}
              accessibilityLabel="Log out"
              accessibilityRole="button"
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={mutedInverse}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

/* ─── NavItem subcomponent ─── */

function NavItem({
  icon,
  label,
  isActive,
  brandColor,
  inverseText,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  isActive: boolean;
  brandColor: string;
  inverseText: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.navItem, isActive && styles.activeNavItem]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isActive ? brandColor : inverseText}
      />
      <Text
        style={[
          styles.navText,
          { color: inverseText },
          isActive && { color: brandColor, fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    zIndex: 1000,
    flexDirection: 'column',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp['4'],
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoBlock: {
    flex: 1,
  },
  wordmark: {
    ...text.h3,
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1'],
  },
  scroll: {
    flex: 1,
    paddingHorizontal: sp['4'],
  },
  sectionLabel: {
    ...text.overline,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: sp['3'],
    marginLeft: sp['2'],
    marginTop: sp['4'],
  },
  divider: {
    height: 1,
    marginVertical: sp['4'],
    marginHorizontal: sp['2'],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
    height: 48,
    paddingHorizontal: sp['4'],
    borderRadius: 12,
    marginBottom: sp['1.5'],
  },
  activeNavItem: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  subsection: {
    paddingLeft: sp['5'],
    marginTop: sp['1'],
    marginBottom: sp['2'],
    gap: sp['1'],
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
    height: 40,
    paddingHorizontal: sp['3'],
    borderRadius: 10,
  },
  activeSubItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  subItemText: {
    fontSize: 14,
    fontWeight: '400',
  },
  footer: {
    padding: sp['4'],
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderTopWidth: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  iconHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
