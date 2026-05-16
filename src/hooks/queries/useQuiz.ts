import { useMutation } from '@tanstack/react-query';
import { toolsService } from '@/services/tools.service';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizSession {
  sessionId: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  total: number;
  correctAnswers: number;
  message: string;
}

export function useGenerateQuiz() {
  return useMutation<QuizSession, Error, { fileUri: string; fileName: string }>({
    mutationFn: async (payload) => {
      return toolsService.quizGenerate(payload.fileUri, payload.fileName);
    },
  });
}

export function useSubmitQuiz() {
  return useMutation<QuizResult, Error, { sessionId: string; answers: Record<string, number> }>({
    mutationFn: async (payload) => {
      // Convert to strings for the API
      const stringAnswers: Record<string, string> = {};
      Object.entries(payload.answers).forEach(([k, v]) => {
        stringAnswers[k] = String(v);
      });
      return toolsService.quizSubmit(payload.sessionId, stringAnswers);
    },
  });
}
