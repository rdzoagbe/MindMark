import { useState, useMemo, useEffect } from 'react';
import { Plus, Pin, Sparkles, Cloud, ArrowRight, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSessions } from '../contexts/SessionContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../hooks/useLanguage';
import { SessionCard } from '../components/SessionCard';
import { SummaryStrip } from '../components/SummaryStrip';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyState } from '../components/EmptyState';
import { OnboardingCard } from '../components/OnboardingCard';
import { SessionStatus } from '../types';
import { FeatureGate } from '../components/FeatureGate';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';
import { analytics } from '../services/analytics';

const HOME_TRANSLATIONS: Record<string, any> = {
  English: {
    dashboard: 'Dashboard', welcome: 'Welcome back. Pick up exactly where you left off.', newSession: 'New Session',
    upgradeTitle: 'Upgrade to Plus', upgradeDesc: 'Unlock pinned sessions, smart reminders, and more.', viewPlans: 'View Plans',
    syncTitle: 'Cloud Sync Available', syncDesc: 'Create account to sync across devices.', getStarted: 'Get Started',
    pinned: 'Pinned Sessions', recent: 'Recent Sessions', all: 'All Sessions',
    syncing: 'Syncing sessions...',
    emptyTitle: 'Your future self will thank you',
    emptyDesc: "MindMark helps you save what you were doing, why you paused, and what to do next. Capture your first context before you step away.",
    searchEmptyTitle: 'No matches found',
    searchEmptyDesc: "We couldn't find any sessions matching your search. Try a different search term or clear filters.",
    statusEmpty: 'No {status} sessions',
    statusEmptyDesc: "You don't have any sessions marked as {status} right now.",
    clearFilters: 'Clear Filters',
    sessionDeleted: 'Session deleted successfully'
  },
  French: {
    dashboard: 'Tableau', welcome: 'Bon retour. Reprenez exactement là où vous vous étiez arrêté.', newSession: 'Nouvelle Session',
    upgradeTitle: 'Passer à Plus', upgradeDesc: 'Débloquez les sessions épinglées, les rappels et plus encore.', viewPlans: 'Voir les forfaits',
    syncTitle: 'Synchronisation Cloud', syncDesc: 'Créez un compte pour synchroniser.', getStarted: 'Commencer',
    pinned: 'Sessions épinglées', recent: 'Sessions récentes', all: 'Toutes les sessions',
    syncing: 'Synchronisation des sessions...',
    emptyTitle: 'Votre futur moi vous remerciera',
    emptyDesc: "MindMark vous aide à enregistrer ce que vous faisiez, pourquoi vous vous êtes arrêté et quoi faire ensuite.",
    searchEmptyTitle: 'Aucun résultat trouvé',
    searchEmptyDesc: "Nous n'avons trouvé aucune session correspondant à votre recherche. Essayez un autre terme ou effacez les filtres.",
    statusEmpty: 'Aucune session {status}',
    statusEmptyDesc: "Vous n'avez aucune session marquée comme {status} pour le moment.",
    clearFilters: 'Effacer les filtres',
    sessionDeleted: 'Session supprimée avec succès'
  },
  Spanish: {
    dashboard: 'Panel', welcome: 'De vuelta. Retoma exactamente donde lo dejaste.', newSession: 'Nueva Sesión',
    upgradeTitle: 'Mejorar a Plus', upgradeDesc: 'Desbloquea sesiones ancladas, recordatorios y más.', viewPlans: 'Ver Planes',
    syncTitle: 'Sincronización Cloud', syncDesc: 'Crea una cuenta para sincronizar.', getStarted: 'Empezar',
    pinned: 'Sesiones ancladas', recent: 'Sesiones recientes', all: 'Todas las sesiones',
    syncing: 'Sincronizando sesiones...',
    emptyTitle: 'Tu yo del futuro te lo agradecerá',
    emptyDesc: "MindMark te ayuda a guardar lo que estabas haciendo, por qué te detuviste y qué hacer a continuación.",
    searchEmptyTitle: 'No se encontraron coincidencias',
    searchEmptyDesc: "No pudimos encontrar ninguna sesión que coincida con tu búsqueda. Prueba con otro término o borra los filtros.",
    statusEmpty: 'Sin sesiones {status}',
    statusEmptyDesc: "No tienes ninguna sesión marcada como {status} en este momento.",
    clearFilters: 'Borrar filtros',
    sessionDeleted: 'Sesión eliminada con éxito'
  },
  Portuguese: {
    dashboard: 'Painel', welcome: 'Bem vindo de volta. Retome exatamente onde parou.', newSession: 'Nova Sessão',
    upgradeTitle: 'Atualizar para Plus', upgradeDesc: 'Desbloqueie sessões fixadas, lembretes e mais.', viewPlans: 'Ver Planos',
    syncTitle: 'Cloud Sync', syncDesc: 'Crie uma conta para sincronizar.', getStarted: 'Começar',
    pinned: 'Sessions fixadas', recent: 'Sessions recentes', all: 'Todas as sessões',
    syncing: 'Sincronizando sessões...',
    emptyTitle: 'Seu eu do futuro agradecerá',
    emptyDesc: "MindMark ajuda você a salvar o que estava fazendo, por que parou e o que fazer a seguir.",
    searchEmptyTitle: 'Nenhuma correspondência encontrada',
    searchEmptyDesc: "Nenhuma sessão encontrada. Tente outro termo ou limpe os filtros.",
    statusEmpty: 'Nenhuma sessão {status}',
    statusEmptyDesc: "Você não tem nenhuma sessão marcada como {status} no momento.",
    clearFilters: 'Limpar filtros',
    sessionDeleted: 'Sessão excluída com sucesso'
  },
  Chinese: {
    dashboard: '仪表板', welcome: '欢迎回来。准确从您离开的地方接续。', newSession: '新会话',
    upgradeTitle: '升级到 Plus', upgradeDesc: '解锁固定会话、智能提醒等。', viewPlans: '查看计划',
    syncTitle: '云同步可用', syncDesc: '创建帐户以跨设备同步。', getStarted: '开始',
    pinned: '固定会话', recent: '最近会话', all: '所有会话',
    syncing: '正在同步会话...',
    emptyTitle: '未来的你会感谢你',
    emptyDesc: "MindMark 帮助您记录正在做的事情、暂停的原因以及下一步的任务。在离开前捕捉您的第一个上下文。",
    searchEmptyTitle: '未找到匹配项',
    searchEmptyDesc: "我们找不到任何匹配您搜索的会话。请尝试不同的关键词或清除过滤器。",
    statusEmpty: '没有 {status} 会话',
    statusEmptyDesc: "您目前没有标记为 {status} 的会话。",
    clearFilters: '清除过滤器',
    sessionDeleted: '会话已成功删除'
  },
  German: {
    dashboard: 'Dashboard', welcome: 'Willkommen zurück. Machen Sie genau dort weiter, wo Sie aufgehört haben.', newSession: 'Neue Sitzung',
    upgradeTitle: 'Upgrade auf Plus', upgradeDesc: 'Schalten Sie angepinnte Sitzungen, Erinnerungen und mehr frei.', viewPlans: 'Pläne ansehen',
    syncTitle: 'Cloud Sync', syncDesc: 'Konto erstellen zum Synchronisieren.', getStarted: 'Starten',
    pinned: 'Angeheftete', recent: 'Kürzliche Sitzungen', all: 'Alle Sitzungen',
    syncing: 'Sitzungen werden synchronisiert...',
    emptyTitle: 'Ihr zukünftiges Ich wird es Ihnen danken',
    emptyDesc: "MindMark hilft Ihnen dabei, festzuhalten, was Sie getan haben, warum Sie pausiert haben und was als Nächstes zu tun ist.",
    searchEmptyTitle: 'Keine Treffer gefunden',
    searchEmptyDesc: "Wir konnten keine Sitzungen finden, die Ihrer Suche entsprechen. Versuchen Sie einen anderen Suchbegriff oder löschen Sie die Filter.",
    statusEmpty: 'Keine {status} Sitzungen',
    statusEmptyDesc: "Sie haben derzeit keine Sitzungen, die als {status} markiert sind.",
    clearFilters: 'Filter löschen',
    sessionDeleted: 'Sitzung erfolgreich gelöscht'
  }
};

export function Home() {
  const { sessions, togglePin, updateStatus, deleteSession, isSyncing } = useSessions();
  const { isFree, isPro } = usePlan();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('active');
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('mindmark-onboarding-completed', false);
  const { preferredLanguage } = useLanguage();

  const t = HOME_TRANSLATIONS[preferredLanguage] || HOME_TRANSLATIONS['English'];

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleTogglePin = async (id: string) => {
    try {
      setError(null);
      await togglePin(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pin session');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateStatus = async (id: string, status: SessionStatus) => {
    try {
      setError(null);
      await updateStatus(id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      setError(null);
      await deleteSession(id);
      setToastMessage(t.sessionDeleted);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
      setTimeout(() => setError(null), 5000);
    }
  };

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
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 theme-surface px-6 py-4 rounded-2xl shadow-premium border theme-border"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium theme-text-primary">{toastMessage}</p>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-4 p-1 theme-text-secondary hover:theme-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 theme-surface px-6 py-4 rounded-2xl shadow-premium border border-rose-100 dark:border-rose-900/30"
          >
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium theme-text-primary">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-4 p-1 theme-text-secondary hover:theme-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader 
        title={t.dashboard} 
        description={t.welcome}
      >
        <Button 
          onClick={() => navigate('/create')}
          icon={Plus}
          size="lg"
        >
          {t.newSession}
        </Button>
      </PageHeader>

      <AnimatePresence>
        {!hasCompletedOnboarding && (
          <OnboardingCard onDismiss={() => setHasCompletedOnboarding(true)} />
        )}
      </AnimatePresence>

      <SummaryStrip sessions={sessions} />
      
      {isFree && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/pricing" 
            className="block group"
            onClick={() => analytics.track('upgrade_prompt_clicked', { type: 'plus_banner' })}
          >
            <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.01] active:scale-[0.99] transition-all border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{t.upgradeTitle}</h3>
                    <p className="text-indigo-100 text-sm">{t.upgradeDesc}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-white/30 transition-colors backdrop-blur-md">
                  {t.viewPlans}
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
          <Link 
            to="/signup" 
            className="block group"
            onClick={() => analytics.track('upgrade_prompt_clicked', { type: 'cloud_sync_banner' })}
          >
            <Card variant="ghost" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl theme-text-primary">{t.syncTitle}</h3>
                    <p className="theme-text-secondary text-sm">{t.syncDesc}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  {t.getStarted}
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

        {isSyncing && sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="theme-text-secondary font-medium">{t.syncing}</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="space-y-12">
            <FeatureGate feature="pinned_sessions" inline>
              {pinnedSessions.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Pin className="w-5 h-5 fill-current" />
                    </div>
                    <h2 className="text-xl font-bold theme-text-primary">{t.pinned}</h2>
                  </div>
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {pinnedSessions.map((session) => (
                      <motion.div key={session.id} variants={item}>
                        <SessionCard 
                          session={session} 
                          onTogglePin={handleTogglePin}
                          onUpdateStatus={handleUpdateStatus}
                          onDelete={handleDeleteSession}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}
            </FeatureGate>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center theme-text-secondary">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold theme-text-primary">
                  {pinnedSessions.length > 0 ? t.recent : t.all}
                </h2>
              </div>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {otherSessions.map((session) => (
                  <motion.div key={session.id} variants={item}>
                    <SessionCard 
                      session={session} 
                      onTogglePin={handleTogglePin}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteSession}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </div>
        ) : (
          <EmptyState 
            isSearch={sessions.length > 0 && searchQuery !== ''} 
            title={
              sessions.length === 0 
                ? t.emptyTitle 
                : searchQuery !== '' 
                  ? t.searchEmptyTitle 
                  : t.statusEmpty.replace('{status}', statusFilter)
            }
            description={
              sessions.length === 0
                ? t.emptyDesc
                : searchQuery !== ''
                  ? t.searchEmptyDesc
                  : t.statusEmptyDesc.replace('{status}', statusFilter)
            }
            onClearSearch={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            action={
              sessions.length === 0 ? undefined : (searchQuery === '' ? {
                label: t.clearFilters,
                onClick: () => setStatusFilter('all')
              } : undefined)
            }
          />
        )}
      </div>
    </div>
  );
}
