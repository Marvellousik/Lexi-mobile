import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
// FIX: Imported from safe-area-context to prevent the crash
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const FLASHCARDS = [
  { id: '1', front: 'What year was Adolf Hitler born?', back: '1889' },
  { id: '2', front: 'Where was Adolf Hitler born?', back: 'Braunau am Inn, Austria' },
  { id: '3', front: 'What was Hitler\'s early career aspiration?', back: 'Artist' },
];

export default function FlashcardsSessionScreen() {
  const c = useTheme();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const current = FLASHCARDS[index];

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [flipped]);

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top']}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.counter, { color: c.text.muted }]}>
          {index + 1} / {FLASHCARDS.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setFlipped(!flipped)}
          style={styles.cardWrapper}
        >
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: c.ui.cardBg, borderColor: c.ui.inputBorder },
              { transform: [{ rotateY: frontRotate }], backfaceVisibility: 'hidden' },
            ]}
          >
            <Text style={[styles.cardText, { color: c.text.primary }]}>
              {current.front}
            </Text>
            <Text style={[styles.hint, { color: c.text.muted }]}>Tap to flip</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              { backgroundColor: c.brand.primaryLight, borderColor: c.brand.primary },
              {
                transform: [{ rotateY: backRotate }],
                backfaceVisibility: 'hidden',
                position: 'absolute',
              },
            ]}
          >
            <Text style={[styles.cardText, { color: c.brand.primary }]}>
              {current.back}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePrev} style={styles.controlButton}>
          <Ionicons name="arrow-back" size={24} color={c.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
          <Ionicons name="arrow-forward" size={24} color={c.text.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: sp['6'],
    paddingBottom: sp['4'],
  },
  counter: {
    ...text.bodySm,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp['6'],
  },
  cardWrapper: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: sp['6'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardText: {
    ...text.h3,
    textAlign: 'center',
    lineHeight: 30,
  },
  hint: {
    ...text.caption,
    marginTop: sp['4'],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['8'],
    paddingBottom: sp['10'],
  },
  controlButton: {
    padding: sp['3'],
  },
});