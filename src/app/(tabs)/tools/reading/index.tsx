import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '@/components/layout/Sidebar';
import UploadZone from '@/components/shared/UploadZone';
import DocRow from '@/components/shared/DocRow';
import PrimaryButton from '@/components/shared/PrimaryButton';
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
            Reading Assistant
          </Text>
          <View style={{ height: sp['6'] }} />

          <View style={[styles.heroCard, { backgroundColor: c.tool.reading }]}>
            <Ionicons name="book" size={48} color="#3D7A52" />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Reading Assistant</Text>
              <Text style={styles.heroDesc}>
                Get help reading and understanding complex texts
              </Text>
            </View>
          </View>

          <View style={{ height: sp['6'] }} />

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
