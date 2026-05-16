import { api } from '@/services/api';

/**
 * MOCK ADAPTER — Environment Driven
 *
 * When EXPO_PUBLIC_API_MOCK=true, this registers axios interceptors
 * that return typed fixture data for matched URLs.
 *
 * RULES:
 * 1. NEVER mock inside components or hooks.
 * 2. NEVER use setTimeout inside UI code.
 * 3. Fixtures live here or in a co-located __fixtures__ file.
 * 4. When backend is ready, set EXPO_PUBLIC_API_MOCK=false and
 *    delete this file — components stay untouched.
 */

const MOCK_DELAY = 800;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const isMockEnabled = () => {
  try {
    return process.env.EXPO_PUBLIC_API_MOCK === 'true';
  } catch {
    return false;
  }
};

// ─── FIXTURES ───
const FIXTURES: Record<string, (config?: any) => unknown> = {
  'GET /dashboard': () => ({
    greeting: 'Good afternoon',
    userName: 'Victoria Smith',
    avatarUrl: null,
    tools: [
      { id: 'tts', title: 'Text to Speech', desc: 'Listen to notes', route: '/tools/tts' },
      { id: 'reading', title: 'Reading Assistant', desc: 'Simplify words', route: '/tools/reading' },
      { id: 'buddy', title: 'Study Buddy', desc: 'Upload notes', route: '/tools/studybuddy' },
      { id: 'notes', title: 'Note Taker', desc: 'Voice to text', route: '/tools/writing' },
    ],
    recentFiles: [
      { id: '1', name: 'Operating Systems', meta: 'Quiz \u2022 12th March, 2026', color: '#FFEBEE' },
      { id: '2', name: 'The Nature of Man', meta: 'Flashcards \u2022 9th April, 2026', color: '#E1F5FE' },
      { id: '3', name: 'World War II Overview', meta: 'Reading \u2022 2nd May, 2026', color: '#E8F5E9' },
    ],
    feedbackBanner: {
      visible: true,
      title: 'Enjoying LexiAssist?',
      subtitle: 'Suggestions and feedback will be highly appreciated',
    },
  }),

  'GET /history': () => [
    { id: '1', title: 'History of Hitler.pdf', tool: 'Quiz', date: 'Yesterday' },
    { id: '2', title: 'History of Hitler.pdf', tool: 'Flashcards', date: 'Yesterday' },
    { id: '3', title: 'Philosophy Notes.docx', tool: 'Text to Speech', date: '2 days ago' },
    { id: '4', title: 'Meeting Recording.mp3', tool: 'Writing Assistant', date: '3 days ago' },
  ],

  'POST /quiz/generate': () => ({
    sessionId: 'quiz_' + Date.now(),
    questions: [
      {
        id: '1',
        question: 'In which year was Adolf Hitler born?',
        options: ['1887', '1888', '1889', '1890', '1891'],
        correctAnswerIndex: 2,
      },
      {
        id: '2',
        question: 'Where was Adolf Hitler born?',
        options: ['Berlin', 'Vienna', 'Braunau am Inn', 'Munich', 'Salzburg'],
        correctAnswerIndex: 2,
      },
      {
        id: '3',
        question: 'What was Hitler\'s early career aspiration?',
        options: ['Politician', 'Artist', 'Soldier', 'Writer', 'Architect'],
        correctAnswerIndex: 1,
      },
    ],
  }),

  'POST /quiz/submit': () => ({
    score: 8,
    total: 10,
    correctAnswers: 8,
    message: 'Great effort! Review the questions you missed to improve.',
  }),

  'POST /flashcards/generate': () => ({
    sessionId: 'fc_' + Date.now(),
    flashcards: [
      { id: '1', front: 'What year was Adolf Hitler born?', back: '1889' },
      { id: '2', front: 'Where was Adolf Hitler born?', back: 'Braunau am Inn, Austria' },
      { id: '3', front: "What was Hitler's early career aspiration?", back: 'Artist' },
    ],
  }),

  'POST /reading/process': () => ({
    documentId: 'doc_' + Date.now(),
    title: 'History of Hitler.pdf',
    content: `Adolf Hitler's life remains one of the most studied and scrutinized periods in modern history, marking the transition from a failed artist to the architect of a global catastrophe.\n\nEarly Life and Artistic Failure\n\nAdolf Hitler was born on April 20, 1889, in the small Austrian town of Braunau am Inn. His early years were shaped by a difficult relationship with his strict father and a deep devotion to his mother. In 1907, he moved to Vienna with dreams of becoming an artist. However, he was twice rejected by the Academy of Fine Arts. During his years of poverty in Vienna, he began to adopt the extreme nationalist and antisemitic ideologies that would later define his regime.`,
    difficulty: 'beginner',
    tokens: [
      { word: 'Adolf ', confidence: 'high' },
      { word: 'Hitler\u2019s ', confidence: 'high' },
      { word: 'scrutinized ', confidence: 'low' },
    ],
  }),

  'POST /audio/process': () => ({
    audioId: 'aud_' + Date.now(),
    title: 'History of Hitler.pdf',
    durationSeconds: 245,
    segments: [
      { text: 'Adolf Hitler was born on April 20, 1889...', start: 0, end: 12, highlight: 'April 20' },
    ],
  }),

  'POST /chat/message': () => ({
    messageId: 'msg_' + Date.now(),
    role: 'assistant',
    content: 'I can help you with that! Based on your request, here are the key points:\n\n1. **Historical Context**: Understanding the timeline and major events\n2. **Key Figures**: Important people and their roles\n3. **Impact Analysis**: How it affected subsequent events\n4. **Study Tips**: Best ways to memorize and understand this topic\n\nWould you like me to create flashcards or a quiz based on this?',
  }),

  'POST /writing/clean': () => ({
    cleanedText: 'Adolf Hitler was born on April 20, 1889, in Braunau am Inn, Austria.\n\nHis early career aspiration was to become an artist.',
    changes: 3,
  }),

  'POST /auth/resend-verification': () => ({
    message: 'Verification email sent successfully.',
  }),
};

// ─── INTERCEPTOR ───
export function registerMockAdapter() {
  if (!isMockEnabled()) return;

  // Short-circuit requests that match our fixture keys
  api.interceptors.request.use(async (config) => {
    const method = config.method?.toUpperCase() ?? 'GET';
    const url = config.url ?? '';
    const urlPath = url.split('?')[0];
    const key = `${method} ${urlPath}`;

    if (FIXTURES[key]) {
      // Attach a marker so the response interceptor knows to handle it
      (config as any)._mockFixtureKey = key;
      (config as any)._mockFixtureFn = FIXTURES[key];
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      if (!config) return Promise.reject(error);

      const mockKey = (config as any)._mockFixtureKey;
      const mockFn = (config as any)._mockFixtureFn;
      if (mockKey && mockFn) {
        await delay(MOCK_DELAY);
        return Promise.resolve({
          data: mockFn(config),
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      }

      return Promise.reject(error);
    }
  );
}
