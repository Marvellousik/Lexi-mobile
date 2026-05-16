import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useQuizStore } from '@/stores/quizStore';
import { useSubmitQuiz } from '@/hooks/queries/useQuiz';
import * as Haptics from 'expo-haptics';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { showToast } from '@/components/ui/Toast';
import { QuizSessionSkeleton } from '@/components/skeleton/Skeleton';

export default function QuizSessionScreen() {
  const router = useRouter();
  const c = useTheme();
  const { questions, answers, setAnswer, setResult } = useQuizStore();
  const submit = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const question = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;

  // Guard: if no session data, redirect back
  if (!question) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top']}>
        <StatusBar style={c.isDark ? 'light' : 'dark'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: sp['6'] }}>
          <Ionicons name="alert-circle-outline" size={48} color={c.text.muted} />
          <Text style={[text.h3, { color: c.text.primary, marginTop: sp['4'] }]}>
            No active quiz
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

  React.useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: currentIndex / total,
      friction: 8,
      tension: 100,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, total]);

  const handleSelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnswer(question.id, index);
  };

  const handleNext = async () => {
    if (isLast) {
      try {
        const sessionId = useQuizStore.getState().sessionId!;
        const result = await submit.mutateAsync({ sessionId, answers });
        setResult(result.score, result.total);
        router.push('/tools/studybuddy/quiz/results');
      } catch {
        showToast('Failed to submit quiz. Please try again.', 'error');
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const selectedOption = answers[question.id] ?? null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top', 'bottom']}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <Text style={[styles.pageTitle, { color: c.text.primary }]}>Quizzes</Text>
        <Text style={[styles.docName, { color: c.text.primary }]}>History of Hitler</Text>

        <View style={{ height: sp['4'] }} />

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Text style={[styles.questionLabel, { color: c.brand.primary }]}>
            Question {currentIndex + 1}/{total}
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: c.ui.inputBorder }]}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: c.brand.primary },
              ]}
            />
          </View>
        </View>

        <View style={styles.questionRow}>
          <Text style={[styles.questionText, { color: c.text.primary }]}>
            {question.question}
          </Text>
        </View>

        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === index && {
                borderColor: c.brand.primary,
                borderWidth: 2,
                backgroundColor: c.brand.primaryLight,
              },
            ]}
            onPress={() => handleSelect(index)}
            activeOpacity={0.9}
            accessible={true}
            accessibilityLabel={option}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedOption === index }}
          >
            <Text style={[styles.optionText, { color: c.text.primary }]}>
              {option}
            </Text>
            {selectedOption === index && (
              <Ionicons name="checkmark-circle" size={20} color={c.brand.primary} />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.buttonRow}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.prevButton, isLast && { flex: 1 }]}
              onPress={handlePrevious}
              activeOpacity={0.88}
              accessible={true}
              accessibilityLabel="Previous question"
              accessibilityRole="button"
            >
              <Text style={styles.prevText}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.nextButton,
              currentIndex === 0 && { flex: 1 },
              submit.isPending && { opacity: 0.7 },
            ]}
            onPress={handleNext}
            activeOpacity={0.88}
            disabled={submit.isPending}
            accessible={true}
            accessibilityLabel={isLast ? 'Finish quiz' : 'Next question'}
            accessibilityRole="button"
          >
            <Text style={styles.nextText}>
              {submit.isPending ? 'Submitting...' : isLast ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 140,
  },
  pageTitle: {
    ...text.h1,
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: sp['1'],
  },
  docName: { ...text.h3, marginBottom: sp['4'] },
  progressContainer: { marginBottom: sp['5'] },
  questionLabel: {
    ...text.caption,
    fontWeight: '600',
    marginBottom: sp['1.5'],
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  questionRow: { marginBottom: sp['4'] },
  questionText: {
    ...text.body,
    lineHeight: 24,
  },
  option: {
    minHeight: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: sp['4'],
    marginBottom: sp['2.5'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionText: { ...text.body, fontWeight: '500' },
  buttonRow: {
    flexDirection: 'row',
    gap: sp['3'],
    marginTop: sp['5'],
  },
  prevButton: {
    flex: 1,
    height: 54,
    borderWidth: 1.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevText: { ...text.button },
  nextButton: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  nextText: { ...text.button },
});
