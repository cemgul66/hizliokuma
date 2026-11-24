import { isSupabaseConfigured, supabase } from '../supabaseClient';
import { AcademyProgress, DayRecord } from '../types/academy';
import { getInitialTheme } from './storage';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

function isValidDayRecord(item: unknown): item is DayRecord {
  if (!item || typeof item !== 'object') return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.dayNumber === 'number' &&
    typeof r.completedAt === 'string' &&
    typeof r.rawKpm === 'number' &&
    typeof r.effectiveKpm === 'number' &&
    typeof r.comprehensionRate === 'number' &&
    typeof r.correctCount === 'number' &&
    typeof r.totalQuestions === 'number' &&
    typeof r.readingSeconds === 'number'
  );
}

export function sanitizeProgressData(
  raw: unknown,
  fallbackTheme?: AcademyProgress['theme']
): AcademyProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const completedDays: Record<number, DayRecord> = {};
  if (obj.completedDays && typeof obj.completedDays === 'object') {
    for (const [key, val] of Object.entries(obj.completedDays as Record<string, unknown>)) {
      const dayNum = Number(key);
      if (Number.isInteger(dayNum) && dayNum >= 0 && dayNum <= 30 && isValidDayRecord(val)) {
        completedDays[dayNum] = val;
      }
    }
  }

  return {
    checkupCompleted: Boolean(obj.checkupCompleted),
    baselineKpm: typeof obj.baselineKpm === 'number' ? obj.baselineKpm : null,
    currentKpm: typeof obj.currentKpm === 'number' ? obj.currentKpm : null,
    completedDays,
    theme:
      obj.theme === 'dark' || obj.theme === 'light'
        ? obj.theme
        : (fallbackTheme ?? getInitialTheme()),
  };
}

export async function fetchCloudProgress(userId: string): Promise<{
  progress: AcademyProgress | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured) {
    return { progress: null, error: 'Supabase anahtarı tanımlanmamış.' };
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('progress_data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return { progress: null, error: error.message };
    }

    if (!data || !data.progress_data) {
      return { progress: null, error: null };
    }

    const sanitized = sanitizeProgressData(data.progress_data);
    return { progress: sanitized, error: null };
  } catch (err) {
    return {
      progress: null,
      error: err instanceof Error ? err.message : 'Bulut verisi alınamadı.',
    };
  }
}

export async function upsertCloudProgress(
  userId: string,
  progress: AcademyProgress
): Promise<{ ok: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase anahtarı tanımlanmamış.' };
  }

  try {
    const { error } = await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        progress_data: progress,
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, error: null };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Bulut kaydı başarısız oldu.',
    };
  }
}

export function translateSupabaseAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'E-posta adresi veya şifre hatalı.';
  }
  if (lower.includes('email not confirmed')) {
    return 'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'Bu e-posta adresiyle zaten kayıtlı bir hesap bulunuyor.';
  }
  if (lower.includes('password should be at least') || lower.includes('weak_password')) {
    return 'Şifreniz en az 6 karakter uzunluğunda olmalıdır.';
  }
  if (lower.includes('unable to validate email') || lower.includes('invalid email')) {
    return 'Lütfen geçerli bir e-posta adresi girin.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
  }
  if (lower.includes('invalid api key') || lower.includes('apikey')) {
    return 'Supabase anon anahtarı geçersiz veya eksik. Lütfen VITE_SUPABASE_ANON_KEY ayarını kontrol edin.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.';
  }
  return message;
}
