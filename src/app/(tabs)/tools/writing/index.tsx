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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import ConfidenceTooltip from '@/components/ui/ConfidenceTooltip';
import ExportOptionsSheet from '@/components/ui/ExportOptionsSheet';
import { showToast } from '@/components/ui/Toast';
import { WordToken } from '@/types';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const MOCK_TEXT: WordToken[] = [
  { word: 'Adolf ', confidence: 'high' },
  { word: 'Hitler’s ', confidence: 'high' },
  { word: 'life ', confidence: 'high' },
  { word: 'remains ', confidence: 'high' },
  { word: 'one ', confidence: 'high' },
  { word: 'of ', confidence: 'high' },
  { word: 'the ', confidence: 'high' },
  { word: 'most ', confidence: 'high' },
  { word: 'studied ', confidence: 'high' },
  { word: 'and ', confidence: 'high' },
  { word: 'scrutinized ', confidence: 'low' },
  { word: 'periods ', confidence: 'high' },
  { word: 'in ', confidence: 'high' },
  { word: 'modern ', confidence: 'high' },
  { word: 'history, ', confidence: 'high' },
  { word: 'marking ', confidence: 'high' },
  { word: 'the ', confidence: 'high' },
  { word: 'transition ', confidence: 'high' },
  { word: 'from ', confidence: 'high' },
  { word: 'a ', confidence: 'high' },
  { word: 'failed ', confidence: 'high' },
  { word: 'artist ', confidence: 'high' },
  { word: 'to ', confidence: 'high' },
  { word: 'the ', confidence: 'high' },
  { word: 'architect ', confidence: 'high' },
  { word: 'of ', confidence: 'high' },
  { word: 'a ', confidence: 'high' },
  { word: 'global ', confidence: 'high' },
  { word: 'catastrophe. ', confidence: 'high' },
  { word: 'Early ', confidence: 'high' },
  { word: 'Life ', confidence: 'high' },
  { word: 'and ', confidence: 'high' },
  { word: 'Artistic ', confidence: 'high' },
  { word: 'Failure ', confidence: 'high' },
  { word: 'Adolf ', confidence: 'high' },
  { word: 'Hitler was born ', confidence: 'low' },
  { word: 'on ', confidence: 'high' },
  { word: 'April ', confidence: 'high' },
  { word: '20, ', confidence: 'high' },
  { word: '1889, ', confidence: 'high' },
  { word: 'in ', confidence: 'high' },
  { word: 'the ', confidence: 'high' },
  { word: 'small ', confidence: 'high' },
  { word: 'Austrian ', confidence: 'high' },
  { word: 'town ', confidence: 'high' },
  { word: 'of ', confidence: 'high' },
  { word: 'Braunau ', confidence: 'high' },
  { word: 'am ', confidence: 'high' },
  { word: 'Inn. ', confidence: 'high' },
];

const FONTS = ['Default', 'OpenDyslexic', 'Roboto'] as const;
const COLORS = [
  '#F9F9F9', '#FFF9E6', '#E6F4FF', '#F0FFF4',
  '#FFF0F0', '#F5E6FF', '#E0F2F1', '#F1F8E9',
  '#FFF3E0', '#EFEBE9', '#FAFAFA', '#ECEFF1',
  '#E1F5FE', '#F3E5F5', '#E8F5E9', '#FFFDE7'
];

export default function WritingAssistantScreen() {
  const c = useTheme();
  const router = useRouter();
  const [confidence, setConfidence] = useState<'high' | 'low'>('low');
  const [copied, setCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transcriptText, setTranscriptText] = useState(MOCK_TEXT.map(t => t.word).join(''));
  const [readingMode, setReadingMode] = useState<'letter' | 'word' | 'line'>('word');
  const [selectedFont, setSelectedFont] = useState<string>('Roboto');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (showSettings) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showSettings]);

  const handleCleanText = () => {
    // Simulated AI cleaning: Ensure proper capitalization and spacing
    const cleaned = transcriptText
      .trim()
      .replace(/(^\w|\.\s+\w)/gm, (m) => m.toUpperCase()) // Capitalize sentences
      .replace(/\s+/g, ' ') // Remove extra spaces
      .split('. ')
      .join('.\n\n'); // Add double line breaks for structure
    
    setTranscriptText(cleaned);
    showToast('Text cleaned and structured', 'success');
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(transcriptText);
    setCopied(true);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const confidenceColor = confidence === 'low' ? '#F97316' : '#10B981';
  const confidenceLabel = confidence === 'low' ? 'Low confidence' : 'High confidence';
  const highlightColor = selectedColor || (confidence === 'low' ? '#FED7AA' : '#CFFAFE');

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
          <View style={styles.titleRow}>
            <Text style={[styles.pageTitle, { color: c.text.primary }]}>Writing Assistant</Text>
            <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.topSettings}>
              <Ionicons name="settings-outline" size={24} color={c.brand.primary} />
            </TouchableOpacity>
          </View>
        <View style={{ height: sp['6'] }} />
        <View style={[styles.card, { backgroundColor: c.ui.cardBg }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={[styles.dot, { backgroundColor: confidenceColor }]} />
              <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                {confidenceLabel}
              </Text>
              <TouchableOpacity onPress={() => setShowTooltip(true)}>
                <Ionicons name="information-circle-outline" size={16} color={confidenceColor} />
              </TouchableOpacity>
            </View>

            <View style={styles.readerActions}>
              <View style={{ marginRight: 12 }}>
                <MaterialCommunityIcons name="waveform" size={22} color="#6B9E7C" />
              </View>
              <TouchableOpacity 
                style={styles.cleanButton} 
                onPress={handleCleanText}
                activeOpacity={0.8}
              >
                <Text style={styles.cleanText}>Clean and Structure</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.transcript}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.editor,
                  { 
                    color: c.text.primary,
                    fontFamily: selectedFont === 'Default' ? undefined : selectedFont,
                  }
                ]}
                value={transcriptText}
                onChangeText={setTranscriptText}
                multiline
                autoFocus
              />
            ) : (
              MOCK_TEXT.map((token, index) => (
                <Text
                  key={index}
                  style={[
                    styles.word,
                    {
                      color: c.text.primary,
                      fontFamily: selectedFont === 'Default' ? undefined : selectedFont,
                      backgroundColor: token.confidence === 'low' ? highlightColor : 'transparent',
                    },
                  ]}
                >
                  {token.word}
                </Text>
              ))
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.pillButton,
              copied && { backgroundColor: '#F0F9F4', borderColor: '#3D7A52' },
            ]}
            onPress={handleCopy}
            activeOpacity={0.8}
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={18}
              color="#3D7A52"
            />
            <Text style={styles.pillText}>
              {copied ? 'Copied' : 'Copy to Clipboard'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pillButton}
            onPress={() => setShowExport(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={18} color="#3D7A52" />
            <Text style={styles.pillText}>Export</Text>
          </TouchableOpacity>
        </View>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          {isRecording ? (
            <View style={styles.controlsRow}>
              <TouchableOpacity 
                style={styles.controlCircle} 
                onPress={() => setIsRecording(false)}
                activeOpacity={0.75}
              >
                <Ionicons name="pause" size={36} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlCircle}
                onPress={() => setIsRecording(false)}
                activeOpacity={0.75}
              >
                <Ionicons name="stop" size={36} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.controlCircle, styles.largeMic]}
              onPress={() => setIsRecording(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="mic" size={44} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Settings Bottom Sheet */}
      <Modal
        visible={showSettings}
        transparent
        animationType="none"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowSettings(false)}
        >
          <Animated.View 
            style={[
              styles.settingsSheet,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Mode</Text>
            <View style={styles.fontRow}>
              <TouchableOpacity
                style={[styles.fontPill, !isEditing && styles.activePill]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={[styles.pillLabel, !isEditing && styles.activePillLabel]}>View Mode</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fontPill, isEditing && styles.activePill]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={[styles.pillLabel, isEditing && styles.activePillLabel]}>Edit Mode</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Reading Mode</Text>
            <View style={styles.fontRow}>
              {(['letter', 'word', 'line'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.fontPill,
                    readingMode === mode && styles.activePill
                  ]}
                  onPress={() => setReadingMode(mode)}
                >
                  <Text style={[
                    styles.pillLabel,
                    readingMode === mode && styles.activePillLabel
                  ]}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Font</Text>
            <View style={styles.fontRow}>
              {FONTS.map((font) => (
                <TouchableOpacity
                  key={font}
                  style={[
                    styles.fontPill,
                    selectedFont === font && styles.activePill
                  ]}
                  onPress={() => setSelectedFont(font)}
                >
                  <Text style={[
                    styles.pillLabel,
                    selectedFont === font && styles.activePillLabel
                  ]}>{font}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Highlight Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorSquare,
                    { backgroundColor: color },
                    selectedColor === color && styles.activeColorSquare
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.applyText}>Apply Settings</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>

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
    paddingTop: sp['8'],
    paddingBottom: 150,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSettings: {
    padding: sp['2'],
  },
  pageTitle: {
    ...text.h1,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  card: {
    borderRadius: 32,
    padding: sp['6'],
    marginBottom: sp['6'],
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sp['6'],
  },
  readerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confidenceText: { 
    ...(text.caption as any), 
    fontWeight: '600' as const,
    fontSize: 13,
  },
  waveformPlaceholder: {
    flex: 1,
  },
  cleanButton: {
    backgroundColor: '#6B9E7C',
    paddingHorizontal: sp['4'],
    paddingVertical: sp['2'],
    borderRadius: 18,
  },
  cleanText: { color: '#FFFFFF', ...(text.caption as any), fontWeight: '700' as const, fontSize: 13 },
  transcript: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    ...(text.body as any),
    fontSize: 17,
    lineHeight: 32,
    paddingHorizontal: 2,
    marginVertical: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  editor: {
    ...(text.body as any),
    fontSize: 18,
    lineHeight: 32,
    minHeight: 200,
    textAlignVertical: 'top',
    padding: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: sp['3'],
    marginBottom: sp['12'],
  },
  pillButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
    height: 54,
    borderWidth: 1.5,
    borderColor: '#3D7A52',
    borderRadius: 27,
  },
  pillText: { color: '#3D7A52', ...(text.buttonSm as any), fontWeight: '700' as const, fontSize: 14 },
  
  controlsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp['4'],
  },
  controlsRow: {
    flexDirection: 'row',
    gap: sp['12'],
  },
  controlCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#6B9E7C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  largeMic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  settingsSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fontRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  fontPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activePill: {
    backgroundColor: '#3D7A52',
  },
  pillLabel: {
    fontSize: 14,
    color: '#555',
  },
  activePillLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  activeColorSquare: {
    borderColor: '#3D7A52',
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  applyButton: {
    backgroundColor: '#3D7A52',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
