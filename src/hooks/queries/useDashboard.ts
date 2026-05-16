import { useQuery } from '@tanstack/react-query';

export interface DashboardTool {
  id: string;
  title: string;
  desc: string;
  route: string;
}

export interface RecentFile {
  id: string;
  name: string;
  meta: string;
  color: string;
}

export interface DashboardData {
  greeting: string;
  userName: string;
  avatarUrl: string | null;
  tools: DashboardTool[];
  recentFiles: RecentFile[];
  feedbackBanner: {
    visible: boolean;
    title: string;
    subtitle: string;
  };
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // When backend is ready, this URL should exist.
      // The mock adapter intercepts it when EXPO_PUBLIC_API_MOCK=true.
      const { api } = await import('@/services/api');
      const res = await api.get('/dashboard');
      return res.data;
    },
  });
}
