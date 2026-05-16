import { useMutation } from '@tanstack/react-query';
import { toolsService } from '@/services/tools.service';

export interface ChatMessageResponse {
  messageId: string;
  role: 'assistant';
  content: string;
}

export function useSendChatMessage() {
  return useMutation<ChatMessageResponse, Error, { message: string; fileUri?: string }>({
    mutationFn: async (payload) => {
      return toolsService.chatMessage(payload.message, payload.fileUri);
    },
  });
}
