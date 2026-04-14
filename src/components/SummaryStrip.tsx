import { BarChart3, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useMemo, memo } from 'react';
import { Session } from '../types';
import { Card } from './ui/Card';

interface SummaryStripProps {
  sessions: Session[];
}

export const SummaryStrip = memo(({ sessions }: SummaryStripProps) => {
  const stats = useMemo(() => {
    const active = sessions.filter(s => s.status === 'active');
    const done = sessions.filter(s => s.status === 'done').length;
    const today = new Date().setHours(0, 0, 0, 0);
    const resumableToday = active.filter(s => s.updatedAt >= today).length;
    const lastUpdated = active.length > 0 
      ? new Date(Math.max(...active.map(s => s.updatedAt))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'N/A';

    return {
      active: active.length,
      done,
      resumableToday,
      lastUpdated
    };
  }, [sessions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5 flex items-center gap-5 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active</p>
          <p className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.active}</p>
        </div>
      </Card>
      <Card className="p-5 flex items-center gap-5 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-[1rem] bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Completed</p>
          <p className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.done}</p>
        </div>
      </Card>
      <Card className="p-5 flex items-center gap-5 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-[1rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Today</p>
          <p className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.resumableToday}</p>
        </div>
      </Card>
      <Card className="p-5 flex items-center gap-5 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-[1rem] bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Updated</p>
          <p className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.lastUpdated}</p>
        </div>
      </Card>
    </div>
  );
});
