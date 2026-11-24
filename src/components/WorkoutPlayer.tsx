import { useState } from 'react';
import { ArrowLeft, Award, Check, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { getDayCurriculum } from '../data/curriculum';
import { DayRecord, WorkoutStepType } from '../types/academy';
import { formatSeconds } from '../utils/storage';
import { ChunkReadingStep } from './steps/ChunkReadingStep';
import { EyeWarmupStep } from './steps/EyeWarmupStep';
import { PyramidStep } from './steps/PyramidStep';
import { ReadingQuizStep } from './steps/ReadingQuizStep';
import { RsvpStep } from './steps/RsvpStep';
import { SchulteStep } from './steps/SchulteStep';

interface WorkoutPlayerProps {
  dayNumber: number;
  baselineKpm: number | null;
  onFinishDay: (record: DayRecord) => void;
  onExit: () => void;
}

export function WorkoutPlayer({
  dayNumber,
  baselineKpm,
  onFinishDay,
  onExit,
}: WorkoutPlayerProps) {
  const day = getDayCurriculum(dayNumber);
  const pipeline: WorkoutStepType[] = day.steps ?? ['eye', 'schulte', 'reading-quiz'];
  const totalSteps = pipeline.length;

  // currentStepIndex: 0..totalSteps-1 for active steps, totalSteps for completion screen
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [schulteResult, setSchulteResult] = useState<{ seconds: number; errors: number } | null>(
    null
  );
  const [rsvpResult, setRsvpResult] = useState<{ finalKpm: number; wordCount: number } | null>(
    null
  );
  const [completedRecord, setCompletedRecord] = useState<DayRecord | null>(null);

  const getStepShortName = (type: WorkoutStepType): string => {
    switch (type) {
      case 'eye':
        return day.eyePattern === 'diagonal-circular' ? 'Çapraz & Dairesel Göz' : 'Göz Takip';
      case 'schulte':
        return `${day.schulteSize}x${day.schulteSize} Schulte`;
      case 'pyramid':
        return 'Kelime Piramidi';
      case 'rsvp':
        return 'RSVP Akışı';
      case 'chunk-only':
        return 'Blok Okuma';
      case 'chunk-quiz':
        return 'Blok Okuma & Test';
      case 'reading-quiz':
        return day.dayNumber === 30
          ? 'Mezuniyet Sınavı'
          : day.isMilestoneCheckup
            ? 'Ara Check-Up Testi'
            : 'Okuma & Test';
    }
  };

  const getNextButtonLabel = (currentIdx: number): string => {
    const nextType = pipeline[currentIdx + 1];
    if (!nextType) return `${day.dayNumber}. Günü Tamamla`;
    return `${currentIdx + 2}. Adıma Geç (${getStepShortName(nextType)})`;
  };

  const handleSchulteComplete = (res: { seconds: number; errors: number }) => {
    setSchulteResult(res);

    // If Schulte is the final step (e.g. Day 1 2-step flow)
    if (stepIndex + 1 >= totalSteps) {
      const base = baselineKpm ?? 150;
      const speedBonus = Math.max(5, Math.min(25, Math.round(160 / Math.max(res.seconds, 4))));
      const nextKpm = base + speedBonus;

      const record: DayRecord = {
        dayNumber: day.dayNumber,
        completedAt: new Date().toISOString(),
        rawKpm: nextKpm,
        effectiveKpm: nextKpm,
        comprehensionRate: 100,
        correctCount: 0,
        totalQuestions: 0,
        readingSeconds: 0,
        schulteSeconds: res.seconds,
        schulteErrors: res.errors,
      };
      setCompletedRecord(record);
      setStepIndex(totalSteps);
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const handleReadingComplete = (readingRes: {
    rawKpm: number;
    effectiveKpm: number;
    comprehensionRate: number;
    correctCount: number;
    totalQuestions: number;
    readingSeconds: number;
  }) => {
    const record: DayRecord = {
      dayNumber: day.dayNumber,
      completedAt: new Date().toISOString(),
      rawKpm: readingRes.rawKpm,
      effectiveKpm: readingRes.effectiveKpm,
      comprehensionRate: readingRes.comprehensionRate,
      correctCount: readingRes.correctCount,
      totalQuestions: readingRes.totalQuestions,
      readingSeconds: readingRes.readingSeconds,
      schulteSeconds: schulteResult?.seconds,
      schulteErrors: schulteResult?.errors,
    };
    setCompletedRecord(record);
    setStepIndex(totalSteps);
  };

  const effectiveBase = baselineKpm ?? 180;
  const multiplier = day.speedMultiplier ?? 1.2;
  const targetKpm = Math.round(effectiveBase * multiplier);

  const currentType = pipeline[stepIndex];
  const isCompletedView = stepIndex >= totalSteps;
  const gridColsClass =
    totalSteps === 2
      ? 'grid-cols-2'
      : totalSteps === 4
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-3';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Yolculuk Haritasına Dön</span>
        </button>

        <div className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums">
          {day.dayNumber}. Gün · {day.weekNumber}. Hafta
          {day.speedMultiplier ? ` · ${day.speedMultiplier}x Tempo` : ''}
        </div>
      </div>

      {/* Live Stepper Progress Bar */}
      <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            {day.isMilestoneCheckup && (
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                {day.dayNumber === 30
                  ? 'Büyük Final & Mezuniyet Sınavı · Final KPM Hesaplanır'
                  : day.dayNumber === 20
                    ? '2. Ara Seviye Ölçümü · Güncel Hız Güncellenir'
                    : '1. Ara Seviye Ölçümü · Güncel Hız Güncellenir'}
              </div>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {day.dayNumber}. Gün: {day.title}
            </h1>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
            {!isCompletedView ? `Adım ${stepIndex + 1} / ${totalSteps}` : 'Tamamlandı'}
          </span>
        </div>

        <nav aria-label="Antrenman adımları" className={`grid gap-2 sm:gap-3 ${gridColsClass}`}>
          {pipeline.map((type, idx) => {
            const isDone = stepIndex > idx;
            const isCurrent = stepIndex === idx;
            return (
              <div key={`${type}-${idx}`} className="flex items-center gap-2">
                <div
                  className={`flex-1 rounded-lg border px-3 py-2.5 transition-colors ${
                    isCurrent
                      ? 'border-sky-600 dark:border-sky-400 bg-sky-50 dark:bg-sky-950/40'
                      : isDone
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <span
                      className={`font-mono font-semibold ${
                        isCurrent
                          ? 'text-sky-700 dark:text-sky-300'
                          : isDone
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      Adım {idx + 1}/{totalSteps}
                    </span>
                    {isDone && (
                      <Check
                        className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div
                    className={`mt-0.5 text-xs sm:text-sm font-semibold truncate ${
                      isCurrent || isDone
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-500'
                    }`}
                  >
                    {getStepShortName(type)}
                  </div>
                </div>
                {idx < pipeline.length - 1 && totalSteps <= 3 && (
                  <ChevronRight
                    className="hidden sm:block w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Step Stage */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8">
        {!isCompletedView && currentType === 'eye' && (
          <EyeWarmupStep
            key={`eye-${stepIndex}`}
            day={day}
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            nextButtonLabel={getNextButtonLabel(stepIndex)}
            onComplete={() => setStepIndex((prev) => prev + 1)}
          />
        )}

        {!isCompletedView && currentType === 'schulte' && (
          <SchulteStep
            key={`schulte-${stepIndex}`}
            day={day}
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            nextButtonLabel={getNextButtonLabel(stepIndex)}
            onComplete={handleSchulteComplete}
          />
        )}

        {!isCompletedView && currentType === 'pyramid' && (
          <PyramidStep
            key={`pyramid-${stepIndex}`}
            sets={
              day.pyramidSets ?? [
                [
                  'göz',
                  'hızlı okuma',
                  'odaklanma gücü',
                  'beyin görsel algısı',
                  'genişleyen aktif görüş alanı',
                  'tek bakışta anlamlı bütünleri kavramak',
                ],
                [
                  'odak',
                  'sessiz zihin',
                  'akıcı satır ritmi',
                  'kelime grubu tarama',
                  'ileri yönlü kararlı sıçramalar',
                  'gereksiz geri dönüşleri tamamen bırakmak',
                ],
                [
                  'algı',
                  'görsel hız',
                  'derin anlama gücü',
                  'çevresel görüş penceresi',
                  'blok halinde anlam yakalama',
                  'okuma verimliliğini her gün yukarı taşımak',
                ],
              ]
            }
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            nextButtonLabel={getNextButtonLabel(stepIndex)}
            onComplete={() => setStepIndex((prev) => prev + 1)}
          />
        )}

        {!isCompletedView && currentType === 'rsvp' && (
          <RsvpStep
            key={`rsvp-${stepIndex}`}
            text={day.rsvpText ?? day.reading.paragraphs.join(' ')}
            defaultKpm={targetKpm}
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            nextButtonLabel={getNextButtonLabel(stepIndex)}
            onComplete={(res) => {
              setRsvpResult(res);
              setStepIndex((prev) => prev + 1);
            }}
          />
        )}

        {!isCompletedView && currentType === 'chunk-only' && (
          <ChunkReadingStep
            key={`chunk-only-${stepIndex}`}
            day={day}
            defaultKpm={targetKpm}
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            includeQuiz={false}
            defaultChunkSize={day.defaultChunkSize ?? 2}
            customParagraphs={day.rsvpText ? [day.rsvpText] : undefined}
            nextButtonLabel={getNextButtonLabel(stepIndex)}
            onAdvanceWithoutQuiz={() => setStepIndex((prev) => prev + 1)}
            onComplete={handleReadingComplete}
          />
        )}

        {!isCompletedView && currentType === 'chunk-quiz' && (
          <ChunkReadingStep
            key={`chunk-quiz-${stepIndex}`}
            day={day}
            defaultKpm={targetKpm}
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            includeQuiz={true}
            defaultChunkSize={day.defaultChunkSize ?? 2}
            onComplete={handleReadingComplete}
          />
        )}

        {!isCompletedView && currentType === 'reading-quiz' && (
          <ReadingQuizStep
            key={`reading-quiz-${stepIndex}`}
            day={day}
            stepNumber={stepIndex + 1}
            totalSteps={totalSteps}
            onComplete={handleReadingComplete}
          />
        )}

        {/* COMPLETION SCREEN */}
        {isCompletedView && completedRecord && (
          <div className="space-y-6 text-center sm:text-left">
            <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/75 dark:bg-emerald-950/35 p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-600 text-white shrink-0">
                  <Award className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {day.dayNumber === 30
                        ? 'Büyük Final ve Mezuniyet Sınavı Tamamlandı'
                        : day.dayNumber === 20
                          ? '2. Ara Check-Up ve Seviye Ölçümü Tamamlandı'
                          : day.isMilestoneCheckup
                            ? '1. Ara Check-Up ve Seviye Ölçümü Tamamlandı'
                            : `${day.dayNumber}. Gün Başarıyla Tamamlandı`}
                    </span>
                  </div>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {day.dayNumber < 30
                      ? `Tebrikler! ${day.dayNumber + 1}. Günün Kilidi Açıldı`
                      : 'Tebrikler! 30 Günlük Akademiyi Tamamladınız'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {day.dayNumber === 30
                      ? 'Final KPM skorunuz kaydedildi. Şimdi tüm akademi yolculuğunuzu özetleyen Mezuniyet Başarı Belgenizi görüntüleyebilirsiniz.'
                      : day.isMilestoneCheckup
                        ? 'Yeni ara ölçüm KPM skorunuz kaydedildi ve üst paneldeki Güncel Hız değeriniz güncellendi.'
                        : 'Bugünkü tüm adımları bitirdiniz. Güncel KPM skorunuz kaydedildi.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-emerald-200/80 dark:border-emerald-800/60">
                {completedRecord.schulteSeconds !== undefined ? (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Schulte Süresi</div>
                    <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {completedRecord.schulteSeconds.toFixed(1)} sn
                    </div>
                  </div>
                ) : rsvpResult ? (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">RSVP Akış Hızı</div>
                    <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {rsvpResult.finalKpm} KPM
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Göz Isınması</div>
                    <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                      Tamamlandı
                    </div>
                  </div>
                )}

                {completedRecord.totalQuestions > 0 ? (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Okuma & Anlama
                    </div>
                    <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {completedRecord.readingSeconds > 0
                        ? `${formatSeconds(completedRecord.readingSeconds)} · `
                        : ''}
                      %{completedRecord.comprehensionRate}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Schulte Hatası</div>
                    <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {completedRecord.schulteErrors ?? 0} hata
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Güncel KPM</div>
                  <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                    {completedRecord.effectiveKpm} KPM
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onFinishDay(completedRecord)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>
                  {day.dayNumber < 30
                    ? `Haritaya Dön ve ${day.dayNumber + 1}. Güne Geç`
                    : 'Mezuniyet Başarı Belgesini Görüntüle'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
