import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

interface OutlineButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function OutlineButton({
  label,
  onPress,
  loading = false,
  disabled = false,
}: OutlineButtonProps) {
  const c = useTheme();
  const [pressed, setPressed] = useState(false);
  const { animatedStyle, handlers } = useAnimatedPress(0.98, 100);

  const handlePress = () => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          (loading || disabled) && styles.disabled,
          pressed && { backgroundColor: c.brand.primary + '0F' },
          {
            borderColor: c.brand.primary,
          },
        ]}
        onPress={handlePress}
        activeOpacity={1}
        disabled={loading || disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessible={true}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color={c.brand.primary} size="small" />
        ) : (
          <Text style={[styles.text, { color: c.brand.primary }]}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  button: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp['6'],
  },

  disabled: {
    opacity: 0.5,
  },
  text: {
    ...text.button,
  },
});