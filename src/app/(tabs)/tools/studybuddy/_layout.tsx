import React from 'react';
import { Stack } from 'expo-router';

export default function StudyBuddyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="quiz" />
      <Stack.Screen name="flashcards" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}
