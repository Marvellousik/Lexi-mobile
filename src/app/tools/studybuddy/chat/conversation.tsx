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
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useSendChatMessage } from '@/hooks/queries/useChat';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';
import { showToast } from '@/components/ui/Toast';
import { ChatMessage, DocumentResult } from '@/types';
import { ChatConversationSkeleton } from '@/components/skeleton/Skeleton';
import * as Haptics from 'expo-haptics';

const TAB_BAR_HEIGHT = 70;

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your AI study assistant. I can help you summarize texts, create flashcards, generate quizzes, or explain complex topics. What would you like to learn today?",
  },
];

export default function ChatConversationScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { message } = useLocalSearchParams<{ message?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const sendMessage = useSendChatMessage();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState(message || '');
  const [attachment, setAttachment] = useState<DocumentResult | null>(null);
  const [focused, setFocused] = useState(false);

  const sendOpacity = useRef(new Animated.Value(0)).current;
  const sendScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sendOpacity, {
        toValue: input.trim() ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(sendScale, {
        toValue: input.trim() ? 1 : 0.8,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [input, sendOpacity, sendScale]);

  // Handle initial message from empty-state screen
  useEffect(() => {
    if (message) {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
      };
      setMessages((prev) => [...prev, userMsg]);
      sendMessage.mutate(
        { message },
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
    }
  }, [message]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, sendMessage.isPending, scrollToEnd]);

  const handleFocus = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => setFocused(false), []);
  const handleChangeText = useCallback((text: string) => setInput(text), []);
  const handleClearAttachment = useCallback(() => {
    setAttachment(null);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() && !attachment) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      attachment: attachment || undefined,
    };

    const msgToSend = input.trim();
    const fileUri = attachment?.uri;

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachment(null);

    sendMessage.mutate(
      { message: msgToSend, fileUri },
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
  }, [input, attachment, sendMessage]);

  const inputBorderColor = focused ? c.brand.primary : c.ui.inputBorder;
  const inputBgColor = focused ? c.ui.background : c.ui.cardBg;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.ui.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
    >
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + sp['4'] },
        ]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
      >
        <View style={styles.messagesList}>
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isFirst={index === 0}
              isLast={index === messages.length - 1}
            />
          ))}

          {sendMessage.isPending && <TypingIndicator />}
        </View>
      </ScrollView>

      {/* Input Bar */}
      <View
        style={[
          styles.inputContainer,
          {
            borderTopColor: c.ui.divider,
            backgroundColor: c.ui.background,
            paddingBottom: Math.max(insets.bottom, sp['4']) + TAB_BAR_HEIGHT,
          },
        ]}
      >
        <View
          style={[
            styles.inputBar,
            {
              borderColor: inputBorderColor,
              backgroundColor: inputBgColor,
            },
          ]}
        >
          {attachment && (
            <View
              style={[
                styles.attachmentPreview,
                {
                  backgroundColor: c.ui.cardBg,
                  borderColor: c.ui.inputBorder,
                },
              ]}
            >
              <Ionicons name="document-text" size={16} color={c.brand.primary} />
              <Text
                style={[styles.attachmentText, { color: c.text.primary }]}
                numberOfLines={1}
              >
                {attachment.name}
              </Text>
              <TouchableOpacity onPress={handleClearAttachment}>
                <Ionicons name="close-circle" size={18} color={c.text.muted} />
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={[styles.input, { color: c.text.primary }]}
            value={input}
            onChangeText={handleChangeText}
            placeholder="Message your AI assistant..."
            placeholderTextColor={c.text.muted}
            multiline
            textAlignVertical="top"
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessible={true}
            accessibilityLabel="Message input"
          />

          <View style={styles.inputToolbar}>
            <View style={styles.toolbarLeft}>
              <TouchableOpacity
                style={[styles.toolbarButton, { backgroundColor: c.ui.cardBg }]}
                activeOpacity={0.7}
              >
                <Ionicons name="attach" size={18} color={c.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toolbarButton, { backgroundColor: c.ui.cardBg }]}
                activeOpacity={0.7}
              >
                <Ionicons name="mic" size={18} color={c.text.secondary} />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                opacity: sendOpacity,
                transform: [{ scale: sendScale }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: c.brand.primary },
                ]}
                onPress={handleSend}
                activeOpacity={0.8}
                disabled={!input.trim() && !attachment}
              >
                <Ionicons name="arrow-up" size={20} color={c.text.inverse} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({
  message,
  isFirst,
  isLast,
}: {
  message: ChatMessage;
  isFirst: boolean;
  isLast: boolean;
}) {
  const c = useTheme();
  const isUser = message.role === 'user';

  const handleCopy = useCallback(() => {
    Clipboard.setString(message.content);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Copied to clipboard', 'success');
  }, [message.content]);

  const handleRegenerate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast('Regenerating response...', 'info');
  }, []);

  return (
    <View
      style={[
        styles.messageRow,
        isFirst && styles.messageRowFirst,
        isLast && styles.messageRowLast,
      ]}
    >
      {!isUser && (
        <View
          style={[
            styles.avatar,
            { backgroundColor: c.brand.primaryLight },
          ]}
        >
          <Ionicons name="leaf" size={16} color={c.brand.primary} />
        </View>
      )}

      <View
        style={[
          styles.messageContent,
          isUser && styles.messageContentUser,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isUser
              ? [
                  styles.bubbleUser,
                  { backgroundColor: c.brand.primary },
                ]
              : [
                  styles.bubbleAssistant,
                  {
                    backgroundColor: c.ui.cardBg,
                    borderColor: c.ui.inputBorder,
                  },
                ],
          ]}
        >
          {message.attachment && (
            <View
              style={[
                styles.attachmentBadge,
                {
                  backgroundColor: isUser
                    ? 'rgba(255,255,255,0.2)'
                    : c.ui.inputBorder,
                },
              ]}
            >
              <Ionicons
                name="document-text"
                size={14}
                color={isUser ? c.text.inverse : c.brand.primary}
              />
              <Text
                style={[
                  styles.attachmentBadgeText,
                  { color: isUser ? c.text.inverse : c.text.primary },
                ]}
              >
                {message.attachment.name}
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.messageText,
              {
                color: isUser ? c.text.inverse : c.text.primary,
              },
            ]}
          >
            {message.content}
          </Text>
        </View>

        {!isUser && (
          <View style={styles.messageActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCopy}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="copy-outline" size={16} color={c.text.muted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRegenerate}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="refresh" size={16} color={c.text.muted} />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop());
  }, [dots]);

  return (
    <View style={styles.typingRow}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: c.brand.primaryLight },
        ]}
      >
        <Ionicons name="leaf" size={16} color={c.brand.primary} />
      </View>

      <View
        style={[
          styles.typingBubble,
          {
            backgroundColor: c.ui.cardBg,
            borderColor: c.ui.inputBorder,
          },
        ]}
      >
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.typingDot,
              {
                backgroundColor: c.text.muted,
                opacity: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { flex: 1 },
  messagesContent: {
    paddingTop: sp['4'],
    paddingHorizontal: sp['4'],
  },
  messagesList: {
    gap: sp['4'],
  },
  messageRow: {
    flexDirection: 'row',
    gap: sp['3'],
    alignItems: 'flex-start',
  },
  messageRowFirst: {
    marginTop: sp['2'],
  },
  messageRowLast: {
    marginBottom: sp['2'],
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp['1'],
  },
  messageContent: {
    flex: 1,
    gap: sp['2'],
  },
  messageContentUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: sp['4'],
    paddingVertical: sp['3'],
    maxWidth: '92%',
    borderWidth: 1,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
    borderWidth: 0,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...text.body,
    lineHeight: 22,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    paddingHorizontal: sp['3'],
    paddingVertical: sp['2'],
    borderRadius: 8,
    marginBottom: sp['2'],
    alignSelf: 'flex-start',
  },
  attachmentBadgeText: {
    ...text.bodySm,
    fontWeight: '500',
  },
  messageActions: {
    flexDirection: 'row',
    gap: sp['2'],
    marginLeft: sp['1'],
  },
  actionButton: {
    padding: sp['2'],
    borderRadius: 8,
  },
  typingRow: {
    flexDirection: 'row',
    gap: sp['3'],
    alignItems: 'flex-start',
    marginBottom: sp['2'],
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    paddingHorizontal: sp['4'],
    paddingVertical: sp['3'],
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: sp['4'],
    paddingTop: sp['3'],
  },
  inputBar: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: sp['3'],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    padding: sp['2'],
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: sp['2'],
  },
  attachmentText: {
    flex: 1,
    ...text.bodySm,
  },
  input: {
    ...text.body,
    minHeight: 40,
    textAlignVertical: 'top',
    marginBottom: sp['2'],
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: sp['2'],
  },
  toolbarButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
