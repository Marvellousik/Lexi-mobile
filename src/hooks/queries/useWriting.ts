import { useMutation } from '@tanstack/react-query';
import { toolsService } from '@/services/tools.service';

export interface WritingCleanResult {
  cleanedText: string;
  changes: number;
}

export function useCleanWriting() {
  return useMutation<WritingCleanResult, Error, { text: string }>({
    mutationFn: async (payload) => {
      return toolsService.writingClean(payload.text);
    },
  });
}
