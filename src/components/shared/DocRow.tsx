import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

interface DocRowProps {
  filename: string;
  fileType: string;
  onDismiss: () => void;
}

export function DocRow({ filename, fileType, onDismiss }: DocRowProps) {
  const c = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: c.ui.cardBg },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(61,122,82,0.12)' }]}>
        <Ionicons name="document-text" size={20} color={c.brand.primary} />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.filename, { color: c.text.primary }]} numberOfLines={1}>
          {filename}
        </Text>
        <Text style={[styles.fileType, { color: c.text.muted }]}>{fileType}</Text>
      </View>
      <TouchableOpacity
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessible={true}
        accessibilityLabel={`Remove ${filename}`}
        accessibilityRole="button"
        style={styles.dismissBtn}
      >
        <Ionicons name="close" size={18} color={c.text.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sp['4'],
    borderRadius: 12,
    marginBottom: sp['4'],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    marginLeft: sp['3'],
  },
  filename: {
    ...text.body,
    fontWeight: '600',
  },
  fileType: {
    ...text.caption,
    marginTop: sp['0.5'],
  },
  dismissBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});