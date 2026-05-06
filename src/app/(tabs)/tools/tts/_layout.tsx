import React from 'react';
import { Stack } from 'expo-router';

export default function TtsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="player" />
    </Stack>
  );
}
