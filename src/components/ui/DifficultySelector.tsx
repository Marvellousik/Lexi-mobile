import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ScrollView } from 'react-native';

interface Props {
  visible: boolean;
  level: 'simplified' | 'beginner' | 'intermediate';
  onChange: (level: 'simplified' | 'beginner' | 'intermediate') => void;
  onClose: () => void;
}

export default function DifficultySelector({ visible, level, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {(['simplified', 'beginner', 'intermediate'] as const).map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.option, level === l && styles.activeOption]}
                onPress={() => { onChange(l); onClose(); }}
              >
                <Text style={[styles.text, level === l && styles.activeText]}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  activeOption: {
    backgroundColor: '#3D7A52',
  },
  text: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
