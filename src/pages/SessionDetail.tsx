import React from 'react';
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
  FileQuestion
} from 'lucide-react';
import { useSessions } from '../hooks/useSessions';
import { SessionStatus, Priority } from '../types';
import { ResumeBox } from '../components/ResumeBox';
import { FeatureGate } from '../components/FeatureGate';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { format } from 'date-fns';

const priorityConfig: Record<Priority, { label: string; variant: 'gray' | 'indigo' | 'amber' | 'rose' | 'green' }> = {
  low: { label: 'Low', variant: 'gray' },
  medium: { label: 'Medium', variant: 'amber' },
  high: { label: 'High', variant: 'rose' },
};

const statusConfig: Record<SessionStatus, { icon: any; variant: 'indigo' | 'rose' | 'green' | 'gray'; label: string }> = {
  active: { icon: PlayCircle, variant: 'indigo', label: 'Active' },
  blocked: { icon: AlertCircle, variant: 'rose', label: 'Blocked' },
  done: { icon: CheckCircle, variant: 'green', label: 'Done' },
  archived: { icon: Archive, variant: 'gray', label: 'Archived' },
};

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, deleteSession, duplicateSession, updateStatus, togglePin } = useSessions();

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="py-20">
        <EmptyState
          icon={FileQuestion}
          title="Session not found"
          description="The session you are looking for does not exist or has been deleted."
          action={{
            label: "Go back home",
            onClick: () => navigate('/')
          }}
        />
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      await deleteSession(session.id);
      navigate('/');
    }
  };

  const handleDuplicate = async () => {
    const newSession = await duplicateSession(session.id);
    if (newSession) {
      navigate(`/session/${newSession.id}`);
    }
  };

  const handleMarkDone = async () => {
    await updateStatus(session.id, 'done');
  };

  const handleArchive = async () => {
    await updateStatus(session.id, session.status === 'archived' ? 'active' : 'archived');
  };

  const StatusIcon = statusConfig[session.status].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-2 text-sm font-display font-bold text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{session.title}</span>
      </div>

      <PageHeader title={session.title}>
        <div className="flex flex-wrap items-center gap-3">
          <FeatureGate feature="pinned_sessions" inline>
            <Button
              variant="outline"
              size="sm"
              icon={session.pinned ? PinOff : Pin}
              onClick={() => togglePin(session.id)}
              title={session.pinned ? "Unpin" : "Pin"}
            >
              {session.pinned ? 'Unpin' : 'Pin'}
            </Button>
          </FeatureGate>
          <Button
            variant="outline"
            size="sm"
            icon={Copy}
            onClick={handleDuplicate}
            title="Duplicate"
          >
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => navigate(`/edit/${session.id}`)}
            title="Edit"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleDelete}
            title="Delete"
          >
            Delete
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="space-y-10 premium-card">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={statusConfig[session.status].variant} icon={StatusIcon}>
                {statusConfig[session.status].label}
              </Badge>
              <Badge variant={priorityConfig[session.priority].variant}>
                {priorityConfig[session.priority].label} Priority
              </Badge>
              <Badge variant="gray">
                {session.category}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Task</h3>
              <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-tight whitespace-pre-wrap">
                {session.currentTask || 'No task description provided.'}
              </p>
            </div>

            {session.pauseReason && (
              <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Pause Reason</h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {session.pauseReason}
                </p>
              </div>
            )}
          </Card>

          <ResumeBox nextStep={session.nextStep} />

          <div className="flex flex-wrap gap-4">
            {session.status !== 'done' && (
              <Button 
                onClick={handleMarkDone}
                variant="outline"
                icon={CheckCircle}
                className="bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                Mark as Done
              </Button>
            )}
            <Button 
              onClick={handleArchive}
              variant="outline"
              icon={Archive}
              className="bg-white dark:bg-slate-900"
            >
              {session.status === 'archived' ? 'Restore Session' : 'Archive Session'}
            </Button>
          </div>

          {session.notes && (
            <Card className="space-y-6 premium-card">
              <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Additional Notes</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                {session.notes}
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-10">
          <Card className="space-y-8 premium-card">
            <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Reference Links</h3>
            <div className="space-y-4">
              {session.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-display font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {link.label || 'Untitled Link'}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-50 group-hover:bg-indigo-600 p-1 rounded-md transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                    {link.url}
                  </p>
                  {link.comment && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic font-medium">
                      {link.comment}
                    </p>
                  )}
                </a>
              ))}
              {session.links.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-center mx-auto text-slate-300">
                    <Tag className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
                    No links attached.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-6 premium-card">
            <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="indigo" icon={Tag} className="rounded-xl">
                  {tag}
                </Badge>
              ))}
              {session.tags.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium ml-1">No tags.</p>
              )}
            </div>
          </Card>

          <Card className="space-y-6 premium-card">
            <h3 className="text-xs font-display font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Metadata</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[1rem] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest">Created</p>
                  <p className="font-display font-extrabold text-slate-900 dark:text-white">{format(new Date(session.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[1rem] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                  <p className="font-display font-extrabold text-slate-900 dark:text-white">{format(new Date(session.updatedAt), 'HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[1rem] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400">
                  <MoreVertical className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest">Session ID</p>
                  <p className="font-mono text-[11px] text-slate-400 font-bold">{session.id.slice(0, 12)}...</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
