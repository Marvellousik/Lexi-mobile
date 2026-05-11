import React, { useRef, useEffect } from 'react';
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
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import * as Haptics from 'expo-haptics';

const STUDY_TOOLS = [
  {
    id: 'quiz',
    title: 'Quizzes',
    description: 'Test your knowledge with AI-generated quizzes based on your study materials',
    icon: 'help-circle',
    route: '/tools/studybuddy/quiz',
    accentColor: 'rgba(126,87,194,0.15)',
    iconColor: '#7E57C2',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Study with spaced repetition using AI-generated flashcards',
    icon: 'albums',
    route: '/tools/studybuddy/flashcards',
    accentColor: 'rgba(61,122,82,0.15)',
    iconColor: '#3D7A52',
  },
  {
    id: 'chat',
    title: 'Chat Assistant',
    description: 'Have a conversation with AI to better understand your notes',
    icon: 'chatbubbles',
    route: '/tools/studybuddy/chat',
    accentColor: 'rgba(64,123,255,0.15)',
    iconColor: '#407BFF',
  },
] as const;

/**
 * StudyBuddyIndexScreen
 *
 * Landing page for StudyBuddy that lists all available study tools.
 * Each tool opens its respective workflow while maintaining the
 * StudyBuddy context.
 */
export default function StudyBuddyIndexScreen() {
  const router = useRouter();
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

  const handleNavigate = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
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
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={[styles.headerTitle, { color: c.text.primary }]}>
            StudyBuddy
          </Text>
          <Text style={[styles.headerSubtitle, { color: c.text.secondary }]}>
            Choose a study tool to get started
          </Text>
        </Animated.View>

        <View style={styles.toolsList}>
          {STUDY_TOOLS.map((tool, index) => (
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
                tool={tool}
                onPress={() => handleNavigate(tool.route)}
              />
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

interface ToolCardProps {
  tool: (typeof STUDY_TOOLS)[number];
  onPress: () => void;
}

function ToolCard({ tool, onPress }: ToolCardProps) {
  const c = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: c.ui.cardBg,
          borderColor: c.ui.inputBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      accessible={true}
      accessibilityLabel={tool.title}
      accessibilityHint={tool.description}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: tool.accentColor },
        ]}
      >
        <Ionicons
          name={tool.icon as any}
          size={28}
          color={tool.iconColor}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.cardTitle, { color: c.text.primary }]}>
          {tool.title}
        </Text>
        <Text
          style={[styles.cardDescription, { color: c.text.secondary }]}
          numberOfLines={2}
        >
          {tool.description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={c.text.muted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 24,
  },
  headerTitle: {
    ...text.h1,
    marginBottom: sp['1'],
  },
  headerSubtitle: {
    ...text.body,
    marginBottom: sp['6'],
  },
  toolsList: {
    gap: sp['4'],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp['4'],
    borderRadius: 16,
    borderWidth: 1,
    gap: sp['3'],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    gap: sp['1'],
  },
  cardTitle: {
    ...text.h4,
  },
  cardDescription: {
    ...text.bodySm,
    lineHeight: 20,
  },
});