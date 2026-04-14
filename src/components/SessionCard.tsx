import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Pin, PinOff, CheckCircle2, AlertCircle, Archive, PlayCircle } from 'lucide-react';
import { Session, SessionStatus, Priority } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface SessionCardProps {
  session: Session;
  onTogglePin?: (id: string) => void;
  onUpdateStatus?: (id: string, status: SessionStatus) => void;
}

const statusConfig: Record<SessionStatus, { icon: any; variant: 'indigo' | 'rose' | 'green' | 'gray'; label: string }> = {
  active: { icon: PlayCircle, variant: 'indigo', label: 'Active' },
  blocked: { icon: AlertCircle, variant: 'rose', label: 'Blocked' },
  done: { icon: CheckCircle2, variant: 'green', label: 'Done' },
  archived: { icon: Archive, variant: 'gray', label: 'Archived' },
};

const priorityConfig: Record<Priority, 'gray' | 'indigo' | 'amber' | 'rose' | 'green'> = {
  low: 'gray',
  medium: 'amber',
  high: 'rose',
};

export const SessionCard = memo(({ session, onTogglePin, onUpdateStatus }: SessionCardProps) => {
  const StatusIcon = statusConfig[session.status].icon;

  return (
    <Card 
      padding="none"
      className={`group relative transition-all duration-500 premium-card ${
        session.pinned 
          ? 'border-indigo-200 dark:border-indigo-900/50 ring-2 ring-indigo-50 dark:ring-indigo-900/20' 
          : ''
      }`}
    >
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onTogglePin(session.id);
          }}
          className={`absolute top-5 right-5 p-2.5 rounded-xl transition-all duration-300 z-10 ${
            session.pinned
              ? 'bg-indigo-600 text-white shadow-indigo'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          {session.pinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
        </button>
      )}

      <Link to={`/session/${session.id}`} className="block p-8">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant={statusConfig[session.status].variant} icon={StatusIcon} size="xs">
            {statusConfig[session.status].label}
          </Badge>
          <Badge variant={priorityConfig[session.priority]} size="xs">
            {session.priority}
          </Badge>
          <Badge variant="gray" size="xs">
            {session.category}
          </Badge>
        </div>

        <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
          {session.title}
        </h3>

        <div className="mb-6 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-2xl">
          <p className="text-[11px] font-display font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Next Step</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
            {session.nextStep || 'No next step defined...'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {new Date(session.updatedAt).toLocaleDateString()}
            </div>
            {session.links.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-widest">
                <ExternalLink className="w-3.5 h-3.5" />
                {session.links.length}
              </div>
            )}
          </div>
          
          <div className="flex gap-1.5">
            {session.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="gray" size="xs" className="rounded-lg">
                #{tag}
              </Badge>
            ))}
            {session.tags.length > 2 && (
              <span className="text-[11px] font-display font-bold text-slate-400 dark:text-slate-500 self-center ml-1">
                +{session.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
});
