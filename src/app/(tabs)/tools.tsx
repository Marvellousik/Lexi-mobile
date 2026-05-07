import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const TOOLS = [
  { id: 'tts', title: 'Text to Speech', icon: 'mic', route: '/(tabs)/tools/tts', desc: 'Convert text to natural speech' },
  { id: 'reading', title: 'Reading Assistant', icon: 'book', route: '/(tabs)/tools/reading', desc: 'Get help reading complex texts' },
  { id: 'writing', title: 'Writing Assistant', icon: 'pencil', route: '/(tabs)/tools/writing', desc: 'Transcribe speech to text' },
  { id: 'quiz', title: 'Quizzes', icon: 'help-circle', route: '/(tabs)/tools/studybuddy/quiz', desc: 'Test your knowledge' },
  { id: 'flashcards', title: 'Flashcards', icon: 'albums', route: '/(tabs)/tools/studybuddy/flashcards', desc: 'Study with spaced repetition' },
  { id: 'chat', title: 'Chat Assistant', icon: 'chatbubble', route: '/(tabs)/tools/studybuddy/chat', desc: 'Chat with AI for studying' },
];

export default function ToolsScreen() {
  const router = useRouter();
  const c = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

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
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ height: sp['6'] }} />

          {TOOLS.map((tool, index) => (
            <ToolListItem
              key={tool.id}
              tool={tool}
              index={index}
              fadeAnim={fadeAnim}
              onPress={() => router.push(tool.route as any)}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function ToolListItem({
  tool,
  index,
  fadeAnim,
  onPress,
}: {
  tool: (typeof TOOLS)[0];
  index: number;
  fadeAnim: Animated.Value;
  onPress: () => void;
}) {
  const c = useTheme();
  const { animatedStyle, handlers } = useAnimatedPress(0.98, 100);

  const delay = Math.min(index * 50, 200);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: c.ui.cardBg }]}
        onPress={onPress}
        activeOpacity={0.92}
        accessible={true}
        accessibilityLabel={tool.title}
        accessibilityHint={tool.desc}
        accessibilityRole="button"
        {...handlers}
      >
        <View style={[styles.iconContainer, { backgroundColor: c.brand.primaryLight }]}>
          <Ionicons name={tool.icon as any} size={24} color={c.brand.primary} />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.cardTitle, { color: c.text.primary }]}>{tool.title}</Text>
          <Text style={[styles.cardDesc, { color: c.text.muted }]}>{tool.desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={c.text.muted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingBottom: 120,
  },
  pageTitle: {
    ...text.h1,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp['4'],
    borderRadius: 16,
    marginBottom: sp['3'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    marginLeft: sp['3'],
  },
  cardTitle: {
    ...text.label,
    marginBottom: sp['0.5'],
  },
  cardDesc: {
    ...text.caption,
  },
});
