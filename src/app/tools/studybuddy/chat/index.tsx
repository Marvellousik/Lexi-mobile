import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import * as Haptics from 'expo-haptics';

// Tab bar is absolutely positioned; we must pad below it
const TAB_BAR_HEIGHT = 70;

const EXAMPLE_PROMPTS = [
  { id: '1', icon: 'book-outline' as const, text: 'Summarize this into key points' },
  { id: '2', icon: 'sunny-outline' as const, text: 'Give me the most important ideas from this topic' },
  { id: '3', icon: 'pencil-outline' as const, text: 'Explain empiricism in philosophy in simple terms' },
  { id: '4', icon: 'help-circle-outline' as const, text: 'Quiz me on World War II' },
];

/**
 * ChatEmptyScreen - Enterprise Grade
 *
 * Clean, focused entry point inspired by Claude/ChatGPT interfaces.
 * Design principles:
 * - Generous whitespace and clear visual hierarchy
 * - Subtle animations that guide attention
 * - Input field is the hero element
 * - Zero hardcoded colors, full theme integration
 * - All callbacks memoized to prevent render thrashing
 */
export default function ChatEmptyScreen() {
  const router = useRouter();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();

  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleFocus = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => setFocused(false), []);
  const handleChangeText = useCallback((text: string) => setInput(text), []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/tools/studybuddy/chat/conversation',
      params: { message: input },
    });
  }, [input, router]);

  const handlePromptPress = useCallback((text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput(text);
  }, []);

  const inputBorderColor = focused ? c.brand.primary : c.ui.inputBorder;
  const inputBgColor = focused ? c.ui.background : c.ui.cardBg;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.ui.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
    >
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + sp['4'] },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        overScrollMode="never"
      >
        {/* Hero Greeting Section */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: c.brand.primaryLight },
              ]}
            >
              <Ionicons name="leaf" size={32} color={c.brand.primary} />
            </View>
          </View>

          <Text style={[styles.greetingTitle, { color: c.text.primary }]}>
            {greeting}, {user?.name || 'Victoria'}
          </Text>
          <Text style={[styles.greetingSubtitle, { color: c.text.secondary }]}>
            How can I help you learn today?
          </Text>
        </Animated.View>

        {/* Input Card - The Hero Element */}
        <Animated.View
          style={[
            styles.inputSection,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 15],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.inputCard,
              {
                borderColor: inputBorderColor,
                backgroundColor: inputBgColor,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: c.text.primary }]}
              value={input}
              onChangeText={handleChangeText}
              placeholder="Ask me anything..."
              placeholderTextColor={c.text.muted}
              multiline
              maxLength={2000}
              textAlignVertical="top"
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessible={true}
              accessibilityLabel="Message input"
              accessibilityHint="Type your question or request"
            />

            <View style={styles.inputToolbar}>
              <View style={styles.toolbarLeft}>
                <TouchableOpacity
                  style={[styles.toolbarButton, { backgroundColor: c.ui.cardBg }]}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel="Attach file"
                  accessibilityRole="button"
                >
                  <Ionicons name="attach" size={18} color={c.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toolbarButton, { backgroundColor: c.ui.cardBg }]}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel="Voice input"
                  accessibilityRole="button"
                >
                  <Ionicons name="mic" size={18} color={c.text.secondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: input.trim()
                      ? c.brand.primary
                      : c.ui.inputBorder,
                  },
                ]}
                onPress={handleSend}
                activeOpacity={0.8}
                disabled={!input.trim()}
                accessible={true}
                accessibilityLabel="Send message"
                accessibilityRole="button"
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={input.trim() ? c.text.inverse : c.text.muted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Example Prompts Section */}
        <Animated.View
          style={[
            styles.promptsSection,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 25],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.promptsLabel, { color: c.text.muted }]}>
            SUGGESTED PROMPTS
          </Text>

          <View style={styles.promptsGrid}>
            {EXAMPLE_PROMPTS.map((prompt) => (
              <PromptChip
                key={prompt.id}
                prompt={prompt}
                onPress={handlePromptPress}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PromptChip({
  prompt,
  onPress,
}: {
  prompt: (typeof EXAMPLE_PROMPTS)[0];
  onPress: (text: string) => void;
}) {
  const c = useTheme();

  const handlePress = useCallback(() => {
    onPress(prompt.text);
  }, [onPress, prompt.text]);

  return (
    <TouchableOpacity
      style={[
        styles.promptChip,
        {
          backgroundColor: c.ui.cardBg,
          borderColor: c.ui.inputBorder,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={prompt.text}
      accessibilityRole="button"
    >
      <Ionicons name={prompt.icon} size={16} color={c.brand.primary} />
      <Text
        style={[styles.promptChipText, { color: c.text.primary }]}
        numberOfLines={2}
      >
        {prompt.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['5'],
    paddingTop: sp['8'],
  },

  // Hero Section
  hero: {
    alignItems: 'center',
    marginBottom: sp['8'],
  },
  logoContainer: {
    marginBottom: sp['5'],
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingTitle: {
    ...text.h1,
    textAlign: 'center',
    marginBottom: sp['2'],
  },
  greetingSubtitle: {
    ...text.bodyLg,
    textAlign: 'center',
  },

  // Input Section
  inputSection: {
    marginBottom: sp['8'],
  },
  inputCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: sp['4'],
    minHeight: 140,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    ...text.body,
    minHeight: 60,
    maxHeight: 150,
    textAlignVertical: 'top',
    marginBottom: sp['3'],
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: sp['2'],
  },
  toolbarButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Prompts Section
  promptsSection: {
    marginBottom: sp['6'],
  },
  promptsLabel: {
    ...text.overline,
    marginBottom: sp['4'],
    letterSpacing: 1.5,
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp['3'],
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    paddingHorizontal: sp['3'],
    paddingVertical: sp['2.5'],
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
  },
  promptChipText: {
    ...text.bodySm,
    flex: 1,
    flexShrink: 1,
  },
});