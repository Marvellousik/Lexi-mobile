import { create } from 'zustand';
import type { ReadingDocument } from '@/hooks/queries/useReading';

interface ReadingState {
  document: ReadingDocument | null;
  setDocument: (doc: ReadingDocument) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  document: null,
  setDocument: (document) => set({ document }),
  reset: () => set({ document: null }),
}));
