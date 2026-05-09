import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import PrimaryButton from '@/components/shared/PrimaryButton';

const VOICES = ['Alex', 'Nadia', 'Jake'] as const;
const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0] as const;
const HIGHLIGHT_MODES = ['Word by Word', 'Line by Line'] as const;
const BG_COLORS = [
  '#FFFDE7', '#F5EDE0', '#E2DFA0', '#EDCBA4',
  '#C8DEF5', '#D8F0E0', '#D0C8E8', '#6B9BD2',
  '#E8E8B8', '#706848', '#E8D0C8', '#D8B0B0',
  '#F0D0B8', '#80D880', '#E0E0E0', null,
];

export default function TtsPlayerScreen() {
  const c = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Alex');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(0.75);
  const [highlightMode, setHighlightMode] = useState<string>('Word by Word');
  const [bgColor, setBgColor] = useState<string | null>('#FFFDE7');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const openSettings = () => {
    setShowSettings(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 150,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowSettings(false));
  };

  const cardBg = bgColor || (c.isDark ? '#2C2C2C' : '#FFFFFF');

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
          {/* Header row with title + settings gear */}
          <View style={styles.headerRow}>
            <Text style={[styles.pageTitle, { color: c.text.primary, flex: 1 }]}>
              Text To Speech Learning Hub
            </Text>
            <TouchableOpacity onPress={openSettings} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="settings-outline" size={24} color={c.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={{ height: sp['6'] }} />

          <View style={[styles.playerCard, { backgroundColor: cardBg }]}>
            {/* File chip */}
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

            {/* Playback controls */}
            <View style={styles.controls}>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessible accessibilityLabel="Previous" accessibilityRole="button">
                <Ionicons name="play-skip-back" size={28} color={c.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessible accessibilityLabel={isPlaying ? 'Pause' : 'Play'} accessibilityRole="button">
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={c.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessible accessibilityLabel="Next" accessibilityRole="button">
                <Ionicons name="play-skip-forward" size={28} color={c.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Text content */}
            <View style={styles.textContent}>
              <Text style={[styles.sectionHeading, { color: c.text.primary }]}>
                Early Life and Artistic Failure
              </Text>
              <Text style={[styles.bodyText, { color: c.text.primary }]}>
                Adolf Hitler's life remains one of the most studied and scrutinized periods in modern history, marking the transition from a failed artist to the architect of a global catastrophe.{'\n'}
                Early Life and Artistic Failure{'\n'}
                Adolf Hitler was born on{' '}
                <Text style={{ backgroundColor: 'rgba(179,157,219,0.4)' }}>
                  April 20
                </Text>
                , 1889, in the small Austrian town of Braunau am Inn. His early years were shaped by a difficult relationship with his strict father and a deep devotion to his mother. In 1907, he moved to Vienna with dreams of becoming an artist. However, he was twice rejected by the Academy of Fine Arts. During his years of poverty in Vienna, he began to adopt the extreme nationalist and antisemitic ideologies that would later define his regime.
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

      {/* Settings Bottom Sheet */}
      <Modal visible={showSettings} transparent animationType="none" onRequestClose={closeSettings}>
        <Pressable style={styles.overlay} onPress={closeSettings}>
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: c.isDark ? '#2C2C2C' : '#FFFFFF',
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                }],
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Handle */}
              <View style={styles.sheetHandle} />

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Voice */}
                <Text style={[styles.sheetLabel, { color: c.text.primary }]}>Voice</Text>
                <View style={styles.optionList}>
                  {VOICES.map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[styles.optionPill, selectedVoice === v && styles.optionPillActive]}
                      onPress={() => setSelectedVoice(v)}
                    >
                      <Text style={[styles.optionText, selectedVoice === v && styles.optionTextActive]}>
                        {v}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Speed */}
                <Text style={[styles.sheetLabel, { color: c.text.primary }]}>Reading Speed</Text>
                <View style={styles.optionList}>
                  {SPEEDS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.optionPill, selectedSpeed === s && styles.optionPillActive]}
                      onPress={() => setSelectedSpeed(s)}
                    >
                      <Text style={[styles.optionText, selectedSpeed === s && styles.optionTextActive]}>
                        {s}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Highlight mode */}
                <Text style={[styles.sheetLabel, { color: c.text.primary }]}>Highlight Mode</Text>
                <View style={styles.optionList}>
                  {HIGHLIGHT_MODES.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.optionPill, highlightMode === m && styles.optionPillActive]}
                      onPress={() => setHighlightMode(m)}
                    >
                      <Text style={[styles.optionText, highlightMode === m && styles.optionTextActive]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Background Color */}
                <Text style={[styles.sheetLabel, { color: c.text.primary }]}>Background Color</Text>
                <View style={styles.colorGrid}>
                  {BG_COLORS.map((color, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.colorSwatch,
                        {
                          backgroundColor: color || 'transparent',
                          borderWidth: bgColor === color ? 2.5 : 1,
                          borderColor: bgColor === color ? c.brand.primary : '#DDD',
                        },
                      ]}
                      onPress={() => setBgColor(color)}
                    >
                      {color === null && (
                        <View style={styles.noColorIcon}>
                          <View style={styles.noColorLine} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ height: sp['8'] }} />
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const { width: SCREEN_W } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: sp['6'],
    paddingTop: sp['6'],
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['3'],
  },
  pageTitle: {
    ...(text.h1 as any),
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
    ...(text.bodySm as any),
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
  sectionHeading: {
    ...(text.h4 as any),
    marginBottom: sp['2'],
  },
  bodyText: {
    ...(text.body as any),
    lineHeight: 24,
  },
  // Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: sp['6'],
    paddingTop: sp['3'],
    paddingBottom: sp['10'],
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginBottom: sp['5'],
  },
  sheetLabel: {
    ...(text.h4 as any),
    marginBottom: sp['3'],
    marginTop: sp['4'],
  },
  optionList: {
    gap: sp['2'],
  },
  optionPill: {
    paddingVertical: sp['3'],
    paddingHorizontal: sp['5'],
    borderRadius: 50,
    alignItems: 'center',
  },
  optionPillActive: {
    backgroundColor: '#3D7A52',
  },
  optionText: {
    ...(text.button as any),
    color: '#555',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp['3'],
    justifyContent: 'flex-start',
  },
  colorSwatch: {
    width: (SCREEN_W - 48 - 36) / 4,
    height: (SCREEN_W - 48 - 36) / 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noColorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  noColorLine: {
    width: 30,
    height: 2,
    backgroundColor: '#111',
    transform: [{ rotate: '45deg' }],
  },
});
