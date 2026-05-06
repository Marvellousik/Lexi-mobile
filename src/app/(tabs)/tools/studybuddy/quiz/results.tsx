import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const SCORE = 10;
const TOTAL = 20;

const getScoreMessage = (score: number, total: number) => {
  const pct = score / total;
  if (pct >= 0.8) return 'Excellent Work!';
  if (pct >= 0.5) return 'Good Job!';
  return 'Keep Going!';
};

const scoreColor = SCORE / TOTAL >= 0.8 ? '#3D7A52' : '#F97316';

export default function QuizResultsScreen() {
  const router = useRouter();
  const c = useTheme();
  const [displayScore, setDisplayScore] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        if (prev >= SCORE) {
          clearInterval(interval);
          return SCORE;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <Sidebar />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.avatarCircle,
            { backgroundColor: '#FDD835', opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Ionicons name="happy" size={64} color="#3D7A52" />
        </Animated.View>

        <Animated.Text
          style={[
            styles.youScored,
            { color: c.text.primary, opacity: fadeAnim },
          ]}
        >
          You Scored
        </Animated.Text>
        <Animated.Text
          style={[
            styles.score,
            { color: scoreColor, opacity: fadeAnim },
          ]}
        >
          {displayScore}/{TOTAL}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.message,
            { color: c.text.primary, opacity: fadeAnim },
          ]}
        >
          {getScoreMessage(SCORE, TOTAL)}
        </Animated.Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => router.replace('/(tabs)/tools/studybuddy/quiz/session')}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={18} color="#3D7A52" />
            <Text style={styles.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => router.push('/(tabs)/tools/studybuddy/quiz/review')}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Check answers"
            accessibilityRole="button"
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.checkText}>Check Answers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp['6'],
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['6'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  youScored: { ...text.h2, marginBottom: sp['2'] },
  score: { ...text.display, marginBottom: sp['2'] },
  message: { ...text.h4, marginBottom: sp['8'] },
  buttonRow: {
    flexDirection: 'row',
    gap: sp['3'],
    width: '100%',
  },
  tryAgainButton: {
    flex: 1,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#3D7A52',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
  },
  tryAgainText: { color: '#3D7A52', ...text.button },
  checkButton: {
    flex: 1,
    height: 54,
    backgroundColor: '#3D7A52',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
    shadowColor: '#3D7A52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  checkText: { color: '#FFFFFF', ...text.button },
});
