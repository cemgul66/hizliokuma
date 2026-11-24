import { LogIn, LogOut, Moon, RotateCcw, Sun } from 'lucide-react';
import { AcademyProgress, ThemeMode } from '../types/academy';
import { getCompletedTrainingDayCount } from '../utils/storage';
import { SyncStatus } from '../utils/supabaseSync';

interface HeaderProps {
  theme: ThemeMode;
  progress: AcademyProgress;
  onToggleTheme: () => void;
  onRequestReset: () => void;
  activeView: 'roadmap' | 'checkup' | 'workout' | 'guide' | 'certificate' | 'analytics';
  onNavigate: (view: 'roadmap' | 'guide' | 'analytics') => void;
  userEmail: string | null;
  syncStatus: SyncStatus;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export function Header({
  theme,
  progress,
  onToggleTheme,
  onRequestReset,
  activeView,
  onNavigate,
  userEmail,
  syncStatus,
  onOpenAuthModal,
  onSignOut,
}: HeaderProps) {
  const completedCount = getCompletedTrainingDayCount(progress);
  const baseline = progress.baselineKpm;
  const current = progress.currentKpm;

  let improvementText = '%0';
  let improvementClass = 'text-slate-900 dark:text-slate-100';

  if (baseline !== null && current !== null && baseline > 0) {
    const pct = Math.round(((current - baseline) / baseline) * 100);
    if (pct > 0) {
      improvementText = `+%${pct}`;
      improvementClass = 'text-emerald-700 dark:text-emerald-400';
    } else if (pct < 0) {
      improvementText = `%${pct}`;
      improvementClass = 'text-amber-700 dark:text-amber-400';
    }
  } else if (baseline !== null && current !== null && baseline === 0 && current > 0) {
    improvementText = '+%100';
    improvementClass = 'text-emerald-700 dark:text-emerald-400';
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      {/* Top Row: Brand + Nav + Action Buttons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onNavigate('roadmap')}
            className="text-left text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 rounded"
          >
            30 Günlük Hızlı Okuma Akademisi
          </button>

          <nav
            aria-label="Ana gezinme"
            className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <button
              type="button"
              onClick={() => onNavigate('roadmap')}
              className={`whitespace-nowrap shrink-0 py-0.5 border-b-2 transition-colors cursor-pointer ${
                activeView !== 'guide' && activeView !== 'analytics'
                  ? 'border-sky-600 text-slate-900 dark:border-sky-400 dark:text-slate-100'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Yolculuk Haritası
            </button>
            <button
              type="button"
              onClick={() => onNavigate('guide')}
              className={`whitespace-nowrap shrink-0 py-0.5 border-b-2 transition-colors cursor-pointer ${
                activeView === 'guide'
                  ? 'border-sky-600 text-slate-900 dark:border-sky-400 dark:text-slate-100'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Nasıl Çalışır
            </button>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate(activeView === 'analytics' ? 'roadmap' : 'analytics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'analytics'
                ? 'border-sky-600 dark:border-sky-400 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                : 'border-sky-200 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60'
            }`}
          >
            <span aria-hidden="true">📊</span>
            <span className="hidden sm:inline">Gelişim Analizi</span>
            <span className="sm:hidden">Analiz</span>
          </button>

          {userEmail ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 py-1">
              <span
                title={userEmail}
                className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[150px] truncate"
              >
                {userEmail}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                  syncStatus === 'error'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : syncStatus === 'syncing'
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {syncStatus === 'error'
                  ? '⚠️ Senkronizasyon Hatası'
                  : syncStatus === 'syncing'
                    ? '⏳ Kaydediliyor...'
                    : '☁️ Senkronize Edildi'}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3 h-3" aria-hidden="true" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Giriş Yap / Kayıt Ol</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRequestReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">İlerlemeyi Sıfırla</span>
            <span className="sm:hidden">Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Tema Değiştir"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Tema Değiştir</span>
          </button>
        </div>
      </div>

      {/* Fixed Summary Strip */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Başlangıç Hızı:</span>
            <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {baseline !== null ? `${baseline} KPM` : '-- KPM'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Güncel Hız:</span>
            <span className="font-mono font-bold tabular-nums text-sky-700 dark:text-sky-400">
              {current !== null ? `${current} KPM` : '-- KPM'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">Gelişim:</span>
            <span className={`font-mono font-bold tabular-nums ${improvementClass}`}>
              {improvementText}
            </span>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">İlerleme:</span>
            <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {completedCount}/30 Gün
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
