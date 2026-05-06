export interface DocumentResult {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachment?: DocumentResult;
}

export interface RecentItem {
  id: string;
  filename: string;
  toolType: string;
  timestamp: string;
}

export type ToolCard = {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  route: string;
};

export type ReadingMode = 'word' | 'line';
export type DifficultyLevel = 'beginner' | 'intermediate';
export type Confidence = 'high' | 'low';

export interface WordToken {
  word: string;
  confidence: Confidence;
}
