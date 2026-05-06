import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

// Global toast state manager (simple pub/sub pattern)
let toastListeners: ((toast: ToastItem) => void)[] = [];

export function showToast(message: string, type: ToastType = 'info') {
  const toast: ToastItem = {
    id: Math.random().toString(36).substring(7),
    message,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const listener = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2500);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          toast={toast}
          index={index}
          bottomOffset={insets.bottom + 100 + index * 64}
        />
      ))}
    </>
  );
}

function Toast({
  toast,
  index,
  bottomOffset,
}: {
  toast: ToastItem;
  index: number;
  bottomOffset: number;
}) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const dismissTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2200);

    return () => clearTimeout(dismissTimer);
  }, []);

  const iconName =
    toast.type === 'success'
      ? 'checkmark-circle'
      : toast.type === 'error'
      ? 'close-circle'
      : 'information-circle';
  const iconColor =
    toast.type === 'success'
      ? '#22C55E'
      : toast.type === 'error'
      ? '#EF4444'
      : '#3B82F6';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: bottomOffset,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.toast}
        activeOpacity={0.9}
        onPress={() => {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 80,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }}
      >
        <Ionicons name={iconName as any} size={18} color={iconColor} />
        <Text style={styles.message}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: sp['6'],
    right: sp['6'],
    zIndex: 999,
  },
  toast: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  message: {
    ...text.body,
    color: '#FFFFFF',
    flex: 1,
  },
});
