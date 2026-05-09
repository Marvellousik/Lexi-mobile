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
import UploadZone from '@/components/shared/UploadZone';
import DocRow from '@/components/shared/DocRow';
import PrimaryButton from '@/components/shared/PrimaryButton';
import ReadingHeroIllustration from '@/components/illustrations/ReadingHeroIllustration';
import { useTheme } from '@/hooks/useTheme';
import { DocumentResult } from '@/types';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function ReadingUploadScreen() {
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
      await new Promise((r) => setTimeout(r, 800));
      router.push('/(tabs)/tools/reading/reader');
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
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>
            Reading Assistant
          </Text>
          <View style={{ height: sp['6'] }} />

          {/* Hero card */}
          <View style={[styles.heroCard, { backgroundColor: c.tool.reading }]}>
            <View style={styles.heroImageWrapper}>
              <ReadingHeroIllustration width={120} height={100} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Reading Assistant</Text>
              <Text style={styles.heroDesc}>
                Study with confidence as{'\n'}words are simplified into bits
              </Text>
            </View>
          </View>

          <View style={{ height: sp['8'] }} />

          {/* Upload or result */}
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
    paddingBottom: 120,
  },
  pageTitle: {
    ...(text.h1 as any),
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 16,
    padding: sp['4'],
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden' as const,
  },
  heroImageWrapper: {
    width: 110,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  heroText: {
    flex: 1,
    marginLeft: sp['3'],
    paddingRight: sp['2'],
  },
  heroTitle: {
    ...(text.h3 as any),
    color: '#111111',
    lineHeight: 24,
  },
  heroDesc: {
    ...(text.bodySm as any),
    color: '#555555',
    marginTop: sp['2'],
    lineHeight: 20,
  },
  sectionLabel: {
    ...(text.label as any),
    marginBottom: sp['2'],
  },
});
