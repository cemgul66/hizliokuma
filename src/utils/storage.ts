import { AcademyProgress, ThemeMode } from '../types/academy';

const STORAGE_KEY = 'hizli_okuma_akademisi_v1';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AcademyProgress>;
      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        return parsed.theme;
      }
    }
  } catch {
    // ignore storage errors
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function createDefaultProgress(theme?: ThemeMode): AcademyProgress {
  return {
    checkupCompleted: false,
    baselineKpm: null,
    currentKpm: null,
    completedDays: {},
    theme: theme ?? getInitialTheme(),
  };
}

export function loadProgress(): AcademyProgress {
  if (typeof window === 'undefined') return createDefaultProgress('light');
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw) as Partial<AcademyProgress>;
    return {
      checkupCompleted: Boolean(parsed.checkupCompleted),
      baselineKpm: typeof parsed.baselineKpm === 'number' ? parsed.baselineKpm : null,
      currentKpm: typeof parsed.currentKpm === 'number' ? parsed.currentKpm : null,
      completedDays: parsed.completedDays && typeof parsed.completedDays === 'object' ? parsed.completedDays : {},
      theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : getInitialTheme(),
    };
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: AcademyProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export function countWords(paragraphs: string[]): number {
  return paragraphs
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function calculateKpm(wordCount: number, elapsedSeconds: number): number {
  const safeSeconds = Math.max(elapsedSeconds, 2);
  return Math.round((wordCount / safeSeconds) * 60);
}

export function calculateEffectiveKpm(rawKpm: number, correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return rawKpm;
  const ratio = correctCount / totalQuestions;
  return Math.round(rawKpm * ratio);
}

export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (mins === 0) {
    return `${secs} sn`;
  }
  return `${mins} dk ${secs.toString().padStart(2, '0')} sn`;
}

export function getActiveDayNumber(progress: AcademyProgress): number {
  if (!progress.checkupCompleted) {
    return 0;
  }
  for (let day = 1; day <= 30; day++) {
    if (!progress.completedDays[day]) {
      return day;
    }
  }
  return 31; // All 30 days completed
}

export function getCompletedTrainingDayCount(progress: AcademyProgress): number {
  let count = 0;
  for (let day = 1; day <= 30; day++) {
    if (progress.completedDays[day]) {
      count++;
    }
  }
  return count;
}
