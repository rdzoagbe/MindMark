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

import { restoreWorkspace } from '../utils/workspace';

  
  // Time Tracker State
  const [isTracking, setIsTracking] = useState(false);
  const [localDuration, setLocalDuration] = useState(0);
  const timerRef = useRef<number | null>(null);

  const session = sessions.find((s) => s.id === id);
  // Optional chaining to safely check if the logged in user is the owner
  const isOwner = user?.uid === (session as any)?.userId || true; // Fallback to true if local

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
          <p className="theme-text-secondary font-medium">Loading session...</p>
        </div>
      );
    }
    return (
      <div className="py-20">
        <EmptyState
          icon={FileQuestion}
          title="Session not found"
          description="The session you are looking for does not exist or has been deleted."
          action={{
            label: "Go back home",
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
      handleError(new Error("Popup blocker prevented some tabs from opening. Click the button below to retry manually."), "Popup blocker prevented some tabs from opening.");
    });
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold theme-text-primary">Session Detail</h1>
          <p className="theme-text-secondary">Status: {session.status}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <FeatureGate feature="time_tracking" inline>
            <Button
              onClick={handleToggleTimer}
              variant={isTracking ? "danger" : "outline"}
              icon={isTracking ? Square : Play}
              className={isTracking ? "animate-pulse" : "theme-surface"}
            >
              {isTracking ? `Stop Timer (${formatDuration(localDuration)})` : `Start Timer (${formatDuration(localDuration)})`}
            </Button>
          </FeatureGate>

          {session.status !== 'done' && (
            <Button
              onClick={handleMarkDone}
              variant="outline"
              icon={CheckCircle}
              className="theme-surface border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              Mark as Done
            </Button>
          )}

          <Button
            onClick={handleArchive}
            variant="outline"
            icon={Archive}
            className="theme-surface"
          >
            {session.status === 'archived' ? 'Restore Session' : 'Archive Session'}
          </Button>
        </div>

        {session.notes && (
          <div className="space-y-4">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">
              Additional Notes
            </h3>
            <div className="prose prose-slate dark:prose-invert prose-sm max-w-none theme-text-primary">
              <Markdown remarkPlugins={[remarkGfm]}>{session.notes}</Markdown>
            </div>
          </div>
        )}
      </Card>

      {session.links && session.links.length > 0 && (
        <Card className="space-y-6">
          <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">
            Reference Links
          </h3>
          <div className="space-y-3">
            {session.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border theme-border theme-surface p-4 hover:shadow-md transition"
              >
                <div className="font-medium theme-text-primary">{link.url}</div>
                <div className="text-sm theme-text-secondary break-all">{link.url}</div>
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
