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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import DifficultySelector from '@/components/ui/DifficultySelector';

const FONTS = ['Default', 'OpenDyslexic', 'Roboto'] as const;
const MODES = ['letter', 'word', 'line'] as const;
const COLORS = [
  '#FFF9C4', '#F5F5DC', '#C8E6C9', '#FFCCBC',
  '#81D4FA', '#E0F2F1', '#E1BEE7', '#90CAF9',
  '#DCEDC8', '#BCAAA4', '#BDBDBD', '#EF9A9A',
  '#FFCC80', '#4CAF50', '#E0E0E0', null,
];

export default function ReadingReaderScreen() {
  const c = useTheme();
  // FIX: Removed 'simplified' and set the default to 'beginner'
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate'>('beginner');
  const [readingMode, setReadingMode] = useState<'letter' | 'word' | 'line'>('word');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string>('Roboto');
  
  const [showSettings, setShowSettings] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [showWordDef, setShowWordDef] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
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
    Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 150 }).start();
  };
  const closeSettings = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setShowSettings(false));
  };

  const bodyContent = `Adolf Hitler's life remains one of the most studied and scrutinized periods in modern history, marking the transition from a failed artist to the architect of a global catastrophe.\nEarly Life and Artistic Failure\nAdolf Hitler was born on April 20, 1889, in the small Austrian town of Braunau am Inn. His early years were shaped by a difficult relationship with his strict father and a deep devotion to his mother. In 1907, he moved to Vienna with dreams of becoming an artist. However, he was twice rejected by the Academy of Fine Arts. During his years of poverty in Vienna, he began to adopt the extreme nationalist and antisemitic ideologies that would later define his regime.`;

  const renderContent = () => (
    <View style={styles.textContent}>
      <Text style={[styles.sectionHeading, { color: c.text.primary, fontFamily: selectedFont === 'Default' ? undefined : selectedFont }]}>
        Early Life and Artistic Failure
      </Text>
      <Text style={[styles.bodyText, { color: c.text.primary, fontFamily: selectedFont === 'Default' ? undefined : selectedFont }]}>
        {bodyContent}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.ui.background }]} edges={['top']}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      
      {!fullScreen ? (
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

            {/* File chip */}
            <View style={[styles.fileChip, {
              backgroundColor: c.isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
              borderColor: c.isDark ? 'rgba(255,255,255,0.15)' : '#E5E5E5',
            }]}>
              <Ionicons name="document-text" size={14} color={c.brand.primary} />
              <Text style={[styles.fileChipText, { color: c.brand.primary }]}>
                History of Hitler.pdf
              </Text>
            </View>

            {/* Reader card */}
            <View style={[
              styles.readerCard, 
              { backgroundColor: selectedColor || (c.isDark ? '#2C2C2C' : '#FFFFFF') }
            ]}>
              {/* Header row */}
              <View style={styles.readerHeader}>
                <TouchableOpacity 
                  style={styles.difficultyPill} 
                  onPress={() => setShowDifficulty(true)}
                  activeOpacity={0.8}
                >
                  {/* FIX: Simplified text render */}
                  <Text style={styles.difficultyText}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#FFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
                <View style={styles.readerActions}>
                  <TouchableOpacity onPress={openSettings} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="settings-outline" size={22} color={c.brand.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFullScreen(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="expand-outline" size={22} color={c.brand.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="close" size={22} color={c.brand.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: c.isDark ? '#444' : '#E5E5E5' }]} />

              {renderContent()}
            </View>

            {/* Word definition card (demo) */}
            <TouchableOpacity activeOpacity={0.9} onPress={() => setShowWordDef(!showWordDef)}>
              <View style={[styles.wordDefCard, { backgroundColor: c.isDark ? '#2C2C2C' : '#FFFFFF' }]}>
                <View style={styles.wordDefHeader}>
                  <Text style={[styles.wordDefWord, { color: c.brand.primary }]}>Scrutinized</Text>
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="volume-high-outline" size={22} color={c.text.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.wordDefMeaning, { color: c.text.primary }]}>
                  To inspect with great care.
                </Text>
                <Text style={[styles.wordDefLabel, { color: c.brand.primary }]}>Synonyms</Text>
                <Text style={[styles.wordDefSynonyms, { color: c.text.primary }]}>
                  Inspect, examine, probe, audit
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      ) : (
        /* Full Screen Reader Mode */
        <View style={[styles.fullScreenContainer, { backgroundColor: selectedColor || c.ui.background }]}>
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity onPress={() => setFullScreen(false)} style={styles.minimizeButton}>
              <Ionicons name="contract-outline" size={24} color={c.brand.primary} />
              <Text style={[styles.minimizeText, { color: c.brand.primary }]}>Minimize</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.difficultyPill, { alignSelf: 'center' }]} 
              onPress={() => setShowDifficulty(true)}
              activeOpacity={0.8}
            >
              {/* FIX: Simplified text render */}
              <Text style={styles.difficultyText}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#FFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={openSettings}>
              <Ionicons name="settings-outline" size={24} color={c.brand.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={styles.fullScreenScroll}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </View>
      )}

      {/* Settings Bottom Sheet */}
      <Modal visible={showSettings} transparent animationType="none" onRequestClose={closeSettings}>
        <Pressable style={styles.overlay} onPress={closeSettings}>
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: c.isDark ? '#2C2C2C' : '#FFFFFF',
                transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [600, 0] }) }],
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHandle} />
              
              <Text style={[styles.sheetTitle, { color: c.text.primary }]}>Reader Settings</Text>

              {/* Font Selection */}
              <Text style={[styles.sectionLabel, { color: c.text.muted }]}>Font</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                {FONTS.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.pill, selectedFont === f && styles.pillActive]}
                    onPress={() => setSelectedFont(f)}
                  >
                    <Text style={[styles.pillText, selectedFont === f && styles.pillTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Difficulty Selection */}
              <Text style={[styles.sectionLabel, { color: c.text.muted, marginTop: sp['4'] }]}>Difficulty</Text>
              <View style={styles.row}>
                {(['beginner', 'intermediate'] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.pill, difficulty === d && styles.pillActive]}
                    onPress={() => setDifficulty(d)}
                  >
                    <Text style={[styles.pillText, difficulty === d && styles.pillTextActive]}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Reading Mode Selection */}
              <Text style={[styles.sectionLabel, { color: c.text.muted, marginTop: sp['4'] }]}>Reading Mode</Text>
              <View style={styles.modeColumn}>
                {MODES.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.modeRow, readingMode === m && styles.modeRowActive]}
                    onPress={() => setReadingMode(m)}
                  >
                    <Text style={[styles.modeText, readingMode === m && styles.modeTextActive]}>
                      {m.charAt(0).toUpperCase() + m.slice(1)} Selection
                    </Text>
                    {readingMode === m && <Text style={styles.modeArrow}>▸</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Color Selection */}
              <Text style={[styles.sectionLabel, { color: c.text.muted, marginTop: sp['4'] }]}>Background Color</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((color, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.colorCircle,
                      color ? { backgroundColor: color } : styles.noColorCircle,
                      selectedColor === color && styles.colorCircleActive
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {!color && <Ionicons name="ban-outline" size={20} color="#888" />}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: sp['8'] }} />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <DifficultySelector
        visible={showDifficulty}
        level={difficulty}
        onChange={(level) => setDifficulty(level)}
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
    ...(text.h1 as any),
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
  fileChipText: { ...(text.bodySm as any) },
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
    backgroundColor: '#3D7A52',
    paddingHorizontal: sp['3'],
    paddingVertical: sp['1.5'],
    borderRadius: 16,
  },
  difficultyText: { color: '#FFFFFF', ...(text.caption as any), fontWeight: '600' as const },
  readerActions: { flexDirection: 'row', alignItems: 'center', gap: sp['3'] },
  divider: { height: 1, marginBottom: sp['3'] },
  textContent: {},
  sectionHeading: { ...(text.h4 as any), marginBottom: sp['2'] },
  bodyText: { ...(text.body as any), lineHeight: 28 },
  
  // Full Screen
  fullScreenContainer: { flex: 1 },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp['6'],
    paddingVertical: sp['4'],
  },
  minimizeButton: { flexDirection: 'row', alignItems: 'center', gap: sp['1'] },
  minimizeText: { ...(text.button as any), fontSize: 14 },
  fullScreenScroll: { paddingHorizontal: sp['6'], paddingBottom: 60 },

  // Word definition card
  wordDefCard: {
    borderRadius: 16,
    padding: sp['5'],
    marginTop: sp['4'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  wordDefHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sp['1'],
  },
  wordDefWord: { ...(text.h3 as any) },
  wordDefMeaning: { ...(text.body as any), marginBottom: sp['3'] },
  wordDefLabel: { ...(text.h4 as any), marginBottom: sp['1'] },
  wordDefSynonyms: { ...(text.body as any) },
  
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
    paddingBottom: sp['6'],
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginBottom: sp['5'],
  },
  sheetTitle: { ...(text.h3 as any), marginBottom: sp['4'] },
  sectionLabel: { ...(text.label as any), marginBottom: sp['2'] },
  row: { flexDirection: 'row', gap: sp['2'], marginBottom: sp['2'] },
  pill: {
    paddingVertical: sp['2.5'],
    paddingHorizontal: sp['4'],
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#3D7A52',
    borderColor: '#3D7A52',
  },
  pillText: { ...(text.button as any), fontSize: 13, color: '#555' },
  pillTextActive: { color: '#FFFFFF' },
  
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sp['3'],
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  noColorCircle: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleActive: {
    borderColor: '#3D7A52',
  },
  modeColumn: {
    gap: sp['2'],
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sp['3'],
    paddingHorizontal: sp['4'],
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  modeRowActive: {
    backgroundColor: '#EAF4EE',
    borderColor: '#3D7A52',
  },
  modeText: {
    ...(text.bodySm as any),
    color: '#666',
  },
  modeTextActive: {
    color: '#3D7A52',
    fontWeight: '600' as const,
  },
  modeArrow: {
    fontSize: 18,
    color: '#3D7A52',
  },
});