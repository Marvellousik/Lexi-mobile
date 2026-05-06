import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onDownload: () => void;
  onExportGoogle: () => void;
  onClose: () => void;
}

export default function ExportOptionsSheet({ visible, onDownload, onExportGoogle, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.row} onPress={() => { onDownload(); onClose(); }}>
            <View style={[styles.iconBox, { backgroundColor: '#2B579A' }]}>
              <Text style={styles.iconText}>W</Text>
            </View>
            <Text style={styles.rowText}>Download as docx</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => { onExportGoogle(); onClose(); }}>
            <View style={[styles.iconBox, { backgroundColor: '#4285F4' }]}>
              <Ionicons name="logo-google" size={18} color="#FFF" />
            </View>
            <Text style={styles.rowText}>Export to Google docx</Text>
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
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  rowText: {
    fontSize: 15,
    color: '#111',
  },
});
