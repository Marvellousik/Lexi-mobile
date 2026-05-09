import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';

interface Props {
  visible: boolean;
  mode: 'letter' | 'word' | 'line';
  onChange: (mode: 'letter' | 'word' | 'line') => void;
  onClose: () => void;
}

export default function ReadingModeSelector({ visible, mode, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.option, mode === 'letter' && styles.activeOption]}
            onPress={() => { onChange('letter'); onClose(); }}
          >
            <Text style={[styles.text, mode === 'letter' && styles.activeText]}>Letter by Letter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, mode === 'word' && styles.activeOption]}
            onPress={() => { onChange('word'); onClose(); }}
          >
            <Text style={[styles.text, mode === 'word' && styles.activeText]}>Word by Word</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, mode === 'line' && styles.activeOption]}
            onPress={() => { onChange('line'); onClose(); }}
          >
            <Text style={[styles.text, mode === 'line' && styles.activeText]}>Line by Line</Text>
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
