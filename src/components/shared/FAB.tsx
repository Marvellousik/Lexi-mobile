import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface FABProps {
  onPress: () => void;
  icon?: string;
}

export default function FAB({ onPress, icon = 'add' }: FABProps) {
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 100,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(pressAnim, {
        toValue: 0.90,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: 0,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          bottom: insets.bottom + 90,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { scale: pressAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessible={true}
        accessibilityLabel="Add new item"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name={icon as any} size={28} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: sp['6'],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3D7A52',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D7A52',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 30,
  },
});

import { sp } from '@/constants/spacing';