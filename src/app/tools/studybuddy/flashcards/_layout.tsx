import React from 'react';
import { Stack } from 'expo-router';

export default function FlashcardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="session" />
    </Stack>
  );
}
