import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface RsvpStepProps {
  text: string;
  defaultKpm: number;
  stepNumber: number;
  totalSteps: number;
  nextButtonLabel: string;
  onComplete: (result: { finalKpm: number; wordCount: number }) => void;
}

function splitWordOrp(word: string): { before: string; center: string; after: string } {
  if (!word) return { before: '', center: '', after: '' };
  if (word.length === 1) return { before: '', center: word, after: '' };
  const centerIndex = Math.floor((word.length - 1) / 2);
  return {
    before: word.slice(0, centerIndex),
    center: word[centerIndex],
    after: word.slice(centerIndex + 1),
  };
}

export function RsvpStep({
  text,
  defaultKpm,
  stepNumber,
  totalSteps,
  nextButtonLabel,
  onComplete,
}: RsvpStepProps) {
  const words = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean),
    [text]
  );
  const initialKpm = Math.max(120, Math.min(800, defaultKpm));

  const [kpm, setKpm] = useState<number>(initialKpm);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== 'running') {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = Math.max(60, Math.round(60000 / kpm));
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= words.length) {
          setStatus('done');
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, kpm, words.length]);

  const handleTogglePlay = () => {
    if (status === 'idle' || status === 'paused') {
      setStatus('running');
    } else if (status === 'running') {
      setStatus('paused');
    } else if (status === 'done') {
      setCurrentIndex(0);
      setStatus('running');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setStatus('running');
  };

  const adjustKpm = (delta: number) => {
    setKpm((prev) => Math.max(100, Math.min(900, prev + delta)));
  };

  const currentWord = words[currentIndex] ?? '';
  const { before, center, after } = splitWordOrp(currentWord);
  const progressPct =
    words.length > 0
      ? status === 'done'
        ? 100
        : Math.round(((currentIndex + 1) / words.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" aria-hidden="true" />
            <span>
              Adım {stepNumber}/{totalSteps} · RSVP (Hızlı Kelime Akışı)
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Merkez Odaklı Seri Kelime Algılama
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Gözlerinizi kırmızı odak harfinden ayırmadan kelimeleri zihninizde seslendirmeden yakalayın. Başlangıç hızınızın %20 üzerine ayarlanmıştır.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">Akış Hızı</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
            {kpm} KPM
          </div>
        </div>
      </div>

      {/* RSVP Focal Stage */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-14 sm:py-16 px-4 select-none">
        {/* Top & Bottom Focus Guides */}
        <div
          aria-hidden="true"
          className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-rose-500/80 dark:bg-rose-400/80"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-rose-500/80 dark:bg-rose-400/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-px bg-slate-200/70 dark:bg-slate-800/70 pointer-events-none"
        />

        {/* ORP Aligned Word Box */}
        <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-baseline text-3xl sm:text-5xl font-bold tracking-tight min-h-[3.5rem]">
          <span className="text-right text-slate-900 dark:text-slate-100 whitespace-pre">
            {status === 'idle' ? 'Hazır' : before}
          </span>
          <span className="text-center text-rose-600 dark:text-rose-400 min-w-[0.65ch]">
            {status === 'idle' ? '' : center}
          </span>
          <span className="text-left text-slate-900 dark:text-slate-100 whitespace-pre">
            {status === 'idle' ? '' : after}
          </span>
        </div>

        <div className="mt-8 text-center text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
          {status === 'done'
            ? `Tüm ${words.length} kelime tamamlandı`
            : `${currentIndex + 1} / ${words.length} kelime`}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-[width] duration-100 ${
            status === 'done'
              ? 'bg-emerald-600 dark:bg-emerald-500'
              : 'bg-sky-600 dark:bg-sky-400'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
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
                  {status === 'paused' ? 'Devam Et' : status === 'done' ? 'Tekrar Akıt' : 'Başlat'}
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
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        {/* Instant - / + KPM Controls */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => adjustKpm(-25)}
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
            onClick={() => adjustKpm(25)}
            aria-label="Hızı 25 KPM artır"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>25 KPM</span>
          </button>
        </div>
      </div>

      {/* Complete Step Action */}
      {status === 'done' && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>RSVP egzersizi {kpm} KPM hızında tamamlandı.</span>
          </span>
          <button
            type="button"
            onClick={() => onComplete({ finalKpm: kpm, wordCount: words.length })}
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
