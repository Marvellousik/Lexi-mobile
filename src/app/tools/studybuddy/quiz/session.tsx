import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
// ADDED: Correct import for SafeAreaView to prevent the app from crashing
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const QUESTIONS = [
  {
    id: '1',
    question: 'In which year was Adolf Hitler born?',
    options: ['1887', '1888', '1889', '1890', '1891'],
    correctAnswerIndex: 2,
  },
  {
    id: '2',
    question: 'Where was Adolf Hitler born?',
    options: ['Berlin', 'Vienna', 'Braunau am Inn', 'Munich', 'Salzburg'],
    correctAnswerIndex: 2,
  },
];

export default function QuizSessionScreen() {
  const router = useRouter();
  const { retake } = useLocalSearchParams();
  const c = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const progressAnim = useRef(new Animated.Value(0)).current;

  const question = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const isLast = currentIndex === total - 1;

  React.useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: currentIndex / total,
      friction: 8,
      tension: 100,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleSelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(index);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLast) {
      router.push({ pathname: '/tools/studybuddy/quiz/results', params: { retake: retake || 'false' } });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(answers[currentIndex - 1] ?? null);
    }
  };

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
          <View style={[styles.progressTrack, { backgroundColor: '#E5E5E5' }]}>
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
              selectedOption === index && styles.optionSelected,
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
            style={[styles.nextButton, currentIndex === 0 && { flex: 1 }]}
            onPress={handleNext}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel={isLast ? 'Finish quiz' : 'Next question'}
            accessibilityRole="button"
          >
            <Text style={styles.nextText}>{isLast ? 'Finish' : 'Next'}</Text>
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
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: sp['4'],
    marginBottom: sp['2.5'],
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionSelected: {
    borderColor: '#3D7A52',
    borderWidth: 2,
    backgroundColor: '#F0F7F3',
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
    borderColor: '#3D7A52',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevText: { color: '#3D7A52', ...text.button },
  nextButton: {
    flex: 1,
    height: 54,
    backgroundColor: '#3D7A52',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D7A52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  nextText: { color: '#FFFFFF', ...text.button },
});