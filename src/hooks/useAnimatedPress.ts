import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export const useAnimatedPress = (scaleDown = 0.96, duration = 150) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: scaleDown,
      duration,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, scaleDown, duration]);

  const animateOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const animatedStyle = { transform: [{ scale: scaleAnim }] };

  const handlers = {
    onPressIn: animateIn,
    onPressOut: animateOut,
  };

  return { animatedStyle, handlers, scaleAnim };
};
