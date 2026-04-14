import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, BookMarked, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { motion, AnimatePresence } from 'motion/react';
import { PlanBadge } from './PlanBadge';

export function Layout() {
  const location = useLocation();
  const { currentPlan, isFree } = usePlan();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/create', icon: PlusCircle, label: 'New Session' },
    { path: '/pricing', icon: Sparkles, label: 'Plans', highlight: isFree },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-500">
      <header className="glass sticky top-0 z-30 border-b border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-display font-extrabold text-2xl tracking-tight hover:opacity-80 transition-all active:scale-95">
              <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-indigo">
                <BookMarked className="w-6 h-6" />
              </div>
              <span className="hidden sm:inline">Context Saver</span>
            </Link>
            <div className="hidden lg:block">
              <PlanBadge plan={currentPlan} size="sm" />
            </div>
          </div>
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all duration-300 ${
                    isActive
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="header-nav-pill"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${item.highlight && !isActive ? 'text-amber-500 animate-pulse' : ''}`} />
                  <span className="hidden md:inline relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pb-32 sm:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation - Only on small screens */}
      <nav className="sm:hidden fixed bottom-8 left-6 right-6 glass rounded-[2.5rem] shadow-premium z-40 overflow-hidden p-2 border-2 border-white/40 dark:border-white/10">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-90 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-[1.5rem]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${item.highlight && !isActive ? 'text-amber-500 animate-pulse' : ''}`} />
                <span className="text-[10px] font-display font-bold uppercase tracking-widest relative z-10">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
