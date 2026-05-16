import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FeedbackBanner } from '@/components/dashboard/FeedbackBanner';
import { ToolGrid } from '@/components/dashboard/ToolGrid';
import RecentFiles from '@/components/dashboard/RecentFiles';
import { useTheme } from '@/hooks/useTheme';
import { useDashboard } from '@/hooks/queries';
import { DashboardSkeleton } from '@/components/skeleton/Skeleton';
import { sp } from '@/constants/spacing';
import { text } from '@/constants/typography';

export default function Dashboard() {
  const router = useRouter();
  const c = useTheme();
  const { data, isPending, isError, refetch } = useDashboard();

  if (isPending) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: c.ui.background }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <DashboardSkeleton />
        <View style={{ height: 120 }} />
      </ScrollView>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.container, { backgroundColor: c.ui.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color={c.text.danger} />
        <Text style={[text.h3, { color: c.text.primary, marginTop: sp['4'] }]}>
          Couldn&apos;t load dashboard
        </Text>
        <Text style={[text.body, { color: c.text.muted, marginTop: sp['2'], marginBottom: sp['6'] }]}>
          Pull down to retry or check your connection.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[styles.retryButton, { backgroundColor: c.brand.primary }]}
          activeOpacity={0.88}
        >
          <Text style={[text.button, { color: c.text.inverse }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.ui.background }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Top Greeting Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: c.text.secondary }]}>{data.greeting}</Text>
          <Text style={[styles.userName, { color: c.text.primary }]}>{data.userName}</Text>
        </View>
        <TouchableOpacity
          style={[styles.profileWrapper, { borderColor: c.brand.primaryLight }]}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <Image
            source={
              data.avatarUrl
                ? { uri: data.avatarUrl }
                : require('../../../assets/icon.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* 2. Feedback Card Component */}
      {data.feedbackBanner?.visible && <FeedbackBanner />}

      {/* 3. Tool Section */}
      <Text style={[styles.sectionTitle, { color: c.text.primary }]}>Get Started with a Tool</Text>
      <ToolGrid tools={data.tools} />

      {/* 4. History / Recent Section */}
      <Text style={[styles.sectionTitle, { color: c.text.primary, marginTop: 10 }]}>Recent Files</Text>
      <RecentFiles files={data.recentFiles} />

      {/* Bottom spacer for TabBar visibility */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: { fontSize: 16 },
  userName: { fontSize: 24, fontWeight: '700' },
  profileWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
  },
  profileImage: { width: '100%', height: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  retryButton: {
    paddingHorizontal: sp['8'],
    paddingVertical: sp['3'],
    borderRadius: 50,
  },
});
