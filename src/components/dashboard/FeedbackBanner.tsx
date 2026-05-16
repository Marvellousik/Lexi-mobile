import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import HeartIcon from '../../../assets/3dicons-heart-dynamic-color.svg';

export function FeedbackBanner() {
  const c = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <LinearGradient 
        colors={['#3C8350', '#0D1D12']} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <View style={styles.iconWrapper}>
          <HeartIcon width={60} height={60} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: c.text.inverse }]}>
            Enjoying <Text style={styles.brandText}>LexiAssist</Text>?
          </Text>
          <Text style={styles.subtitle}>
            Suggestions and feedback will be highly appreciated
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center', // Aligns icon and text container vertically
    overflow: 'visible',
  },
  iconWrapper: {
    // Removed the negative top offset to align with the text
    marginRight: 15, 
    zIndex: 10,
  },
  textContainer: { 
    flex: 1, 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
  },
  brandText: { 
    color: '#A5D6A7' 
  },
  subtitle: { 
    fontSize: 13, 
    color: '#E0E0E0', 
    marginTop: 2, 
    lineHeight: 18 
  },
});