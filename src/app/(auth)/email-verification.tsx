import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setCountdown(60);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={40} color="#3D7A52" />
          <Text style={styles.logoText}>LexiAssist</Text>
        </View>

        <View style={styles.iconCircle}>
          <Ionicons name="mail-open" size={48} color="#3D7A52" />
        </View>

        <Text style={styles.heading}>Email Verification</Text>
        <Text style={styles.body}>
          We have sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </Text>

        <TouchableOpacity
          style={[styles.button, (countdown > 0 || loading) && styles.buttonDisabled]}
          onPress={handleResend}
          disabled={countdown > 0 || loading}
          activeOpacity={0.88}
          accessible={true}
          accessibilityLabel={countdown > 0 ? `Resend email in ${countdown} seconds` : 'Resend verification email'}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
          </Text>
        </TouchableOpacity>

        {countdown > 0 && (
          <Text style={styles.countdown}>Link expires in {countdown}s</Text>
        )}

        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          style={styles.backLink}
          accessible={true}
          accessibilityLabel="Back to login"
          accessibilityRole="link"
        >
          <Text style={styles.backLinkText}>Back to login</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: sp['6'],
    paddingTop: 60,
    paddingBottom: sp['10'],
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
    marginBottom: sp['10'],
  },
  logoText: { fontSize: 20, fontWeight: '600', color: '#3D7A52' },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EAF4EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp['6'],
  },
  heading: { ...text.h1, color: '#111111', marginBottom: sp['3'] },
  body: {
    ...text.body,
    color: '#555555',
    textAlign: 'center',
    maxWidth: '85%',
    marginBottom: sp['8'],
    lineHeight: 24,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#3D7A52',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D7A52',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...text.button, color: '#FFFFFF' },
  countdown: {
    color: '#EF4444',
    ...text.body,
    marginTop: sp['3'],
  },
  backLink: {
    marginTop: sp['6'],
  },
  backLinkText: {
    color: '#3D7A52',
    ...text.body,
    fontWeight: '600',
  },
});
