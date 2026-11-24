import { ArrowLeft, BookOpen, Eye, Grid3X3, Gauge } from 'lucide-react';

interface GuideViewProps {
  onBack: () => void;
}

export function GuideView({ onBack }: GuideViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>İlerleme Haritasına Dön</span>
      </button>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            30 Günlük Akademi Nasıl Çalışır?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Program, göz kaslarınızı güçlendirmek, çevresel görüş alanınızı genişletmek ve iç seslendirme alışkanlığını azaltarak okuma verimliliğinizi artırmak üzere aşamalı olarak tasarlanmıştır.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <Gauge className="w-4 h-4" aria-hidden="true" />
              <span>0. Gün: Başlangıç Seviye Tespiti</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Yaklaşık 250 kelimelik ölçüm metnini doğal hızınızda okuyup 5 anlama sorusunu yanıtlarsınız. Ham okuma hızınız doğru cevap oranıyla çarpılarak Gerçek Okuma Hızınız (KPM) belirlenir.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>Adım 1: 30 Saniyelik Göz Isınması</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Başınızı sabit tutarak yatay, dikey ve ilerleyen haftalarda çapraz eksende hareket eden odak noktasını gözlerinizle takip edersiniz. Bu çalışma satır geçişlerindeki göz yorgunluğunu azaltır.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <Grid3X3 className="w-4 h-4" aria-hidden="true" />
              <span>Adım 2: Schulte Tablosu</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              3x3&apos;ten başlayıp 4x4 ve 5x5&apos;e genişleyen sayı matrislerinde merkeze bakarak 1&apos;den başlayıp sayıları sırayla bulursunuz. Tek bakışta daha fazla kelimeyi algılamayı öğretir.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Adım 3: Gün Sonu Okuma & Test</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Günün tekniğini kısa bir metin üzerinde uygular ve 3 soruluk anlama testini çözersiniz. Tüm verileriniz cihazınızdaki tarayıcı hafızasında güvenle saklanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
