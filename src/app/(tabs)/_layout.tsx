import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import GlassTabBar from '@/components/layout/GlassTabBar';
import { useAuthStore } from '@/stores/authStore';

export default function TabsLayout() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  return (
    <Tabs
      tabBar={() => <GlassTabBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="tools" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
