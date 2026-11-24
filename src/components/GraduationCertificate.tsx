import { ArrowLeft, Award, BookOpenCheck, CheckCircle2, Printer, TrendingUp } from 'lucide-react';
import { AcademyProgress } from '../types/academy';

interface GraduationCertificateProps {
  progress: AcademyProgress;
  onBackToRoadmap: () => void;
}

export function GraduationCertificate({
  progress,
  onBackToRoadmap,
}: GraduationCertificateProps) {
  const day0Record = progress.completedDays[0];
  const day10Record = progress.completedDays[10];
  const day20Record = progress.completedDays[20];
  const day30Record = progress.completedDays[30];

  const day0Kpm = day0Record?.effectiveKpm ?? progress.baselineKpm ?? null;
  const day10Kpm = day10Record?.effectiveKpm ?? null;
  const day20Kpm = day20Record?.effectiveKpm ?? null;
  const day30Kpm = day30Record?.effectiveKpm ?? progress.currentKpm ?? null;

  // Total KPM increase percentage from Day 0 baseline to Day 30 final KPM
  let growthPct = 0;
  let kpmDiff = 0;
  if (day0Kpm !== null && day30Kpm !== null) {
    kpmDiff = day30Kpm - day0Kpm;
    if (day0Kpm > 0) {
      growthPct = Math.round(((day30Kpm - day0Kpm) / day0Kpm) * 100);
    } else if (day30Kpm > 0) {
      growthPct = 100;
    }
  }

  // Overall average comprehension rate across all completed days with quiz questions (0..30)
  const quizRecords = Object.values(progress.completedDays).filter(
    (rec) => rec.totalQuestions > 0
  );
  const averageComprehension =
    quizRecords.length > 0
      ? Math.round(
          quizRecords.reduce((sum, rec) => sum + rec.comprehensionRate, 0) / quizRecords.length
        )
      : 100;

  const milestones = [
    {
      label: '0. Gün Başlangıç Hızı',
      sublabel: 'Başlangıç Seviye Check-Up',
      kpm: day0Kpm,
      comprehension: day0Record?.comprehensionRate,
      highlight: false,
    },
    {
      label: '10. Gün Hızı',
      sublabel: '1. Ara Check-Up Ölçümü',
      kpm: day10Kpm,
      comprehension: day10Record?.comprehensionRate,
      highlight: false,
    },
    {
      label: '20. Gün Hızı',
      sublabel: '2. Ara Check-Up Ölçümü',
      kpm: day20Kpm,
      comprehension: day20Record?.comprehensionRate,
      highlight: false,
    },
    {
      label: '30. Gün Final Hızı',
      sublabel: 'Büyük Final & Mezuniyet',
      kpm: day30Kpm,
      comprehension: day30Record?.comprehensionRate,
      highlight: true,
    },
  ];

  const maxMilestoneKpm = Math.max(
    100,
    ...milestones.map((m) => m.kpm ?? 0)
  );

  const formattedDate = day30Record?.completedAt
    ? new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(
        new Date(day30Record.completedAt)
      )
    : new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(new Date());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Action Bar (hidden when printing) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBackToRoadmap}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Yolculuk Haritasına Dön</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Yazdır / PDF Kaydet</span>
        </button>
      </div>

      {/* Main Certificate Card */}
      <section
        aria-label="Mezuniyet Başarı Belgesi"
        className="rounded-xl border-2 border-emerald-500/70 dark:border-emerald-700 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm print:shadow-none print:border-slate-400"
      >
        {/* Inner Academic Frame */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                30 Günlük Hızlı Okuma Akademisi · Resmi Başarı Karnesi
              </div>
              <h1 className="mt-2 font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Mezuniyet Başarı Belgesi
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Otuz günlük göz kasları, çevresel görüş, blok okuma ve yüksek hızlı kavrama
                müfredatının tüm adımlarını başarıyla tamamladığınız için bu mezuniyet karnesi
                düzenlenmiştir.
              </p>
            </div>

            <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-8 h-8" aria-hidden="true" />
            </div>
          </div>

          {/* Primary KPI Summary */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Toplam KPM Artış Yüzdesi</span>
              </div>
              <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                {growthPct >= 0 ? `+%${growthPct}` : `%${growthPct}`}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {kpmDiff >= 0 ? `+${kpmDiff}` : kpmDiff} KPM net hız kazanımı
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <BookOpenCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                <span>Genel Anlama Ortalaması</span>
              </div>
              <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
                %{averageComprehension}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {quizRecords.length} anlama testi ortalaması
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Tamamlanan Müfredat</span>
              </div>
              <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                30 / 30 Gün
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* 4-Milestone Speed Progression Comparison */}
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Aşamalı Hız Gelişim Karşılaştırması (0 · 10 · 20 · 30. Gün)
            </h2>

            <div className="mt-4 space-y-3">
              {milestones.map((item) => {
                const widthPct =
                  item.kpm !== null
                    ? Math.max(12, Math.round((item.kpm / maxMilestoneKpm) * 100))
                    : 0;

                return (
                  <div
                    key={item.label}
                    className={`rounded-lg border p-4 ${
                      item.highlight
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.label}
                        </span>
                        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                          · {item.sublabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {typeof item.comprehension === 'number' && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                            Anlama: %{item.comprehension}
                          </span>
                        )}
                        <span
                          className={`font-mono text-lg font-bold tabular-nums ${
                            item.highlight
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {item.kpm !== null ? `${item.kpm} KPM` : '-- KPM'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.highlight
                            ? 'bg-emerald-600 dark:bg-emerald-500'
                            : 'bg-sky-600 dark:bg-sky-500'
                        }`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span>Düzenlenme Tarihi: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formattedDate}
              </span>
            </div>
            <div>
              30 Günlük Hızlı Okuma Akademisi · Tamamlanmış Mezuniyet Kaydı
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Return Button */}
      <div className="mt-6 flex justify-end print:hidden">
        <button
          type="button"
          onClick={onBackToRoadmap}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Yolculuk Haritasına Dön</span>
        </button>
      </div>
    </div>
  );
}
