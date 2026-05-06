import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

// Preset skeleton layouts for common patterns
export function SkeletonHeroCard() {
  return <Skeleton height={130} borderRadius={16} style={{ marginBottom: 12 }} />;
}

export function SkeletonToolCard() {
  return <Skeleton height={130} borderRadius={16} style={{ marginBottom: 12 }} />;
}

export function SkeletonRecentRow() {
  return <Skeleton height={72} borderRadius={12} style={{ marginBottom: 8 }} />;
}

export function SkeletonUploadZone() {
  return <Skeleton height={160} borderRadius={16} style={{ marginBottom: 16 }} />;
}

export function SkeletonInput() {
  return <Skeleton height={54} borderRadius={12} style={{ marginBottom: 16 }} />;
}

export function SkeletonButton() {
  return <Skeleton height={54} borderRadius={14} style={{ marginBottom: 16 }} />;
}

export function DashboardSkeleton() {
  return (
    <View style={{ gap: 12 }}>
      <SkeletonHeroCard />
      <SkeletonToolCard />
      <SkeletonToolCard />
      <SkeletonToolCard />
      <SkeletonRecentRow />
      <SkeletonRecentRow />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E5E5',
  },
});
