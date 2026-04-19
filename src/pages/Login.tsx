import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, BookMarked, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { signIn, sendPasswordReset, signInWithGoogle, signInWithMicrosoft } from '../services/authService';
import { analytics } from '../services/analytics';
import { motion, AnimatePresence } from 'motion/react';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

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
      analytics.track('login_completed', { method: provider, email: userCredential.user.email });
      analytics.identify(userCredential.user.uid, { email: userCredential.user.email });
      navigate('/dashboard', { state: { message: 'Signed in successfully' } });
    } catch (err: any) {
      console.error(`[SSO Error] ${provider}:`, err);
      let message = err.message || `Failed to sign in with ${provider}`;
      
      if (err.code === 'auth/unauthorized-domain') {
        message = "UNAUTHORIZED DOMAIN: You must add this URL to your Firebase Console > Authentication > Settings > Authorized domains.";
      } else if (err.code === 'auth/popup-blocked') {
        message = "POPUP BLOCKED: Please enable popups or try opening the app in a new tab.";
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = "Sign-in was cancelled or the popup was closed before completion.";
      }
      
      setError(message);
    } finally {
      setSsoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (resetMode) {
        await sendPasswordReset(email);
        setResetSent(true);
        analytics.track('password_reset_requested', { email });
      } else {
        const userCredential = await signIn(email, password);
        analytics.track('login_completed', { method: 'email', email });
        if (userCredential.user) {
          analytics.identify(userCredential.user.uid, { email });
        }
        navigate('/dashboard', { state: { message: 'Your sessions are now synced across devices' } });
      }
    } catch (err: any) {
      let message = err.message || 'An error occurred. Please try again.';
      if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      }
      setError(message);
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
            <h2 className="text-2xl font-bold theme-text-primary text-center mb-3">Fix API Key</h2>
            <div className="space-y-4 mb-8">
              <p className="theme-text-secondary text-sm text-center">
                Google Cloud is rejecting your API Key. This usually happens if the key is restricted or if you've switched projects.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-3">
                <p className="text-xs font-semibold theme-text-primary uppercase tracking-wider">How to Fix:</p>
                <ol className="text-xs theme-text-secondary space-y-2 list-decimal ml-4">
                  <li>Go to <b>Google Cloud Console</b> &gt; <b>APIs &amp; Services</b> &gt; <b>Credentials</b>.</li>
                  <li>Find the <b>Browser API Key</b> (starts with AIzaSy).</li>
                  <li>Click on it and ensure <b>API Restrictions</b> is set to "None" (or includes Identity Toolkit and Firestore).</li>
                  <li>Copy the key and paste it below.</li>
                </ol>
              </div>
            </div>
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
            {localStorage.getItem('FIREBASE_API_KEY_OVERRIDE') && (
              <button 
                onClick={clearOverride}
                className="mt-6 w-full text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Clear Override and Try Environment Settings Again
              </button>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }

  if (resetSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-lg border theme-border p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary mb-3">Check your email</h2>
            <p className="theme-text-secondary mb-8">
              We've sent a password reset link to <span className="font-semibold theme-text-primary">{email}</span>.
            </p>
            <Button fullWidth onClick={() => {
              setResetSent(false);
              setResetMode(false);
            }}>
              Back to Login
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 my-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg border theme-border p-8 sm:p-10">
          <div className="text-center">
            {resetMode ? (
              <button 
                onClick={() => setResetMode(false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to sign in
              </button>
            ) : (
              <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-sm mb-6 hover:opacity-90 transition-opacity">
                <BookMarked className="w-8 h-8" />
              </Link>
            )}
            <h2 className="text-3xl font-bold theme-text-primary tracking-tight">
              {resetMode ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="mt-3 theme-text-secondary">
              {resetMode 
                ? "Enter your email and we'll send you a link to reset your password."
                : 'Sign in to sync your context across all your devices.'}
            </p>
          </div>

          {!resetMode && (
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
                Google
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
                Microsoft
              </Button>
            </div>
          )}

          {!resetMode && (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center shadow-sm">
                <div className="w-full border-t theme-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-4 theme-text-secondary font-medium">Or continue with</span>
              </div>
            </div>
          )}

          <form className={resetMode ? "mt-8 space-y-6" : "space-y-6"} onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary ml-1">Email Address</label>
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

              {!resetMode && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium theme-text-secondary">Password</label>
                    <button 
                      type="button"
                      onClick={() => setResetMode(true)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              icon={resetMode ? Mail : ArrowRight}
              className={resetMode ? "" : "flex-row-reverse"}
            >
              {resetMode ? 'Send Reset Link' : 'Sign in'}
            </Button>
          </form>

          {!resetMode && (
            <div className="mt-8 text-center">
              <p className="text-sm theme-text-secondary">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                  Sign up for free
                </Link>
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
