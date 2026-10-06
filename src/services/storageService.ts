import { AppSettings, LeaderboardEntry } from '../types';

const SETTINGS_KEY = 'nawaf_quiz_settings';
const LEADERBOARD_KEY = 'nawaf_quiz_leaderboard';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'blue',
  fontSize: 'medium',
  language: 'ar',
  musicEnabled: true,
  soundEffectsEnabled: true
};

export const storageService = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed reading settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings', e);
    }
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (data) {
        const parsed = JSON.parse(data) as LeaderboardEntry[];
        return parsed.sort((a, b) => b.score - a.score);
      }
    } catch (e) {
      console.warn('Failed reading leaderboard', e);
    }
    return [];
  },

  addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
    const list = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())
    };

    const updated = [...list, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving leaderboard', e);
    }

    return updated;
  }
};
