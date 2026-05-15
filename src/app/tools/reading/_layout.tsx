import React from 'react';
import { Stack } from 'expo-router';

export default function ReadingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reader" />
    </Stack>
  );
}