import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { UploadZone } from '@/components/shared/UploadZone';
import { DocRow } from '@/components/shared/DocRow';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { useTheme } from '@/hooks/useTheme';
import { DocumentResult } from '@/types';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function QuizUploadScreen() {
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
      // Simulate processing
      await new Promise((r) => setTimeout(r, 1200));
      router.push('/tools/studybuddy/quiz/session');
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
          <Text style={[styles.pageTitle, { color: c.text.primary }]}>Quizzes</Text>
          <View style={{ height: sp['8'] }} />

          {/* Hero Card */}
          <View style={[styles.heroCard, { backgroundColor: c.tool.quiz }]}>
            <View style={styles.heroContent}>
              <View style={styles.illustrationContainer}>
                <Image 
                  source={require('../../../../../assets/images/tools/quiz-hero.png')} 
                  style={styles.heroImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Quizzes</Text>
                <Text style={styles.heroDesc}>
                  Upload a document and we will automatically generate questions to test your understanding of the content
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: sp['10'] }} />

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
                label="Generate Quiz"
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
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp['5'],
  },
  illustrationContainer: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 120,
    height: 120,
  },
  heroTextContainer: {
    flex: 1,
    marginLeft: sp['2'],
  },
  heroTitle: {
    ...(text.h2 as any),
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: sp['2'],
  },
  heroDesc: {
    ...(text.bodySm as any),
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionLabel: {
    ...(text.label as any),
    marginBottom: sp['3'],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});