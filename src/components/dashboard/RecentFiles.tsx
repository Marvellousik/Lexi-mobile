import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FILES = [
  { id: '1', name: 'Operating Systems', meta: 'Quiz • 12th March, 2026', color: '#FFEBEE' },
  { id: '2', name: 'The Nature of Man', meta: 'Flashcards • 9th April, 2026', color: '#E1F5FE' },
];

export default function RecentFiles() {
  return (
    <View>
      {FILES.map(file => (
        <View key={file.id} style={styles.item}>
          <View style={[styles.icon, { backgroundColor: file.color }]}>
            <Text style={styles.iconText}>PDF</Text>
          </View>
          <View>
            <Text style={styles.name}>{file.name}</Text>
            <Text style={styles.meta}>{file.meta}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 12, borderRadius: 16, marginBottom: 12 },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  iconText: { fontSize: 10, fontWeight: '800', color: '#666' },
  name: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
});