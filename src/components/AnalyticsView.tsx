import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  BookOpenCheck,
  Clock,
  Download,
  Gauge,
  Play,
  TrendingUp,
} from 'lucide-react';
import { getDayCurriculum } from '../data/curriculum';
import { AcademyProgress, DayRecord } from '../types/academy';
import { countWords, getCompletedTrainingDayCount } from '../utils/storage';
import { ProgressChart } from './ProgressChart';

interface AnalyticsViewProps {
  progress: AcademyProgress;
  onBackToRoadmap: () => void;
  onStartCheckup: () => void;
}

interface PhaseDefinition {
  id: number;
  name: string;
  subtitle: string;
  startDay: number;
  endDay: number;
}

const PHASES: PhaseDefinition[] = [
  {
    id: 1,
    name: '1. Faz: Göz Kasları & Odak',
    subtitle: '1–7. Günler · Göz koordinasyonu, Schulte ve temel ritim',
    startDay: 1,
    endDay: 7,
  },
  {
    id: 2,
    name: '2. Faz: Görme Alanı Genişletme',
    subtitle: '8–15. Günler · Kelime piramidi, blok okuma ve 1. Ara Check-Up',
    startDay: 8,
    endDay: 15,
  },
  {
    id: 3,
    name: '3. Faz: İç Sesi Susturma',
    subtitle: '16–23. Günler · Yüksek tempolu RSVP, 3’lü bloklar ve 2. Ara Check-Up',
    startDay: 16,
    endDay: 23,
  },
  {
    id: 4,
    name: '4. Faz: Ustalık & Yüksek Hız',
    subtitle: '24–30. Günler · 2.2x–2.5x yoğun analizler ve Büyük Final',
    startDay: 24,
    endDay: 30,
  },
];

function estimateDayFocusSeconds(record: DayRecord, baselineKpm: number | null): number {
  const curriculum = getDayCurriculum(record.dayNumber);
  if (record.dayNumber === 0) {
    // Check-up reading + answering 5 questions (~45s)
    return (record.readingSeconds || 60) + 45;
  }

  let totalSec = record.readingSeconds + (record.schulteSeconds ?? 0);
  const steps = curriculum.steps ?? ['eye', 'schulte', 'reading-quiz'];
  const baseSpeed = Math.max(80, baselineKpm ?? 160);

  steps.forEach((step) => {
    if (step === 'eye') {
      totalSec += curriculum.eyeDurationSec || 30;
    } else if (step === 'pyramid') {
      totalSec += 45;
    } else if (step === 'rsvp') {
      const words = curriculum.rsvpText
        ? curriculum.rsvpText.trim().split(/\s+/).length
        : 45;
      const targetKpm = baseSpeed * (curriculum.speedMultiplier ?? 1.2);
      totalSec += Math.max(20, Math.round((words / targetKpm) * 60));
    } else if (step === 'chunk-only') {
      const words = curriculum.rsvpText
        ? curriculum.rsvpText.trim().split(/\s+/).length
        : 45;
      const targetKpm = baseSpeed * (curriculum.speedMultiplier ?? 1.2);
      totalSec += Math.max(20, Math.round((words / targetKpm) * 60));
    } else if (step === 'chunk-quiz' && record.readingSeconds === 0) {
      const words = countWords(curriculum.reading.paragraphs);
      const targetKpm = baseSpeed * (curriculum.speedMultiplier ?? 1.2);
      totalSec += Math.max(30, Math.round((words / targetKpm) * 60)) + 25;
    } else if (step === 'reading-quiz') {
      totalSec += curriculum.reading.questions.length * 10;
    }
  });

  return Math.max(30, Math.round(totalSec));
}

function calculateStreak(progress: AcademyProgress): number {
  let streak = 0;
  for (let d = 1; d <= 30; d++) {
    if (progress.completedDays[d]) {
      streak++;
    } else {
      break;
    }
  }
  if (streak === 0 && progress.checkupCompleted) {
    return 1;
  }
  return progress.checkupCompleted ? streak : 0;
}

export function AnalyticsView({
  progress,
  onBackToRoadmap,
  onStartCheckup,
}: AnalyticsViewProps) {
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const completedTrainingCount = getCompletedTrainingDayCount(progress);

  const allRecords = useMemo(() => {
    return Object.values(progress.completedDays).sort(
      (a, b) => a.dayNumber - b.dayNumber
    );
  }, [progress.completedDays]);

  const tableRecords = useMemo(() => {
    return sortDesc ? [...allRecords].reverse() : allRecords;
  }, [allRecords, sortDesc]);

  // 1. Başlangıç Hızı
  const baselineKpm = progress.completedDays[0]?.effectiveKpm ?? progress.baselineKpm;

  // 2. Güncel / En Yüksek Hız & Artış %
  const maxKpm = useMemo(() => {
    if (allRecords.length === 0) return progress.currentKpm;
    const peak = Math.max(
      ...allRecords.map((r) => r.effectiveKpm),
      progress.currentKpm ?? 0
    );
    return peak > 0 ? peak : null;
  }, [allRecords, progress.currentKpm]);

  const peakGrowthPct = useMemo(() => {
    if (baselineKpm === null || maxKpm === null) return null;
    if (baselineKpm === 0) return maxKpm > 0 ? 100 : 0;
    return Math.round(((maxKpm - baselineKpm) / baselineKpm) * 100);
  }, [baselineKpm, maxKpm]);

  // 3. Ortalama Anlama Oranı
  const quizRecords = useMemo(
    () => allRecords.filter((r) => r.totalQuestions > 0),
    [allRecords]
  );

  const avgComprehension = useMemo(() => {
    if (quizRecords.length === 0) return null;
    const sum = quizRecords.reduce((acc, r) => acc + r.comprehensionRate, 0);
    return Math.round(sum / quizRecords.length);
  }, [quizRecords]);

  // 4. Toplam Antrenman Süresi & Seri
  const totalFocusMinutes = useMemo(() => {
    const totalSeconds = allRecords.reduce(
      (acc, rec) => acc + estimateDayFocusSeconds(rec, baselineKpm),
      0
    );
    return Math.max(allRecords.length > 0 ? 1 : 0, Math.round(totalSeconds / 60));
  }, [allRecords, baselineKpm]);

  const streakDays = useMemo(() => calculateStreak(progress), [progress]);

  // Faz Bazlı Başarı Analizi
  const phaseStats = useMemo(() => {
    return PHASES.map((phase) => {
      const totalDays = phase.endDay - phase.startDay + 1;
      const doneRecords: DayRecord[] = [];
      for (let d = phase.startDay; d <= phase.endDay; d++) {
        if (progress.completedDays[d]) {
          doneRecords.push(progress.completedDays[d]);
        }
      }
      const completed = doneRecords.length;
      const pct = Math.round((completed / totalDays) * 100);
      const avgKpm =
        doneRecords.length > 0
          ? Math.round(
              doneRecords.reduce((sum, r) => sum + r.effectiveKpm, 0) /
                doneRecords.length
            )
          : null;

      return {
        ...phase,
        totalDays,
        completed,
        pct,
        avgKpm,
      };
    });
  }, [progress.completedDays]);

  const handleDownloadCsv = () => {
    const headers = [
      'Gün No',
      'Eğitim Başlığı',
      'Tamamlanma Tarihi',
      'Ham KPM',
      'Anlama (%)',
      'Net KPM',
    ];
    const rows = allRecords.map((rec) => {
      const title = getDayCurriculum(rec.dayNumber).title.replace(/"/g, '""');
      const dateStr = new Intl.DateTimeFormat('tr-TR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(rec.completedAt));
      const compStr =
        rec.totalQuestions > 0 ? `%${rec.comprehensionRate}` : 'Schulte';
      return [
        rec.dayNumber,
        `"${title}"`,
        `"${dateStr}"`,
        rec.rawKpm,
        `"${compStr}"`,
        rec.effectiveKpm,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hizli-okuma-gelisim-raporu.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      summary: {
        baselineKpm,
        currentKpm: progress.currentKpm,
        maxKpm,
        peakGrowthPct,
        averageComprehension: avgComprehension,
        completedTrainingDays: completedTrainingCount,
        estimatedFocusMinutes: totalFocusMinutes,
      },
      records: allRecords.map((rec) => ({
        ...rec,
        title: getDayCurriculum(rec.dayNumber).title,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hizli-okuma-gelisim-raporu.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action & Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            type="button"
            onClick={onBackToRoadmap}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Haritaya Dön</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            İstatistikler ve Gelişim Analizi
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Başlangıç Check-Up ölçümünden itibaren hız, anlama oranı ve faz bazlı ilerleme dökümünüz.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToRoadmap}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Haritaya Dön</span>
        </button>
      </div>

      {/* 4 Summary Performance Cards */}
      <section aria-label="Özet Performans Kartları" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Başlangıç Hızı */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Başlangıç Hızı</span>
            <Gauge className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {baselineKpm !== null ? `${baselineKpm} KPM` : '-- KPM'}
          </div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {progress.checkupCompleted
              ? `0. Gün Check-Up · Anlama %${progress.completedDays[0]?.comprehensionRate ?? 100}`
              : 'Henüz başlangıç ölçümü yapılmadı'}
          </div>
        </div>

        {/* Card 2: Güncel / En Yüksek Hız */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Güncel / En Yüksek Hız</span>
            <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
              {maxKpm !== null ? `${maxKpm} KPM` : '-- KPM'}
            </span>
            {peakGrowthPct !== null && (
              <span
                className={`text-xs font-mono font-bold tabular-nums ${
                  peakGrowthPct >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {peakGrowthPct >= 0 ? `+%${peakGrowthPct}` : `%${peakGrowthPct}`}
              </span>
            )}
          </div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {progress.currentKpm !== null
              ? `Son skor: ${progress.currentKpm} KPM`
              : 'Başlangıca göre net hız değişimi'}
          </div>
        </div>

        {/* Card 3: Ortalama Anlama Oranı */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Ortalama Anlama Oranı</span>
            <BookOpenCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {avgComprehension !== null ? `%${avgComprehension}` : '--'}
          </div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {quizRecords.length > 0
              ? `Tamamlanan ${quizRecords.length} anlama testi ortalaması`
              : 'Test tamamlandıkça hesaplanır'}
          </div>
        </div>

        {/* Card 4: Toplam Antrenman Süresi & Seri */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Antrenman Süresi & Seri</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {totalFocusMinutes} dk
          </div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {completedTrainingCount}/30 Gün tamamlandı · Seri: {streakDays} gün
          </div>
        </div>
      </section>

      {/* Interactive Line Chart or First-Time Prompt */}
      {allRecords.length > 0 ? (
        <ProgressChart records={allRecords} />
      ) : (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Gelişim Grafiğiniz Henüz Boş
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            KPM hızınızı ve anlama eğrinizi görselleştirmek için önce 0. Gün Başlangıç Seviye Tespiti (Check-Up) testini tamamlayın.
          </p>
          <button
            type="button"
            onClick={onStartCheckup}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>0. Gün Check-Up Testine Başla</span>
          </button>
        </section>
      )}

      {/* Phase-Based Completion Progress */}
      <section
        aria-label="Faz Bazlı Başarı Analizi"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6"
      >
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Faz Bazlı Başarı Analizi
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            30 günlük müfredatın 4 ana gelişim fazındaki tamamlanma oranınız ve faz ortalamalarınız.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {phaseStats.map((phase) => (
            <div
              key={phase.id}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {phase.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {phase.subtitle}
                  </p>
                </div>
                <span className="font-mono text-sm font-bold tabular-nums text-sky-700 dark:text-sky-400 shrink-0">
                  %{phase.pct}
                </span>
              </div>

              <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    phase.pct === 100
                      ? 'bg-emerald-600 dark:bg-emerald-500'
                      : 'bg-sky-600 dark:bg-sky-500'
                  }`}
                  style={{ width: `${phase.pct}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                <span>
                  {phase.completed} / {phase.totalDays} Gün tamamlandı
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {phase.avgKpm !== null ? `Ort: ${phase.avgKpm} KPM` : 'Henüz başlanmadı'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chronological History Table & Export Controls */}
      <section
        aria-label="Tamamlanan Günler Geçmiş Tablosu"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Kronolojik Performans Geçmişi
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Tamamlanan tüm Check-Up ve günlük antrenman kayıtlarınız.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allRecords.length > 1 && (
              <button
                type="button"
                onClick={() => setSortDesc((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{sortDesc ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}</span>
              </button>
            )}

            <button
              type="button"
              disabled={allRecords.length === 0}
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white dark:text-slate-950 text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Raporu İndir (CSV)</span>
            </button>

            <button
              type="button"
              disabled={allRecords.length === 0}
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-50 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {tableRecords.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 pr-4 whitespace-nowrap">Gün No</th>
                  <th className="py-3 pr-4">Eğitim Başlığı</th>
                  <th className="py-3 pr-4 whitespace-nowrap">Tarih</th>
                  <th className="py-3 pr-4 text-right whitespace-nowrap">Ham KPM</th>
                  <th className="py-3 pr-4 text-right whitespace-nowrap">Anlama %</th>
                  <th className="py-3 text-right whitespace-nowrap">Net KPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {tableRecords.map((rec) => {
                  const dayMeta = getDayCurriculum(rec.dayNumber);
                  const dateFormatted = new Intl.DateTimeFormat('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(rec.completedAt));
                  const isMilestone =
                    rec.dayNumber === 0 ||
                    rec.dayNumber === 10 ||
                    rec.dayNumber === 20 ||
                    rec.dayNumber === 30;

                  return (
                    <tr
                      key={rec.dayNumber}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pr-4 font-mono font-bold tabular-nums whitespace-nowrap text-slate-900 dark:text-slate-100">
                        <span className={isMilestone ? 'text-amber-700 dark:text-amber-400' : ''}>
                          {rec.dayNumber}. Gün
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-800 dark:text-slate-200 font-medium">
                        {dayMeta.title}
                      </td>
                      <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {rec.rawKpm} KPM
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums whitespace-nowrap">
                        {rec.totalQuestions > 0 ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            %{rec.comprehensionRate}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Schulte
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono font-bold tabular-nums text-sky-700 dark:text-sky-400 whitespace-nowrap">
                        {rec.effectiveKpm} KPM
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Henüz tamamlanmış bir gün kaydı bulunmuyor.
          </div>
        )}
      </section>
    </div>
  );
}
