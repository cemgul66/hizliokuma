import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Grid3X3, Play, RotateCcw } from 'lucide-react';
import { DayCurriculum } from '../../types/academy';

interface SchulteStepProps {
  day: DayCurriculum;
  stepNumber?: number;
  totalSteps: number;
  nextButtonLabel?: string;
  onComplete: (result: { seconds: number; errors: number }) => void;
}

function generateShuffledNumbers(size: number): number[] {
  const total = size * size;
  const arr = Array.from({ length: total }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function SchulteStep({
  day,
  stepNumber = 2,
  totalSteps,
  nextButtonLabel,
  onComplete,
}: SchulteStepProps) {
  const size = day.schulteSize;
  const totalNumbers = size * size;

  const [numbers, setNumbers] = useState<number[]>(() => generateShuffledNumbers(size));
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [nextTarget, setNextTarget] = useState<number>(1);
  const [errors, setErrors] = useState<number>(0);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds((performance.now() - startTimeRef.current) / 1000);
      }, 100);
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  const startExercise = () => {
    setNumbers(generateShuffledNumbers(size));
    setNextTarget(1);
    setErrors(0);
    setWrongCell(null);
    setElapsedSeconds(0);
    startTimeRef.current = performance.now();
    setStatus('running');
  };

  const handleCellClick = (num: number) => {
    if (status !== 'running') return;

    if (num === nextTarget) {
      if (nextTarget === totalNumbers) {
        const finalSecs = Number(((performance.now() - startTimeRef.current) / 1000).toFixed(1));
        setElapsedSeconds(finalSecs);
        setNextTarget(totalNumbers + 1);
        setStatus('done');
      } else {
        setNextTarget((prev) => prev + 1);
      }
    } else if (num > nextTarget) {
      setErrors((prev) => prev + 1);
      setWrongCell(num);
      window.setTimeout(() => setWrongCell(null), 300);
    }
  };

  const gridColsClass =
    size === 3 ? 'grid-cols-3 max-w-xs' : size === 4 ? 'grid-cols-4 max-w-sm' : 'grid-cols-5 max-w-md';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <Grid3X3 className="w-4 h-4" aria-hidden="true" />
            <span>Adım {stepNumber}/{totalSteps} · Schulte Tablosu ({size}x{size})</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Çevresel Görüş ve Hızlı Tarama
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Mümkün olduğunca tablonun merkezine odaklanarak 1&apos;den {totalNumbers}&apos;e kadar sayıları sırayla bulun ve tıklayın.
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Süre</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {elapsedSeconds.toFixed(1)} sn
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Hata</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {errors}
            </div>
          </div>
        </div>
      </div>

      {/* Next Target Banner */}
      <div className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-4 py-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {status === 'done'
            ? `Tüm ${totalNumbers} sayı sırayla tamamlandı.`
            : status === 'idle'
              ? 'Hazır olduğunuzda tabloyu başlatın.'
              : 'Sıradaki Hedef Sayı:'}
        </span>
        {status === 'running' && (
          <span className="text-xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
            {nextTarget}
          </span>
        )}
        {status === 'done' && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Tamamlandı
          </span>
        )}
      </div>

      {/* Schulte Grid */}
      <div className="relative flex justify-center py-2">
        <div className={`grid ${gridColsClass} w-full gap-2.5 sm:gap-3`}>
          {numbers.map((num) => {
            const isFound = num < nextTarget;
            const isWrong = wrongCell === num;

            return (
              <button
                key={num}
                type="button"
                disabled={status !== 'running' || isFound}
                onClick={() => handleCellClick(num)}
                className={`aspect-square rounded-lg border text-lg sm:text-xl font-bold font-mono tabular-nums flex items-center justify-center transition-colors select-none cursor-pointer disabled:cursor-default ${
                  isFound
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    : isWrong
                      ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-400 dark:border-rose-600 text-rose-700 dark:text-rose-300'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-sky-50 dark:hover:bg-slate-800 hover:border-sky-400'
                }`}
              >
                {status === 'idle' ? '•' : num}
              </button>
            );
          })}
        </div>

        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 dark:bg-slate-900/75 backdrop-blur-[1px] rounded-xl">
            <button
              type="button"
              onClick={startExercise}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Schulte Tablosunu Başlat</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        {status !== 'idle' ? (
          <button
            type="button"
            onClick={startExercise}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Tabloyu Yenile</span>
          </button>
        ) : (
          <div />
        )}

        {status === 'done' && (
          <button
            type="button"
            onClick={() => onComplete({ seconds: elapsedSeconds, errors })}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>
              {nextButtonLabel ??
                (totalSteps === 2 ? '1. Günü Tamamla' : '3. Adıma Geç (Okuma & Test)')}
            </span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
