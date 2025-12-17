export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Evaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  follow_up_questions: string[];
}

export interface SessionState {
  sessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  evaluation: Evaluation | null;
}
