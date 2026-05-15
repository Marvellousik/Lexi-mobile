/**
 * Centralized route-to-title mapping.
 * Single source of truth for header titles across the application.
 */

export const ROUTE_TITLES: Record<string, string> = {
  // Home (Inside Tabs)
  '/home': 'LexiAssist',
  '/(tabs)/home': 'LexiAssist',

  // Top-level tabs
  '/chat': 'Lexi Chat',
  '/(tabs)/chat': 'Lexi Chat',
  '/history': 'History',
  '/(tabs)/history': 'History',
  '/profile': 'Profile',
  '/(tabs)/profile': 'Profile',

  // Tools: Standalone Routes (Moved outside (tabs))
  '/tools/tts': 'Text to Speech',
  '/tools/tts/player': 'Text to Speech',

  '/tools/reading': 'Reading Assistant',
  '/tools/writing': 'Writing Assistant',
  '/tools/studybuddy': 'StudyBuddy',

  // StudyBuddy: Quiz
  '/tools/studybuddy/quiz': 'Quizzes',
  '/tools/studybuddy/quiz/session': 'Quiz Session',
  '/tools/studybuddy/quiz/results': 'Quiz Results',
  '/tools/studybuddy/quiz/review': 'Quiz Review',

  // StudyBuddy: Flashcards
  '/tools/studybuddy/flashcards': 'Flashcards',
  '/tools/studybuddy/flashcards/session': 'Flashcards',

  // StudyBuddy: Chat
  '/tools/studybuddy/chat': 'Chat Assistant',
  '/tools/studybuddy/chat/conversation': 'Chat Assistant',
} as const;

/**
 * Determines if the given pathname represents the home/dashboard route.
 */
export function isHomeRoute(pathname: string): boolean {
  return pathname === '/home' || pathname === '/(tabs)/home';
}