import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, Pause, Play, RotateCcw } from 'lucide-react';
import { DayCurriculum } from '../../types/academy';

interface EyeWarmupStepProps {
  day: DayCurriculum;
  stepNumber?: number;
  totalSteps: number;
  nextButtonLabel?: string;
  onComplete: () => void;
}

export function EyeWarmupStep({
  day,
  stepNumber = 1,
  totalSteps,
  nextButtonLabel,
  onComplete,
}: EyeWarmupStepProps) {
  const durationMs = day.eyeDurationSec * 1000;
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [dotPos, setDotPos] = useState<{ xPct: number; yPct: number }>({ xPct: 50, yPct: 50 });

  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  const computePosition = (ms: number): { xPct: number; yPct: number; phaseLabel: string } => {
    const t = Math.min(1, ms / durationMs);
    const half = 0.5;

    if (day.eyePattern === 'diagonal-circular') {
      if (t < half) {
        const local = t / half;
        const sweep = 0.5 - 0.5 * Math.cos(local * Math.PI * 6);
        const x = 14 + sweep * 72;
        const y = local < 0.5 ? 14 + sweep * 72 : 86 - sweep * 72;
        return { xPct: x, yPct: y, phaseLabel: 'Çapraz (Diyagonal) Göz Takibi' };
      }
      const local = (t - half) / half;
      const angle = local * Math.PI * 6;
      return {
        xPct: 50 + 36 * Math.cos(angle),
        yPct: 50 + 36 * Math.sin(angle),
        phaseLabel: 'Dairesel Göz Takibi',
      };
    }

    if (day.eyePattern === 'diagonal' && t >= half) {
      // Second half diagonal sweep
      const local = (t - half) / half;
      const sweep = 0.5 - 0.5 * Math.cos(local * Math.PI * 6);
      const pos = 12 + sweep * 76;
      return { xPct: pos, yPct: pos, phaseLabel: 'Çapraz Odak Takibi' };
    }

    if (day.eyePattern === 'figure-eight' && t >= half) {
      const local = (t - half) / half;
      const angle = local * Math.PI * 6;
      const xPct = 50 + 38 * Math.sin(angle);
      const yPct = 50 + 34 * Math.sin(angle * 2);
      return { xPct, yPct, phaseLabel: 'Sonsuzluk (8) Yörünge Takibi' };
    }

    if (t < half) {
      // Horizontal sweep (left <-> right)
      const local = t / half;
      const sweep = 0.5 - 0.5 * Math.cos(local * Math.PI * 6);
      return {
        xPct: 10 + sweep * 80,
        yPct: 50,
        phaseLabel: 'Yatay Göz Takibi (Soldan Sağa)',
      };
    }

    // Vertical sweep (top <-> bottom)
    const local = (t - half) / half;
    const sweep = 0.5 - 0.5 * Math.cos(local * Math.PI * 6);
    return {
      xPct: 50,
      yPct: 12 + sweep * 76,
      phaseLabel: 'Dikey Göz Takibi (Yukarıdan Aşağıya)',
    };
  };

  useEffect(() => {
    if (status !== 'running') {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }
      const delta = now - lastFrameRef.current;
      lastFrameRef.current = now;

      const nextElapsed = Math.min(durationMs, elapsedRef.current + delta);
      elapsedRef.current = nextElapsed;
      setElapsedMs(nextElapsed);

      const pos = computePosition(nextElapsed);
      setDotPos({ xPct: pos.xPct, yPct: pos.yPct });

      if (nextElapsed >= durationMs) {
        setStatus('done');
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, durationMs]);

  const handleStart = () => {
    if (status === 'done') {
      elapsedRef.current = 0;
      setElapsedMs(0);
    }
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleRestart = () => {
    elapsedRef.current = 0;
    setElapsedMs(0);
    setDotPos({ xPct: 50, yPct: 50 });
    setStatus('running');
  };

  const remainingSec = Math.max(0, (durationMs - elapsedMs) / 1000);
  const progressPct = Math.min(100, (elapsedMs / durationMs) * 100);
  const currentPhase =
    status === 'idle'
      ? day.eyePattern === 'diagonal-circular'
        ? 'Hazır — Başlatınca odak noktası çapraz ve dairesel hareket edecektir'
        : 'Hazır — Başlatınca odak noktası yatay ve dikey hareket edecektir'
      : status === 'done'
        ? '30 Saniyelik Göz Isınması Tamamlandı'
        : computePosition(elapsedMs).phaseLabel;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>Adım {stepNumber}/{totalSteps} · Göz Takip Egzersizi</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            {day.eyePattern === 'diagonal-circular'
              ? '30 Saniyelik Çapraz ve Dairesel Odak Takibi'
              : '30 Saniyelik Yatay ve Dikey Odak Takibi'}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Başınızı sabit tutun ve sadece gözlerinizle hareket eden odak noktasını takip edin.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">Kalan Süre</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {remainingSec.toFixed(1)} sn
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="relative h-72 sm:h-80 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
        {/* Subtle crosshairs */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-slate-200/80 dark:bg-slate-800/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px bg-slate-200/80 dark:bg-slate-800/80"
        />

        {/* Phase instruction bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pointer-events-none">
          <span className="font-medium text-slate-700 dark:text-slate-300">{currentPhase}</span>
          <span className="font-mono tabular-nums">{Math.round(progressPct)}%</span>
        </div>

        {/* Moving Focus Target (GPU-only left/top via wrapper or transform) */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            style={{
              left: `${dotPos.xPct}%`,
              top: `${dotPos.yPct}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              status === 'done'
                ? 'bg-emerald-600 dark:bg-emerald-500'
                : 'bg-sky-600 dark:bg-sky-400 shadow-lg shadow-sky-500/30'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-950" />
          </div>
        </div>

        {/* Overlay prompt when idle */}
        {status === 'idle' && (
          <div className="absolute inset-0 bg-slate-50/75 dark:bg-slate-950/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Göz Isınmasını Başlat (30 sn)</span>
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-sky-600 dark:bg-sky-400 transition-[width] duration-100"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status === 'running' && (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4" aria-hidden="true" />
              <span>Duraklat</span>
            </button>
          )}
          {status === 'paused' && (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Devam Et</span>
            </button>
          )}
          {status !== 'idle' && (
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Baştan Al</span>
            </button>
          )}
        </div>

        {status === 'done' ? (
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>{nextButtonLabel ?? '2. Adıma Geç (Schulte Tablosu)'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Süre dolduğunda sonraki adım otomatik açılır.
          </span>
        )}
      </div>
    </div>
  );
}
