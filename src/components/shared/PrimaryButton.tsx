import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAnimatedPress } from '@/hooks/useAnimatedPress';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'pill'; // pill for auth screens
  icon?: React.ReactNode;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'default',
  icon,
}: PrimaryButtonProps) {
  const { animatedStyle, handlers } = useAnimatedPress(0.985, 100);

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
          variant === 'pill' && styles.pill,
          (loading || disabled) && styles.disabled,
        ]}
        onPress={handlePress}
        activeOpacity={0.88}
        disabled={loading || disabled}
        accessible={true}
        accessibilityLabel={label}
        accessibilityRole="button"
        {...handlers}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, icon ? styles.textWithIcon : null]}>{label}</Text>
          </>
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
    backgroundColor: '#3D7A52',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sp['6'],
    flexDirection: 'row',
    gap: sp['2'],
    shadowColor: '#3D7A52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  pill: {
    borderRadius: 50,
    height: 52,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...text.button,
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  textWithIcon: {
    marginLeft: sp['1.5'],
  },
});
