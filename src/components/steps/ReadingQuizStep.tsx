import { useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Play } from 'lucide-react';
import { DayCurriculum } from '../../types/academy';
import {
  calculateEffectiveKpm,
  calculateKpm,
  countWords,
  formatSeconds,
} from '../../utils/storage';

interface ReadingQuizStepProps {
  day: DayCurriculum;
  stepNumber?: number;
  totalSteps?: number;
  onComplete: (result: {
    rawKpm: number;
    effectiveKpm: number;
    comprehensionRate: number;
    correctCount: number;
    totalQuestions: number;
    readingSeconds: number;
  }) => void;
}

export function ReadingQuizStep({
  day,
  stepNumber = 3,
  totalSteps = 3,
  onComplete,
}: ReadingQuizStepProps) {
  const [stage, setStage] = useState<'ready' | 'reading' | 'quiz'>('ready');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [rawKpm, setRawKpm] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const startTimeRef = useRef<number>(0);
  const reading = day.reading;
  const wordCount = countWords(reading.paragraphs);
  const totalQuestions = reading.questions.length;

  const handleStartReading = () => {
    startTimeRef.current = performance.now();
    setStage('reading');
  };

  const handleFinishReading = () => {
    const seconds = Math.max(2, (performance.now() - startTimeRef.current) / 1000);
    setElapsedSeconds(Math.round(seconds));
    setRawKpm(calculateKpm(wordCount, seconds));
    setAnswers({});
    setStage('quiz');
  };

  const allAnswered = reading.questions.every((q) => typeof answers[q.id] === 'number');

  const handleSubmitQuiz = () => {
    if (!allAnswered) return;
    let correctCount = 0;
    reading.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const comprehensionRate = Math.round((correctCount / totalQuestions) * 100);
    const effectiveKpm = calculateEffectiveKpm(rawKpm, correctCount, totalQuestions);

    onComplete({
      rawKpm,
      effectiveKpm,
      comprehensionRate,
      correctCount,
      totalQuestions,
      readingSeconds: elapsedSeconds,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>
            Adım {stepNumber}/{totalSteps} ·{' '}
            {day.dayNumber === 30
              ? 'Büyük Final & Mezuniyet Sınavı'
              : day.dayNumber === 20
                ? '2. Ara Check-Up & KPM Seviye Ölçümü'
                : day.isMilestoneCheckup
                  ? '1. Ara Check-Up & KPM Seviye Ölçümü'
                  : 'Gün Sonu Okuma & Anlama Testi'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{wordCount} Kelime</span>
        </div>
        <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {reading.title}
        </h2>
      </div>

      {stage === 'ready' && (
        <div className="space-y-5">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {day.dayNumber === 30
              ? `30 günlük akademinin büyük final ölçümündesiniz. "Okumaya Başla" butonuna bastığınızda süre tutulur; ${wordCount} kelimelik final metninin ardından ${totalQuestions} soruluk mezuniyet sınavını tamamlayıp Başarı Belgenizi alacaksınız.`
              : day.dayNumber === 20
                ? 'İlk 20 günün ardından ulaştığınız yeni okuma hızını ve anlama oranını ölçüyoruz. "Okumaya Başla" butonuna bastığınızda süre tutulur; elde edeceğiniz Net KPM skoru üst paneldeki Güncel Hız değerinizi günceller.'
                : day.isMilestoneCheckup
                  ? 'İlk 10 günün ardından ulaştığınız okuma hızını ve anlama oranını ölçüyoruz. "Okumaya Başla" butonuna bastığınızda süre tutulur; elde edeceğiniz Net KPM skoru üst paneldeki Güncel Hız değerinizi günceller.'
                  : `Önceki adımlardaki göz ve odak çalışmalarının ardından şimdi metni akıcı biçimde okuyun. Ardından ${totalQuestions} soruluk anlama testini yanıtlayın.`}
          </p>
          <button
            type="button"
            onClick={handleStartReading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Okumaya Başla</span>
          </button>
        </div>
      )}

      {stage === 'reading' && (
        <div>
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              Süre ölçülüyor — kelimeleri gruplar halinde akıcı okuyun.
            </span>
            <span className="font-mono tabular-nums">{wordCount} kelime</span>
          </div>

          <article className="font-serif text-[17px] sm:text-[18px] leading-[1.8] text-slate-800 dark:text-slate-200 space-y-5 max-w-[65ch]">
            {reading.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </article>

          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleFinishReading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Okumayı Bitirdim</span>
            </button>
          </div>
        </div>
      )}

      {stage === 'quiz' && (
        <div className="space-y-6">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Okuma Süresi: </span>
              <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {formatSeconds(elapsedSeconds)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Ham Hız: </span>
              <span className="font-mono font-semibold tabular-nums text-sky-700 dark:text-sky-400">
                {rawKpm} KPM
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {reading.questions.map((question, qIndex) => (
              <fieldset
                key={question.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-4"
              >
                <legend className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 px-1">
                  {qIndex + 1}. {question.prompt}
                </legend>
                <div className="mt-3 space-y-2">
                  {question.options.map((option, optIdx) => {
                    const isSelected = answers[question.id] === optIdx;
                    const letter = ['A', 'B', 'C', 'D'][optIdx];
                    return (
                      <label
                        key={optIdx}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-sky-600 dark:border-sky-400 bg-sky-50 dark:bg-sky-950/40 text-slate-900 dark:text-slate-100'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={optIdx}
                          checked={isSelected}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [question.id]: optIdx }))
                          }
                          className="mt-0.5 accent-sky-600"
                        />
                        <span>
                          <span className="font-mono font-semibold mr-1.5">{letter})</span>
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Yanıtlanan: {Object.keys(answers).length}/{totalQuestions}
            </span>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={handleSubmitQuiz}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Testi Tamamla ve Günü Bitir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
