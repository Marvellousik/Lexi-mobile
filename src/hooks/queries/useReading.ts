import { useMutation } from '@tanstack/react-query';
import { toolsService } from '@/services/tools.service';

export interface ReadingToken {
  word: string;
  confidence: 'high' | 'low';
}

export interface ReadingDocument {
  documentId: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate';
  tokens: ReadingToken[];
}

export function useProcessReading() {
  return useMutation<ReadingDocument, Error, { fileUri: string; fileName: string; level: string }>({
    mutationFn: async (payload) => {
      return toolsService.readingProcess(payload.fileUri, payload.fileName, payload.level);
    },
  });
}
