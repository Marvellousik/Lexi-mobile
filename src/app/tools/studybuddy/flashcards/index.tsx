import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UploadZone } from '@/components/shared/UploadZone';
import { DocRow } from '@/components/shared/DocRow';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { useTheme } from '@/hooks/useTheme';
import { DocumentResult } from '@/types';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function FlashcardsUploadScreen() {
  const router = useRouter();
  const c = useTheme();
  const [file, setFile] = useState<DocumentResult | null>(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      router.push('/tools/studybuddy/flashcards/session');
    } finally {
      setLoading(false);
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
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>Flashcards</Text>
          <View style={{ height: sp['8'] }} />

          {!file ? (
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
                Document selected
              </Text>
              <DocRow
                filename={file.name}
                fileType={file.mimeType || 'Unknown'}
                onDismiss={() => setFile(null)}
              />
              <View style={{ height: sp['6'] }} />
              <PrimaryButton
                label="Generate Flashcards"
                onPress={handleSubmit}
                loading={loading}
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
    paddingBottom: 140,
  },
  pageTitle: {
    ...(text.h1 as any),
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  sectionLabel: {
    ...(text.label as any),
    marginBottom: sp['3'],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
