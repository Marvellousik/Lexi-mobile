import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Animated, Image } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import ToastProvider from '@/components/ui/Toast';
import GlobalTabBar from '@/components/layout/GlobalTabBar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
  
  // We use two animations now: opacity and scale
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().then(() => {
        // Run both animations at the exact same time
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 600, // Faster, snappier fade
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.15, // Subtle zoom towards the user
            duration: 600,
            useNativeDriver: true,
          })
        ]).start(() => {
          setSplashAnimationComplete(true);
        });
      });
    }
  }, [appIsReady, fadeAnim, scaleAnim]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings/index" />
        </Stack>
        <GlobalTabBar />
      </SafeAreaView>

      <StatusBar style="dark" />
      <ToastProvider />

      {!splashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#FFFFFF',
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }], // Apply the zoom
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            },
          ]}
        >
          <Image
            source={require('../../assets/splash-icon.png')}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </Animated.View>
      )}
    </SafeAreaProvider>
  );
}