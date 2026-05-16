import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useQuizStore } from '@/stores/quizStore';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function QuizReviewScreen() {
  const c = useTheme();
  const { questions, answers } = useQuizStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top']}>
        <StatusBar style={c.isDark ? 'light' : 'dark'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[text.body, { color: c.text.muted }]}>No quiz data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top']}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>
            Quizzes
          </Text>
          <Text style={[styles.docName, { color: c.text.primary }]}>
            History of Hitler : Answer Review
          </Text>

          <View style={{ height: sp['8'] }} />

          {questions.map((q, qi) => {
            const userAnswerIndex = answers[q.id] ?? -1;
            return (
              <View key={q.id} style={styles.questionBlock}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionCounter}>
                    <Text style={{ color: c.brand.primaryTint, fontWeight: '700' }}>Question {qi + 1}/{questions.length}</Text>
                    {' '}{q.question}
                  </Text>
                </View>

                <View style={{ height: sp['4'] }} />

                {q.options.map((option, index) => {
                  const isCorrect = index === q.correctAnswerIndex;
                  const isUserPicked = index === userAnswerIndex;
                  const isWrong = isUserPicked && !isCorrect;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.option,
                        { borderColor: c.ui.inputBorder, backgroundColor: c.ui.background },
                        isCorrect && styles.optionCorrect,
                        isWrong && styles.optionWrong,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isCorrect && { color: c.text.inverse },
                          isWrong && { color: c.text.danger },
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                  );
                })}
                <View style={[styles.divider, { backgroundColor: c.ui.divider }]} />
              </View>
            );
          })}
        </Animated.View>
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
    ...(text.h1 as any),
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: sp['2'],
  },
  docName: {
    ...(text.h3 as any),
    fontWeight: '800',
    marginBottom: sp['4'],
  },
  questionBlock: {
    marginBottom: sp['6'],
  },
  questionHeader: {
    flexDirection: 'row',
  },
  questionCounter: {
    ...(text.body as any),
    lineHeight: 24,
    fontSize: 16,
  },
  option: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
    padding: sp['4'],
    marginBottom: sp['2.5'],
    justifyContent: 'center',
  },
  optionCorrect: {
    backgroundColor: '#1B9C42',
    borderColor: '#1B9C42',
  },
  optionWrong: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  optionText: {
    ...(text.body as any),
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginTop: sp['6'],
    marginBottom: sp['2'],
  },
});
