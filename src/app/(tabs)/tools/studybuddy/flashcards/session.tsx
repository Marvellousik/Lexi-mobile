import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const { width } = Dimensions.get('window');

const FLASHCARDS = [
  { id: '1', question: 'What was the name of the failed coup attempt by Hitler and the Nazi Party in 1923?', answer: 'The Beer Hall Putsch.' },
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flipAnim.setValue(0);
      setShowAnswer(false);
      setIndex((prev) => prev + 1);
    }
  }, [index, flipAnim]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flipAnim.setValue(0);
      setShowAnswer(false);
      setIndex((prev) => prev - 1);
    }
  }, [index, flipAnim]);

  const CardFace = ({ isBack }: { isBack?: boolean }) => (
    <View style={[styles.cardInner, { backgroundColor: c.brand.primary }]}>
      <View style={styles.topSection}>
        <View style={styles.questionIcon}>
          <Ionicons name="help" size={32} color={c.brand.primary} />
        </View>
        <Text style={styles.counter}>{index + 1}/{FLASHCARDS.length}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.cardText}>
          {isBack ? card.answer : card.question}
        </Text>
      </View>
      
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.flipButton} onPress={flipCard} activeOpacity={0.9}>
          <Text style={styles.flipButtonText}>{isBack ? 'Question' : 'Answer'}</Text>
        </TouchableOpacity>
      </View>

      {/* Blob Decorations */}
      <View style={styles.blobContainer} pointerEvents="none">
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top', 'bottom']}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.docName, { color: c.text.primary }]}>History of Hitler</Text>
        </View>

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
            style={[styles.navButton, index === 0 && styles.disabledNav]}
            onPress={goPrev}
            disabled={index === 0}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={c.brand.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, index === FLASHCARDS.length - 1 && styles.disabledNav]}
            onPress={goNext}
            disabled={index === FLASHCARDS.length - 1}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward" size={24} color={c.brand.primary} />
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
    paddingTop: sp['4'],
    paddingBottom: 100, // Account for tab bar height
  },
  header: {
    width: '100%',
    marginBottom: sp['6'],
  },
  docName: { 
    ...text.h1,
    fontWeight: '800',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    minHeight: 380,
    maxHeight: 520,
    marginBottom: sp['8'],
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    padding: sp['8'],
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  questionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['4'],
  },
  counter: {
    ...text.h3,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardText: {
    ...text.h2,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  flipButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: sp['10'],
    paddingVertical: sp['3'],
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  flipButtonText: { 
    ...text.button, 
    color: '#3D7A52',
    fontWeight: '700',
  },
  blobContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  blob1: {
    position: 'absolute',
    bottom: -30,
    left: -40,
    width: 240,
    height: 140,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '15deg' }],
  },
  blob2: {
    position: 'absolute',
    bottom: -40,
    right: -60,
    width: 280,
    height: 160,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.12)',
    transform: [{ rotate: '-10deg' }],
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: sp['8'],
  },
  navButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#3D7A52',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledNav: {
    opacity: 0.3,
    borderColor: '#CCCCCC',
  },
});

