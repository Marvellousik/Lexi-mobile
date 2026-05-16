import { useMutation } from '@tanstack/react-query';
import { toolsService } from '@/services/tools.service';

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardSession {
  sessionId: string;
  flashcards: FlashcardItem[];
}

export function useGenerateFlashcards() {
  return useMutation<FlashcardSession, Error, { fileUri: string; fileName: string }>({
    mutationFn: async (payload) => {
      return toolsService.flashcardsGenerate(payload.fileUri, payload.fileName);
    },
  });
}
