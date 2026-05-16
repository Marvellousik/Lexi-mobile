import { useQuery } from '@tanstack/react-query';

export interface HistoryItem {
  id: string;
  title: string;
  tool: string;
  date: string;
}

export function useHistory() {
  return useQuery<HistoryItem[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const { api } = await import('@/services/api');
      const res = await api.get('/history');
      return res.data;
    },
  });
}
