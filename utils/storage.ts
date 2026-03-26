import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  FAVORITES: "@cevsen_favorites",
  STREAK: "@cevsen_streak",
  READ_BABS: "@cevsen_read_babs",
  COMPLETIONS: "@cevsen_completions",
  READING_LOG: "@cevsen_reading_log",
  LAST_READ: "@cevsen_last_read",
  FONT_SIZE: "@cevsen_font_size",
  LANGUAGE: "@cevsen_language",
  NOTIFICATION_ENABLED: "@cevsen_notification_enabled",
};

export type FontSize = "small" | "medium" | "large";
export type Language = "en" | "tr";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Favorites ─────────────────────────────────────────────────

export async function getFavorites(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFavorite(babId: number): Promise<number[]> {
  const favs = await getFavorites();
  const idx = favs.indexOf(babId);
  const next =
    idx >= 0 ? favs.filter((id) => id !== babId) : [...favs, babId];
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(next));
  return next;
}

export async function isFavorite(babId: number): Promise<boolean> {
  const favs = await getFavorites();
  return favs.includes(babId);
}

// ── Progress ──────────────────────────────────────────────────

interface StreakData {
  current: number;
  longest: number;
  lastDate: string;
}

async function getStreakData(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(KEYS.STREAK);
  return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastDate: "" };
}

async function getReadBabs(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEYS.READ_BABS);
  return raw ? JSON.parse(raw) : [];
}

async function getCompletions(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.COMPLETIONS);
  return raw ? parseInt(raw, 10) : 0;
}

export async function markBabRead(babId: number): Promise<void> {
  const today = todayStr();

  // Update reading log
  const logRaw = await AsyncStorage.getItem(KEYS.READING_LOG);
  const log: Record<string, number[]> = logRaw ? JSON.parse(logRaw) : {};
  if (!log[today]) log[today] = [];

  if (!log[today].includes(babId)) {
    log[today].push(babId);
    await AsyncStorage.setItem(KEYS.READING_LOG, JSON.stringify(log));

    // Update streak
    const streak = await getStreakData();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (streak.lastDate === today) {
      // already counted today
    } else if (streak.lastDate === yesterdayStr) {
      streak.current += 1;
    } else {
      streak.current = 1;
    }
    streak.longest = Math.max(streak.longest, streak.current);
    streak.lastDate = today;
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(streak));

    // Update read babs list, track completions
    const readBabs = await getReadBabs();
    if (!readBabs.includes(babId)) {
      const next = [...readBabs, babId];
      if (next.length >= 99) {
        const completions = await getCompletions();
        await AsyncStorage.setItem(
          KEYS.COMPLETIONS,
          String(completions + 1)
        );
        await AsyncStorage.setItem(KEYS.READ_BABS, JSON.stringify([]));
      } else {
        await AsyncStorage.setItem(KEYS.READ_BABS, JSON.stringify(next));
      }
    }
  }
}

export async function getStats(): Promise<{
  streak: number;
  longestStreak: number;
  completions: number;
  babsRead: number;
  readBabIds: number[];
}> {
  const [streak, readBabs, completions] = await Promise.all([
    getStreakData(),
    getReadBabs(),
    getCompletions(),
  ]);
  return {
    streak: streak.current,
    longestStreak: streak.longest,
    completions,
    babsRead: readBabs.length,
    readBabIds: readBabs,
  };
}

export async function getReadingLog(): Promise<Record<string, number[]>> {
  const raw = await AsyncStorage.getItem(KEYS.READING_LOG);
  return raw ? JSON.parse(raw) : {};
}

// ── Last Read ─────────────────────────────────────────────────

export async function getLastReadBab(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.LAST_READ);
  return raw ? parseInt(raw, 10) : 1;
}

export async function setLastReadBab(babId: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.LAST_READ, String(babId));
}

// ── Settings ──────────────────────────────────────────────────

export async function getFontSize(): Promise<FontSize> {
  const raw = await AsyncStorage.getItem(KEYS.FONT_SIZE);
  return (raw as FontSize) || "medium";
}

export async function saveFontSize(size: FontSize): Promise<void> {
  await AsyncStorage.setItem(KEYS.FONT_SIZE, size);
}

export async function getLanguage(): Promise<Language> {
  const raw = await AsyncStorage.getItem(KEYS.LANGUAGE);
  return (raw as Language) || "en";
}

export async function saveLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
}

export async function getNotificationEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.NOTIFICATION_ENABLED);
  return raw === "true";
}

export async function saveNotificationEnabled(
  enabled: boolean
): Promise<void> {
  await AsyncStorage.setItem(KEYS.NOTIFICATION_ENABLED, String(enabled));
}
