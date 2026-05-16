import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { RecentFile } from '@/hooks/queries';

interface RecentFilesProps {
  files: RecentFile[];
}

export default function RecentFiles({ files }: RecentFilesProps) {
  const c = useTheme();
  return (
    <View>
      {files.map((file) => (
        <View key={file.id} style={[styles.item, { backgroundColor: c.ui.cardBg }]}>
          <View style={[styles.icon, { backgroundColor: file.color }]}>
            <Text style={[styles.iconText, { color: c.text.muted }]}>PDF</Text>
          </View>
          <View>
            <Text style={[styles.name, { color: c.text.primary }]}>{file.name}</Text>
            <Text style={[styles.meta, { color: c.text.muted }]}>{file.meta}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: { fontSize: 10, fontWeight: '800' },
  name: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 2 },
});
