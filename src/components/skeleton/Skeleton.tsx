import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Base Skeleton — Theme-Aware with Shimmer
 *
 * Uses a translateX animation to create a shimmer wave effect.
 * Color automatically adapts to light/dark mode.
 */
export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const c = useTheme();
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const bgColor = c.isDark ? '#333333' : '#E5E5E5';
  const shimmerColor = c.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)';

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: bgColor,
          overflow: 'hidden',
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: shimmerColor,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Base shimmer container
  },
  shimmer: {
    width: '40%',
    height: '100%',
    opacity: 0.3,
  },
});

// ─── ATOMIC SKELETON PRIMITIVES ───

export function SkeletonCircle({ size = 48 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonLine({ width = '100%', height = 16 }: { width?: number | string; height?: number }) {
  return <Skeleton width={width} height={height} borderRadius={height / 2} />;
}

export function SkeletonText({ lines = 3, lineHeight = 16, lastLineWidth = '60%' }: {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: number | string;
}) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          borderRadius={lineHeight / 2}
        />
      ))}
    </View>
  );
}

export function SkeletonRow({ iconSize = 44, lines = 2, lineHeight = 14 }: {
  iconSize?: number;
  lines?: number;
  lineHeight?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <SkeletonCircle size={iconSize} />
      <View style={{ flex: 1, gap: 8 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === 0 ? '70%' : '40%'}
            height={lineHeight}
            borderRadius={lineHeight / 2}
          />
        ))}
      </View>
    </View>
  );
}

export function SkeletonCard({ height = 130, children }: { height?: number; children?: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Skeleton width="100%" height={height} borderRadius={16}>
        {children}
      </Skeleton>
    </View>
  );
}

export function SkeletonButton({ width = '100%', height = 54 }: { width?: number | string; height?: number }) {
  return <Skeleton width={width} height={height} borderRadius={14} style={{ marginBottom: 16 }} />;
}

export function SkeletonInput({ width = '100%', height = 54 }: { width?: number | string; height?: number }) {
  return <Skeleton width={width} height={height} borderRadius={12} style={{ marginBottom: 16 }} />;
}

// ─── PAGE-LEVEL SKELETON LAYOUTS ───

export function DashboardSkeleton() {
  return (
    <View style={{ gap: 12 }}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ gap: 8 }}>
          <SkeletonLine width={100} height={16} />
          <SkeletonLine width={180} height={28} />
        </View>
        <SkeletonCircle size={50} />
      </View>
      {/* Feedback banner */}
      <SkeletonCard height={100} />
      {/* Tool grid - 2x2 */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
        <Skeleton width="48%" height={190} borderRadius={24} />
        <Skeleton width="48%" height={190} borderRadius={24} />
        <Skeleton width="48%" height={190} borderRadius={24} />
        <Skeleton width="48%" height={190} borderRadius={24} />
      </View>
      {/* Recent files */}
      <SkeletonLine width={140} height={20} />
      <SkeletonRow iconSize={44} lines={2} />
      <SkeletonRow iconSize={44} lines={2} />
    </View>
  );
}

export function HistorySkeleton() {
  return (
    <View style={{ gap: 8, marginTop: 24 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonRow key={i} iconSize={36} lines={2} lineHeight={14} />
      ))}
    </View>
  );
}

export function ChatConversationSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 16, paddingTop: 16 }}>
      {/* Assistant message */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonCircle size={28} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonText lines={3} lineHeight={14} lastLineWidth="40%" />
        </View>
      </View>
      {/* User message */}
      <View style={{ alignItems: 'flex-end' }}>
        <Skeleton width="75%" height={60} borderRadius={18} />
      </View>
      {/* Assistant message */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonCircle size={28} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonText lines={4} lineHeight={14} lastLineWidth="30%" />
        </View>
      </View>
    </View>
  );
}

export function QuizSessionSkeleton() {
  return (
    <View style={{ gap: 12, paddingHorizontal: 24, paddingTop: 24 }}>
      <SkeletonLine width={120} height={34} />
      <SkeletonLine width={180} height={24} />
      <View style={{ height: 16 }} />
      {/* Progress bar */}
      <SkeletonLine width={80} height={14} />
      <Skeleton width="100%" height={4} borderRadius={2} />
      <View style={{ height: 16 }} />
      {/* Question */}
      <SkeletonText lines={2} lineHeight={18} lastLineWidth="80%" />
      <View style={{ height: 8 }} />
      {/* Options */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} width="100%" height={56} borderRadius={12} />
      ))}
      <View style={{ height: 20 }} />
      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonButton width="48%" />
        <SkeletonButton width="48%" />
      </View>
    </View>
  );
}

export function FlashcardSkeleton() {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' }}>
      <SkeletonLine width={60} height={16} />
      <View style={{ height: 40 }} />
      <Skeleton width="100%" height={300} borderRadius={24} />
      <View style={{ height: 40 }} />
      <View style={{ flexDirection: 'row', gap: 48 }}>
        <SkeletonCircle size={44} />
        <SkeletonCircle size={44} />
      </View>
    </View>
  );
}

export function ReadingReaderSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 24, paddingTop: 24 }}>
      <SkeletonLine width={200} height={34} />
      <Skeleton width={140} height={32} borderRadius={16} />
      <View style={{ height: 8 }} />
      {/* Reader card */}
      <Skeleton width="100%" height={400} borderRadius={16} />
      <View style={{ height: 8 }} />
      {/* Word definition card */}
      <Skeleton width="100%" height={180} borderRadius={16} />
    </View>
  );
}

export function TtsPlayerSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 24, paddingTop: 24 }}>
      <SkeletonLine width={180} height={34} />
      <View style={{ height: 8 }} />
      {/* Player card */}
      <Skeleton width="100%" height={320} borderRadius={16} />
      <View style={{ height: 8 }} />
      <SkeletonButton />
    </View>
  );
}

export function WritingAssistantSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 24, paddingTop: 24 }}>
      <SkeletonLine width={200} height={34} />
      <View style={{ height: 8 }} />
      {/* Main card */}
      <Skeleton width="100%" height={400} borderRadius={32} />
      <View style={{ height: 8 }} />
      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonButton width="48%" />
        <SkeletonButton width="48%" />
      </View>
      <View style={{ height: 8 }} />
      {/* Mic control */}
      <View style={{ alignItems: 'center' }}>
        <SkeletonCircle size={100} />
      </View>
    </View>
  );
}

export function SettingsSkeleton() {
  return (
    <View style={{ gap: 12, paddingHorizontal: 24, paddingTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SkeletonCircle size={28} />
        <SkeletonLine width={120} height={28} />
        <View style={{ width: 28 }} />
      </View>
      <View style={{ height: 24 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonRow key={i} iconSize={36} lines={1} lineHeight={16} />
      ))}
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 24, paddingTop: 24, alignItems: 'center' }}>
      <SkeletonCircle size={80} />
      <SkeletonLine width={160} height={24} />
      <SkeletonLine width={200} height={16} />
      <View style={{ height: 24 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} width="100%" height={56} borderRadius={12} />
      ))}
      <View style={{ height: 24 }} />
      <SkeletonButton />
    </View>
  );
}

export function StudyBuddyIndexSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 24, paddingTop: 24 }}>
      <SkeletonText lines={2} lineHeight={20} lastLineWidth="50%" />
      <View style={{ height: 8 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} width="100%" height={120} borderRadius={16} />
      ))}
    </View>
  );
}
