import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Clipboard,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/hooks/useTheme';
import { useSendChatMessage } from '@/hooks/queries/useChat';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { showToast } from '@/components/ui/Toast';
import { ChatMessage, DocumentResult } from '@/types';

const TAB_BAR_HEIGHT = 70;

export default function ChatConversationScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { initialMessage, initialAttachmentUri, initialAttachmentName } = useLocalSearchParams<{ 
    initialMessage?: string, 
    initialAttachmentUri?: string,
    initialAttachmentName?: string 
  }>();
  
  const scrollRef = useRef<ScrollView>(null);
  const sendMessage = useSendChatMessage();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<DocumentResult | null>(null);

  // Handle immediate dispatch if routed from empty state with data
  useEffect(() => {
    if (initialMessage || initialAttachmentUri) {
      handleDispatch(initialMessage || '', {
        uri: initialAttachmentUri || '',
        name: initialAttachmentName || 'Attached Document',
      } as DocumentResult);
    }
  }, []);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, sendMessage.isPending, scrollToEnd]);

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

  const handleDispatch = (msgText: string, doc: DocumentResult | null) => {
    if (!msgText.trim() && !doc?.uri) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      attachment: doc || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);

    sendMessage.mutate(
      { message: msgText, fileUri: doc?.uri },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: data.messageId,
              role: data.role,
              content: data.content,
            },
          ]);
        },
        onError: () => {
          showToast('Failed to get response. Please try again.', 'error');
        },
      }
    );
  };

  const handleSendPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleDispatch(input, attachment);
    setInput('');
    setAttachment(null);
  }, [input, attachment]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.ui.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
    >
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      <ScrollView
        ref={scrollRef}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingTop: insets.top + sp['6'] },
        ]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {sendMessage.isPending && <TypingIndicator />}
      </ScrollView>

      {/* Docked Input Box - Matching index.tsx exactly */}
      <View 
        style={[
          styles.inputWrapper, 
          { 
            backgroundColor: c.ui.background,
            paddingBottom: Math.max(insets.bottom, sp['4']) + TAB_BAR_HEIGHT 
          }
        ]}
      >
        <View style={[styles.inputBox, { borderColor: c.ui.inputBorder }]}>
          
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
            placeholder="Tell me more..."
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
              onPress={handleSendPress}
              disabled={!input.trim() && !attachment}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-up" size={20} color={c.brand.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const c = useTheme();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={[styles.userBubble, { backgroundColor: c.ui.cardBg }]}>
        <Text style={[styles.userText, { color: c.text.primary }]}>
          {message.content}
        </Text>
      </View>
    );
  }

  // Assistant Message (No background, flush left, formatted text)
  return (
    <View style={styles.assistantBubble}>
      {/* Basic handling to render line breaks cleanly */}
      {message.content.split('\n\n').map((paragraph, idx) => {
        const isHeading = paragraph.length < 40 && !paragraph.includes('.'); // Simplistic heading detection
        return (
          <Text 
            key={idx} 
            style={[
              isHeading ? styles.assistantHeading : styles.assistantText, 
              { color: c.text.primary }
            ]}
          >
            {paragraph}
          </Text>
        );
      })}
    </View>
  );
}

function TypingIndicator() {
  const c = useTheme();
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      )
    );
    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop());
  }, [dots]);

  return (
    <View style={styles.assistantBubble}>
      <View style={styles.typingIndicatorRow}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.typingDot,
              {
                backgroundColor: c.brand.primary,
                opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: sp['5'],
    paddingBottom: sp['6'],
    gap: sp['6'], // generous gap between conversation turns
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: sp['5'],
    paddingVertical: sp['4'],
    maxWidth: '85%',
  },
  userText: {
    ...text.bodyLg,
    lineHeight: 24,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    maxWidth: '95%',
    gap: sp['3'],
  },
  assistantHeading: {
    ...text.h3,
    marginBottom: sp['1'],
  },
  assistantText: {
    ...text.bodyLg,
    lineHeight: 26, // Increased readability for AI responses
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: sp['2'],
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Docked Input Styles (Identical to index.tsx)
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