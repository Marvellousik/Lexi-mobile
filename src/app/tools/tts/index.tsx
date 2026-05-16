import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { UploadZone } from '@/components/shared/UploadZone';
import { DocRow } from '@/components/shared/DocRow';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { useTheme } from '@/hooks/useTheme';
import { useProcessTts } from '@/hooks/queries/useTts';
import { useTtsStore } from '@/stores/ttsStore';
import { DocumentResult } from '@/types';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { SkeletonCard as SkeletonUploadZone, SkeletonButton } from '@/components/skeleton/Skeleton';
import { showToast } from '@/components/ui/Toast';

export default function TtsUploadScreen() {
  const router = useRouter();
  const c = useTheme();
  const process = useProcessTts();
  const setResult = useTtsStore((s) => s.setResult);
  const [file, setFile] = useState<DocumentResult | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const data = await process.mutateAsync({
        fileUri: file.uri,
        fileName: file.name,
      });
      setResult(data);
      router.push('/tools/tts/player');
    } catch {
      showToast('Failed to process document. Please try again.', 'error');
    }
  };

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
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>
            Text To Speech
          </Text>
          <View style={{ height: sp['6'] }} />

          {/* Hero card */}
          <View style={[styles.heroCard, { backgroundColor: c.tool.tts }]}>
            <Ionicons name="mic" size={48} color={c.brand.primary} />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Text to Speech</Text>
              <Text style={styles.heroDesc}>
                Convert documents to natural-sounding audio
              </Text>
            </View>
          </View>

          <View style={{ height: sp['6'] }} />

          {process.isPending ? (
            <>
              <SkeletonUploadZone />
              <View style={{ height: sp['6'] }} />
              <SkeletonButton />
            </>
          ) : !file ? (
            <UploadZone
              onFilePicked={(f) =>
                setFile({
                  uri: f.uri,
                  name: f.name,
                  mimeType: f.mimeType,
                  size: undefined,
                })
              }
            />
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={[styles.sectionLabel, { color: c.text.muted }]}>
                Document uploaded
              </Text>
              <DocRow
                filename={file.name}
                fileType={file.mimeType || 'Unknown'}
                onDismiss={() => setFile(null)}
              />
              <PrimaryButton
                label="Submit"
                onPress={handleSubmit}
                loading={process.isPending}
              />
            </Animated.View>
          )}
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
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: sp['4'],
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  heroText: { flex: 1, marginLeft: sp['3'] },
  heroTitle: { ...text.h3, color: '#111111' },
  heroDesc: { ...text.bodySm, color: '#555555', marginTop: sp['1'], lineHeight: 20 },
  sectionLabel: { ...text.label, marginBottom: sp['2'] },
});
