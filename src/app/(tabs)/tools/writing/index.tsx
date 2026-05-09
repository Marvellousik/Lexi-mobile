import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { ConfidenceTooltip } from '@/components/ui/ConfidenceTooltip';
import { ExportOptionsSheet } from '@/components/ui/ExportOptionsSheet';
import { showToast } from '@/components/ui/Toast';
import { WordToken } from '@/types';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const MOCK_TEXT: WordToken[] = [
  { word: 'Adolf ', confidence: 'high' },
  { word: 'Hitler ', confidence: 'high' },
  { word: 'was ', confidence: 'high' },
  { word: 'scrutinized ', confidence: 'low' },
  { word: 'by ', confidence: 'high' },
  { word: 'many ', confidence: 'high' },
  { word: 'historians. ', confidence: 'high' },
  { word: 'Hitler was born ', confidence: 'low' },
  { word: 'in ', confidence: 'high' },
  { word: 'Austria. ', confidence: 'high' },
];

export default function WritingAssistantScreen() {
  const c = useTheme();
  const [confidence, setConfidence] = useState<'high' | 'low'>('low');
  const [copied, setCopied] = useState(false);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleCopy = async () => {
    const text = MOCK_TEXT.map((t) => t.word).join('');
    await Clipboard.setStringAsync(text);
    setCopied(true);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const confidenceColor = confidence === 'low' ? '#F97316' : '#10B981';
  const confidenceLabel = confidence === 'low' ? 'Low confidence' : 'High confidence';

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
        <Text style={[styles.pageTitle, { color: c.text.primary }]}>
          Writing Assistant
        </Text>
        <View style={{ height: sp['6'] }} />

        <View style={[styles.card, { backgroundColor: c.ui.cardBg }]}>
          <View style={styles.cardHeader}>
            <TouchableOpacity
              style={styles.confidenceRow}
              onPress={() => setShowTooltip(true)}
              accessible={true}
              accessibilityLabel={`${confidenceLabel} — tap for info`}
              accessibilityRole="button"
            >
              <View style={[styles.dot, { backgroundColor: confidenceColor }]} />
              <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                {confidenceLabel}
              </Text>
              <Ionicons name="information-circle-outline" size={16} color={confidenceColor} />
            </TouchableOpacity>

            <View style={styles.waveform}>
              <Ionicons name="pulse" size={20} color={c.brand.primary} />
            </View>

            <Ionicons name="mic" size={20} color={c.brand.primary} />

            <TouchableOpacity style={styles.cleanButton}>
              <Text style={styles.cleanText}>Clean and Structure</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transcript}>
            {MOCK_TEXT.map((token, index) => (
              <Text
                key={index}
                style={[
                  styles.word,
                  {
                    color: c.text.primary,
                    backgroundColor:
                      selectedWord === index
                        ? '#CFFAFE'
                        : confidence === 'low' && token.confidence === 'low'
                        ? '#FED7AA'
                        : 'transparent',
                  },
                ]}
                onPress={() => setSelectedWord(index === selectedWord ? null : index)}
              >
                {token.word}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              copied && { backgroundColor: c.brand.primary, borderColor: c.brand.primary },
            ]}
            onPress={handleCopy}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel={copied ? 'Copied' : 'Copy to clipboard'}
            accessibilityRole="button"
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={18}
              color={copied ? '#FFFFFF' : c.brand.primary}
            />
            <Text
              style={[
                styles.actionText,
                copied && { color: '#FFFFFF' },
              ]}
            >
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowExport(true)}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Export"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={18} color={c.brand.primary} />
            <Text style={styles.actionText}>Export</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: sp['6'] }} />
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: confidenceColor }]}
          onPress={() => setConfidence(confidence === 'low' ? 'high' : 'low')}
          activeOpacity={0.88}
          accessible={true}
          accessibilityLabel="Toggle confidence view"
          accessibilityRole="button"
        >
          <Text style={styles.toggleText}>Toggle Confidence (Demo)</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfidenceTooltip visible={showTooltip} onClose={() => setShowTooltip(false)} />
      <ExportOptionsSheet
        visible={showExport}
        onDownload={() => {}}
        onExportGoogle={() => {}}
        onClose={() => setShowExport(false)}
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
  },
  card: {
    borderRadius: 16,
    padding: sp['5'],
    marginBottom: sp['5'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sp['4'],
    flexWrap: 'wrap',
    gap: sp['2'],
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1.5'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confidenceText: { ...text.caption, fontWeight: '600' },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cleanButton: {
    backgroundColor: '#2D5A3D',
    paddingHorizontal: sp['3'],
    paddingVertical: sp['1.5'],
    borderRadius: 12,
  },
  cleanText: { color: '#FFFFFF', ...text.caption, fontWeight: '600' },
  transcript: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    ...text.body,
    lineHeight: 28,
    paddingHorizontal: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: sp['3'],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
    height: 48,
    borderWidth: 1.5,
    borderColor: '#3D7A52',
    borderRadius: 14,
  },
  actionText: { color: '#3D7A52', ...text.buttonSm },
  toggleButton: {
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: { color: '#FFFFFF', ...text.buttonSm },
});
