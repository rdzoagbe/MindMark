import { useState, useMemo } from 'react';
import { Plus, Pin, Sparkles, Cloud, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionCard } from '../components/SessionCard';
import { SummaryStrip } from '../components/SummaryStrip';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyState } from '../components/EmptyState';
import { SessionStatus } from '../types';
import { FeatureGate } from '../components/FeatureGate';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

export function Home() {
  const { sessions, togglePin, updateStatus } = useSessions();
  const { isFree, isPro } = usePlan();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('active');
  const navigate = useNavigate();

  // Filter sessions based on search query and status
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const pinnedSessions = filteredSessions.filter(s => s.pinned);
  const otherSessions = filteredSessions.filter(s => !s.pinned);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back. Pick up exactly where you left off."
      >
        <Button 
          onClick={() => navigate('/create')}
          icon={Plus}
          size="lg"
        >
          New Session
        </Button>
      </PageHeader>

      <SummaryStrip sessions={sessions} />
      
      {isFree && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/pricing" className="block group">
            <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.01] active:scale-[0.99] transition-all border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-2xl">Upgrade to Plus</h3>
                    <p className="text-indigo-100 font-medium">Unlock pinned sessions, smart reminders, and more.</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white/20 px-6 py-3 rounded-2xl text-sm font-display font-bold group-hover:bg-white/30 transition-colors backdrop-blur-md">
                  View Plans
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      {isPro && !isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link to="/signup" className="block group">
            <Card variant="ghost" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-indigo">
                    <Cloud className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Cloud Sync Available</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Create account to sync across devices.</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-display font-bold text-sm">
                  Get Started
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      <div className="space-y-8">
        <SearchFilterBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredSessions.length > 0 ? (
          <div className="space-y-16">
            <FeatureGate feature="pinned_sessions" inline>
              {pinnedSessions.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[1rem] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Pin className="w-5 h-5 fill-current" />
                    </div>
                    <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">Pinned Sessions</h2>
                  </div>
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {pinnedSessions.map((session) => (
                      <motion.div key={session.id} variants={item}>
                        <SessionCard 
                          session={session} 
                          onTogglePin={togglePin}
                          onUpdateStatus={updateStatus}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}
            </FeatureGate>

            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                  {pinnedSessions.length > 0 ? 'Recent Sessions' : 'All Sessions'}
                </h2>
              </div>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {otherSessions.map((session) => (
                  <motion.div key={session.id} variants={item}>
                    <SessionCard 
                      session={session} 
                      onTogglePin={togglePin}
                      onUpdateStatus={updateStatus}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </div>
        ) : (
          <EmptyState 
            isSearch={searchQuery !== '' || statusFilter !== 'all'} 
            onClearSearch={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }} 
          />
        )}
      </div>
    </div>
  );
}
