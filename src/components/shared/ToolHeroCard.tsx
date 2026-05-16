import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

interface ToolHeroCardProps {
  title: string;
  description: string;
  backgroundColor: string;
  icon: string;
  onPress: () => void;
}

export default function ToolHeroCard({
  title,
  description,
  backgroundColor,
  icon,
  onPress,
}: ToolHeroCardProps) {
  const c = useTheme();
  const { animatedStyle, handlers } = useAnimatedPress(0.97, 120);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.95}
        accessible={true}
        accessibilityLabel={title}
        accessibilityHint={description}
        accessibilityRole="button"
        {...handlers}
      >
        <View style={styles.iconBox}>
          <Ionicons name={icon as any} size={40} color={c.brand.primary} />
        </View>
        <View style={styles.textBox}>
          <Text style={[styles.title, { color: c.text.primary }]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={[styles.description, { color: c.text.secondary }]} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: sp['3'],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    height: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: '35%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
    paddingVertical: sp['5'],
    paddingRight: sp['4'],
    paddingLeft: sp['2'],
  },
  title: {
    ...text.h4,
    marginBottom: sp['1'],
  },
  description: {
    ...text.caption,
    lineHeight: 20,
    opacity: 0.82,
  },
});