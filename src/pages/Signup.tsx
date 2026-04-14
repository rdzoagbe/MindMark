import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle, ArrowRight, BookMarked, ShieldCheck } from 'lucide-react';
import { signUp } from '../services/authService';
import { analytics } from '../services/analytics';
import { motion } from 'motion/react';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signUp(email, password);
      analytics.track('signup_completed', { email });
      if (userCredential.user) {
        analytics.identify(userCredential.user.uid, { email });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <Card className="shadow-premium border border-slate-100 dark:border-white/5 p-10 sm:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] text-white shadow-indigo mb-8">
              <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Start syncing your work context across all your devices.
            </p>
          </div>

          <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-4 text-rose-600 dark:text-rose-400 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none font-medium"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none font-medium"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none font-medium"
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
              className="flex-row-reverse py-5 rounded-[1.5rem]"
            >
              Create account
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-display font-extrabold">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
