import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { authService } from '@/services/auth.service';
import { useTheme } from '@/hooks/useTheme';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

// We do not assume error shapes. We parse them defensively.
const parseAuthError = (err: any): string => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.request) {
    return 'Network error. Please check your connection.';
  }
  return 'Registration failed. Please try again.';
};

export default function RegisterScreen() {
  const router = useRouter();
  const c = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Memoized change handlers
  const handleNameChange = useCallback((val: string) => {
    setName(val);
    if (error) setError('');
  }, [error]);

  const handleEmailChange = useCallback((val: string) => {
    setEmail(val);
    if (error) setError('');
  }, [error]);

  const handlePasswordChange = useCallback((val: string) => {
    setPassword(val);
    if (error) setError('');
  }, [error]);

  // Memoized focus/blur handlers to prevent child component render thrashing
  const handleNameFocus = useCallback(() => setFocusedField('name'), []);
  const handleEmailFocus = useCallback(() => setFocusedField('email'), []);
  const handlePasswordFocus = useCallback(() => setFocusedField('password'), []);
  const handleInputBlur = useCallback(() => setFocusedField(null), []);
  const toggleSecureEntry = useCallback(() => setSecure((prev) => !prev), []);

  const handleRegister = useCallback(async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    setError('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      await authService.register({ name: name.trim(), email: email.trim(), password });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push('/(auth)/email-verification');
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [name, email, password, router]);

  const getInputStyle = useCallback((field: string) => [
    styles.input,
    {
      borderColor: c.ui.inputBorder,
      backgroundColor: c.ui.background,
    },
    focusedField === field && {
      borderColor: c.brand.primary,
      backgroundColor: c.ui.inputFocusBg,
    },
  ], [focusedField, c]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>LexiAssist</Text>
        </View>

        <Text style={styles.heading}>Welcome to LexiAssist!</Text>
        <Text style={styles.subtitle}>Register your account</Text>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: c.ui.errorBg }]}>
            <Ionicons name="alert-circle" size={16} color={c.text.danger} />
            <Text style={[styles.errorText, { color: c.text.danger }]}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.text.primary }]}>Name</Text>
          <TextInput
            ref={nameRef}
            style={[getInputStyle('name'), { color: c.text.primary }]}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter your name"
            placeholderTextColor={c.text.muted}
            autoComplete="name"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => emailRef.current?.focus()}
            onFocus={handleNameFocus}
            onBlur={handleInputBlur}
            accessible={true}
            accessibilityLabel="Full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.text.primary }]}>Email</Text>
          <TextInput
            ref={emailRef}
            style={[getInputStyle('email'), { color: c.text.primary }]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            placeholderTextColor={c.text.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current?.focus()}
            onFocus={handleEmailFocus}
            onBlur={handleInputBlur}
            accessible={true}
            accessibilityLabel="Email address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: c.text.primary }]}>Password</Text>
          <View style={getInputStyle('password')}>
            <TextInput
              ref={passwordRef}
              style={[styles.passwordInput, { color: c.text.primary }]}
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Min 8 characters"
              placeholderTextColor={c.text.muted}
              secureTextEntry={secure}
              autoComplete="password-new"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              onFocus={handlePasswordFocus}
              onBlur={handleInputBlur}
              accessible={true}
              accessibilityLabel="Password"
            />
            <TouchableOpacity
              onPress={toggleSecureEntry}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityLabel={secure ? 'Show password' : 'Hide password'}
              accessibilityRole="button"
            >
              <Ionicons
                name={secure ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={c.text.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: c.brand.primary, shadowColor: c.brand.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.88}
          accessible={true}
          accessibilityLabel="Sign Up"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color={c.text.inverse} size="small" />
          ) : (
            <Text style={[styles.buttonText, { color: c.text.inverse }]}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: c.ui.divider }]} />
          <Text style={[styles.orText, { color: c.text.muted }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: c.ui.divider }]} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity 
            style={[styles.socialButton, { borderColor: c.brand.primary }]} 
            activeOpacity={0.8} 
            accessible={true} 
            accessibilityRole="button"
          >
            <Ionicons name="logo-google" size={18} color={c.brand.primary} />
            <Text style={[styles.socialText, { color: c.brand.primary }]}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.socialButton, { borderColor: c.brand.primary }]} 
            activeOpacity={0.8} 
            accessible={true} 
            accessibilityRole="button"
          >
            <Ionicons name="logo-linkedin" size={18} color={c.brand.primary} />
            <Text style={[styles.socialText, { color: c.brand.primary }]}>LinkedIn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: c.text.secondary }]}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Sign in"
            accessibilityRole="link"
          >
            <Text style={[styles.footerLink, { color: c.brand.primary }]}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  scroll: { 
    flexGrow: 1, // Ensures content fills screen so bounces=false works smoothly
    paddingHorizontal: sp['6'], 
    paddingTop: 60, 
    paddingBottom: sp['10'] 
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
    marginBottom: sp['8'],
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: '600', 
  },
  heading: { 
    ...text.h1, 
    marginBottom: sp['1.5'] 
  },
  subtitle: { 
    ...text.body, 
    marginBottom: sp['7'] 
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    borderRadius: 10,
    padding: sp['3'],
    marginBottom: sp['4'],
  },
  errorText: { 
    fontSize: 14, 
    flex: 1 
  },
  inputGroup: { 
    marginBottom: sp['4'] 
  },
  label: { 
    ...text.label, 
    marginBottom: sp['1.5'] 
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 50,
    paddingHorizontal: sp['4'],
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    // Removed elevation here. This was killing the Android focus.
  },
  passwordInput: { 
    flex: 1, 
    fontSize: 16, 
  },
  button: {
    height: 52,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp['2'],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: { 
    opacity: 0.6 
  },
  buttonText: { 
    ...text.button, 
  },
  dividerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: sp['5'] 
  },
  divider: { 
    flex: 1, 
    height: 1, 
  },
  orText: { 
    marginHorizontal: sp['3'], 
    ...text.body 
  },
  socialRow: { 
    flexDirection: 'row', 
    gap: sp['3'] 
  },
  socialButton: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
  },
  socialText: { 
    fontSize: 15, 
    fontWeight: '500' 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: sp['6'] 
  },
  footerText: { 
    ...text.body 
  },
  footerLink: { 
    ...text.body, 
    fontWeight: '600' 
  },
});