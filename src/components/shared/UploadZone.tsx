import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

interface UploadZoneProps {
  onFilePicked: (file: { uri: string; name: string; mimeType: string }) => void;
}

export default function UploadZone({ onFilePicked }: UploadZoneProps) {
  const c = useTheme();
  const { animatedStyle, handlers } = useAnimatedPress(0.97, 120);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'text/plain', 'image/*'],
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      onFilePicked({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType || 'application/octet-stream',
      });
    }
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            borderColor: c.brand.primary,
            backgroundColor: c.brand.primaryLight,
          },
        ]}
        onPress={pickFile}
        activeOpacity={0.9}
        accessible={true}
        accessibilityLabel="Upload document"
        accessibilityHint="Tap to browse PDF, Word, or image files"
        accessibilityRole="button"
        {...handlers}
      >
        <View style={[styles.iconCircle, { backgroundColor: c.brand.primary }]}>
          <Ionicons name="cloud-upload-outline" size={24} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: c.brand.primary }]}>
          Click to upload or drag and drop
        </Text>
        <Text style={[styles.subtitle, { color: c.text.muted }]}>
          PDF, DOC, TXT, image (Size maximun)
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: sp['8'],
    paddingHorizontal: sp['6'],
    alignItems: 'center',
    gap: sp['2.5'],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...(text.h4 as any),
    textAlign: 'center',
  },
  subtitle: {
    ...(text.bodySm as any),
    textAlign: 'center',
  },
});
