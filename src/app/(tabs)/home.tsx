import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import {FeedbackBanner} from '@/components/dashboard/FeedbackBanner';
import {ToolGrid} from '@/components/dashboard/ToolGrid';
import RecentFiles from '@/components/dashboard/RecentFiles';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Top Greeting Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.userName}>Victoria Smith</Text>
        </View>
        <TouchableOpacity style={styles.profileWrapper}>
           {/* Replace with your actual user image path */}
          <Image 
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {/* 2. Feedback Card Component */}
      <FeedbackBanner />

      {/* 3. Tool Section */}
      <Text style={styles.sectionTitle}>Get Started with a Tool</Text>
      <ToolGrid />

      {/* 4. History / Recent Section */}
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Recent Files</Text>
      <RecentFiles />

      {/* Bottom spacer for TabBar visibility */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 20, 
    marginBottom: 10 
  },
  greeting: { fontSize: 16, color: '#666' },
  userName: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  profileWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  profileImage: { width: '100%', height: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
});