import { create } from 'zustand';
import type { FlashcardItem } from '@/hooks/queries/useFlashcards';

interface FlashcardsState {
  sessionId: string | null;
  flashcards: FlashcardItem[];
  setSession: (sessionId: string, flashcards: FlashcardItem[]) => void;
  reset: () => void;
}

export const useFlashcardsStore = create<FlashcardsState>((set) => ({
  sessionId: null,
  flashcards: [],
  setSession: (sessionId, flashcards) => set({ sessionId, flashcards }),
  reset: () => set({ sessionId: null, flashcards: [] }),
}));
