import { create } from 'zustand';
import type { QuizQuestion } from '@/hooks/queries/useQuiz';

interface QuizState {
  sessionId: string | null;
  questions: QuizQuestion[];
  answers: Record<string, number>;
  score: number | null;
  total: number | null;
  setSession: (sessionId: string, questions: QuizQuestion[]) => void;
  setAnswer: (questionId: string, optionIndex: number) => void;
  setResult: (score: number, total: number) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: null,
  questions: [],
  answers: {},
  score: null,
  total: null,
  setSession: (sessionId, questions) =>
    set({ sessionId, questions, answers: {}, score: null, total: null }),
  setAnswer: (questionId, optionIndex) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionIndex },
    })),
  setResult: (score, total) => set({ score, total }),
  reset: () =>
    set({ sessionId: null, questions: [], answers: {}, score: null, total: null }),
}));
