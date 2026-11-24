export interface Question {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface ReadingPassage {
  title: string;
  category: string;
  paragraphs: string[];
  questions: Question[];
}

export type WorkoutStepType =
  | 'eye'
  | 'schulte'
  | 'pyramid'
  | 'rsvp'
  | 'chunk-only'
  | 'chunk-quiz'
  | 'reading-quiz';

export interface DayCurriculum {
  dayNumber: number; // 0 for check-up, 1..30 for training days
  weekNumber: number; // 0 for check-up, 1..4 for training weeks
  title: string;
  subtitle: string;
  eyeDurationSec: number;
  eyePattern: 'horizontal-vertical' | 'diagonal' | 'figure-eight' | 'diagonal-circular';
  schulteSize: 3 | 4 | 5;
  steps?: WorkoutStepType[];
  speedMultiplier?: number;
  defaultChunkSize?: 2 | 3;
  isMilestoneCheckup?: boolean;
  pyramidSets?: string[][];
  rsvpText?: string;
  reading: ReadingPassage;
}

export interface DayRecord {
  dayNumber: number;
  completedAt: string;
  rawKpm: number;
  effectiveKpm: number;
  comprehensionRate: number; // 0..100
  correctCount: number;
  totalQuestions: number;
  readingSeconds: number;
  schulteSeconds?: number;
  schulteErrors?: number;
}

export type ThemeMode = 'light' | 'dark';

export interface AcademyProgress {
  checkupCompleted: boolean;
  baselineKpm: number | null;
  currentKpm: number | null;
  completedDays: Record<number, DayRecord>;
  theme: ThemeMode;
}
