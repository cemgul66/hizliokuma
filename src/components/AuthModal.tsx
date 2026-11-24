import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, LogIn, UserPlus, X } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../supabaseClient';
import { translateSupabaseAuthError } from '../utils/supabaseSync';

interface AuthModalProps {
  onClose: () => void;
}

type AuthTab = 'login' | 'signup';

export function AuthModal({ onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase anon anahtarı henüz yapılandırılmamış. Lütfen VITE_SUPABASE_ANON_KEY değişkenini veya supabaseClient.js dosyasındaki anahtarı güncelleyin.'
      );
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMsg(translateSupabaseAuthError(error.message));
          return;
        }

        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMsg(translateSupabaseAuthError(error.message));
          return;
        }

        if (data.user && !data.session) {
          setInfoMsg(
            'Hesabınız oluşturuldu! E-posta adresinize gönderilen doğrulama bağlantısını onayladıktan sonra giriş yapabilirsiniz.'
          );
          return;
        }

        onClose();
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? translateSupabaseAuthError(err.message)
          : 'İşlem sırasında beklenmeyen bir hata oluştu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2
              id="auth-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              Bulut Senkronizasyonu ve Hesap
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              İlerlemenizi tüm cihazlarınızda güvenle saklamak için giriş yapın.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Pencereyi Kapat"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="px-6 pt-4">
          <div
            role="tablist"
            aria-label="Hesap işlemleri"
            className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              onClick={() => handleTabChange('login')}
              className={`py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'signup'}
              onClick={() => handleTabChange('signup')}
              className={`py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Yeni Hesap Oluştur
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              E-posta Adresi
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@eposta.com"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Şifre
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 px-3.5 py-2.5 text-xs text-rose-800 dark:text-rose-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-2.5 text-xs text-emerald-800 dark:text-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{infoMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-60 text-white dark:text-slate-950 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : activeTab === 'login' ? (
              <LogIn className="w-4 h-4" aria-hidden="true" />
            ) : (
              <UserPlus className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {loading
                ? 'İşleniyor...'
                : activeTab === 'login'
                  ? 'Giriş Yap'
                  : 'Yeni Hesap Oluştur'}
            </span>
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Misafir Olarak Devam Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
