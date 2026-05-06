import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';

const COLORS = [
  ['#FFF9C4', '#F5F5DC', '#C8E6C9', '#FFCCBC'],
  ['#81D4FA', '#E0F2F1', '#E1BEE7', '#90CAF9'],
  ['#DCEDC8', '#BCAAA4', '#BDBDBD', '#EF9A9A'],
  ['#FFCC80', '#4CAF50', '#E0E0E0', null],
];

interface Props {
  visible: boolean;
  selected: string | null;
  onChange: (color: string | null) => void;
  onClose: () => void;
}

export default function ColorPickerPopover({ visible, selected, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          {COLORS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((color, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.swatch,
                    color ? { backgroundColor: color } : styles.clearSwatch,
                    selected === color && styles.selectedSwatch,
                  ]}
                  onPress={() => {
                    onChange(color);
                    onClose();
                  }}
                >
                  {!color && <Text style={styles.clearText}>⊘</Text>}
                </TouchableOpacity>
              ))}
            </View>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  clearSwatch: {
    borderColor: '#999',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSwatch: {
    borderColor: '#3D7A52',
    borderWidth: 3,
  },
  clearText: {
    fontSize: 20,
    color: '#999',
  },
});
