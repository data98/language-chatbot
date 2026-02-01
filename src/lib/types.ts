export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Feedback {
  corrected: string;
  explanation: string;
  alternatives: string[];
  next_prompt: string;
}

export interface HistoryItem {
  prompt: string;
  answer: string;
  corrected: string;
}

export interface Session {
  nativeLanguage: string;
  targetLanguage: string;
  difficulty: Difficulty;
  scenario: string;
  currentPrompt: string | null;
  lastAnswer: string | null;
  lastFeedback: Feedback | null;
  history: HistoryItem[];
}
