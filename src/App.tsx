import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AnalyticsView } from './components/AnalyticsView';
import { AuthModal } from './components/AuthModal';
import { CheckupFlow } from './components/CheckupFlow';
import { GraduationCertificate } from './components/GraduationCertificate';
import { GuideView } from './components/GuideView';
import { Header } from './components/Header';
import { RoadmapView } from './components/RoadmapView';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import { AcademyProgress, DayRecord } from './types/academy';
import { createDefaultProgress, loadProgress, saveProgress } from './utils/storage';
import {
  fetchCloudProgress,
  SyncStatus,
  upsertCloudProgress,
} from './utils/supabaseSync';

type ActiveView = 'roadmap' | 'checkup' | 'workout' | 'guide' | 'certificate' | 'analytics';

export default function App() {
  const [progress, setProgress] = useState<AcademyProgress>(() => loadProgress());
  const [activeView, setActiveView] = useState<ActiveView>('roadmap');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [focusTrigger, setFocusTrigger] = useState<number>(0);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  const syncedUserIdRef = useRef<string | null>(null);
  const progressRef = useRef<AcademyProgress>(progress);
  progressRef.current = progress;

  // Sync theme class on <html> and persist progress to localStorage immediately
  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveProgress(progress);
  }, [progress]);

  // Listen to Supabase auth state and perform initial cloud fetch / guest migration
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    const handleSessionUser = async (sessionUser: User | null) => {
      if (!active) return;

      if (!sessionUser) {
        syncedUserIdRef.current = null;
        setUser(null);
        setSyncStatus('idle');
        return;
      }

      setUser(sessionUser);

      if (syncedUserIdRef.current === sessionUser.id) {
        return;
      }
      syncedUserIdRef.current = sessionUser.id;
      setSyncStatus('syncing');

      const { progress: cloudProgress, error } = await fetchCloudProgress(sessionUser.id);
      if (!active) return;

      if (error) {
        setSyncStatus('error');
        return;
      }

      if (cloudProgress) {
        // Cloud data exists: overwrite local storage & state
        saveProgress(cloudProgress);
        setProgress(cloudProgress);
        setSyncStatus('synced');
      } else {
        // No cloud record yet: migrate current local guest progress to Supabase
        const guestProgress = progressRef.current;
        const { ok } = await upsertCloudProgress(sessionUser.id, guestProgress);
        if (!active) return;
        setSyncStatus(ok ? 'synced' : 'error');
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      handleSessionUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionUser(session?.user ?? null);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const syncProgressToCloud = useCallback(
    async (nextProgress: AcademyProgress) => {
      if (!user || !isSupabaseConfigured) return;
      setSyncStatus('syncing');
      const { ok } = await upsertCloudProgress(user.id, nextProgress);
      setSyncStatus(ok ? 'synced' : 'error');
    },
    [user]
  );

  const handleToggleTheme = () => {
    const next: AcademyProgress = {
      ...progressRef.current,
      theme: progressRef.current.theme === 'dark' ? 'light' : 'dark',
    };
    setProgress(next);
    saveProgress(next);
    void syncProgressToCloud(next);
  };

  const handleNavigate = (view: 'roadmap' | 'guide' | 'analytics') => {
    setActiveView(view);
    if (view === 'roadmap') {
      setFocusTrigger((prev) => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDay = (dayNumber: number) => {
    if (dayNumber === 0) {
      setActiveView('checkup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!progress.checkupCompleted) {
      setActiveView('checkup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSelectedDayNumber(dayNumber);
    setActiveView('workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckupComplete = (record: DayRecord) => {
    const prev = progressRef.current;
    const next: AcademyProgress = {
      ...prev,
      checkupCompleted: true,
      baselineKpm: record.effectiveKpm,
      currentKpm: prev.currentKpm ?? record.effectiveKpm,
      completedDays: {
        ...prev.completedDays,
        [0]: record,
      },
    };
    setProgress(next);
    saveProgress(next);
    void syncProgressToCloud(next);
    setActiveView('roadmap');
    setFocusTrigger((n) => n + 1);
  };

  const handleWorkoutFinish = (record: DayRecord) => {
    const prev = progressRef.current;
    const next: AcademyProgress = {
      ...prev,
      currentKpm: record.effectiveKpm,
      completedDays: {
        ...prev.completedDays,
        [record.dayNumber]: record,
      },
    };
    setProgress(next);
    saveProgress(next);
    void syncProgressToCloud(next);
    if (record.dayNumber === 30) {
      setActiveView('certificate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveView('roadmap');
    setFocusTrigger((n) => n + 1);
  };

  const handleConfirmReset = () => {
    const fresh = createDefaultProgress(progressRef.current.theme);
    setProgress(fresh);
    saveProgress(fresh);
    void syncProgressToCloud(fresh);
    setShowResetModal(false);
    setActiveView('roadmap');
    setFocusTrigger((n) => n + 1);
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    syncedUserIdRef.current = null;
    setUser(null);
    setSyncStatus('idle');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        theme={progress.theme}
        progress={progress}
        onToggleTheme={handleToggleTheme}
        onRequestReset={() => setShowResetModal(true)}
        activeView={activeView}
        onNavigate={handleNavigate}
        userEmail={user?.email ?? null}
        syncStatus={syncStatus}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {activeView === 'roadmap' && (
          <RoadmapView
            progress={progress}
            onSelectDay={handleSelectDay}
            onOpenCertificate={() => {
              setActiveView('certificate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            focusTrigger={focusTrigger}
          />
        )}

        {activeView === 'checkup' && (
          <CheckupFlow
            isRetake={progress.checkupCompleted}
            onComplete={handleCheckupComplete}
            onCancel={() => handleNavigate('roadmap')}
          />
        )}

        {activeView === 'workout' && (
          <WorkoutPlayer
            key={selectedDayNumber}
            dayNumber={selectedDayNumber}
            baselineKpm={progress.baselineKpm}
            onFinishDay={handleWorkoutFinish}
            onExit={() => handleNavigate('roadmap')}
          />
        )}

        {activeView === 'guide' && <GuideView onBack={() => handleNavigate('roadmap')} />}

        {activeView === 'certificate' && (
          <GraduationCertificate
            progress={progress}
            onBackToRoadmap={() => handleNavigate('roadmap')}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView
            progress={progress}
            onBackToRoadmap={() => handleNavigate('roadmap')}
            onStartCheckup={() => handleSelectDay(0)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>30 Günlük Hızlı Okuma Akademisi</span>
          <span>
            {user
              ? 'İlerlemeniz hem tarayıcınızda hem de bulut hesabınızda güvenle saklanır.'
              : 'İlerlemeniz tarayıcınızdaki yerel hafızada saklanır. Bulut senkronizasyonu için giriş yapabilirsiniz.'}
          </span>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* In-App Reset Confirmation Modal */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
            <h2
              id="reset-dialog-title"
              className="text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              İlerlemeyi Sıfırlamak İstiyor musunuz?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Başlangıç KPM skorunuz, tamamlanan tüm günleriniz ve kilit açılışlarınız silinecektir. Akademiye 0. Gün Check-Up ile yeniden başlayacaksınız.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Evet, Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
