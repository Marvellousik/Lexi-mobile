import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const HISTORY = [
  { id: '1', title: 'History of Hitler.pdf', tool: 'Quiz', date: 'Yesterday' },
  { id: '2', title: 'History of Hitler.pdf', tool: 'Flashcards', date: 'Yesterday' },
  { id: '3', title: 'Philosophy Notes.docx', tool: 'Text to Speech', date: '2 days ago' },
  { id: '4', title: 'Meeting Recording.mp3', tool: 'Writing Assistant', date: '3 days ago' },
];

export default function HistoryScreen() {
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

          {HISTORY.length > 0 ? (
            HISTORY.map((item, index) => (
              <Animated.View
                key={item.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8 + index * 4, 0],
                    }),
                  }],
                }}
              >
                <View style={[styles.row, { backgroundColor: c.ui.cardBg }]}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(61,122,82,0.1)' }]}>
                    <Ionicons name="document-text" size={20} color={c.brand.primary} />
                  </View>
                  <View style={styles.textBlock}>
                    <Text style={[styles.title, { color: c.text.primary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.metaRow}>
                      <Text style={[styles.meta, { color: c.text.muted }]}>{item.tool}</Text>
                      <Text style={[styles.meta, { color: c.text.muted }]}>{item.date}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={40} color={c.text.muted} />
              <Text style={[styles.emptyTitle, { color: c.text.primary }]}>No history yet</Text>
              <Text style={[styles.emptyBody, { color: c.text.muted }]}>
                Your recent activity will appear here
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sp['3.5'],
    paddingHorizontal: sp['4'],
    borderRadius: 12,
    marginBottom: sp['2'],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sp['3'],
  },
  textBlock: {
    flex: 1,
  },
  title: {
    ...text.label,
    marginBottom: sp['0.5'],
  },
  metaRow: {
    flexDirection: 'row',
    gap: sp['2'],
  },
  meta: {
    ...text.caption,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: sp['10'],
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
