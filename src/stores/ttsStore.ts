import { create } from 'zustand';
import type { TtsResult } from '@/hooks/queries/useTts';

interface TtsState {
  result: TtsResult | null;
  setResult: (result: TtsResult) => void;
  reset: () => void;
}

export const useTtsStore = create<TtsState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  reset: () => set({ result: null }),
}));
