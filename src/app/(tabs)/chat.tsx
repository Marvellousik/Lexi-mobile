import React from 'react';
import { Redirect } from 'expo-router';

export default function ChatTab() {
  // Instantly redirects the user to the actual chatbot tool
  // Update this path if your main chat screen is just '/tools/studybuddy/chat'
  return <Redirect href="/tools/studybuddy/chat" />;
}