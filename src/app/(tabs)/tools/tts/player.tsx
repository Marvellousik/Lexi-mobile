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
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import PrimaryButton from '@/components/shared/PrimaryButton';

export default function TtsPlayerScreen() {
  const c = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
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
      <Sidebar />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="never"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>
            Text To Speech
          </Text>
          <View style={{ height: sp['6'] }} />

          <View
            style={[
              styles.playerCard,
              { backgroundColor: c.isDark ? '#2C2C2C' : '#FFFDE7' },
            ]}
          >
            <View style={[styles.fileChip, {
              backgroundColor: c.isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
              borderColor: c.isDark ? 'rgba(255,255,255,0.15)' : '#E5E5E5',
            }]}>
              <Ionicons name="document-text" size={14} color={c.brand.primary} />
              <Text style={[styles.fileChipText, { color: c.text.primary }]} numberOfLines={1}>
                History of Hitler.pdf
              </Text>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={16} color="#888" />
              </TouchableOpacity>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessible={true}
                accessibilityLabel="Previous"
                accessibilityRole="button"
              >
                <Ionicons name="play-skip-back" size={28} color={c.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsPlaying(!isPlaying)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessible={true}
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
                accessibilityRole="button"
              >
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={c.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessible={true}
                accessibilityLabel="Next"
                accessibilityRole="button"
              >
                <Ionicons name="play-skip-forward" size={28} color={c.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.textContent}>
              <Text style={[styles.sectionHeading, { color: c.text.primary }]}>
                Early Life and Artistic Failure
              </Text>
              <Text style={[styles.bodyText, { color: c.text.primary }]}>
                Adolf Hitler was born on{' '}
                <Text style={{ backgroundColor: 'rgba(179,157,219,0.4)', borderRadius: 3, overflow: 'hidden' }}>
                  April 20
                </Text>
                , 1889, in Braunau am Inn, Austria-Hungary. He was the fourth of six children born to Alois Hitler and Klara Pölzl.
              </Text>
            </View>
          </View>

          <View style={{ marginTop: sp['4'] }}>
            <PrimaryButton
              label="Export Audio (MP3)"
              onPress={() => {}}
              icon={<Ionicons name="headset" size={18} color="#FFFFFF" />}
            />
          </View>
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
  playerCard: {
    borderRadius: 16,
    padding: sp['5'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
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
  fileChipText: {
    ...text.bodySm,
    maxWidth: 200,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['7'],
    marginVertical: sp['4'],
  },
  textContent: {},
  sectionHeading: { ...text.h4, marginBottom: sp['2'] },
  bodyText: { ...text.body, lineHeight: 24 },
});
