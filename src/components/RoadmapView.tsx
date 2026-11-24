import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  Award,
  Check,
  Crosshair,
  Lock,
  Play,
  RotateCw,
} from 'lucide-react';
import { CHECKUP_DAY, TRAINING_DAYS } from '../data/curriculum';
import { AcademyProgress, DayCurriculum } from '../types/academy';
import { getActiveDayNumber } from '../utils/storage';

interface RoadmapViewProps {
  progress: AcademyProgress;
  onSelectDay: (dayNumber: number) => void;
  onOpenCertificate: () => void;
  focusTrigger: number;
}

export function RoadmapView({
  progress,
  onSelectDay,
  onOpenCertificate,
  focusTrigger,
}: RoadmapViewProps) {
  const activeDayNumber = getActiveDayNumber(progress);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [lockedAlertDay, setLockedAlertDay] = useState<number | null>(null);

  const allStops: DayCurriculum[] = [CHECKUP_DAY, ...TRAINING_DAYS];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      activeCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [activeDayNumber, focusTrigger]);

  useEffect(() => {
    if (lockedAlertDay === null) return;
    const t = window.setTimeout(() => setLockedAlertDay(null), 3200);
    return () => window.clearTimeout(t);
  }, [lockedAlertDay]);

  const handleFocusActive = () => {
    activeCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const jumpToDay = (dayNum: number) => {
    sectionRefs.current[dayNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
            Yolculuk Haritası (0–30. Gün)
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            0. Gün başlangıç seviye tespitinden başlayarak adım adım 30. güne ilerleyin.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFocusActive}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Aktif Güne Odaklan</span>
        </button>
      </div>

      {/* Week quick jump */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {[
          { label: '0. Gün (Check-Up)', day: 0 },
          { label: '1. Hafta', day: 1 },
          { label: '2. Hafta', day: 8 },
          { label: '3. Hafta', day: 15 },
          { label: '4. Hafta', day: 22 },
          { label: '30. Gün', day: 30 },
        ].map((item) => (
          <button
            key={item.day}
            type="button"
            onClick={() => jumpToDay(item.day)}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Graduation Banner when all 30 days completed */}
      {activeDayNumber === 31 && (
        <div className="mt-6 rounded-xl border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-100">
                Tebrikler! 30 Günlük Hızlı Okuma Akademisini Tamamladınız
              </h2>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
                Başlangıç hızınız {progress.baselineKpm ?? '--'} KPM iken güncel hızınız{' '}
                <span className="font-mono font-bold">{progress.currentKpm ?? '--'} KPM</span> seviyesine ulaştı.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCertificate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>Mezuniyet Belgesini Görüntüle</span>
          </button>
        </div>
      )}

      {/* Vertical Dashed Route */}
      <div className="mt-8 flex flex-col">
        {allStops.map((day, idx) => {
          const isCheckup = day.dayNumber === 0;
          const isCompleted = isCheckup
            ? progress.checkupCompleted
            : Boolean(progress.completedDays[day.dayNumber]);
          const isActive = day.dayNumber === activeDayNumber;
          const isLocked = !isCompleted && !isActive;
          const hasNext = idx < allStops.length - 1;
          const record = progress.completedDays[day.dayNumber];
          const showLockedWarning = lockedAlertDay === day.dayNumber;

          return (
            <div key={day.dayNumber} className="flex flex-col">
              {/* Stop Row */}
              <div
                ref={(el) => {
                  sectionRefs.current[day.dayNumber] = el;
                  if (isActive) activeCardRef.current = el;
                }}
                className="flex items-stretch gap-4 sm:gap-5"
              >
                {/* Left Vertical Node & Dashed Track */}
                <div className="flex flex-col items-center shrink-0 w-9 sm:w-10" aria-hidden="true">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm font-bold border-2 shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isActive
                          ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      day.dayNumber
                    )}
                  </div>

                  {hasNext && (
                    <div
                      className={`w-0.5 flex-1 min-h-8 border-l-2 border-dashed ${
                        isCompleted
                          ? 'border-emerald-400 dark:border-emerald-700'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  )}
                </div>

                {/* Right Stop Card */}
                <div className={`flex-1 ${hasNext ? 'pb-5' : ''}`}>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0.92, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="rounded-xl border-2 border-sky-500 dark:border-sky-400 bg-white dark:bg-slate-900 p-5 shadow-lg shadow-sky-500/10 ring-4 ring-sky-500/10 dark:ring-sky-400/10"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-600 dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold tracking-wide">
                          <span aria-hidden="true">📍</span>
                          <span>ŞU AN BURADASIN</span>
                        </span>
                        <span className="text-xs font-mono font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                          {isCheckup ? '0. Gün' : `${day.dayNumber}. Gün`}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {isCheckup
                          ? 'Zorunlu Başlangıç Seviye Ölçümü'
                          : day.dayNumber === 30
                            ? 'Büyük Final · Mezuniyet Check-Up Sınavı'
                            : day.dayNumber === 20
                              ? '2. Ara Check-Up · Seviye Ölçüm Günü'
                              : day.isMilestoneCheckup
                                ? '1. Ara Check-Up · Seviye Ölçüm Günü'
                                : `${day.weekNumber}. Hafta · ${day.steps?.length ?? 3} Adımlı Antrenman`}
                      </div>

                      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                        {isCheckup ? '0. Gün: Başlangıç Seviye Tespiti (Check-Up)' : `${day.dayNumber}. Gün: ${day.title}`}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {day.subtitle}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onSelectDay(day.dayNumber)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 text-sm font-semibold transition-colors cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                          <span>Eğitime Başla</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : isCompleted ? (
                    <div className="rounded-xl border-2 border-emerald-500/70 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <span aria-hidden="true">✓</span>
                          <span>Tamamlandı</span>
                        </span>
                        <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 tabular-nums">
                          {isCheckup ? '0. Gün' : `${day.dayNumber}. Gün`}
                        </span>
                      </div>

                      <h2 className="mt-1.5 text-base font-bold text-slate-900 dark:text-slate-100">
                        {isCheckup ? '0. Gün: Başlangıç Seviye Tespiti (Check-Up)' : `${day.dayNumber}. Gün: ${day.title}`}
                      </h2>

                      <div className="mt-3 pt-3 border-t border-emerald-200/80 dark:border-emerald-800/70 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-mono font-bold tabular-nums text-emerald-800 dark:text-emerald-300">
                            {record ? `${record.effectiveKpm} KPM` : `${progress.baselineKpm ?? '--'} KPM`}
                          </span>
                          {record && record.totalQuestions > 0 && (
                            <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                              · %{record.comprehensionRate} anlama
                            </span>
                          )}
                          {record && record.schulteSeconds !== undefined && (
                            <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                              · Schulte: {record.schulteSeconds.toFixed(1)} sn
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectDay(day.dayNumber)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Tekrarla</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLockedAlertDay(day.dayNumber)}
                      className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/45 p-4 sm:p-5 opacity-75 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Kilitli</span>
                        </span>
                        <span className="font-mono tabular-nums">{day.dayNumber}. Gün</span>
                      </div>

                      <h2 className="mt-1.5 text-base font-semibold text-slate-700 dark:text-slate-300">
                        {day.dayNumber}. Gün: {day.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
                        {day.subtitle}
                      </p>

                      {showLockedWarning && (
                        <div
                          role="alert"
                          className="mt-3 flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>Önceki günü tamamlamalısın</span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating toast when user clicks a locked day */}
      {lockedAlertDay !== null && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-slate-900 px-4 py-3 shadow-lg text-sm font-semibold text-amber-900 dark:text-amber-300"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Önceki günü tamamlamalısın ({lockedAlertDay}. gün kilitli)</span>
        </div>
      )}
    </div>
  );
}
