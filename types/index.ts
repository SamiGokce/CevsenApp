export interface BabTranslation {
  en: string;
  tr: string;
}

export interface BabClosing {
  arabic: string;
  transliteration: string;
  translation: BabTranslation;
}

export interface Bab {
  id: number;
  title: BabTranslation;
  arabic: string;
  transliteration: string;
  translation: BabTranslation;
  closing: BabClosing;
}

export interface UserProgress {
  currentBab: number;
  lastReadAt: string;
  completionCount: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
}

export interface ReadingLog {
  [date: string]: number[];
}
