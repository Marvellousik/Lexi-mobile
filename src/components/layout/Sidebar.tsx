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
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 300);

const toolsConfig: Record<string, { activeTop: string | null; activeSub: string | null }> = {
  '/(tabs)/home': { activeTop: 'dashboard', activeSub: null },
  '/(tabs)/tools/tts': { activeTop: 'tts', activeSub: null },
  '/(tabs)/tools/reading': { activeTop: 'reading', activeSub: null },
  '/(tabs)/tools/writing': { activeTop: 'writing', activeSub: null },
  '/(tabs)/tools/studybuddy/quiz': { activeTop: 'studybuddy', activeSub: 'quizzes' },
  '/(tabs)/tools/studybuddy/flashcards': { activeTop: 'studybuddy', activeSub: 'flashcards' },
  '/(tabs)/tools/studybuddy/chat': { activeTop: 'studybuddy', activeSub: 'chat' },
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  
  const { isOpen, openSidebar, closeSidebar } = useSidebarStore();
  const { logout, user } = useAuthStore();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Start completely off-screen to the left
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const config = toolsConfig[pathname] || { activeTop: null, activeSub: null };

  useEffect(() => {
    if (config.activeTop === 'studybuddy') {
      setExpandedSection('studybuddy');
    }
  }, [pathname]);

  // Master Animation Controller
  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0, // Slide in to origin
          friction: 9,
          tension: 45,
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
          toValue: -DRAWER_WIDTH, // Slide completely out to the left
          friction: 9,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, translateX, overlayOpacity]);

  // Gesture Math updated for Left-Anchored drawer
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only trigger gesture if open and swiping LEFT
        return isOpen && gestureState.dx < -15;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          // Constrain movement so it doesn't drag past 0 on the right
          translateX.setValue(Math.max(-DRAWER_WIDTH, gestureState.dx));
          overlayOpacity.setValue(Math.max(0, 1 + gestureState.dx / DRAWER_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped more than 30% left, or swiped fast, trigger close
        if (gestureState.dx < -DRAWER_WIDTH * 0.3 || gestureState.vx < -0.5) {
          closeSidebar();
        } else {
          // Snap back open
          Animated.spring(translateX, {
            toValue: 0,
            friction: 9,
            tension: 45,
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

  const isActiveTop = useCallback((key: string) => config.activeTop === key, [config]);
  const isActiveSub = useCallback((key: string) => config.activeSub === key, [config]);

  const handleNavigate = useCallback((path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeSidebar();
    router.push(path as any);
  }, [closeSidebar, router]);

  const toggleSection = useCallback((section: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const handleLogout = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    logout();
    closeSidebar();
    router.replace('/(auth)/login');
  }, [logout, closeSidebar, router]);

  return (
    <>
      {/* 
        The hamburger menu icon.
        Anchored top-left so it stays out of the way. 
      */}
      <Animated.View 
        style={[
          styles.floatingHamburger, 
          { 
            top: insets.top + sp['2'],
            opacity: overlayOpacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) 
          }
        ]}
        pointerEvents={isOpen ? 'none' : 'auto'}
      >
        <TouchableOpacity
          onPress={openSidebar}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={styles.iconHit}
        >
          <Ionicons name="menu" size={26} color="#3D7A52" />
        </TouchableOpacity>
      </Animated.View>

      {/* 
        Overlay is PERMANENTLY mounted. 
        It controls touches via pointerEvents instead of conditional rendering. 
      */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={closeSidebar} 
        />
      </Animated.View>

      {/* Drawer bounds now slide from the left limit */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Text style={styles.wordmark}>LexiAssist</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => { closeSidebar(); toggleTheme(); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.iconHit}
              >
                <Ionicons name="moon-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              {/* Close Button moved to the right edge for better ergonomics */}
              <TouchableOpacity
                onPress={closeSidebar}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                style={styles.iconHit}
              >
                <Ionicons name="close" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + sp['5'] }}
        >
          <Text style={styles.sectionLabel}>MAIN</Text>
          <TouchableOpacity
            style={[styles.navItem, isActiveTop('dashboard') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/home')}
          >
            <Ionicons name="home" size={20} color={isActiveTop('dashboard') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('dashboard') && styles.activeText]}>Dashboard</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>TOOLS</Text>

          <TouchableOpacity
            style={[styles.navItem, isActiveTop('tts') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/tools/tts')}
          >
            <Ionicons name="mic" size={20} color={isActiveTop('tts') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('tts') && styles.activeText]}>Text to Speech</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, isActiveTop('reading') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/tools/reading')}
          >
            <Ionicons name="book" size={20} color={isActiveTop('reading') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('reading') && styles.activeText]}>Reading Assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, isActiveTop('writing') && styles.activeItem]}
            onPress={() => handleNavigate('/(tabs)/tools/writing')}
          >
            <Ionicons name="pencil" size={20} color={isActiveTop('writing') ? '#3D7A52' : '#FFFFFF'} />
            <Text style={[styles.navText, isActiveTop('writing') && styles.activeText]}>Writing Assistant</Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity
              style={[styles.navItem, isActiveTop('studybuddy') && styles.activeItem]}
              onPress={() => toggleSection('studybuddy')}
            >
              <Ionicons name="school" size={20} color={isActiveTop('studybuddy') ? '#3D7A52' : '#FFFFFF'} />
              <Text style={[styles.navText, isActiveTop('studybuddy') && styles.activeText]}>StudyBuddy</Text>
              <Ionicons
                name={expandedSection === 'studybuddy' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={isActiveTop('studybuddy') ? '#3D7A52' : "rgba(255,255,255,0.7)"}
                style={styles.chevron}
              />
            </TouchableOpacity>

            {expandedSection === 'studybuddy' && (
              <View style={styles.subItems}>
                {[
                  { label: 'Chat Assistant', key: 'chat', icon: 'chatbubbles-outline' },
                  { label: 'Flashcards', key: 'flashcards', icon: 'albums-outline' },
                  { label: 'Quizzes', key: 'quizzes', icon: 'help-circle-outline' },
                ].map((sub) => (
                  <TouchableOpacity
                    key={sub.key}
                    style={[styles.subItem, isActiveSub(sub.key) && styles.activeSubItem]}
                    onPress={() => handleNavigate(`/(tabs)/tools/studybuddy/${sub.key}`)}
                  >
                    <Ionicons 
                      name={sub.icon as any} 
                      size={18} 
                      color={isActiveSub(sub.key) ? '#3D7A52' : 'rgba(255,255,255,0.7)'} 
                    />
                    <Text style={[styles.subItemText, isActiveSub(sub.key) && styles.activeSubText]}>
                      {sub.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, sp['4']) }]}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user?.email || 'guest@lexiassist.com'}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              style={styles.iconHit}
            >
              <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.7)" />
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
    zIndex: 100, 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    zIndex: 999, 
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0, // Swapped from right: 0 to left: 0
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#3D7A52',
    zIndex: 1000, 
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 }, // Cast shadow to the right now
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20,
  },
  headerWrapper: {
    backgroundColor: '#3D7A52',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: sp['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp['4'],
    height: 60,
  },
  logoRow: {
    flex: 1,
  },
  wordmark: {
    color: '#FFFFFF',
    ...text.h3,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1'],
  },
  scroll: {
    flex: 1,
    paddingHorizontal: sp['4'],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
    height: 52,
    paddingHorizontal: sp['4'],
    borderRadius: 14,
    marginBottom: sp['2'],
  },
  activeItem: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  activeText: {
    color: '#3D7A52',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: sp['4'],
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...text.overline,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: sp['3'],
    marginLeft: sp['2'],
  },
  chevron: {
    marginLeft: 'auto',
  },
  subItems: {
    paddingLeft: sp['6'],
    marginTop: sp['1'],
    marginBottom: sp['3'],
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
    marginLeft: 26,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
    height: 44,
    paddingHorizontal: sp['3'],
    borderRadius: 10,
    marginBottom: sp['1'],
  },
  activeSubItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  subItemText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
  },
  activeSubText: {
    color: '#3D7A52',
    fontWeight: '600',
  },
  footer: {
    padding: sp['5'],
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#3D7A52',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#3D7A52',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  iconHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});