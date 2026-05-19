import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import type { DashboardTool } from '@/hooks/queries';

// SVG Component Imports
import HeadphoneIcon from '../../../assets/3dicons-headphone-dynamic-color.svg';
import BookIcon from '../../../assets/3dicons-notebook-dynamic-color.svg';
import TargetIcon from '../../../assets/3dicons-target-dynamic-color.svg';
import PencilIcon from '../../../assets/3dicons-pencil-iso-color.svg';

// NEW SVGs (Ensure these exist in your assets folder)
import FlashcardIcon from '../../../assets/flashcard-icon.svg';
import QuizIcon from '../../../assets/quiz-icon.svg';

const { width } = Dimensions.get('window');

const ICON_MAP: Record<string, React.FC<{ width: number; height: number }>> = {
  tts: HeadphoneIcon,
  reading: BookIcon,
  bot: TargetIcon, 
  notes: PencilIcon,
  flashcards: FlashcardIcon, 
  quizzes: QuizIcon,         
};

interface ToolGridProps {
  tools: DashboardTool[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  const router = useRouter();
  const c = useTheme();

  return (
    <View style={styles.grid}>
      {tools.map((tool) => {
        // Fallback to TargetIcon if the ID doesn't match the map
        const Icon = ICON_MAP[tool.id] ?? TargetIcon;
        return (
          <TouchableOpacity
            key={tool.id}
            style={styles.cardWrapper}
            onPress={() => router.push(tool.route as any)}
            activeOpacity={0.9}
          >
            <LinearGradient colors={['#3C8350', '#0D1D12']} style={styles.card}>
              <View style={styles.iconWrapper}>
                <Icon width={90} height={90} />
              </View>
              <Text style={[styles.cardTitle, { color: c.text.inverse }]}>{tool.title}</Text>
              <Text style={styles.cardDesc}>{tool.desc}</Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  cardWrapper: { 
    width: (width - 56) / 2, 
    marginBottom: 20 
  },
  card: {
    height: 190,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: { 
    marginBottom: 10 
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    textAlign: 'center' 
  },
  cardDesc: { 
    fontSize: 10, 
    color: '#A5D6A7', 
    textAlign: 'center', 
    marginTop: 4 
  },
});