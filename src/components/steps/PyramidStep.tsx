import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';

interface PyramidStepProps {
  sets: string[][];
  stepNumber: number;
  totalSteps: number;
  nextButtonLabel: string;
  onComplete: () => void;
}

export function PyramidStep({
  sets,
  stepNumber,
  totalSteps,
  nextButtonLabel,
  onComplete,
}: PyramidStepProps) {
  const [setIndex, setSetIndex] = useState<number>(0);
  const [activeRow, setActiveRow] = useState<number>(-1);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const [rowDelayMs, setRowDelayMs] = useState<number>(950);

  const timerRef = useRef<number | null>(null);
  const currentSet = sets[setIndex] ?? sets[0] ?? [];
  const totalSets = sets.length;

  useEffect(() => {
    if (status !== 'running') {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setTimeout(() => {
      if (activeRow + 1 < currentSet.length) {
        setActiveRow((prev) => prev + 1);
      } else if (setIndex + 1 < totalSets) {
        setSetIndex((prev) => prev + 1);
        setActiveRow(0);
      } else {
        setStatus('done');
      }
    }, activeRow === -1 ? 250 : rowDelayMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, activeRow, setIndex, currentSet.length, totalSets, rowDelayMs]);

  const handleToggle = () => {
    if (status === 'idle') {
      setSetIndex(0);
      setActiveRow(0);
      setStatus('running');
    } else if (status === 'paused') {
      setStatus('running');
    } else if (status === 'running') {
      setStatus('paused');
    } else if (status === 'done') {
      setSetIndex(0);
      setActiveRow(0);
      setStatus('running');
    }
  };

  const handleRestart = () => {
    setSetIndex(0);
    setActiveRow(0);
    setStatus('running');
  };

  const adjustDelay = (delta: number) => {
    setRowDelayMs((prev) => Math.max(400, Math.min(1800, prev + delta)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
            <span>
              Adım {stepNumber}/{totalSteps} · Genişleyen Kelime Piramidi
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Aktif Görme Açısını Genişletme ({totalSets} Set)
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Gözlerinizi ortadaki dikey çizgiden ayırmadan, satır satır genişleyen kelime gruplarını tek bakışta kavramaya çalışın.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">Piramit Seti</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
            {setIndex + 1}/{totalSets}
          </div>
        </div>
      </div>

      {/* Pyramid Canvas with Vertical Center Guide */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:py-10 overflow-hidden select-none">
        {/* Central Vertical Focus Line */}
        <div
          aria-hidden="true"
          className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-0.5 bg-rose-500/40 dark:bg-rose-400/40 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center gap-3">
          {currentSet.map((line, idx) => {
            const isActive = status !== 'idle' && idx === activeRow;
            const isPast = status === 'done' || (status !== 'idle' && idx < activeRow);
            return (
              <div
                key={`${setIndex}-${idx}`}
                className={`px-4 py-1.5 rounded-lg text-center font-serif text-base sm:text-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-100 dark:bg-sky-900/70 text-slate-950 dark:text-white font-bold ring-2 ring-sky-500 dark:ring-sky-400 scale-[1.03]'
                    : isPast
                      ? 'text-slate-500 dark:text-slate-500 opacity-50'
                      : 'text-slate-400 dark:text-slate-600 opacity-45'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            {status === 'running' ? (
              <>
                <Pause className="w-4 h-4" aria-hidden="true" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>
                  {status === 'paused'
                    ? 'Devam Et'
                    : status === 'done'
                      ? 'Setleri Tekrarla'
                      : 'Piramidi Başlat'}
                </span>
              </>
            )}
          </button>

          {status !== 'idle' && (
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

        {/* Tempo adjustment */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => adjustDelay(150)}
            aria-label="Tempoyu yavaşlat"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Yavaşlat</span>
          </button>
          <span className="px-2 text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {(rowDelayMs / 1000).toFixed(2)} sn/satır
          </span>
          <button
            type="button"
            onClick={() => adjustDelay(-150)}
            aria-label="Tempoyu hızlandır"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hızlandır</span>
          </button>
        </div>
      </div>

      {status === 'done' && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>3 piramit seti başarıyla tamamlandı.</span>
          </span>
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>{nextButtonLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
