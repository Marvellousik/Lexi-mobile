import { api } from './api';

export const toolsService = {
  ttsProcess: async (fileUri: string, fileName: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/pdf',
    } as any);
    const res = await api.post('/audio/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  readingProcess: async (fileUri: string, fileName: string, level: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/pdf',
    } as any);
    formData.append('level', level);
    const res = await api.post('/reading/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  writingClean: async (text: string) => {
    const res = await api.post('/writing/clean', { text });
    return res.data;
  },

  quizGenerate: async (fileUri: string, fileName: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/pdf',
    } as any);
    const res = await api.post('/quiz/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  quizSubmit: async (sessionId: string, answers: Record<string, string>) => {
    const res = await api.post('/quiz/submit', { sessionId, answers });
    return res.data;
  },

  flashcardsGenerate: async (fileUri: string, fileName: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/pdf',
    } as any);
    const res = await api.post('/flashcards/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  chatMessage: async (message: string, fileUri?: string) => {
    const formData = new FormData();
    formData.append('message', message);
    if (fileUri) {
      formData.append('file', {
        uri: fileUri,
        name: 'attachment',
        type: 'application/octet-stream',
      } as any);
    }
    const res = await api.post('/chat/message', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
