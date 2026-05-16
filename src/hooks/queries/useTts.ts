import { useMutation } from '@tanstack/react-query';
import { toolsService } from '@/services/tools.service';

export interface TtsSegment {
  text: string;
  start: number;
  end: number;
  highlight: string;
}

export interface TtsResult {
  audioId: string;
  title: string;
  durationSeconds: number;
  segments: TtsSegment[];
}

export function useProcessTts() {
  return useMutation<TtsResult, Error, { fileUri: string; fileName: string }>({
    mutationFn: async (payload) => {
      return toolsService.ttsProcess(payload.fileUri, payload.fileName);
    },
  });
}
