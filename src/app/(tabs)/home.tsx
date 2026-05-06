import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Sidebar from '@/components/layout/Sidebar';
import ToolHeroCard from '@/components/shared/ToolHeroCard';
import FAB from '@/components/shared/FAB';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const TOOLS = [
  {
    id: 'tts',
    title: 'Text to Speech Learning Hub',
    description: 'Convert text to natural-sounding speech for auditory learning',
    bgColor: '#C5CAE9',
    icon: 'mic',
    route: '/(tabs)/tools/tts',
  },
  {
    id: 'reading',
    title: 'Reading Assistant',
    description: 'Get help reading and understanding complex texts',
    bgColor: '#C5CAE9',
    icon: 'book',
    route: '/(tabs)/tools/reading',
  },
  {
    id: 'studybuddy',
    title: 'StudyBuddy',
    description: 'Generate quizzes, flashcards, and chat with AI for studying',
    bgColor: '#D1C4E9',
    icon: 'school',
    route: '/(tabs)/tools/studybuddy/quiz',
  },
  {
    id: 'writing',
    title: 'Speech to Text (Writing Assistant)',
    description: 'Transcribe speech to text with AI assistance',
    bgColor: '#FFCDD2',
    icon: 'pencil',
    route: '/(tabs)/tools/writing',
  },
];

const RECENT_ITEMS = [
  { id: '1', filename: 'History of Hitler.pdf', toolType: 'Quiz', timestamp: 'Yesterday by 6:00pm' },
  { id: '2', filename: 'History of Hitler.pdf', toolType: 'Flashcards', timestamp: 'Yesterday by 6:00pm' },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const c = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <Sidebar />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={[styles.greeting, { color: c.text.primary }]}>
            Hello, {user?.name || 'Victoria'}!
          </Text>
          <Text style={[styles.subtitle, { color: c.text.secondary }]}>
            Pick a tool to get started with
          </Text>
        </Animated.View>

        <View style={{ height: sp['6'] }} />

        {TOOLS.map((tool, index) => (
          <Animated.View
            key={tool.id}
            style={{
              opacity: fadeAnim,
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 20],
                  outputRange: [0, 20 + index * 8],
                }),
              }],
            }}
          >
            <ToolHeroCard
              title={tool.title}
              description={tool.description}
              backgroundColor={tool.bgColor}
              icon={tool.icon}
              onPress={() => router.push(tool.route as any)}
            />
          </Animated.View>
        ))}

        <Text style={[styles.sectionTitle, { color: c.text.primary }]}>
          Continue from where you left off
        </Text>

        {RECENT_ITEMS.length > 0 ? (
          RECENT_ITEMS.map((item) => (
            <View
              key={item.id}
              style={[styles.recentRow, { backgroundColor: c.ui.cardBg }]}
            >
              <View style={[styles.recentIcon, { backgroundColor: 'rgba(61,122,82,0.1)' }]}>
                <Ionicons name="document-text" size={20} color={c.brand.primary} />
              </View>
              <View style={styles.recentTextBlock}>
                <Text style={[styles.recentFilename, { color: c.text.primary }]}>
                  {item.filename}
                </Text>
                <View style={styles.recentMetaRow}>
                  <Text style={[styles.recentMeta, { color: c.text.muted }]}>
                    {item.toolType}
                  </Text>
                  <Text style={[styles.recentMeta, { color: c.text.muted }]}>
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={40} color={c.text.muted} />
            <Text style={[styles.emptyTitle, { color: c.text.primary }]}>
              No recent sessions
            </Text>
            <Text style={[styles.emptyBody, { color: c.text.muted }]}>
              Pick a tool above to get started
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB onPress={() => {}} />
    </SafeAreaView>
  );
}

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 120,
  },
  greeting: { ...text.h1, marginBottom: sp['1'] },
  subtitle: { ...text.body, marginBottom: sp['4'] },
  sectionTitle: { ...text.h3, marginTop: sp['6'], marginBottom: sp['3'] },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sp['3.5'],
    paddingHorizontal: sp['4'],
    borderRadius: 12,
    marginBottom: sp['2'],
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTextBlock: {
    flex: 1,
    marginLeft: sp['3'],
  },
  recentFilename: {
    ...text.label,
    marginBottom: sp['0.5'],
  },
  recentMetaRow: {
    flexDirection: 'row',
    gap: sp['2'],
    marginTop: sp['0.5'],
  },
  recentMeta: {
    ...text.caption,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: sp['8'],
    gap: sp['3'],
  },
  emptyTitle: {
    ...text.h3,
    marginTop: sp['2'],
  },
  emptyBody: {
    ...text.body,
    textAlign: 'center',
    maxWidth: 240,
  },
});
