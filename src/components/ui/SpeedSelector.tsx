import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

interface Props {
  visible: boolean;
  speed: number;
  onChange: (speed: number) => void;
  onClose: () => void;
}

export default function SpeedSelector({ visible, speed, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          {SPEEDS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.option, speed === s && styles.activeOption]}
              onPress={() => { onChange(s); onClose(); }}
            >
              <Text style={[styles.text, speed === s && styles.activeText]}>{s}x</Text>
            </TouchableOpacity>
          ))}
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
    width: 200,
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
