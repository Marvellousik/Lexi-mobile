import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { DocumentResult } from '@/types';

const TAB_BAR_HEIGHT = 70;

export default function ChatEmptyScreen() {
  const router = useRouter();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();

  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<DocumentResult | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/msword', 'image/*'],
      });
      if (result.canceled) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const f = result.assets[0];
      setAttachment({
        uri: f.uri,
        name: f.name,
        mimeType: f.mimeType,
        size: f.size,
      });
    } catch (error) {
      console.log('Error picking document', error);
    }
  };

  const handleSend = useCallback(() => {
    if (!input.trim() && !attachment) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Pass initial data to conversation screen
    router.replace({
      pathname: '/tools/studybuddy/chat/conversation',
      params: { 
        initialMessage: input,
        initialAttachmentUri: attachment?.uri,
        initialAttachmentName: attachment?.name,
      },
    });
  }, [input, attachment, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.ui.background }]}
    >
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      {/* Centered Greeting */}
      <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
        <Text style={[styles.greetingTitle, { color: c.text.primary }]}>
          {greeting}, {user?.name || 'User'}
        </Text>
        <Text style={[styles.greetingSubtitle, { color: c.text.secondary }]}>
          What's on your mind?
        </Text>
      </Animated.View>

      {/* Docked Input Component */}
      <Animated.View 
        style={[
          styles.inputWrapper, 
          { 
            opacity: fadeAnim,
            paddingBottom: Math.max(insets.bottom, sp['4']) + TAB_BAR_HEIGHT 
          }
        ]}
      >
        <View style={[styles.inputBox, { borderColor: c.ui.inputBorder }]}>
          
          {/* Attachment Preview (Inside Input Box) */}
          {attachment && (
            <View style={[styles.attachmentPreview, { backgroundColor: c.ui.cardBg }]}>
              <View style={styles.pdfIcon}>
                <Text style={styles.pdfText}>PDF</Text>
              </View>
              <Text style={[styles.attachmentText, { color: c.text.primary }]} numberOfLines={1}>
                {attachment.name}
              </Text>
              <TouchableOpacity onPress={() => setAttachment(null)} hitSlop={10}>
                <Ionicons name="close" size={20} color={c.text.primary} />
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={[styles.input, { color: c.text.primary }]}
            value={input}
            onChangeText={setInput}
            placeholder="Summarize this into key points..."
            placeholderTextColor={c.text.muted}
            multiline
            maxLength={2000}
            textAlignVertical="top"
          />

          <View style={styles.inputToolbar}>
            <View style={styles.toolbarLeft}>
              <TouchableOpacity 
                style={[styles.attachPill, { backgroundColor: c.brand.primary }]}
                onPress={handlePickDocument}
                activeOpacity={0.8}
              >
                <Ionicons name="pin" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
                <Text style={styles.attachPillText}>Attach</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.micCircle, { backgroundColor: c.brand.primary }]}
                activeOpacity={0.8}
              >
                <Ionicons name="happy-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sendCircle,
                { borderColor: c.brand.primary },
                (!input.trim() && !attachment) && { opacity: 0.5 }
              ]}
              onPress={handleSend}
              disabled={!input.trim() && !attachment}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-up" size={20} color={c.brand.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp['6'],
  },
  greetingTitle: {
    ...text.h1,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: sp['2'],
  },
  greetingSubtitle: {
    ...text.bodyLg,
    textAlign: 'center',
  },
  inputWrapper: {
    paddingHorizontal: sp['5'],
    paddingTop: sp['4'],
  },
  inputBox: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: sp['3'],
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp['3'],
    borderRadius: 12,
    marginBottom: sp['3'],
  },
  pdfIcon: {
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: sp['3'],
  },
  pdfText: {
    ...text.caption,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
  },
  attachmentText: {
    flex: 1,
    ...text.bodySm,
    fontWeight: '500',
  },
  input: {
    ...text.bodyLg,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: sp['2'],
    paddingTop: sp['2'],
    marginBottom: sp['4'],
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sp['1'],
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
  },
  attachPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1.5'],
    paddingHorizontal: sp['4'],
    paddingVertical: sp['2.5'],
    borderRadius: 20,
  },
  attachPillText: {
    ...text.buttonSm,
    color: '#FFFFFF',
  },
  micCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});