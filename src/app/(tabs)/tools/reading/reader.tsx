import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import DifficultySelector from '@/components/ui/DifficultySelector';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function ReadingReaderScreen() {
  const c = useTheme();
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate'>('beginner');
  const [showDifficulty, setShowDifficulty] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
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
            Reading Assistant
          </Text>

          <View style={[styles.fileChip, {
            backgroundColor: c.isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
            borderColor: c.isDark ? 'rgba(255,255,255,0.15)' : '#E5E5E5',
          }]}>
            <Ionicons name="document-text" size={14} color={c.brand.primary} />
            <Text style={[styles.fileChipText, { color: c.brand.primary }]}>
              History of Hitler.pdf
            </Text>
          </View>

          <View
            style={[
              styles.readerCard,
              { backgroundColor: c.isDark ? '#2C2C2C' : '#FFFDE7' },
            ]}
          >
            <View style={styles.readerHeader}>
              <TouchableOpacity
                style={styles.difficultyPill}
                onPress={() => setShowDifficulty(true)}
                activeOpacity={0.88}
                accessible={true}
                accessibilityLabel="Change difficulty"
                accessibilityRole="button"
              >
                <Text style={styles.difficultyText}>Simplified text</Text>
                <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.readerActions}>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityLabel="Full screen"
                  accessibilityRole="button"
                >
                  <Ionicons name="expand-outline" size={22} color={c.brand.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={22} color={c.brand.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: c.isDark ? '#444' : '#E5E5E5' }]} />

            <View style={styles.textContent}>
              <Text style={[styles.sectionHeading, { color: c.text.primary }]}>
                Early Life and Artistic Failure
              </Text>
              <Text style={[styles.bodyText, { color: c.text.primary }]}>
                Adolf Hitler was born on April 20, 1889, in Braunau am Inn, Austria-Hungary. He was the fourth of six children born to Alois Hitler and Klara Pölzl. His childhood was marked by conflict with his father, who wanted him to pursue a career in the customs bureau, while young Adolf dreamed of becoming an artist.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <DifficultySelector
        visible={showDifficulty}
        level={difficulty}
        onChange={setDifficulty}
        onClose={() => setShowDifficulty(false)}
      />
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
    marginBottom: sp['3'],
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: sp['1.5'],
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: sp['3'],
    paddingVertical: sp['1.5'],
    marginBottom: sp['4'],
  },
  fileChipText: { ...text.bodySm },
  readerCard: {
    borderRadius: 16,
    padding: sp['5'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  readerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sp['2'],
  },
  difficultyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1.5'],
    backgroundColor: '#3D7A52',
    paddingHorizontal: sp['3'],
    paddingVertical: sp['1.5'],
    borderRadius: 16,
  },
  difficultyText: { color: '#FFFFFF', ...text.caption, fontWeight: '600' },
  readerActions: { flexDirection: 'row', alignItems: 'center', gap: sp['3'] },
  divider: { height: 1, marginBottom: sp['3'] },
  textContent: {},
  sectionHeading: { ...text.h4, marginBottom: sp['2'] },
  bodyText: { ...text.body, lineHeight: 24 },
});
