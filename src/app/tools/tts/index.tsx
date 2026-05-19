import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

import { DocRow } from '@/components/shared/DocRow';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import TTSHeroIllustration from '@/components/illustrations/TTSHeroIllustration';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { showToast } from '@/components/ui/Toast';
import { DocumentResult } from '@/types';

export default function TTSUploadScreen() {
  const router = useRouter();
  const c = useTheme();
  const [file, setFile] = useState<DocumentResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/msword', 'image/*'],
      });
      if (result.canceled) return;
      
      const f = result.assets[0];
      setFile({
        uri: f.uri,
        name: f.name,
        mimeType: f.mimeType,
        size: f.size,
      });
    } catch (error) {
      showToast('Error selecting document', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsPending(true);
    try {
      // Logic for submitting/processing TTS document here
      // await process.mutateAsync({...});
      setTimeout(() => {
        setIsPending(false);
        router.push('/tools/tts/player');
      }, 1000);
    } catch {
      setIsPending(false);
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

          {/* Hero card matching the exact gradient from the design */}
          <LinearGradient
            colors={['#377749', '#21482C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroImageWrapper}>
              <TTSHeroIllustration width={120} height={100} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                Text to speech{'\n'}Learning Hub
              </Text>
              <Text style={styles.heroDesc}>
                Turn text into sound. Sit back, listen & watch the words light up as you learn.
              </Text>
            </View>
          </LinearGradient>

          <View style={{ height: sp['8'] }} />

          {!file ? (
            /* Custom Upload Zone Built to Match the PDF Exactly */
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={handlePickDocument}
              style={[
                styles.uploadZone, 
                { 
                  backgroundColor: c.isDark ? '#222' : '#E8F5E9', // Light green background matching PDF
                  borderColor: '#A5D6A7' 
                }
              ]}
            >
              <View style={styles.uploadIconWrapper}>
                <Ionicons name="cloud-upload" size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.uploadTitle, { color: c.brand.primaryDark }]}>
                Click to upload or drag and drop
              </Text>
              <Text style={[styles.uploadSubtitle, { color: c.text.secondary }]}>
                PDF, DOC, TXT, image (Size maximun)
              </Text>
            </TouchableOpacity>
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
                loading={isPending}
              />
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: sp['4'],
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  heroImageWrapper: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    marginLeft: sp['3'],
    paddingRight: sp['2'],
  },
  heroTitle: {
    ...(text.h3 as any),
    color: '#FFFFFF',
    lineHeight: 24,
  },
  heroDesc: {
    ...(text.bodySm as any),
    color: 'rgba(255, 255, 255, 0.85)', // Slightly faded white for description
    marginTop: sp['2'],
    lineHeight: 20,
  },
  sectionLabel: {
    ...(text.label as any),
    marginBottom: sp['2'],
  },
  
  // Custom Upload Zone Styles based on 1-to-1 design matching
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: sp['10'],
    paddingHorizontal: sp['5'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconWrapper: {
    backgroundColor: '#3D7A52', // Direct green to match PDF
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['4'],
  },
  uploadTitle: {
    ...(text.h4 as any),
    textAlign: 'center',
    marginBottom: sp['2'],
  },
  uploadSubtitle: {
    ...(text.bodySm as any),
    textAlign: 'center',
  },
});