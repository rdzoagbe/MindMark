import React from 'react';
import { X, PlusCircle, FileText, PlayCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'motion/react';

interface OnboardingCardProps {
  onDismiss: () => void;
}

export function OnboardingCard({ onDismiss }: OnboardingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-500/20 shadow-sm">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-10"
          aria-label="Dismiss onboarding"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-2 sm:p-4">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mb-3">
              Welcome to Context Saver 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg">
              Never lose your train of thought again. Context Saver helps you capture exactly what you're doing, why you paused, and what to do next, so you can resume instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">1. Create a session</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Start a new session when you need to step away from your work.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">2. Add context</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Jot down your current task, why you're pausing, and the exact next step.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">3. Resume later</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Come back, read your notes, and pick up exactly where you left off.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
