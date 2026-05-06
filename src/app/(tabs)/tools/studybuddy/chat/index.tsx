import React, { useState } from 'react';
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
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const EXAMPLE_PROMPTS = [
  { id: '1', icon: 'book-outline' as const, text: 'Summarize this into key points' },
  { id: '2', icon: 'sunny-outline' as const, text: 'Give me the most important ideas from this topic.' },
  { id: '3', icon: 'pencil-outline' as const, text: 'Explain empiricism in philosophy in simple terms.' },
];

export default function ChatEmptyScreen() {
  const router = useRouter();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSend = () => {
    if (!input.trim()) return;
    router.push({
      pathname: '/(tabs)/tools/studybuddy/chat/conversation',
      params: { message: input },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.ui.background }]}
    >
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <Sidebar />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        overScrollMode="never"
      >
        <View style={styles.center}>
          <View style={[styles.logoCircle, { backgroundColor: c.brand.primaryLight }]}>
            <Ionicons name="leaf" size={40} color={c.brand.primary} />
          </View>
          <Text style={[styles.greeting, { color: c.text.primary }]}>
            {getGreeting()}, {user?.name || 'Victoria'}
          </Text>
          <View style={styles.subRow}>
            <Text style={[styles.subText, { color: c.text.primary }]}>What's on </Text>
            <Text style={[styles.subText, { color: c.brand.primary }]}>your mind?</Text>
          </View>
        </View>

        <View
          style={[
            styles.inputCard,
            {
              borderColor: focused ? c.brand.primary : c.ui.inputBorder,
              backgroundColor: focused ? '#FFFFFF' : '#FAFAFA',
              shadowColor: focused ? c.brand.primary : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: focused ? 0.1 : 0,
              shadowRadius: focused ? 8 : 0,
              elevation: focused ? 2 : 0,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: c.text.primary }]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask AI a question or make a request"
            placeholderTextColor="#888"
            multiline
            maxLength={500}
            textAlignVertical="top"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessible={true}
            accessibilityLabel="Message input"
            accessibilityHint="Type your question or request"
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={[styles.attachButton, { backgroundColor: c.brand.primary }]}
              activeOpacity={0.88}
              accessible={true}
              accessibilityLabel="Attach file"
              accessibilityRole="button"
            >
              <Ionicons name="attach" size={14} color="#FFFFFF" />
              <Text style={styles.attachText}>Attach</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.micButton, { backgroundColor: c.brand.primary }]}
              activeOpacity={0.88}
              accessible={true}
              accessibilityLabel="Voice input"
              accessibilityRole="button"
            >
              <Ionicons name="mic" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            {input.length > 0 && (
              <Animated.View style={{ opacity: 1 }}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                  activeOpacity={0.88}
                  accessible={true}
                  accessibilityLabel="Send message"
                  accessibilityRole="button"
                >
                  <Ionicons name="arrow-up" size={16} color="#3D7A52" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>

        <Text style={[styles.examplesLabel, { color: c.text.muted }]}>
          GET STARTED WITH AN EXAMPLE BELOW
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {EXAMPLE_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt.id}
              style={[styles.chip, { backgroundColor: c.ui.cardBg }]}
              onPress={() => setInput(prompt.text)}
              activeOpacity={0.88}
              accessible={true}
              accessibilityLabel={prompt.text}
              accessibilityRole="button"
            >
              <Ionicons name={prompt.icon} size={14} color={c.brand.primary} />
              <Text style={[styles.chipText, { color: c.text.primary }]} numberOfLines={1}>
                {prompt.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 120,
  },
  center: { alignItems: 'center', marginBottom: sp['8'], marginTop: sp['4'] },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['4'],
  },
  greeting: { ...text.h2, marginTop: sp['2'] },
  subRow: { flexDirection: 'row', marginTop: sp['1'] },
  subText: { ...text.h2 },
  inputCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: sp['4'],
    marginBottom: sp['5'],
    minHeight: 120,
  },
  input: {
    ...text.body,
    minHeight: 44,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    marginTop: sp['2'],
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1.5'],
    paddingHorizontal: sp['3'],
    paddingVertical: sp['1.5'],
    borderRadius: 20,
  },
  attachText: { color: '#FFFFFF', ...text.buttonSm },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#3D7A52',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  examplesLabel: {
    ...text.overline,
    textTransform: 'uppercase',
    marginBottom: sp['3'],
  },
  chipsRow: { paddingBottom: sp['2'] },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1.5'],
    paddingHorizontal: sp['3.5'],
    paddingVertical: sp['2'],
    borderRadius: 18,
    marginRight: sp['2'],
    height: 36,
  },
  chipText: { ...text.bodySm, maxWidth: 160 },
});
