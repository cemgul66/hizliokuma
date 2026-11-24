import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { DayCurriculum } from '../../types/academy';
import { calculateEffectiveKpm } from '../../utils/storage';

interface ChunkReadingStepProps {
  day: DayCurriculum;
  defaultKpm: number;
  stepNumber: number;
  totalSteps: number;
  includeQuiz?: boolean;
  defaultChunkSize?: 2 | 3;
  customParagraphs?: string[];
  nextButtonLabel?: string;
  onAdvanceWithoutQuiz?: () => void;
  onComplete: (result: {
    rawKpm: number;
    effectiveKpm: number;
    comprehensionRate: number;
    correctCount: number;
    totalQuestions: number;
    readingSeconds: number;
  }) => void;
}

interface WordChunk {
  paragraphIndex: number;
  words: string[];
}

export function ChunkReadingStep({
  day,
  defaultKpm,
  stepNumber,
  totalSteps,
  includeQuiz = true,
  defaultChunkSize = 2,
  customParagraphs,
  nextButtonLabel = 'Sonraki Adıma Geç',
  onAdvanceWithoutQuiz,
  onComplete,
}: ChunkReadingStepProps) {
  const reading = day.reading;
  const sourceParagraphs = customParagraphs ?? reading.paragraphs;
  const initialKpm = Math.max(120, Math.min(800, defaultKpm));

  const [chunkSize, setChunkSize] = useState<2 | 3>(defaultChunkSize);
  const [kpm, setKpm] = useState<number>(initialKpm);
  const [stage, setStage] = useState<'reading' | 'quiz'>('reading');
  const [playStatus, setPlayStatus] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const [activeChunkIndex, setActiveChunkIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Build paragraph-preserving 2- or 3-word chunks
  const { chunks, paragraphMap } = useMemo(() => {
    const allChunks: WordChunk[] = [];
    const byPara: Array<Array<{ chunkIndex: number; text: string }>> = [];

    sourceParagraphs.forEach((para, pIdx) => {
      const words = para.trim().split(/\s+/).filter(Boolean);
      const paraChunks: Array<{ chunkIndex: number; text: string }> = [];
      for (let i = 0; i < words.length; i += chunkSize) {
        const slice = words.slice(i, i + chunkSize);
        const globalIdx = allChunks.length;
        allChunks.push({ paragraphIndex: pIdx, words: slice });
        paraChunks.push({ chunkIndex: globalIdx, text: slice.join(' ') });
      }
      byPara.push(paraChunks);
    });

    return { chunks: allChunks, paragraphMap: byPara };
  }, [sourceParagraphs, chunkSize]);

  useEffect(() => {
    if (stage !== 'reading' || playStatus !== 'running') {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const currentChunk = chunks[activeChunkIndex];
    const wordCount = currentChunk?.words.length ?? chunkSize;
    const durationMs = Math.max(160, Math.round((wordCount / kpm) * 60000));

    timerRef.current = window.setTimeout(() => {
      if (activeChunkIndex + 1 < chunks.length) {
        setActiveChunkIndex((prev) => prev + 1);
      } else {
        const secs = Math.max(2, Math.round((performance.now() - startTimeRef.current) / 1000));
        setElapsedSeconds(secs);
        setPlayStatus('done');
        if (includeQuiz) {
          setStage('quiz');
        }
      }
    }, durationMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stage, playStatus, activeChunkIndex, chunks, chunkSize, kpm, includeQuiz]);

  const handleTogglePlay = () => {
    if (playStatus === 'idle') {
      startTimeRef.current = performance.now();
      setActiveChunkIndex(0);
      setPlayStatus('running');
    } else if (playStatus === 'paused') {
      setPlayStatus('running');
    } else if (playStatus === 'running') {
      setPlayStatus('paused');
    }
  };

  const handleRestart = () => {
    startTimeRef.current = performance.now();
    setActiveChunkIndex(0);
    setPlayStatus('running');
  };

  const handleChangeChunkSize = (size: 2 | 3) => {
    setChunkSize(size);
    setActiveChunkIndex(0);
    setPlayStatus('idle');
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
    const totalQuestions = reading.questions.length;
    const comprehensionRate = Math.round((correctCount / totalQuestions) * 100);
    const effectiveKpm = calculateEffectiveKpm(kpm, correctCount, totalQuestions);

    onComplete({
      rawKpm: kpm,
      effectiveKpm,
      comprehensionRate,
      correctCount,
      totalQuestions,
      readingSeconds: elapsedSeconds,
    });
  };

  const progressPct =
    chunks.length > 0 ? Math.round(((activeChunkIndex + 1) / chunks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>
              Adım {stepNumber}/{totalSteps} ·{' '}
              {includeQuiz ? 'Blok Okuma & 3 Soruluk Test' : 'Blok Okuma (Gruplama) Egzersizi'}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            {includeQuiz ? reading.title : '2-3 Kelimelik Bloklarla Akıcı Okuma'}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {stage === 'reading'
              ? 'Metin soluk görünür; parlak vurgulanan kelime gruplarını tek sabitlemede kavrayarak ilerleyin.'
              : 'Blok okuma tamamlandı. Şimdi 3 soruluk anlama testini yanıtlayın.'}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">Blok Hızı</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
            {kpm} KPM
          </div>
        </div>
      </div>

      {stage === 'reading' && (
        <>
          {/* Block size & KPM Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {([2, 3] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleChangeChunkSize(sz)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    chunkSize === sz
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {sz}&apos;li Kelime Bloğu
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setKpm((p) => Math.max(100, p - 25))}
                aria-label="Hızı 25 KPM azalt"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>25 KPM</span>
              </button>
              <span className="px-2 text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {kpm} KPM
              </span>
              <button
                type="button"
                onClick={() => setKpm((p) => Math.min(800, p + 25))}
                aria-label="Hızı 25 KPM artır"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>25 KPM</span>
              </button>
            </div>
          </div>

          {/* Chunked Passage Surface */}
          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 sm:p-7 font-serif text-[17px] sm:text-[18px] leading-[1.9] space-y-5">
            {paragraphMap.map((paraChunks, pIdx) => (
              <p key={pIdx} className="flex flex-wrap gap-x-2 gap-y-1">
                {paraChunks.map((item) => {
                  const isHighlighted =
                    playStatus !== 'idle' && item.chunkIndex === activeChunkIndex;
                  return (
                    <span
                      key={item.chunkIndex}
                      className={`px-1.5 py-0.5 rounded transition-colors duration-100 ${
                        isHighlighted
                          ? 'bg-sky-200/90 dark:bg-sky-800/80 text-slate-950 dark:text-white font-semibold'
                          : 'text-slate-400/75 dark:text-slate-600'
                      }`}
                    >
                      {item.text}
                    </span>
                  );
                })}
              </p>
            ))}
          </article>

          {/* Progress */}
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-sky-600 dark:bg-sky-400 transition-[width] duration-100"
              style={{ width: `${playStatus === 'idle' ? 0 : progressPct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
              >
                {playStatus === 'running' ? (
                  <>
                    <Pause className="w-4 h-4" aria-hidden="true" />
                    <span>Duraklat</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>{playStatus === 'paused' ? 'Devam Et' : 'Blok Okumayı Başlat'}</span>
                  </>
                )}
              </button>

              {playStatus !== 'idle' && (
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Baştan Al</span>
                </button>
              )}
            </div>

            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Blok: {playStatus === 'idle' ? 0 : activeChunkIndex + 1}/{chunks.length}
            </span>
          </div>

          {!includeQuiz && playStatus === 'done' && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Blok okuma egzersizi {kpm} KPM hızında tamamlandı.</span>
              </span>
              <button
                type="button"
                onClick={() => onAdvanceWithoutQuiz?.()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>{nextButtonLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}

      {stage === 'quiz' && (
        <div className="space-y-6">
          <div className="rounded-lg bg-emerald-50/75 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Blok Okuma Tamamlandı
            </span>
            <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              Okuma Hızı: {kpm} KPM
            </span>
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
              Yanıtlanan: {Object.keys(answers).length}/{reading.questions.length}
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
