import React, { useState, useRef, useEffect } from 'react';
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
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { showToast } from '@/components/ui/Toast';
import { ChatMessage, DocumentResult } from '@/types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Explain empiricism in philosophy in simple terms.',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      '**Empiricism**\n\nEmpiricism is a philosophical theory that states knowledge comes primarily from sensory experience. In other words, we learn about the world by observing it through our five senses.\n\nKey points:\n• All ideas originate from experience\n• The mind is a "blank slate" at birth\n• Scientific observation is the best way to gain knowledge',
  },
];

export default function ChatConversationScreen() {
  const c = useTheme();
  const { message } = useLocalSearchParams<{ message?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState(message || '');
  const [attachment, setAttachment] = useState<DocumentResult | null>(null);
  const [focused, setFocused] = useState(false);
  const sendOpacity = useRef(new Animated.Value(input.trim() ? 1 : 0)).current;
  const sendScale = useRef(new Animated.Value(input.trim() ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sendOpacity, {
        toValue: input.trim() ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(sendScale, {
        toValue: input.trim() ? 1 : 0.7,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [input]);

  useEffect(() => {
    if (message) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: message },
      ]);
    }
  }, [message]);

  const handleSend = () => {
    if (!input.trim() && !attachment) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      attachment: attachment || undefined,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setAttachment(null);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Here is a summary of the key points from your document:\n\n1. The Beer Hall Putsch was a failed coup attempt\n2. Hitler was imprisoned and wrote Mein Kampf\n3. The Nazi party gained power through democratic means',
        },
      ]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.ui.background }]}
    >
      <StatusBar style={c.isDark ? 'light' : 'dark'} />
      <Sidebar />
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageRow, msg.role === 'user' && styles.userRow]}
          >
            {msg.role === 'user' ? (
              <View style={styles.userBubble}>
                {msg.attachment && (
                  <View style={styles.attachmentPreview}>
                    <Ionicons name="document-text" size={16} color="#3D7A52" />
                    <Text style={styles.attachmentText} numberOfLines={1}>
                      {msg.attachment.name}
                    </Text>
                    <View style={styles.pdfBadge}>
                      <Text style={styles.pdfBadgeText}>PDF</Text>
                    </View>
                  </View>
                )}
                <Text style={styles.userText}>{msg.content}</Text>
              </View>
            ) : (
              <View style={styles.aiMessage}>
                <Text style={[styles.aiText, { color: c.text.primary }]}>
                  {msg.content}
                </Text>
                <View style={styles.aiActions}>
                  <TouchableOpacity
                    onPress={() => showToast('Copied to clipboard', 'success')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessible={true}
                    accessibilityLabel="Copy response"
                    accessibilityRole="button"
                  >
                    <Ionicons name="copy-outline" size={20} color="#AAAAAA" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessible={true}
                    accessibilityLabel="Regenerate response"
                    accessibilityRole="button"
                  >
                    <Ionicons name="refresh" size={20} color="#AAAAAA" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.inputBar,
          {
            borderColor: focused ? c.brand.primary : c.ui.inputBorder,
            backgroundColor: focused ? '#FFFFFF' : '#FAFAFA',
            shadowColor: focused ? c.brand.primary : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: focused ? 0.1 : 0,
            shadowRadius: focused ? 8 : 0,
            elevation: focused ? 2 : 0,
          },
        ]}
      >
        {attachment && (
          <View style={[styles.attachmentPreview, { backgroundColor: c.ui.cardBg }]}>
            <Ionicons name="document-text" size={16} color="#3D7A52" />
            <Text style={[styles.attachmentText, { color: c.text.primary }]} numberOfLines={1}>
              {attachment.name}
            </Text>
            <View style={styles.pdfBadge}>
              <Text style={styles.pdfBadgeText}>PDF</Text>
            </View>
            <TouchableOpacity onPress={() => setAttachment(null)}>
              <Ionicons name="close" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={[styles.input, { color: c.text.primary }]}
          value={input}
          onChangeText={setInput}
          placeholder="Tell me more"
          placeholderTextColor="#888"
          multiline
          textAlignVertical="top"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessible={true}
          accessibilityLabel="Message input"
        />
        <View style={styles.inputActions}>
          <TouchableOpacity
            style={[styles.attachButton, { backgroundColor: c.brand.primary }]}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Attach file"
            accessibilityRole="button"
          >
            <Ionicons name="attach" size={14} color="#FFFFFF" />
            <Text style={styles.attachText}>Attach</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.micButton, { backgroundColor: c.brand.primary }]}
            activeOpacity={0.88}
            accessible={true}
            accessibilityLabel="Voice input"
            accessibilityRole="button"
          >
            <Ionicons name="mic" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <Animated.View
            style={[
              { opacity: sendOpacity, transform: [{ scale: sendScale }] },
              !input.trim() && { position: 'absolute', right: -100 },
            ]}
          >
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.88}
              accessible={true}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-up" size={16} color="#3D7A52" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { flex: 1 },
  messagesContent: { padding: sp['4'], paddingBottom: sp['2'] },
  messageRow: { marginBottom: sp['4'] },
  userRow: { alignItems: 'flex-end' },
  userBubble: {
    backgroundColor: '#3D7A52',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: sp['4'],
    paddingVertical: sp['2.5'],
    maxWidth: '82%',
    alignSelf: 'flex-end',
  },
  userText: { ...text.body, color: '#FFFFFF', lineHeight: 22 },
  aiMessage: { maxWidth: '92%' },
  aiText: { ...text.body, lineHeight: 22 },
  aiActions: {
    flexDirection: 'row',
    gap: sp['4'],
    marginTop: sp['3'],
  },
  inputBar: {
    borderTopWidth: 1.5,
    borderRadius: 16,
    padding: sp['4'],
    paddingBottom: Platform.OS === 'ios' ? sp['4'] : sp['3'],
    marginHorizontal: sp['4'],
    marginBottom: sp['3'],
  },
  input: {
    ...text.body,
    minHeight: 44,
    maxHeight: 120,
    textAlignVertical: 'top',
    marginBottom: sp['2'],
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['1.5'],
    paddingHorizontal: sp['3'],
    paddingVertical: sp['1.5'],
    borderRadius: 20,
  },
  attachText: { color: '#FFFFFF', ...text.buttonSm },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#3D7A52',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    padding: sp['2'],
    borderRadius: 8,
    marginBottom: sp['2'],
  },
  attachmentText: { flex: 1, ...text.bodySm },
  pdfBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: sp['1.5'],
    paddingVertical: sp['0.5'],
    borderRadius: 4,
  },
  pdfBadgeText: { color: '#FFFFFF', ...text.caption, fontWeight: '700' },
});
