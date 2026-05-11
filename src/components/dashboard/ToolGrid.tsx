import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// SVG Component Imports
import HeadphoneIcon from '../../../assets/3dicons-headphone-dynamic-color.svg';
import BookIcon from '../../../assets/3dicons-notebook-dynamic-color.svg';
import TargetIcon from '../../../assets/3dicons-target-dynamic-color.svg';
import PencilIcon from '../../../assets/3dicons-pencil-iso-color.svg';

const { width } = Dimensions.get('window');

const TOOLS = [
  { id: 'tts', title: 'Text to Speech', desc: 'Listen to notes', Icon: HeadphoneIcon, route: '/tools/tts' },
  { id: 'reading', title: 'Reading Assistant', desc: 'Simplify words', Icon: BookIcon, route: '/tools/reading' },
  { id: 'buddy', title: 'Study Buddy', desc: 'Upload notes', Icon: TargetIcon, route: '/tools/studybuddy' },
  { id: 'notes', title: 'Note Taker', desc: 'Voice to text', Icon: PencilIcon, route: '/tools/writing' }
] as const;

export function ToolGrid() {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {TOOLS.map((tool) => (
        <TouchableOpacity 
          key={tool.id} 
          style={styles.cardWrapper}
          onPress={() => router.push(tool.route as any)}
        >
          <LinearGradient colors={['#3C8350', '#0D1D12']} style={styles.card}>
            <View style={styles.iconWrapper}>
              {/* Size reset to a standard balanced scale */}
              <tool.Icon width={90} height={90} />
            </View>
            <Text style={styles.cardTitle}>{tool.title}</Text>
            <Text style={styles.cardDesc}>{tool.desc}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrapper: { width: (width - 56) / 2, marginBottom: 20 },
  card: {
    height: 190, 
    borderRadius: 24,
    padding: 16,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconWrapper: { 
    marginBottom: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  cardDesc: { fontSize: 10, color: '#A5D6A7', textAlign: 'center', marginTop: 4 },
});