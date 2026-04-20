import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle, ArrowRight, BookMarked, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { signUp, signInWithGoogle, signInWithMicrosoft } from '../services/authService';
import { analytics } from '../services/analytics';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';

const SIGNUP_TRANSLATIONS: Record<string, any> = {
  English: {
    title: 'Create Account',
    subtitle: 'Start syncing your work context across all your devices.',
    google: 'Google', microsoft: 'Microsoft', or: 'Or continue with email',
    email: 'Email Address', password: 'Password', confirm: 'Confirm Password',
    suggest: 'Suggest secure password',
    button: 'Create account',
    already: 'Already have an account?', signIn: 'Sign in here',
    errorMatch: 'Passwords do not match',
    errorLength: 'Password must be at least 6 characters long',
    fixKey: 'Fix API Key'
  },
  French: {
    title: 'Créer un compte',
    subtitle: 'Synchronisez votre contexte de travail sur tous vos appareils.',
    google: 'Google', microsoft: 'Microsoft', or: 'Ou continuer avec l\'e-mail',
    email: 'Adresse e-mail', password: 'Mot de passe', confirm: 'Confirmer le mot de passe',
    suggest: 'Suggérer un mot de passe sûr',
    button: 'Créer le compte',
    already: 'Vous avez déjà un compte ?', signIn: 'Connectez-vous ici',
    errorMatch: 'Les mots de passe ne correspondent pas',
    errorLength: 'Le mot de passe doit faire au moins 6 caractères',
    fixKey: 'Corriger la clé API'
  },
  Spanish: {
    title: 'Crear Cuenta',
    subtitle: 'Comienza a sincronizar tu contexto de trabajo en todos tus dispositivos.',
    google: 'Google', microsoft: 'Microsoft', or: 'O continúa con el correo',
    email: 'Correo Electrónico', password: 'Contraseña', confirm: 'Confirmar Contraseña',
    suggest: 'Sugerir contraseña segura',
    button: 'Crear cuenta',
    already: '¿Ya tienes una cuenta?', signIn: 'Inicia sesión aquí',
    errorMatch: 'Las contraseñas no coinciden',
    errorLength: 'La contraseña debe tener al menos 6 caracteres',
    fixKey: 'Corregir clave API'
  },
  Portuguese: {
    title: 'Criar Conta',
    subtitle: 'Comece a sincronizar seu contexto em todos os seus dispositivos.',
    google: 'Google', microsoft: 'Microsoft', or: 'Ou continue com e-mail',
    email: 'Endereço de e-mail', password: 'Senha', confirm: 'Confirmar Senha',
    suggest: 'Sugerir senha segura',
    button: 'Criar conta',
    already: 'Já tem uma conta?', signIn: 'Entre aqui',
    errorMatch: 'As senhas não coincidem',
    errorLength: 'A senha deve ter pelo menos 6 caracteres',
    fixKey: 'Corrigir chave API'
  },
  Chinese: {
    title: '创建帐户',
    subtitle: '开始在所有设备上同步您的工作上下文。',
    google: 'Google', microsoft: 'Microsoft', or: '或通过电子邮件继续',
    email: '电子邮件地址', password: '密码', confirm: '确认密码',
    suggest: '建议安全密码',
    button: '创建帐户',
    already: '已有帐户？', signIn: '在此登录',
    errorMatch: '密码不匹配',
    errorLength: '密码长度必须至少为 6 个字符',
    fixKey: '修复 API 密钥'
  },
  German: {
    title: 'Konto erstellen',
    subtitle: 'Synchronisieren Sie Ihren Arbeitskontext auf allen Geräten.',
    google: 'Google', microsoft: 'Microsoft', or: 'Oder mit E-Mail weiter',
    email: 'E-Mail Adresse', password: 'Passwort', confirm: 'Passwort bestätigen',
    suggest: 'Sicheres Passwort vorschlagen',
    button: 'Konto erstellen',
    already: 'Haben Sie bereits ein Konto?', signIn: 'Hier anmelden',
    errorMatch: 'Passwörter stimmen nicht überein',
    errorLength: 'Passwort muss mindestens 6 Zeichen lang sein',
    fixKey: 'API-Key korrigieren'
  }
};

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { preferredLanguage } = useLanguage();
  const t = SIGNUP_TRANSLATIONS[preferredLanguage] || SIGNUP_TRANSLATIONS['English'];

  // Check for global configuration errors
  React.useEffect(() => {
    // Check periodically in case the async connection test completes after mount
    const interval = setInterval(() => {
      const configError = (window as any).__FIREBASE_CONFIG_ERROR__;
      if (configError === "Invalid API Key" && error !== "FIREBASE_KEY_ERROR") {
        setError("FIREBASE_KEY_ERROR");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [error]);

  const handleOverrideKey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newKey = formData.get('overrideKey') as string;
    if (newKey && newKey.trim() !== '') {
      localStorage.setItem('FIREBASE_API_KEY_OVERRIDE', newKey.trim());
      window.location.reload();
    }
  };

  const clearOverride = () => {
    localStorage.removeItem('FIREBASE_API_KEY_OVERRIDE');
    window.location.reload();
  };

  const handleSSOSignIn = async (provider: 'google' | 'microsoft') => {
    setError(null);
    setSsoLoading(provider);
    try {
      const signInMethod = provider === 'google' ? signInWithGoogle : signInWithMicrosoft;
      const userCredential = await signInMethod();
      analytics.track('signup_completed', { method: provider, email: userCredential.user.email });
      analytics.identify(userCredential.user.uid, { email: userCredential.user.email });
      navigate('/dashboard', { state: { message: 'Account created successfully' } });
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}`);
    } finally {
      setSsoLoading(null);
    }
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < 12; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    setConfirmPassword(retVal);
    setShowPassword(true);
    analytics.track('password_suggested');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t.errorMatch);
      return;
    }

    if (password.length < 6) {
      setError(t.errorLength);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signUp(email, password);
      analytics.track('signup_completed', { method: 'email', email });
      if (userCredential.user) {
        analytics.identify(userCredential.user.uid, { email });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error === "FIREBASE_KEY_ERROR") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-lg border-rose-200 dark:border-rose-900/30 p-8 sm:p-10">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary text-center mb-3">{t.fixKey}</h2>
            <form onSubmit={handleOverrideKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary">Paste Exact Web API Key Here</label>
                <input
                  name="overrideKey"
                  type="text"
                  required
                  className="block w-full px-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl theme-text-primary font-mono text-sm"
                  placeholder="AIzaSy..."
                />
              </div>
              <Button fullWidth type="submit" variant="primary" className="bg-rose-600 hover:bg-rose-700">
                Apply Override & Reload
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg border theme-border p-8 sm:p-10">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-sm mb-6 hover:opacity-90 transition-opacity">
              <BookMarked className="w-8 h-8" />
            </Link>
            <h2 className="text-3xl font-bold theme-text-primary tracking-tight">{t.title}</h2>
            <p className="mt-3 theme-text-secondary">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => handleSSOSignIn('google')}
              loading={ssoLoading === 'google'}
              disabled={loading || (!!ssoLoading && ssoLoading !== 'google')}
              className="bg-white dark:bg-slate-900"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.5l3.48-3.48C18.1 1.13 15.35 0 12 0 7.31 0 3.25 2.69 1.25 6.61l3.92 3.04C6.11 7.14 8.8 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.57-.21-2.32H12v4.39h6.44c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.79c2.1-1.94 3.32-4.8 3.32-8.34z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.6-2.79c-1.1.74-2.51 1.18-4.33 1.18-3.34 0-6.17-2.26-7.18-5.32L.89 17.18C2.89 21.11 6.95 24 12 24z" />
                <path fill="#FBBC05" d="M4.82 14.16c-.26-.74-.4-1.54-.4-2.36s.14-1.62.4-2.36L.89 6.41C.32 7.78 0 9.29 0 10.86s.32 3.08.89 4.45l3.93-3.15z" />
              </svg>
              {t.google}
            </Button>
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => handleSSOSignIn('microsoft')}
              loading={ssoLoading === 'microsoft'}
              disabled={loading || (!!ssoLoading && ssoLoading !== 'microsoft')}
              className="bg-white dark:bg-slate-900"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              {t.microsoft}
            </Button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center shadow-sm">
              <div className="w-full border-t theme-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 theme-text-secondary font-medium">{t.or}</span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary ml-1">{t.email}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium theme-text-secondary">{t.password}</label>
                  <button 
                    type="button" 
                    onClick={generatePassword}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {t.suggest}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="block w-full pl-11 pr-12 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary ml-1">{t.confirm}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              icon={ArrowRight}
              className="flex-row-reverse"
            >
              {t.button}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm theme-text-secondary">
              {t.already}{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                {t.signIn}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
