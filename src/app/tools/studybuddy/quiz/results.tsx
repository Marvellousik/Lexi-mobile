import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useQuizStore } from '@/stores/quizStore';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function QuizResultsScreen() {
  const router = useRouter();
  const c = useTheme();
  const { score, total, reset } = useQuizStore();
  const [displayScore, setDisplayScore] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Guard: if no result, redirect back
  if (score === null || total === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top']}>
        <StatusBar style={c.isDark ? 'light' : 'dark'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: sp['6'] }}>
          <Ionicons name="alert-circle-outline" size={48} color={c.text.muted} />
          <Text style={[text.h3, { color: c.text.primary, marginTop: sp['4'] }]}>
            No quiz results
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/tools/studybuddy/quiz')}
            style={{ marginTop: sp['6'] }}
          >
            <Text style={{ color: c.brand.primary, fontWeight: '700' }}>Start a new quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        if (prev >= score!) {
          clearInterval(interval);
          return score!;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [score]);

  const handleTryAgain = () => {
    reset();
    router.replace('/tools/studybuddy/quiz/session');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top', 'bottom']}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          {/* IMAGE SECTION */}
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../../../assets/images/tools/quiz-result-avatar.png')}
              style={styles.avatar}
            />
          </View>

          {/* LARGE SPACING TO PREVENT OVERLAP */}
          <View style={{ height: sp['16'] }} />

          {/* SCORE SECTION - AIRY DESIGN */}
          <View style={styles.scoreBlock}>
            <Text style={[styles.youScored, { color: c.text.primary }]}>You Scored</Text>

            <View style={{ height: sp['4'] }} />

            <Text style={[styles.scoreText, { color: c.confidence.low }]}>
              {displayScore}/{total}
            </Text>

            <View style={{ height: sp['4'] }} />

            <Text style={[styles.message, { color: c.text.secondary }]}>
              {score! >= (total! * 0.7) ? 'Excellent work!' : 'Practice Harder!'}
            </Text>
          </View>

          {/* LARGE SPACING BEFORE BUTTONS */}
          <View style={{ height: sp['20'] }} />

          {/* ACTION BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.tryAgainButton, { borderColor: c.brand.primary }]}
              onPress={handleTryAgain}
              activeOpacity={0.88}
            >
              <Ionicons name="refresh" size={20} color={c.brand.primary} />
              <Text style={[styles.tryAgainText, { color: c.brand.primary }]}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkButton,
                { backgroundColor: c.brand.primary, shadowColor: c.brand.primary },
              ]}
              onPress={() => router.push('/tools/studybuddy/quiz/review')}
              activeOpacity={0.88}
            >
              <Ionicons name="checkmark-circle" size={20} color={c.text.inverse} />
              <Text style={[styles.checkText, { color: c.text.inverse }]}>Check Answers</Text>
            </TouchableOpacity>
          </View>

          {/* FINAL BOTTOM PADDING FOR NAVBAR SAFETY */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp['6'],
    paddingTop: sp['10'],
  },
  avatarContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
    backgroundColor: '#FDD835',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scoreBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  youScored: {
    ...(text.h2 as any),
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 76,
    lineHeight: 90,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1.5,
  },
  message: {
    ...(text.h3 as any),
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: sp['4'],
    width: '100%',
    marginBottom: 40,
  },
  tryAgainButton: {
    flex: 1,
    height: 64,
    borderWidth: 2,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
  },
  tryAgainText: {
    fontSize: 17,
    fontWeight: '700',
  },
  checkButton: {
    flex: 1.2,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  checkText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
