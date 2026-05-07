/**
 * Centralized route-to-title mapping.
 * Single source of truth for header titles across the application.
 * Supports both Expo Router group-prefixed and normalized pathnames.
 */

export const ROUTE_TITLES: Record<string, string> = {
  // Home
  '/home': 'LexiAssist',
  '/(tabs)/home': 'LexiAssist',

  // Top-level tabs
  '/tools': 'Tools',
  '/(tabs)/tools': 'Tools',
  '/history': 'History',
  '/(tabs)/history': 'History',
  '/profile': 'Profile',
  '/(tabs)/profile': 'Profile',

  // Tools: TTS
  '/tools/tts': 'Text to Speech',
  '/(tabs)/tools/tts': 'Text to Speech',
  '/tools/tts/player': 'Text to Speech',
  '/(tabs)/tools/tts/player': 'Text to Speech',

  // Tools: Reading
  '/tools/reading': 'Reading Assistant',
  '/(tabs)/tools/reading': 'Reading Assistant',

  // Tools: Writing
  '/tools/writing': 'Writing Assistant',
  '/(tabs)/tools/writing': 'Writing Assistant',

  // Tools: StudyBuddy
  '/tools/studybuddy': 'StudyBuddy',
  '/(tabs)/tools/studybuddy': 'StudyBuddy',

  // StudyBuddy: Quiz
  '/tools/studybuddy/quiz': 'Quizzes',
  '/(tabs)/tools/studybuddy/quiz': 'Quizzes',
  '/tools/studybuddy/quiz/session': 'Quiz Session',
  '/(tabs)/tools/studybuddy/quiz/session': 'Quiz Session',
  '/tools/studybuddy/quiz/results': 'Quiz Results',
  '/(tabs)/tools/studybuddy/quiz/results': 'Quiz Results',
  '/tools/studybuddy/quiz/review': 'Quiz Review',
  '/(tabs)/tools/studybuddy/quiz/review': 'Quiz Review',

  // StudyBuddy: Flashcards
  '/tools/studybuddy/flashcards': 'Flashcards',
  '/(tabs)/tools/studybuddy/flashcards': 'Flashcards',
  '/tools/studybuddy/flashcards/session': 'Flashcards',
  '/(tabs)/tools/studybuddy/flashcards/session': 'Flashcards',

  // StudyBuddy: Chat
  '/tools/studybuddy/chat': 'Chat Assistant',
  '/(tabs)/tools/studybuddy/chat': 'Chat Assistant',
  '/tools/studybuddy/chat/conversation': 'Chat Assistant',
  '/(tabs)/tools/studybuddy/chat/conversation': 'Chat Assistant',
} as const;

/**
 * Determines if the given pathname represents the home/dashboard route.
 * Used to swap between the LexiAssist wordmark and standard screen titles.
 */
export function isHomeRoute(pathname: string): boolean {
  return pathname === '/home' || pathname === '/(tabs)/home';
}
