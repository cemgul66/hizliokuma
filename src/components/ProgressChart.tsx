import { useMemo, useState } from 'react';
import { getDayCurriculum } from '../data/curriculum';
import { DayRecord } from '../types/academy';

export type ChartMode = 'both' | 'kpm' | 'comprehension';

interface ChartPoint {
  dayNumber: number;
  title: string;
  dateLabel: string;
  rawKpm: number;
  effectiveKpm: number;
  comprehensionRate: number;
  totalQuestions: number;
  isMilestone: boolean;
  milestoneLabel?: string;
}

interface ProgressChartProps {
  records: DayRecord[];
}

const MILESTONE_LABELS: Record<number, string> = {
  0: '0. Gün Başlangıç',
  10: '10. Gün · 1. Check-Up',
  20: '20. Gün · 2. Check-Up',
  30: '30. Gün · Final',
};

export function ProgressChart({ records }: ProgressChartProps) {
  const [mode, setMode] = useState<ChartMode>('both');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const points: ChartPoint[] = useMemo(() => {
    const sorted = [...records].sort((a, b) => a.dayNumber - b.dayNumber);
    return sorted.map((rec) => {
      const curriculum = getDayCurriculum(rec.dayNumber);
      const dateLabel = new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(rec.completedAt));

      return {
        dayNumber: rec.dayNumber,
        title: curriculum.title,
        dateLabel,
        rawKpm: rec.rawKpm,
        effectiveKpm: rec.effectiveKpm,
        comprehensionRate: rec.comprehensionRate,
        totalQuestions: rec.totalQuestions,
        isMilestone: rec.dayNumber in MILESTONE_LABELS,
        milestoneLabel: MILESTONE_LABELS[rec.dayNumber],
      };
    });
  }, [records]);

  const activePoint = useMemo(() => {
    if (points.length === 0) return null;
    if (hoveredDay !== null) {
      return points.find((p) => p.dayNumber === hoveredDay) ?? points[points.length - 1];
    }
    return null;
  }, [points, hoveredDay]);

  // SVG layout dimensions
  const width = 820;
  const height = 340;
  const padLeft = 54;
  const padRight = 52;
  const padTop = 28;
  const padBottom = 42;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxKpmRaw = Math.max(
    250,
    ...points.map((p) => Math.max(p.effectiveKpm, p.rawKpm))
  );
  const kpmStep = maxKpmRaw > 600 ? 150 : maxKpmRaw > 360 ? 100 : 50;
  const maxKpmAxis = Math.ceil(maxKpmRaw / kpmStep) * kpmStep;

  const getX = (dayNumber: number) => padLeft + (dayNumber / 30) * plotW;
  const getYForKpm = (kpm: number) =>
    padTop + plotH - (Math.min(Math.max(kpm, 0), maxKpmAxis) / maxKpmAxis) * plotH;
  const getYForComp = (pct: number) =>
    padTop + plotH - (Math.min(Math.max(pct, 0), 100) / 100) * plotH;

  const kpmTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let v = 0; v <= maxKpmAxis; v += kpmStep) {
      ticks.push(v);
    }
    return ticks;
  }, [maxKpmAxis, kpmStep]);

  const compTicks = [0, 25, 50, 75, 100];
  const xTicks = [0, 5, 10, 15, 20, 25, 30];

  const kpmPath = useMemo(() => {
    if (points.length === 0) return '';
    return points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dayNumber).toFixed(1)} ${getYForKpm(p.effectiveKpm).toFixed(1)}`)
      .join(' ');
  }, [points, maxKpmAxis]);

  const kpmAreaPath = useMemo(() => {
    if (points.length < 2) return '';
    const first = points[0];
    const last = points[points.length - 1];
    return `${kpmPath} L ${getX(last.dayNumber).toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${getX(first.dayNumber).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;
  }, [kpmPath, points]);

  const rawKpmPath = useMemo(() => {
    if (points.length === 0) return '';
    return points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dayNumber).toFixed(1)} ${getYForKpm(p.rawKpm).toFixed(1)}`)
      .join(' ');
  }, [points, maxKpmAxis]);

  const compPath = useMemo(() => {
    if (points.length === 0) return '';
    return points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.dayNumber).toFixed(1)} ${getYForComp(p.comprehensionRate).toFixed(1)}`)
      .join(' ');
  }, [points]);

  const showKpm = mode === 'both' || mode === 'kpm';
  const showComp = mode === 'both' || mode === 'comprehension';

  return (
    <section
      aria-label="Etkileşimli Gelişim Grafiği"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6"
    >
      {/* Chart Header + Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            KPM ve Anlama Gelişim Eğrisi
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            0–30. gün arası Net KPM hızı ve anlama başarısı. Detay görmek için noktaların üzerine gelin.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Grafik görünüm modu"
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 self-start md:self-auto"
        >
          {[
            { id: 'both' as const, label: 'Çift Eksen (Tümü)' },
            { id: 'kpm' as const, label: 'KPM Görünümü' },
            { id: 'comprehension' as const, label: 'Anlama Oranı' },
          ].map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setMode(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
        {showKpm && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-0.5 bg-sky-600 dark:bg-sky-400" aria-hidden="true" />
            <span className="font-medium text-slate-800 dark:text-slate-200">Net KPM</span>
          </div>
        )}
        {mode === 'kpm' && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-0.5 border-t-2 border-dashed border-slate-400 dark:border-slate-500"
              aria-hidden="true"
            />
            <span>Ham KPM</span>
          </div>
        )}
        {showComp && (
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-0.5 border-t-2 border-dashed border-emerald-600 dark:border-emerald-400"
              aria-hidden="true"
            />
            <span className="font-medium text-slate-800 dark:text-slate-200">Anlama Oranı (%)</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rotate-45 bg-amber-500 border border-white dark:border-slate-900"
            aria-hidden="true"
          />
          <span>Check-Up / Final Durakları (0, 10, 20, 30. Gün)</span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="mt-4 relative">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[540px] h-auto select-none overflow-visible"
            role="img"
            aria-label="0'dan 30. güne okuma hızı ve anlama oranı çizgi grafiği"
          >
            <defs>
              <linearGradient id="kpmAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {(mode === 'comprehension' ? compTicks : kpmTicks).map((tick) => {
              const y =
                mode === 'comprehension' ? getYForComp(tick) : getYForKpm(tick);
              return (
                <g key={`hgrid-${tick}`}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth={1}
                  />
                  {showKpm && (
                    <text
                      x={padLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono tabular-nums"
                    >
                      {tick}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Right Y-axis ticks for comprehension when in 'both' or 'comprehension' mode */}
            {showComp &&
              compTicks.map((pct) => {
                const y = getYForComp(pct);
                return (
                  <text
                    key={`comp-axis-${pct}`}
                    x={mode === 'comprehension' ? padLeft - 10 : width - padRight + 10}
                    y={y + 4}
                    textAnchor={mode === 'comprehension' ? 'end' : 'start'}
                    className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-mono tabular-nums"
                  >
                    %{pct}
                  </text>
                );
              })}

            {/* Milestone vertical reference lines (0, 10, 20, 30) */}
            {[0, 10, 20, 30].map((mDay) => {
              const x = getX(mDay);
              return (
                <g key={`milestone-guide-${mDay}`}>
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + plotH}
                    className="stroke-amber-300/70 dark:stroke-amber-700/50"
                    strokeDasharray="3 4"
                    strokeWidth={1}
                  />
                </g>
              );
            })}

            {/* X-axis day ticks */}
            {xTicks.map((dayNum) => {
              const x = getX(dayNum);
              const isMilestone = dayNum in MILESTONE_LABELS;
              return (
                <g key={`xtick-${dayNum}`}>
                  <line
                    x1={x}
                    y1={padTop + plotH}
                    x2={x}
                    y2={padTop + plotH + 5}
                    className="stroke-slate-300 dark:stroke-slate-700"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={padTop + plotH + 20}
                    textAnchor="middle"
                    className={`text-[11px] font-mono tabular-nums ${
                      isMilestone
                        ? 'fill-amber-700 dark:fill-amber-400 font-bold'
                        : 'fill-slate-500 dark:fill-slate-400'
                    }`}
                  >
                    {dayNum}. Gün
                  </text>
                </g>
              );
            })}

            {/* Axis border lines */}
            <line
              x1={padLeft}
              y1={padTop + plotH}
              x2={width - padRight}
              y2={padTop + plotH}
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth={1}
            />

            {/* Axis captions */}
            {showKpm && (
              <text
                x={padLeft}
                y={14}
                textAnchor="start"
                className="fill-sky-700 dark:fill-sky-400 text-[11px] font-semibold"
              >
                Net KPM
              </text>
            )}
            {showComp && (
              <text
                x={mode === 'comprehension' ? padLeft : width - padRight}
                y={14}
                textAnchor={mode === 'comprehension' ? 'start' : 'end'}
                className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-semibold"
              >
                Anlama (%)
              </text>
            )}

            {/* Active hover crosshair */}
            {activePoint && (
              <line
                x1={getX(activePoint.dayNumber)}
                y1={padTop}
                x2={getX(activePoint.dayNumber)}
                y2={padTop + plotH}
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            )}

            {/* Area fill under KPM curve */}
            {showKpm && kpmAreaPath && (
              <path d={kpmAreaPath} fill="url(#kpmAreaGrad)" />
            )}

            {/* Raw KPM reference line (only in KPM mode) */}
            {mode === 'kpm' && rawKpmPath && (
              <path
                d={rawKpmPath}
                fill="none"
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth={1.75}
                strokeDasharray="5 4"
              />
            )}

            {/* Comprehension Line */}
            {showComp && compPath && (
              <path
                d={compPath}
                fill="none"
                className="stroke-emerald-600 dark:stroke-emerald-400"
                strokeWidth={mode === 'comprehension' ? 2.75 : 2.25}
                strokeDasharray={mode === 'both' ? '6 4' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Net KPM Line */}
            {showKpm && kpmPath && (
              <path
                d={kpmPath}
                fill="none"
                className="stroke-sky-600 dark:stroke-sky-400"
                strokeWidth={2.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points + Milestone Diamonds + Hover Targets */}
            {points.map((p) => {
              const cx = getX(p.dayNumber);
              const cyKpm = getYForKpm(p.effectiveKpm);
              const cyComp = getYForComp(p.comprehensionRate);
              const isHovered = activePoint?.dayNumber === p.dayNumber;

              return (
                <g
                  key={`pt-${p.dayNumber}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredDay(p.dayNumber)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() =>
                    setHoveredDay((prev) => (prev === p.dayNumber ? null : p.dayNumber))
                  }
                >
                  {/* Comprehension point */}
                  {showComp && (
                    <circle
                      cx={cx}
                      cy={cyComp}
                      r={p.isMilestone ? 5.5 : isHovered ? 5.5 : 3.5}
                      className={`${
                        p.isMilestone
                          ? 'fill-amber-500 stroke-white dark:stroke-slate-900'
                          : 'fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-slate-900'
                      }`}
                      strokeWidth={1.5}
                    />
                  )}

                  {/* Net KPM point (diamond for milestones, circle for regular days) */}
                  {showKpm &&
                    (p.isMilestone ? (
                      <g transform={`translate(${cx}, ${cyKpm})`}>
                        <rect
                          x={-5.5}
                          y={-5.5}
                          width={11}
                          height={11}
                          rx={1.5}
                          transform="rotate(45)"
                          className={`fill-amber-500 stroke-white dark:stroke-slate-900 ${
                            isHovered ? 'scale-125' : ''
                          }`}
                          strokeWidth={2}
                        />
                        <text
                          y={-12}
                          textAnchor="middle"
                          className="fill-amber-700 dark:fill-amber-300 text-[10px] font-mono font-bold tabular-nums"
                        >
                          {p.effectiveKpm}
                        </text>
                      </g>
                    ) : (
                      <circle
                        cx={cx}
                        cy={cyKpm}
                        r={isHovered ? 6 : 4}
                        className="fill-sky-600 dark:fill-sky-400 stroke-white dark:stroke-slate-900"
                        strokeWidth={1.75}
                      />
                    ))}

                  {/* Invisible generous vertical hit zone for smooth hover/touch */}
                  <rect
                    x={cx - 12}
                    y={padTop}
                    width={24}
                    height={plotH}
                    fill="transparent"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tooltip Display (Positioned cleanly above/below or floating card) */}
        {activePoint ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/80 dark:bg-slate-800/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
                  {activePoint.dayNumber}. Gün
                </span>
                {activePoint.milestoneLabel && (
                  <>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {activePoint.milestoneLabel}
                    </span>
                  </>
                )}
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400">{activePoint.dateLabel}</span>
              </div>
              <div className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
                {activePoint.title}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Ham KPM</div>
                <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {activePoint.rawKpm} KPM
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Anlama</div>
                <div className="font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {activePoint.totalQuestions > 0 ? `%${activePoint.comprehensionRate}` : 'Schulte'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Net KPM</div>
                <div className="font-mono font-bold tabular-nums text-sky-700 dark:text-sky-400">
                  {activePoint.effectiveKpm} KPM
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
            İpucu: Grafik üzerindeki herhangi bir gün noktasına dokunarak veya fareyle üzerine gelerek o günün Ham KPM, Anlama Oranı ve Net KPM detaylarını inceleyebilirsiniz.
          </div>
        )}
      </div>
    </section>
  );
}
