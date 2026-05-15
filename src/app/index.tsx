import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = user !== null;

  // Declarative routing waits for the Root Layout to be ready automatically
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}