import { useRef, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Play, Sparkles } from 'lucide-react';
import { CHECKUP_DAY } from '../data/curriculum';
import { DayRecord } from '../types/academy';
import {
  calculateEffectiveKpm,
  calculateKpm,
  countWords,
  formatSeconds,
} from '../utils/storage';

interface CheckupFlowProps {
  onComplete: (record: DayRecord) => void;
  onCancel: () => void;
  isRetake: boolean;
}

type CheckupStage = 'intro' | 'reading' | 'quiz' | 'result';

export function CheckupFlow({ onComplete, onCancel, isRetake }: CheckupFlowProps) {
  const [stage, setStage] = useState<CheckupStage>('intro');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [rawKpm, setRawKpm] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finalRecord, setFinalRecord] = useState<DayRecord | null>(null);

  const startTimeRef = useRef<number>(0);
  const reading = CHECKUP_DAY.reading;
  const wordCount = countWords(reading.paragraphs);
  const totalQuestions = reading.questions.length;

  const handleStartReading = () => {
    startTimeRef.current = performance.now();
    setStage('reading');
  };

  const handleFinishReading = () => {
    const endTime = performance.now();
    const seconds = Math.max(2, (endTime - startTimeRef.current) / 1000);
    const computedRaw = calculateKpm(wordCount, seconds);
    setElapsedSeconds(Math.round(seconds));
    setRawKpm(computedRaw);
    setAnswers({});
    setStage('quiz');
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
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

    const record: DayRecord = {
      dayNumber: 0,
      completedAt: new Date().toISOString(),
      rawKpm,
      effectiveKpm,
      comprehensionRate,
      correctCount,
      totalQuestions,
      readingSeconds: elapsedSeconds,
    };

    setFinalRecord(record);
    setStage('result');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Haritaya Dön</span>
      </button>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        {/* Header Metadata */}
        <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-2">
          <span>0. Gün</span>
          <span aria-hidden="true">·</span>
          <span>Zorunlu Başlangıç Seviye Tespiti</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{wordCount} Kelime</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {reading.title}
        </h1>

        {/* Stage 1: Intro */}
        {stage === 'intro' && (
          <div className="mt-6 space-y-6">
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isRetake
                ? 'Başlangıç seviye tespitini tekrar ölçmek üzeresiniz. Test sonunda güncel başlangıç skorunuz güncellenecektir.'
                : 'Akademiye başlamadan önce mevcut okuma hızınızı ve anlama oranınızı ölçeceğiz. Bu ölçüm tamamlandığında 1. Gün antrenmanınızın kilidi açılacaktır.'}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 border-y border-slate-200 dark:border-slate-800 py-5">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  1. Adım
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Metni Doğal Hızda Okuyun
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Kronometre arka planda sessizce çalışır; dikkatiniz dağılmaz.
                </p>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  2. Adım
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  5 Soruyu Yanıtlayın
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Okuduğunuzu anlama oranınız gerçek okuma hızınızı belirler.
                </p>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  3. Adım
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  1. Günü Açın
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Başlangıç KPM değeriniz kaydedilir ve harita aktifleşir.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleStartReading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Testi Başlat</span>
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Reading */}
        {stage === 'reading' && (
          <div className="mt-6">
            <div className="mb-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                Kronometre arka planda çalışıyor — rahat ve doğal hızınızda okuyun.
              </span>
              <span className="font-mono tabular-nums">{wordCount} kelime</span>
            </div>

            <article className="font-serif text-[17px] sm:text-[18px] leading-[1.8] text-slate-800 dark:text-slate-200 space-y-5 max-w-[65ch]">
              {reading.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </article>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Metni bitirdiğinizde aşağıdaki butona tıklayın.
              </span>
              <button
                type="button"
                onClick={handleFinishReading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Okumayı Bitirdim</span>
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Quiz (5 questions) */}
        {stage === 'quiz' && (
          <div className="mt-6 space-y-6">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Okuma Süresi: </span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {formatSeconds(elapsedSeconds)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Ham Okuma Hızı: </span>
                <span className="font-mono font-semibold tabular-nums text-sky-700 dark:text-sky-400">
                  {rawKpm} KPM
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Anlama Testi (5 Soru)
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Gerçek okuma hızınızı belirlemek için metinle ilgili soruları yanıtlayın.
              </p>
            </div>

            <div className="space-y-6">
              {reading.questions.map((question, qIndex) => (
                <fieldset
                  key={question.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 sm:p-5"
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
                            onChange={() => handleSelectOption(question.id, optIdx)}
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
                className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Sonucu Hesapla ve Kaydet
              </button>
            </div>
          </div>
        )}

        {/* Stage 4: Result */}
        {stage === 'result' && finalRecord && (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 p-6">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>Başlangıç Ölçümü Tamamlandı · 1. Günün Kilidi Açıldı</span>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Okuma Süresi</div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {formatSeconds(finalRecord.readingSeconds)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Ham KPM</div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {finalRecord.rawKpm} KPM
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Anlama Yüzdesi</div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    %{finalRecord.comprehensionRate}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      ({finalRecord.correctCount}/{finalRecord.totalQuestions})
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Net KPM</div>
                  <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                    {finalRecord.effectiveKpm} KPM
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ham KPM × Anlama Oranı
                  </div>
                </div>
              </div>
            </div>

            {/* Question review summary */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Soru Değerlendirmesi
              </h3>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {reading.questions.map((q, idx) => {
                  const userChoice = answers[q.id];
                  const isCorrect = userChoice === q.correctIndex;
                  return (
                    <div key={q.id} className="p-3.5 text-xs sm:text-sm flex items-start justify-between gap-3">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {idx + 1}. {q.prompt}
                        </span>
                        {!isCorrect && (
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            Doğru yanıt: <span className="font-medium text-emerald-700 dark:text-emerald-400">{q.options[q.correctIndex]}</span>
                          </div>
                        )}
                      </div>
                      <span
                        className={`shrink-0 font-semibold ${
                          isCorrect
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {isCorrect ? 'Doğru' : 'Yanlış'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onComplete(finalRecord)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Kursa Başla</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
