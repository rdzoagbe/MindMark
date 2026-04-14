import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, BookMarked } from 'lucide-react';
import { signIn } from '../services/authService';
import { motion } from 'motion/react';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
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
              <BookMarked className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Sign in to sync your context across all your devices.
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
                    placeholder="••••••••"
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
              Sign in
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline font-display font-extrabold">
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
