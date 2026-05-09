/**
 * ReadingHeroIllustration.tsx
 * Hero illustration for the Reading Assistant tool.
 * Uses the user-provided PNG image with a transparent background.
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface ReadingHeroIllustrationProps {
  width?: number;
  height?: number;
}

export default function ReadingHeroIllustration({ width = 120, height = 100 }: ReadingHeroIllustrationProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require('../../../assets/images/tools/reading_ass.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
