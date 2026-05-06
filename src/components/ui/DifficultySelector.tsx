import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';

interface Props {
  visible: boolean;
  level: 'beginner' | 'intermediate';
  onChange: (level: 'beginner' | 'intermediate') => void;
  onClose: () => void;
}

export default function DifficultySelector({ visible, level, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.option, level === 'beginner' && styles.activeOption]}
            onPress={() => { onChange('beginner'); onClose(); }}
          >
            <Text style={[styles.text, level === 'beginner' && styles.activeText]}>Beginner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, level === 'intermediate' && styles.activeOption]}
            onPress={() => { onChange('intermediate'); onClose(); }}
          >
            <Text style={[styles.text, level === 'intermediate' && styles.activeText]}>Intermediate</Text>
          </TouchableOpacity>
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
    borderRadius: 16,
    padding: 8,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  option: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: '#3D7A52',
  },
  text: {
    fontSize: 15,
    color: '#555',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
