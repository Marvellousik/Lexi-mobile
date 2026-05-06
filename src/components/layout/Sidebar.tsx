import React, { useEffect, useRef } from 'react';
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
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import * as Haptics from 'expo-haptics';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

const toolsConfig: Record<string, { activeTop: string | null; expandedSection: string | null; activeSub: string | null }> = {
  '/(tabs)/home': { activeTop: 'dashboard', expandedSection: null, activeSub: null },
  '/(tabs)/tools/tts': { activeTop: 'tts', expandedSection: 'textEditing', activeSub: null },
  '/(tabs)/tools/tts/player': { activeTop: 'tts', expandedSection: 'textEditing', activeSub: null },
  '/(tabs)/tools/reading': { activeTop: 'reading', expandedSection: 'textEditing', activeSub: null },
  '/(tabs)/tools/reading/reader': { activeTop: 'reading', expandedSection: 'textEditing', activeSub: null },
  '/(tabs)/tools/writing': { activeTop: 'writing', expandedSection: null, activeSub: null },
  '/(tabs)/tools/studybuddy/quiz': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'quizzes' },
  '/(tabs)/tools/studybuddy/quiz/session': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'quizzes' },
  '/(tabs)/tools/studybuddy/quiz/results': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'quizzes' },
  '/(tabs)/tools/studybuddy/quiz/review': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'quizzes' },
  '/(tabs)/tools/studybuddy/flashcards': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'flashcards' },
  '/(tabs)/tools/studybuddy/flashcards/session': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'flashcards' },
  '/(tabs)/tools/studybuddy/chat': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'chat' },
  '/(tabs)/tools/studybuddy/chat/conversation': { activeTop: null, expandedSection: 'studybuddy', activeSub: 'chat' },
};

const ttsSubItems = [
  { label: 'Voice Option', value: 'voice' },
  { label: 'Speed', value: 'speed' },
  { label: 'Reading Options', value: 'reading' },
  { label: 'Dim Surrounding Text', value: 'dim' },
  { label: 'Tint Background Colour', value: 'tint' },
  { label: 'Highlight Colour', value: 'highlight' },
];

const readingSubItems = [
  { label: 'Font Choice', value: 'font' },
  { label: 'Spacing', value: 'spacing' },
  { label: 'Dim Surrounding Text', value: 'dim' },
  { label: 'Tint Background Colour', value: 'tint' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isOpen, openSidebar, closeSidebar } = useSidebarStore();
  const { logout, user } = useAuthStore();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -DRAWER_WIDTH,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return isOpen && gestureState.dx < -20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(-DRAWER_WIDTH, gestureState.dx));
          overlayOpacity.setValue(Math.max(0, 1 + gestureState.dx / DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -DRAWER_WIDTH * 0.3 || gestureState.vx < -0.5) {
          closeSidebar();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }).start();
          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const config = toolsConfig[pathname] || { activeTop: null, expandedSection: null, activeSub: null };

  const isActiveTop = (key: string) => config.activeTop === key;
  const isActiveSub = (key: string) => config.activeSub === key;

  const handleNavigate = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeSidebar();
    router.push(path as any);
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    logout();
    closeSidebar();
    router.replace('/login');
  };

  const renderSubItems = () => {
    if (config.expandedSection !== 'textEditing') return null;
    const items = isActiveTop('tts') ? ttsSubItems : readingSubItems;
    return (
      <View style={styles.subItems}>
        {items.map((item) => (
          <TouchableOpacity key={item.value} style={styles.subItem}>
            <Text style={styles.subItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <>
      {/* Floating hamburger — visible when sidebar is closed */}
      {!isOpen && (
        <View style={[styles.floatingHamburger, { top: insets.top + sp['2'] }]}>
          <TouchableOpacity
            onPress={openSidebar}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconHit}
            accessible={true}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          >
            <Ionicons name="menu" size={24} color="#3D7A52" />
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay */}
      {isOpen && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeSidebar} />
        </Animated.View>
      )}

      {/* Drawer */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Header inside sidebar with safe area */}
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={closeSidebar}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.iconHit}
              accessible={true}
              accessibilityLabel="Close menu"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <Ionicons name="leaf" size={28} color="#FFFFFF" />
              <Text style={styles.wordmark}>LexiAssist</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => { closeSidebar(); router.push('/settings'); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.iconHit}
                accessible={true}
                accessibilityLabel="Settings"
                accessibilityRole="button"
              >
                <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { closeSidebar(); toggleTheme(); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.iconHit}
                accessible={true}
                accessibilityLabel="Toggle dark mode"
                accessibilityRole="button"
              >
                <Ionicons name="moon-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + sp['5'] }}
        >
          <TouchableOpacity
            style={[styles.navItem, isActiveTop('dashboard') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/home')}
            accessible={true}
            accessibilityLabel="Dashboard"
            accessibilityRole="button"
            accessibilityState={{ selected: isActiveTop('dashboard') }}
          >
            <Ionicons name="home" size={20} color={isActiveTop('dashboard') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('dashboard') && styles.activeText]}>Dashboard</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>TOOLS</Text>

          <TouchableOpacity
            style={[styles.navItem, isActiveTop('tts') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/tools/tts')}
            accessible={true}
            accessibilityLabel="Text to Speech"
            accessibilityRole="button"
            accessibilityState={{ selected: isActiveTop('tts') }}
          >
            <Ionicons name="mic" size={20} color={isActiveTop('tts') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('tts') && styles.activeText]}>Text to Speech</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, isActiveTop('reading') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/tools/reading')}
            accessible={true}
            accessibilityLabel="Reading Assistant"
            accessibilityRole="button"
            accessibilityState={{ selected: isActiveTop('reading') }}
          >
            <Ionicons name="book" size={20} color={isActiveTop('reading') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('reading') && styles.activeText]}>Reading Assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, isActiveTop('writing') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/tools/writing')}
            accessible={true}
            accessibilityLabel="Writing Assistant"
            accessibilityRole="button"
            accessibilityState={{ selected: isActiveTop('writing') }}
          >
            <Ionicons name="pencil" size={20} color={isActiveTop('writing') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('writing') && styles.activeText]}>Writing Assistant</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity
              style={[styles.navItem, config.expandedSection === 'studybuddy' && styles.activeItem]}
              onPress={() => handleNavigate('/(tabs)/tools/studybuddy/quiz')}
              accessible={true}
              accessibilityLabel="StudyBuddy"
              accessibilityRole="button"
              accessibilityState={{ selected: config.expandedSection === 'studybuddy' }}
            >
              <Ionicons name="list" size={20} color={config.expandedSection === 'studybuddy' ? '#3D7A52' : '#FFFFFF'} />
              <Text style={[styles.navText, config.expandedSection === 'studybuddy' && styles.activeText]}>StudyBuddy</Text>
              <Ionicons
                name={config.expandedSection === 'studybuddy' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="rgba(255,255,255,0.7)"
                style={styles.chevron}
              />
            </TouchableOpacity>

            {config.expandedSection === 'studybuddy' && (
              <View style={styles.subItems}>
                {[
                  { label: 'Chat Assistant', key: 'chat' },
                  { label: 'Flashcards', key: 'flashcards' },
                  { label: 'Quizzes', key: 'quizzes' },
                ].map((sub) => (
                  <TouchableOpacity
                    key={sub.key}
                    style={[styles.subItem, isActiveSub(sub.key) && styles.activeSubItem]}
                    onPress={() =>
                      handleNavigate(
                        sub.key === 'chat'
                          ? '/(tabs)/tools/studybuddy/chat'
                          : sub.key === 'flashcards'
                          ? '/(tabs)/tools/studybuddy/flashcards'
                          : '/(tabs)/tools/studybuddy/quiz'
                      )
                    }
                    accessible={true}
                    accessibilityLabel={sub.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActiveSub(sub.key) }}
                  >
                    <Text style={[styles.subItemText, isActiveSub(sub.key) && styles.activeSubText]}>
                      {sub.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {renderSubItems()}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + sp['4'] }]}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'guest@lexiassist.com'}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.iconHit}
              accessible={true}
              accessibilityLabel="Log out"
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  floatingHamburger: {
    position: 'absolute',
    left: sp['4'],
    zIndex: 35,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 40,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#3D7A52',
    zIndex: 50,
    flexDirection: 'column',
  },
  headerWrapper: {
    backgroundColor: '#3D7A52',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp['5'],
    height: 56,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    position: 'absolute',
    left: 56,
  },
  wordmark: {
    color: '#FFFFFF',
    fontSize: text.h4.fontSize,
    fontWeight: text.h4.fontWeight,
    letterSpacing: text.h4.letterSpacing,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    marginLeft: 'auto',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: sp['5'],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
    height: 48,
    paddingHorizontal: sp['3'],
    borderRadius: 12,
    marginBottom: sp['1'],
  },
  activeItem: {
    backgroundColor: '#FFFFFF',
  },
  navText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0,
    lineHeight: 20,
  },
  activeText: {
    color: '#3D7A52',
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: sp['3'],
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.55)',
    ...text.overline,
    textTransform: 'uppercase',
    marginBottom: sp['2'],
    marginLeft: sp['3'],
  },
  chevron: {
    marginLeft: 'auto',
  },
  subItems: {
    paddingLeft: 44,
    marginBottom: sp['2'],
  },
  subItem: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: sp['3'],
    borderRadius: 12,
    marginBottom: sp['1'],
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  activeSubItem: {
    backgroundColor: '#FFFFFF',
  },
  subItemText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
  },
  activeSubText: {
    color: '#3D7A52',
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: sp['5'],
    paddingTop: sp['5'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
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
    position: 'relative',
  },
  avatarText: {
    color: '#3D7A52',
    fontSize: 16,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: text.h4.fontSize,
    fontWeight: text.h4.fontWeight,
    letterSpacing: text.h4.letterSpacing,
    lineHeight: text.h4.lineHeight,
  },
  userEmail: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: text.caption.fontSize,
    lineHeight: text.caption.lineHeight,
    marginTop: sp['0.5'],
  },
  iconHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
