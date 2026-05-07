import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const FLASHCARDS = [
  { id: '1', question: 'What was the name of the failed coup attempt led by Hitler in 1923?', answer: 'The Beer Hall Putsch.' },
  { id: '2', question: 'In which year did Hitler become Chancellor of Germany?', answer: '1933' },
];

export default function FlashcardsSessionScreen() {
  const c = useTheme();
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const card = FLASHCARDS[index];

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const flipCard = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = showAnswer ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(!showAnswer);
    });
  }, [showAnswer, flipAnim]);

  const goNext = useCallback(() => {
    if (index < FLASHCARDS.length - 1) {
      flipAnim.setValue(0);
      setShowAnswer(false);
      setIndex((prev) => prev + 1);
    }
  }, [index, flipAnim]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      flipAnim.setValue(0);
      setShowAnswer(false);
      setIndex((prev) => prev - 1);
    }
  }, [index, flipAnim]);

  const CardFace = ({ isBack }: { isBack?: boolean }) => (
    <View style={[styles.cardInner, { backgroundColor: '#3D7A52' }]}>
      <View style={styles.questionIcon}>
        <Ionicons name="help" size={24} color="#3D7A52" />
      </View>
      <Text style={styles.counter}>{index + 1}/{FLASHCARDS.length}</Text>
      <Text style={styles.cardText} numberOfLines={6}>
        {isBack ? card.answer : card.question}
      </Text>
      <TouchableOpacity style={styles.flipButton} onPress={flipCard} activeOpacity={0.9}>
        <Text style={styles.flipButtonText}>{isBack ? 'Question' : 'Answer'}</Text>
      </TouchableOpacity>
      <View style={styles.waveDecoration} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <View style={styles.content}>
        <Text style={[styles.docName, { color: c.text.primary }]}>History of Hitler</Text>

        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ perspective: 1000 }, { rotateY: frontRotateY }],
                opacity: frontOpacity,
                zIndex: showAnswer ? 0 : 1,
              },
            ]}
          >
            <CardFace />
          </Animated.View>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ perspective: 1000 }, { rotateY: backRotateY }],
                opacity: backOpacity,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: showAnswer ? 1 : 0,
              },
            ]}
          >
            <CardFace isBack />
          </Animated.View>
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goPrev}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Previous card"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#3D7A52" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goNext}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Next card"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-forward" size={24} color="#3D7A52" />
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
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 120,
    alignItems: 'center',
  },
  docName: { ...text.h3, marginBottom: sp['6'] },
  cardContainer: {
    width: '100%',
    height: 380,
    marginBottom: sp['8'],
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    shadowColor: '#3D7A52',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    padding: sp['6'],
    position: 'relative',
    overflow: 'hidden',
  },
  questionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['3'],
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  counter: {
    ...text.label,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: sp['5'],
  },
  cardText: {
    ...text.h3,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: sp['4'],
    maxWidth: '85%',
  },
  flipButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: sp['7'],
    paddingVertical: sp['3'],
    borderRadius: 50,
    marginBottom: sp['5'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  flipButtonText: { ...text.buttonSm, color: '#3D7A52' },
  waveDecoration: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    right: -40,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 60,
  },
  navRow: {
    flexDirection: 'row',
    gap: sp['6'],
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#3D7A52',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
