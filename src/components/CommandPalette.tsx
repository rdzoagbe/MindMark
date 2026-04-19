import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Zap, ArrowRight, X, Clock, Plus } from 'lucide-react';
import { useSessions } from '../contexts/SessionContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [nextAction, setNextAction] = useState('');
  const [loading, setLoading] = useState(false);
  const { addSession } = useSessions();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + S
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nextAction.trim() || loading) return;

    setLoading(true);
    try {
      const timestamp = new Date().toLocaleString();
      const newSession = {
        title: `Quick Session - ${timestamp}`,
        nextStep: nextAction,
        status: 'active' as const,
        priority: 'medium' as const,
        category: 'Quick Capture',
        tags: ['quick-capture'],
        links: [],
      };

      await addSession(newSession as any);
      setNextAction('');
      setIsOpen(false);
      // Small feedback toast could go here
    } catch (err) {
      console.error('Failed to quick capture:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100]"
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-6"
          >
            <div className="theme-surface border theme-border rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden ring-1 ring-white/20">
              {/* Header */}
              <div className="px-6 py-4 border-b theme-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold theme-text-primary tracking-tight">Quick Action Capture</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[9px] font-black uppercase theme-text-secondary">
                    <Command className="w-2.5 h-2.5" /> Shift S
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-1 theme-text-secondary hover:theme-text-primary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">What is the very next step?</label>
                  <textarea
                    ref={inputRef}
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSubmit();
                      }
                    }}
                    placeholder="e.g., Update the authentication middleware..."
                    className="w-full bg-transparent border-none text-2xl theme-text-primary font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 resize-none leading-relaxed"
                    rows={3}
                  />
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t theme-border">
                  <div className="flex items-center gap-4 text-[10px] font-medium theme-text-secondary uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Auto-generating title
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Plus className="w-3 h-3" />
                      Default priority
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSubmit()}
                    loading={loading}
                    disabled={!nextAction.trim()}
                    icon={ArrowRight}
                    className="flex-row-reverse shadow-lg shadow-indigo-600/20"
                  >
                    Save Action
                  </Button>
                </div>
              </div>

              {/* Footer / Hint */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t theme-border text-[10px] theme-text-secondary font-medium flex justify-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">ESC</kbd> to close</span>
                <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">CMD + Enter</kbd> to save</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
