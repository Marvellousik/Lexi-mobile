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

export function UploadZone({ onFilePicked }: UploadZoneProps) {
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
            borderColor: '#6B9E7C',
            backgroundColor: '#EAF4EE',
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
        <View style={[styles.iconCircle, { backgroundColor: '#3D7A52' }]}>
          <Ionicons name="cloud-upload" size={28} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: '#3D7A52' }]}>
          Click to upload or drag and drop
        </Text>
        <Text style={[styles.subtitle, { color: '#888888' }]}>
          PDF, DOC, TXT, image (Size maximum)
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
    borderRadius: 24,
    paddingVertical: sp['12'],
    paddingHorizontal: sp['6'],
    alignItems: 'center',
    gap: sp['4'],
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['2'],
  },
  title: {
    ...(text.h4 as any),
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    ...(text.bodySm as any),
    textAlign: 'center',
    marginTop: -sp['2'],
  },
});
