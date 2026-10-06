export type LevelId = 'easy' | 'medium' | 'hard';

export interface LevelInfo {
  id: LevelId;
  numericLevel: number;
  title: string;
  subtitle: string;
  badge: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  level: LevelId;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  levelTitle: string;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  date: string;
}

export type ThemeOption = 'blue' | 'dark' | 'light';
export type FontSizeOption = 'small' | 'medium' | 'large';
export type LanguageOption = 'ar' | 'en';

export interface AppSettings {
  theme: ThemeOption;
  fontSize: FontSizeOption;
  language: LanguageOption;
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
}

export type ScreenState =
  | { type: 'home' }
  | { type: 'quiz'; level: LevelId }
  | { type: 'result'; level: LevelId; score: number; correctCount: number; wrongCount: number }
  | { type: 'leaderboard' }
  | { type: 'settings' }
  | { type: 'about' }
  | { type: 'export' };
