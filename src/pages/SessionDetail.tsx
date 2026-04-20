import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Copy, 
  Archive, 
  CheckCircle, 
  Clock, 
  Tag, 
  ExternalLink,
  PlayCircle,
  AlertCircle,
  Pin,
  PinOff,
  ChevronRight,
  Calendar,
  MoreVertical,
  FileQuestion,
  Zap,
  Sparkles,
  Loader2,
  X,
  Shield,
  ShieldAlert,
  Timer,
  Play,
  Square,
  Share2,
  Users
} from 'lucide-react';
import { useSessions } from '../contexts/SessionContext';
import { SessionStatus, Priority } from '../types';
import { ResumeBox } from '../components/ResumeBox';
import { FeatureGate } from '../components/FeatureGate';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { format } from 'date-fns';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { ShareModal } from '../components/ui/ShareModal';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { restoreWorkspace } from '../utils/workspace';

const DETAIL_TRANSLATIONS: Record<string, any> = {
  EN: {
    loading: 'Loading session...',
    notFoundTitle: 'Session not found',
    notFoundDesc: 'The session you are looking for does not exist or has been deleted.',
    backDashboard: 'Go back home',
    smartResume: 'Smart Resume', smartGenerating: 'Generating...', smartAIPowered: 'AI Resume Strategy', smartPoweredBy: 'Powered by Gemini',
    share: 'Share', unpin: 'Unpin', pin: 'Pin', duplicate: 'Duplicate', edit: 'Edit', delete: 'Delete',
    deleteTitle: 'Delete Session', deleteConfirm: 'Are you sure you want to delete "{title}"? This action cannot be undone.',
    progress: 'Session Progress',
    task: 'Current Task', noTask: 'No task description provided.',
    pause: 'Pause Reason',
    nextStepLabel: 'The Exact Next Step',
    notes: 'Additional Notes',
    links: 'Reference Links', untitledLink: 'Untitled Link', noLinks: 'No links attached.',
    tags: 'Tags', noTags: 'No tags.',
    metadata: 'Metadata', dueDate: 'Due Date', created: 'Created', lastUpdated: 'Last Updated', sessionId: 'Session ID', collaborators: 'Collaborators', person: 'Person', people: 'People',
    timerStart: 'Start Timer ({time})', timerStop: 'Stop Timer ({time})', markDone: 'Mark as Done', restore: 'Restore Session', archive: 'Archive Session',
    popupBlocked: 'Popup blocker prevented some tabs from opening. Click the button below to retry manually.',
    confidential: 'Confidential', confidentialTitle: 'Disabled for confidential sessions'
  },
  FR: {
    loading: 'Chargement de la session...',
    notFoundTitle: 'Session non trouvée',
    notFoundDesc: 'La session que vous recherchez n\'existe pas ou a été supprimée.',
    backDashboard: 'Retour à l\'accueil',
    smartResume: 'Résumé intelligent', smartGenerating: 'Génération...', smartAIPowered: 'Stratégie de reprise IA', smartPoweredBy: 'Propulsé par Gemini',
    share: 'Partager', unpin: 'Désépingler', pin: 'Épingler', duplicate: 'Dupliquer', edit: 'Modifier', delete: 'Supprimer',
    deleteTitle: 'Supprimer la session', deleteConfirm: 'Voulez-vous supprimer "{title}" ? Cette action est irréversible.',
    progress: 'Progression de la session',
    task: 'Tâche actuelle', noTask: 'Aucune description de tâche fournie.',
    pause: 'Raison de la pause',
    nextStepLabel: 'L\'étape suivante exacte',
    notes: 'Notes additionnelles',
    links: 'Liens de référence', untitledLink: 'Lien sans titre', noLinks: 'Aucun lien joint.',
    tags: 'Tags', noTags: 'Aucun tag.',
    metadata: 'Métadonnées', dueDate: 'Échéance', created: 'Créé le', lastUpdated: 'Mis à jour', sessionId: 'ID de session', collaborators: 'Collaborateurs', person: 'personne', people: 'personnes',
    timerStart: 'Lancer le minuteur ({time})', timerStop: 'Arrêter ({time})', markDone: 'Marquer comme terminé', restore: 'Restaurer la session', archive: 'Archiver la session',
    popupBlocked: 'Le bloqueur de fenêtres a empêché l\'ouverture de certains onglets.',
    confidential: 'Confidentiel', confidentialTitle: 'Désactivé pour les sessions confidentielles'
  },
  ES: {
    loading: 'Cargando sesión...',
    notFoundTitle: 'Sesión no encontrada',
    notFoundDesc: 'La sesión que buscas no existe o fue eliminada.',
    backDashboard: 'Volver al inicio',
    smartResume: 'Resumen Inteligente', smartGenerating: 'Generando...', smartAIPowered: 'Estrategia de Reanudación IA', smartPoweredBy: 'Impulsado por Gemini',
    share: 'Compartir', unpin: 'Desanclar', pin: 'Anclar', duplicate: 'Duplicar', edit: 'Editar', delete: 'Eliminar',
    deleteTitle: 'Eliminar Sesión', deleteConfirm: '¿Estás seguro de eliminar "{title}"? No se puede deshacer.',
    progress: 'Progreso de la Sesión',
    task: 'Tarea Actual', noTask: 'No se proporcionó descripción de la tarea.',
    pause: 'Razón de la Pausa',
    nextStepLabel: 'El Siguiente Paso Exacto',
    notes: 'Notas Adicionales',
    links: 'Enlaces de Referencia', untitledLink: 'Enlace sin título', noLinks: 'No hay enlaces.',
    tags: 'Etiquetas', noTags: 'Sin etiquetas.',
    metadata: 'Metadatos', dueDate: 'Fecha de entrega', created: 'Creado', lastUpdated: 'Actualizado', sessionId: 'ID de Sesión', collaborators: 'Colaboradores', person: 'persona', people: 'personas',
    timerStart: 'Iniciar Cronómetro ({time})', timerStop: 'Detener ({time})', markDone: 'Marcar como hecho', restore: 'Restaurar Sesión', archive: 'Archivar Sesión',
    popupBlocked: 'El bloqueador de ventanas emergentes impidió abrir algunas pestañas.',
    confidential: 'Confidencial', confidentialTitle: 'Desactivado para sesiones confidenciales'
  },
  PT: {
    loading: 'Carregando sessão...',
    notFoundTitle: 'Sessão não encontrada',
    notFoundDesc: 'A sessão que você procura não existe ou foi excluída.',
    backDashboard: 'Voltar ao início',
    smartResume: 'Resumo Inteligente', smartGenerating: 'Gerando...', smartAIPowered: 'Estratégia de Retomada IA', smartPoweredBy: 'Alimentado por Gemini',
    share: 'Compartilhar', unpin: 'Desafixar', pin: 'Fixar', duplicate: 'Duplicar', edit: 'Editar', delete: 'Excluir',
    deleteTitle: 'Excluir Sessão', deleteConfirm: 'Tem certeza que deseja excluir "{title}"? Isso não pode ser desfeito.',
    progress: 'Progresso da Sessão',
    task: 'Tarefa Atual', noTask: 'Nenhuma descrição fornecida.',
    pause: 'Motivo da Pausa',
    nextStepLabel: 'O Próximo Passo Exato',
    notes: 'Notas Adicionais',
    links: 'Links de Referência', untitledLink: 'Link sem título', noLinks: 'Nenhum link anexado.',
    tags: 'Tags', noTags: 'Sem tags.',
    metadata: 'Metadados', dueDate: 'Data de entrega', created: 'Criado em', lastUpdated: 'Atualizado', sessionId: 'ID da Sessão', collaborators: 'Colaboradores', person: 'pessoa', people: 'pessoas',
    timerStart: 'Iniciar Cronômetro ({time})', timerStop: 'Parar ({time})', markDone: 'Concluir', restore: 'Restaurar Sessão', archive: 'Arquivar Sessão',
    popupBlocked: 'O bloqueador de pop-ups impediu a abertura de algumas guias.',
    confidential: 'Confidencial', confidentialTitle: 'Desativado para sessões confidenciais'
  },
  ZH: {
    loading: '正在加载会话...',
    notFoundTitle: '未找到会话',
    notFoundDesc: '您正在寻找的会话不存在或已被删除。',
    backDashboard: '返回主页',
    smartResume: '智能恢复', smartGenerating: '正在生成...', smartAIPowered: 'AI 恢复策略', smartPoweredBy: '由 Gemini 提供支持',
    share: '分享', unpin: '取消固定', pin: '固定', duplicate: '复制', edit: '编辑', delete: '删除',
    deleteTitle: '删除会话', deleteConfirm: '您确定要删除“{title}”吗？此操作无法撤销。',
    progress: '会话进度',
    task: '当前任务', noTask: '未提供任务描述。',
    pause: '暂停原因',
    nextStepLabel: '确切的下一步',
    notes: '备注',
    links: '参考链接', untitledLink: '未命名链接', noLinks: '未附带链接。',
    tags: '标签', noTags: '无标签。',
    metadata: '元数据', dueDate: '截止日期', created: '创建时间', lastUpdated: '最后更新', sessionId: '会话 ID', collaborators: '协作人', person: '人', people: '人',
    timerStart: '开始计时 ({time})', timerStop: '停止计时 ({time})', markDone: '标记为完成', restore: '恢复会话', archive: '归档会话',
    popupBlocked: '弹出窗口拦截器阻止了某些标签页的打开。',
    confidential: '机密', confidentialTitle: '机密会话已禁用此功能'
  },
  DE: {
    loading: 'Sitzung wird geladen...',
    notFoundTitle: 'Sitzung nicht gefunden',
    notFoundDesc: 'Die gesuchte Sitzung existiert nicht oder wurde gelöscht.',
    backDashboard: 'Zurück zum Dashboard',
    smartResume: 'Smart Resume', smartGenerating: 'Generierung...', smartAIPowered: 'KI-Wiederaufnahmestrategie', smartPoweredBy: 'Unterstützt durch Gemini',
    share: 'Teilen', unpin: 'Lösen', pin: 'Anheften', duplicate: 'Duplizieren', edit: 'Bearbeiten', delete: 'Löschen',
    deleteTitle: 'Sitzung löschen', deleteConfirm: 'Sind Sie sicher, dass Sie "{title}" löschen möchten? Dies kann nicht rückgängig gemacht werden.',
    progress: 'Sitzungsfortschritt',
    task: 'Aktuelle Aufgabe', noTask: 'Keine Aufgabenbeschreibung angegeben.',
    pause: 'Pausengrund',
    nextStepLabel: 'Der exakte nächste Schritt',
    notes: 'Zusätzliche Notizen',
    links: 'Referenz-Links', untitledLink: 'Unbenannter Link', noLinks: 'Keine Links angehängt.',
    tags: 'Tags', noTags: 'Keine Tags.',
    metadata: 'Metadaten', dueDate: 'Fällig am', created: 'Erstellt am', lastUpdated: 'Zuletzt aktualisiert', sessionId: 'Sitzungs-ID', collaborators: 'Mitarbeiter', person: 'Person', people: 'Personen',
    timerStart: 'Timer starten ({time})', timerStop: 'Timer stoppen ({time})', markDone: 'Abschließen', restore: 'Wiederherstellen', archive: 'Archivieren',
    popupBlocked: 'Popup-Blocker hat das Öffnen einiger Tabs verhindert.',
    confidential: 'Vertraulich', confidentialTitle: 'Deaktiviert für vertrauliche Sitzungen'
  }
};

const getStatusLabels = (preferredLanguage: string) => {
  const translations: Record<string, any> = {
    EN: { active: 'Active', blocked: 'Blocked', done: 'Done', archived: 'Archived' },
    FR: { active: 'Actif', blocked: 'Bloqué', done: 'Terminé', archived: 'Archivé' },
    ES: { active: 'Activo', blocked: 'Bloqueado', done: 'Hecho', archived: 'Archivado' },
    PT: { active: 'Ativo', blocked: 'Bloqueado', done: 'Concluído', archived: 'Arquivado' },
    ZH: { active: '进行中', blocked: '已受阻', done: '已完成', archived: '已归档' },
    DE: { active: 'Aktiv', blocked: 'Blockiert', done: 'Erledigt', archived: 'Archiviert' }
  };
  return translations[preferredLanguage] || translations['EN'];
};

const getPriorityLabels = (preferredLanguage: string) => {
  const translations: Record<string, any> = {
    EN: { low: 'Low', medium: 'Medium', high: 'High' },
    FR: { low: 'Basse', medium: 'Moyenne', high: 'Haute' },
    ES: { low: 'Baja', medium: 'Media', high: 'Alta' },
    PT: { low: 'Baixa', medium: 'Média', high: 'Alta' },
    ZH: { low: '低', medium: '中', high: '高' },
    DE: { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' }
  };
  return translations[preferredLanguage] || translations['EN'];
};

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions, deleteSession, duplicateSession, updateStatus, updateSession, togglePin, isSyncing } = useSessions();
  const { preferredLanguage } = useLanguage();
  const t = DETAIL_TRANSLATIONS[preferredLanguage] || DETAIL_TRANSLATIONS['EN'];
  
  const statusLabels = getStatusLabels(preferredLanguage);
  const priorityLabels = getPriorityLabels(preferredLanguage);

  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [workspaceBlocked, setWorkspaceBlocked] = useState(false);
  
  // Time Tracker State
  const [isTracking, setIsTracking] = useState(false);
  const [localDuration, setLocalDuration] = useState(0);
  const timerRef = useRef<number | null>(null);

  const session = sessions.find((s) => s.id === id);
  // Optional chaining to safely check if the logged in user is the owner
  const isOwner = user?.uid === (session as any)?.userId || true; // Fallback to true if local

  const priorityConfig: Record<Priority, { label: string; variant: 'gray' | 'indigo' | 'amber' | 'rose' | 'green' }> = {
    low: { label: priorityLabels.low, variant: 'gray' },
    medium: { label: priorityLabels.medium, variant: 'amber' },
    high: { label: priorityLabels.high, variant: 'rose' },
  };

  const statusConfig: Record<SessionStatus, { icon: any; variant: 'indigo' | 'rose' | 'green' | 'gray'; label: string }> = {
    active: { icon: PlayCircle, variant: 'indigo', label: statusLabels.active },
    blocked: { icon: AlertCircle, variant: 'rose', label: statusLabels.blocked },
    done: { icon: CheckCircle, variant: 'green', label: statusLabels.done },
    archived: { icon: Archive, variant: 'gray', label: statusLabels.archived },
  };

  useEffect(() => {
    if (session) {
      setLocalDuration(session.duration || 0);
    }
  }, [session?.id, session?.duration]);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = window.setInterval(() => {
        setLocalDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  const handleToggleTimer = async () => {
    if (!session) return;
    
    if (isTracking) {
      // Stop tracking and save
      setIsTracking(false);
      try {
        await updateSession(session.id, { duration: localDuration });
      } catch (err) {
        handleError(err, 'Failed to save time');
      }
    } else {
      // Start tracking
      setIsTracking(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  if (!session) {
    if (isSyncing) {
      return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="theme-text-secondary font-medium">{t.loading}</p>
        </div>
      );
    }
    return (
      <div className="py-20">
        <EmptyState
          icon={FileQuestion}
          title={t.notFoundTitle}
          description={t.notFoundDesc}
          action={{
            label: t.backDashboard,
            onClick: () => navigate('/dashboard')
          }}
        />
      </div>
    );
  }

  const handleError = (err: unknown, defaultMessage: string) => {
    setError(err instanceof Error ? err.message : defaultMessage);
    setTimeout(() => setError(null), 5000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSession(session.id);
      navigate('/dashboard');
    } catch (err) {
      handleError(err, 'Failed to delete session');
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const newSession = await duplicateSession(session.id);
      if (newSession) {
        navigate(`/session/${newSession.id}`);
      }
    } catch (err) {
      handleError(err, 'Failed to duplicate session');
    }
  };

  const handleMarkDone = async () => {
    try {
      await updateStatus(session.id, 'done');
    } catch (err) {
      handleError(err, 'Failed to update status');
    }
  };

  const handleResume = async () => {
    try {
      await updateSession(session.id, { status: 'active' });
    } catch (err) {
      handleError(err, 'Failed to resume session');
    }
  };

  const handleRestoreWorkspace = async () => {
    setWorkspaceBlocked(false);
    await restoreWorkspace(session, () => {
      setWorkspaceBlocked(true);
      handleError(new Error(t.popupBlocked), t.popupBlocked);
    });
  };

  const handleArchive = async () => {
    try {
      await updateStatus(session.id, session.status === 'archived' ? 'active' : 'archived');
    } catch (err) {
      handleError(err, 'Failed to archive session');
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePin(session.id);
    } catch (err) {
      handleError(err, 'Failed to pin session');
    }
  };

  const handleUpdateCollaborators = async (emails: string[]) => {
    try {
      await updateSession(session.id, { collaborators: emails });
    } catch (err) {
      handleError(err, 'Failed to update collaborators');
      throw err;
    }
  };

  const handleSmartResume = async () => {
    setIsGenerating(true);
    setAiResponse(null);
    try {
      const strategy = await geminiService.generateResumeStrategy({
        title: session.title,
        currentTask: session.currentTask,
        nextStep: session.nextStep,
        notes: session.notes
      });
      setAiResponse(strategy);
    } catch (err) {
      handleError(err, 'Failed to generate AI strategy');
    } finally {
      setIsGenerating(false);
    }
  };

  const StatusIcon = statusConfig[session.status].icon;

  const getProgress = (status: SessionStatus) => {
    switch (status) {
      case 'done': return 100;
      case 'active': return 50;
      case 'blocked': return 50;
      case 'archived': return 0;
      default: return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="theme-text-primary truncate max-w-[200px]">{session.title}</span>
      </div>

      <PageHeader title={session.title}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <FeatureGate feature="smart_resume" inline>
            <Button
              variant="primary"
              size="sm"
              icon={isGenerating ? Loader2 : Sparkles}
              onClick={handleSmartResume}
              disabled={isGenerating || session.isConfidential}
              className={`text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ${isGenerating ? 'animate-pulse' : ''}`}
              title={session.isConfidential ? t.confidentialTitle : t.smartResume}
            >
              <span className="hidden xs:bold inline">{isGenerating ? t.smartGenerating : t.smartResume}</span>
              <span className="xs:hidden">{isGenerating ? '...' : 'AI'}</span>
            </Button>
          </FeatureGate>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Share2}
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 sm:p-2.5"
              title={t.share}
            />
            <FeatureGate feature="pinned_sessions" inline>
              <Button
                variant="outline"
                size="sm"
                icon={session.pinned ? PinOff : Pin}
                onClick={handleTogglePin}
                className="p-2 sm:p-2.5"
                title={session.pinned ? t.unpin : t.pin}
              />
            </FeatureGate>
            <Button
              variant="outline"
              size="sm"
              icon={Copy}
              onClick={handleDuplicate}
              className="p-2 sm:p-2.5"
              title={t.duplicate}
            />
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => navigate(`/edit/${session.id}`)}
              className="p-2 sm:p-2.5 text-indigo-600"
              title={t.edit}
            />
            {isOwner && (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-2 sm:p-2.5"
                title={t.delete}
              />
            )}
          </div>
        </div>
      </PageHeader>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t.deleteTitle}
        description={t.deleteConfirm.replace('{title}', session.title)}
        confirmLabel={t.delete}
        variant="danger"
        isLoading={isDeleting}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        session={session}
        onUpdateCollaborators={handleUpdateCollaborators}
        isOwner={isOwner}
      />

      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/30 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="sm" icon={X} onClick={() => setAiResponse(null)} />
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold theme-text-primary">{t.smartAIPowered}</h3>
                    <Badge variant="indigo" size="sm">{t.smartPoweredBy}</Badge>
                  </div>
                  <div className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-strong:text-indigo-700 dark:prose-strong:text-indigo-300">
                    <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold theme-text-secondary uppercase tracking-widest ml-1">
                <span>{t.progress}</span>
                <span className={session.status === 'done' ? 'text-emerald-600 dark:text-emerald-400' : 'theme-text-primary'}>
                  {getProgress(session.status)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border theme-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress(session.status)}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full shadow-sm ${
                    session.status === 'done' ? 'bg-emerald-500' : 
                    session.status === 'blocked' ? 'bg-rose-500' : 
                    'bg-indigo-600'
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={statusConfig[session.status].variant} icon={StatusIcon}>
                {statusConfig[session.status].label}
              </Badge>
              <Badge variant={priorityConfig[session.priority].variant}>
                {priorityConfig[session.priority].label} {priorityLabels.low === 'Low' ? 'Priority' : ''}
              </Badge>
              <Badge variant="gray">
                {session.category}
              </Badge>
              {session.isConfidential && (
                <Badge variant="amber" icon={ShieldAlert}>
                  {t.confidential}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.task}</h3>
              <p className="text-2xl font-bold theme-text-primary leading-tight whitespace-pre-wrap">
                {session.currentTask || t.noTask}
              </p>
            </div>

            {session.pauseReason && (
              <div className="pt-6 border-t theme-border">
                <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider mb-3 ml-1">{t.pause}</h3>
                <p className="text-base theme-text-primary leading-relaxed">
                  {session.pauseReason}
                </p>
              </div>
            )}
          </Card>
          
          <ResumeBox 
            nextStep={session.nextStep} 
            onResume={handleResume} 
            onRestoreWorkspace={handleRestoreWorkspace}
            workspaceBlocked={workspaceBlocked}
          />

          <div className="flex flex-wrap gap-4">
            <FeatureGate feature="time_tracking" inline>
              <Button
                onClick={handleToggleTimer}
                variant={isTracking ? "danger" : "outline"}
                icon={isTracking ? Square : Play}
                className={isTracking ? "animate-pulse" : "theme-surface"}
              >
                {isTracking ? t.timerStop.replace('{time}', formatDuration(localDuration)) : t.timerStart.replace('{time}', formatDuration(localDuration))}
              </Button>
            </FeatureGate>
            {session.status !== 'done' && (
              <Button 
                onClick={handleMarkDone}
                variant="outline"
                icon={CheckCircle}
                className="theme-surface border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {t.markDone}
              </Button>
            )}
            <Button 
              onClick={handleArchive}
              variant="outline"
              icon={Archive}
              className="theme-surface"
            >
              {session.status === 'archived' ? t.restore : t.archive}
            </Button>
          </div>

          {session.notes && (
            <Card className="space-y-4">
              <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.notes}</h3>
              <div className="prose prose-slate dark:prose-invert prose-sm max-w-none theme-text-primary">
                <Markdown remarkPlugins={[remarkGfm]}>{session.notes}</Markdown>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="space-y-6">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.links}</h3>
            <div className="space-y-3">
              {session.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold theme-text-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {link.label || t.untitledLink}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-xs theme-text-secondary truncate">
                    {link.url}
                  </p>
                  {link.comment && (
                    <p className="text-xs theme-text-secondary mt-2 italic">
                      {link.comment}
                    </p>
                  )}
                </a>
              ))}
              {session.links.length === 0 && (
                <div className="text-center py-6 space-y-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto theme-text-secondary">
                    <Tag className="w-5 h-5" />
                  </div>
                  <p className="text-sm theme-text-secondary italic">
                    {t.noLinks}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.tags}</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="indigo" icon={Tag} className="rounded-md">
                  {tag}
                </Badge>
              ))}
              {session.tags.length === 0 && (
                <p className="text-sm theme-text-secondary italic ml-1">{t.noTags}</p>
              )}
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">{t.metadata}</h3>
            <div className="space-y-4">
              {session.dueDate && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">{t.dueDate}</p>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{format(new Date(session.dueDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center theme-text-secondary">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">{t.created}</p>
                  <p className="text-sm font-semibold theme-text-primary">{format(new Date(session.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center theme-text-secondary">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">{t.lastUpdated}</p>
                  <p className="text-sm font-semibold theme-text-primary">{format(new Date(session.updatedAt), 'HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center theme-text-secondary">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">{t.sessionId}</p>
                  <p className="font-mono text-xs theme-text-secondary">{session.id.slice(0, 12)}...</p>
                </div>
              </div>
              {session.collaborators && session.collaborators.length > 0 && (
                <div className="pt-4 border-t theme-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">{t.collaborators}</p>
                    <p className="text-sm font-semibold theme-text-primary">{session.collaborators.length} {session.collaborators.length === 1 ? t.person : t.people}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
