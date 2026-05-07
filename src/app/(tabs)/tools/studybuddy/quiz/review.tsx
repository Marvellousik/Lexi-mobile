import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const QUESTIONS = [
  {
    id: '1',
    question: 'In which year was Adolf Hitler born?',
    options: ['1887', '1888', '1889', '1890', '1891'],
    correctAnswerIndex: 2,
    userAnswerIndex: 3,
  },
  {
    id: '2',
    question: 'Where was Adolf Hitler born?',
    options: ['Berlin', 'Vienna', 'Braunau am Inn', 'Munich', 'Salzburg'],
    correctAnswerIndex: 2,
    userAnswerIndex: 2,
  },
];

export default function QuizReviewScreen() {
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
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]}>
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
            Answer Review
          </Text>
          <Text style={[styles.subtitle, { color: c.text.muted }]}>
            History of Hitler
          </Text>
          <View style={{ height: sp['6'] }} />

          {QUESTIONS.map((q, qi) => (
            <View key={q.id} style={styles.questionBlock}>
              <Text style={[styles.questionLabel, { color: c.brand.primary }]}>
                Question {qi + 1}/20
              </Text>
              <Text style={[styles.questionText, { color: c.text.primary }]}>
                {q.question}
              </Text>

              {q.options.map((option, index) => {
                const isCorrect = index === q.correctAnswerIndex;
                const isUserWrong = index === q.userAnswerIndex && index !== q.correctAnswerIndex;
                return (
                  <View
                    key={index}
                    style={[
                      styles.option,
                      isCorrect && styles.optionCorrect,
                      isUserWrong && styles.optionWrong,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isCorrect && styles.optionTextCorrect,
                        isUserWrong && styles.optionTextWrong,
                      ]}
                    >
                      {option}
                    </Text>
                    {isCorrect && (
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    )}
                    {isUserWrong && (
                      <Ionicons name="close" size={18} color="#EF4444" />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
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
    paddingBottom: 120,
  },
  pageTitle: {
    ...text.h1,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: { ...text.body, marginTop: sp['1'] },
  questionBlock: { marginBottom: sp['6'] },
  questionLabel: {
    ...text.caption,
    fontWeight: '600',
    marginBottom: sp['1.5'],
  },
  questionText: {
    ...text.body,
    lineHeight: 24,
    marginBottom: sp['3'],
  },
  option: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: sp['3'],
    marginBottom: sp['2'],
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCorrect: {
    backgroundColor: '#3D7A52',
    borderColor: '#3D7A52',
  },
  optionWrong: {
    borderColor: '#EF4444',
    borderWidth: 2,
    backgroundColor: '#FEF2F2',
  },
  optionText: { ...text.body },
  optionTextCorrect: { color: '#FFFFFF', fontWeight: '600' },
  optionTextWrong: { color: '#111111' },
});
