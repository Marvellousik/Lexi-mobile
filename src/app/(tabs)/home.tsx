import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import FAB from '@/components/shared/FAB';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import {
  TextToSpeechIllustration,
  ReadingAssistantIllustration,
  StudyBuddyIllustration,
  SpeechToTextIllustration,
  FileIcon,
  QuizIcon,
  ClockIcon,
  MemoryCardIcon,
} from '@/components/illustrations/DashboardIllustrations';

const TOOLS = [
  {
    id: 'tts',
    title: 'Text to speech',
    subtitle: 'Learning Hub',
    description:
      'Turn text into sound. Sit back, listen & watch the words light up as you learn.',
    accentColor: 'rgba(64,123,255,0.33)',
    illustration: <TextToSpeechIllustration />,
    route: '/(tabs)/tools/tts',
  },
  {
    id: 'reading',
    title: 'Reading Assistant',
    subtitle: undefined,
    description: 'Study with confidence as words are simplified into bits',
    accentColor: 'rgba(137,207,240,0.33)',
    illustration: <ReadingAssistantIllustration />,
    route: '/(tabs)/tools/reading',
  },
  {
    id: 'studybuddy',
    title: 'StudyBuddy',
    subtitle: undefined,
    description:
      'A smart assistant that helps you understand your notes better. Just upload!',
    accentColor: 'rgba(126,87,194,0.33)',
    illustration: <StudyBuddyIllustration />,
    route: '/(tabs)/tools/studybuddy',
  },
  {
    id: 'writing',
    title: 'Speech to Text',
    subtitle: '(Writing Assistant)',
    description: 'Writing made easier! Just speak and we will do the writing',
    accentColor: 'rgba(197,63,63,0.33)',
    illustration: <SpeechToTextIllustration />,
    route: '/(tabs)/tools/writing',
  },
] as const;

const RECENT_ITEMS = [
  {
    id: '1',
    filename: 'History of Hitler.pdf',
    toolType: 'quiz' as const,
    timestamp: 'Yesterday by 6:00pm',
  },
  {
    id: '2',
    filename: 'History of Hitler.pdf',
    toolType: 'flashcard' as const,
    timestamp: 'Yesterday by 6:00pm',
  },
];

interface ToolCardProps {
  title: string;
  subtitle?: string;
  description: string;
  accentColor: string;
  illustration: React.ReactNode;
  onPress: () => void;
}

function ToolCard({
  title,
  subtitle,
  description,
  accentColor,
  illustration,
  onPress,
}: ToolCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.toolCard, { backgroundColor: accentColor }]}
    >
      <View style={styles.toolCardIllustration}>{illustration}</View>
      <View style={styles.toolCardTextBlock}>
        {subtitle ? (
          <View>
            <Text style={styles.toolCardTitle}>{title}</Text>
            <Text style={styles.toolCardTitle}>{subtitle}</Text>
          </View>
        ) : (
          <Text style={styles.toolCardTitle}>{title}</Text>
        )}
        <Text style={styles.toolCardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface RecentCardProps {
  filename: string;
  toolType: 'quiz' | 'flashcard';
  timestamp: string;
}

function RecentCard({ filename, toolType, timestamp }: RecentCardProps) {
  const isQuiz = toolType === 'quiz';

  return (
    <View style={styles.recentCard}>
      <View style={styles.recentRow}>
        <FileIcon size={24} />
        <Text style={styles.recentFilename} numberOfLines={1}>
          {filename}
        </Text>
      </View>

      <View style={styles.recentMetaRow}>
        <View style={styles.recentMeta}>
          {isQuiz ? <QuizIcon size={16} /> : <MemoryCardIcon size={20} />}
          <Text style={styles.recentMetaText}>
            {isQuiz ? 'Quiz' : 'Flashcards'}
          </Text>
        </View>
        <View style={styles.recentMeta}>
          <ClockIcon size={16} />
          <Text style={styles.recentMetaText}>{timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

function EmptyRecentState() {
  const c = useTheme();
  return (
    <View style={styles.emptyState}>
      <Ionicons name="time-outline" size={40} color={c.text.muted} />
      <Text style={[styles.emptyTitle, { color: c.text.primary }]}>
        No recent sessions
      </Text>
      <Text style={[styles.emptyBody, { color: c.text.muted }]}>
        Pick a tool above to get started
      </Text>
    </View>
  );
}

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
    <View style={[styles.root, { backgroundColor: c.ui.background }]}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={[styles.greeting, { color: c.text.primary }]}>
            Hello, {user?.name ?? 'Victoria'}!
          </Text>
          <Text style={[styles.subtitle, { color: c.text.secondary }]}>
            Pick a tool to get started with
          </Text>
        </Animated.View>

        <View style={{ height: sp['6'] }} />

        <View style={styles.toolCardList}>
          {TOOLS.map((tool, index) => (
            <Animated.View
              key={tool.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 20],
                      outputRange: [0, 20 + index * 8],
                    }),
                  },
                ],
              }}
            >
              <ToolCard
                title={tool.title}
                subtitle={tool.subtitle}
                description={tool.description}
                accentColor={tool.accentColor}
                illustration={tool.illustration}
                onPress={() => router.push(tool.route as any)}
              />
            </Animated.View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text.primary }]}>
          Continue from where you left off
        </Text>

        {RECENT_ITEMS.length > 0 ? (
          <View style={styles.recentList}>
            {RECENT_ITEMS.map((item) => (
              <RecentCard
                key={item.id}
                filename={item.filename}
                toolType={item.toolType}
                timestamp={item.timestamp}
              />
            ))}
          </View>
        ) : (
          <EmptyRecentState />
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <FAB onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 24,
  },

  greeting: {
    ...text.h1,
    letterSpacing: -0.56,
    marginBottom: sp['1'],
  },

  subtitle: {
    ...text.body,
    marginBottom: sp['4'],
  },

  toolCardList: {
    gap: 24,
  },

  toolCard: {
    borderRadius: 12,
    height: 179,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 24,
    overflow: 'hidden',
  },

  toolCardIllustration: {
    flexShrink: 0,
  },

  toolCardTextBlock: {
    flex: 1,
    gap: 16,
  },

  toolCardTitle: {
    ...text.h3,
    letterSpacing: -0.4,
  },

  toolCardDescription: {
    ...text.body,
  },

  sectionTitle: {
    ...text.h3,
    marginTop: sp['6'],
    marginBottom: sp['3'],
    color: 'rgba(0,0,0,0.6)',
  },

  recentList: {
    gap: 17,
  },

  recentCard: {
    backgroundColor: '#EFF0EF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  recentFilename: {
    ...text.label,
    flex: 1,
  },

  recentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 4,
  },

  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  recentMetaText: {
    ...text.bodySm,
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
