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

import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth.service';
import { text } from '@/constants/typography';
import { sp } from '@/constants/spacing';

const parseAuthError = (err: any): string => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.request) {
    return 'Network error. Please check your connection.';
  }
  return 'Login failed. Please try again.';
};

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleEmailChange = useCallback((val: string) => {
    setEmail(val);
    if (error) setError('');
  }, [error]);

  const handlePasswordChange = useCallback((val: string) => {
    setPassword(val);
    if (error) setError('');
  }, [error]);

  // Use explicit callbacks to prevent any unnecessary prop changes
  const handleEmailFocus = useCallback(() => setFocusedField('email'), []);
  const handlePasswordFocus = useCallback(() => setFocusedField('password'), []);
  const handleInputBlur = useCallback(() => setFocusedField(null), []);
  const toggleSecureEntry = useCallback(() => setSecure((prev) => !prev), []);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setError('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      const res = await authService.login({ email: email.trim(), password });
      const { access_token, refresh_token, user } = res.data;
      
      await setAuth(user, access_token, refresh_token);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [email, password, setAuth, router]);

  const getInputStyle = useCallback((field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ], [focusedField]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
      style={styles.container}
    >
      {/* 
        REMOVED: TouchableWithoutFeedback. 
        ScrollView with keyboardShouldPersistTaps="handled" is the proper way 
        to handle tap-to-dismiss without intercepting inputs.
      */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>LexiAssist</Text>
        </View>

        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            ref={emailRef}
            style={getInputStyle('email')}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            placeholderTextColor="#888888"
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
          <Text style={styles.label}>Password</Text>
          <View style={getInputStyle('password')}>
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Enter your password"
              placeholderTextColor="#888888"
              secureTextEntry={secure}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
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
                color="#888888"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotContainer} activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.88}
          accessible={true}
          accessibilityLabel="Sign In"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity 
            style={styles.socialButton} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
          >
            <Ionicons name="logo-google" size={18} color="#3D7A52" />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialButton} 
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
          >
            <Ionicons name="logo-linkedin" size={18} color="#3D7A52" />
            <Text style={styles.socialText}>LinkedIn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Create account"
            accessibilityRole="link"
          >
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  scroll: { 
    flexGrow: 1,
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
    color: '#3D7A52' 
  },
  heading: { 
    ...text.h1, 
    color: '#111111', 
    marginBottom: sp['1.5'] 
  },
  subtitle: { 
    ...text.body, 
    color: '#888888', 
    marginBottom: sp['7'] 
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp['2'],
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: sp['3'],
    marginBottom: sp['4'],
  },
  errorText: { 
    color: '#EF4444', 
    fontSize: 14, 
    flex: 1 
  },
  inputGroup: { 
    marginBottom: sp['4'] 
  },
  label: { 
    ...text.label, 
    color: '#111111', 
    marginBottom: sp['1.5'] 
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 50,
    paddingHorizontal: sp['4'],
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: '#3D7A52',
    backgroundColor: '#F9FFF9', // Subtly change background instead of heavy shadows
    // REMOVED elevation and shadow properties here. 
    // They cause the Android native UI thread to rebuild the view, destroying secureTextEntry focus.
  },
  passwordInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#111111' 
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: sp['4'],
  },
  forgotText: {
    ...text.bodySm,
    color: '#3D7A52',
    fontWeight: '600',
  },
  button: {
    height: 52,
    backgroundColor: '#3D7A52',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sp['2'],
    shadowColor: '#3D7A52',
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
    color: '#FFFFFF' 
  },
  dividerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: sp['5'] 
  },
  divider: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#E5E5E5' 
  },
  orText: { 
    marginHorizontal: sp['3'], 
    color: '#888888', 
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
    borderColor: '#3D7A52',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sp['2'],
  },
  socialText: { 
    color: '#3D7A52', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: sp['6'] 
  },
  footerText: { 
    color: '#888888', 
    ...text.body 
  },
  footerLink: { 
    color: '#3D7A52', 
    ...text.body, 
    fontWeight: '600' 
  },
});