import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => null}
    >
      {/* The 4 Main Visible Tabs */}
      <Tabs.Screen 
        name="home" 
        options={{ title: 'Dashboard' }} 
      />
      {/* CHANGED FROM 'tools' TO 'chat' */}
      <Tabs.Screen 
        name="chat" 
        options={{ title: 'Chat' }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{ title: 'History' }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Me' }} 
      />
    </Tabs>
  );
}