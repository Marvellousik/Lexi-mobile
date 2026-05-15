import React from 'react';
import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="session" />
      <Stack.Screen name="results" />
      <Stack.Screen name="review" />
    </Stack>
  );
}