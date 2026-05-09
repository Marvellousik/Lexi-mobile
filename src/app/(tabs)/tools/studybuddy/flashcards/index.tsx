import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
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
      await new Promise((r) => setTimeout(r, 800));
      router.push('/(tabs)/tools/studybuddy/flashcards/session');
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
          <View style={{ height: sp['6'] }} />

          <View style={[styles.heroCard, { backgroundColor: c.tool.flashcards }]}>
            <Image 
              source={require('../../../../../../assets/flashcard.png')} 
              style={styles.heroImage}
              resizeMode="contain"
            />
            <View style={styles.heroText}>
              <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>Flashcards</Text>
              <Text style={[styles.heroDesc, { color: 'rgba(255,255,255,0.9)' }]}>
                Learn more effectively with generated flashcards
              </Text>
            </View>
          </View>

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
                Document uploaded
              </Text>
              <DocRow
                filename={file.name}
                fileType={file.mimeType || 'Unknown'}
                onDismiss={() => setFile(null)}
              />
              <View style={{ height: sp['4'] }} />
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
    ...text.h1,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: sp['4'],
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  heroImage: {
    width: 110,
    height: 110,
  },
  heroText: { 
    flex: 1, 
    marginLeft: sp['3'],
    justifyContent: 'center',
  },
  heroTitle: { 
    ...text.h2,
    fontWeight: '800',
  },
  heroDesc: { 
    ...text.bodySm, 
    marginTop: sp['1'], 
    lineHeight: 18,
  },
  sectionLabel: { 
    ...text.label, 
    textAlign: 'center',
    marginTop: sp['10'],
    marginBottom: sp['4'],
  },
});

