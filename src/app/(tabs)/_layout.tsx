import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import GlassTabBar from '@/components/layout/GlassTabBar';
import AppHeader from '@/components/layout/AppHeader';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/stores/authStore';

export default function TabsLayout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = user !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.navigatorContainer}>
        <Tabs
          tabBar={() => <GlassTabBar />}
          screenOptions={{ headerShown: false }}
        >
          <Tabs.Screen name="home" />
          <Tabs.Screen name="tools" />
          <Tabs.Screen name="history" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
      <Sidebar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navigatorContainer: { flex: 1 },
});
