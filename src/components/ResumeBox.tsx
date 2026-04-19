<<<<<<< HEAD
import { PlayCircle, ExternalLink, AlertCircle } from 'lucide-react';
=======
import { PlayCircle } from 'lucide-react';
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
import { Button } from './ui/Button';

interface ResumeBoxProps {
  nextStep: string;
  onResume?: () => void;
<<<<<<< HEAD
  onRestoreWorkspace?: () => void;
  workspaceBlocked?: boolean;
}

export function ResumeBox({ nextStep, onResume, onRestoreWorkspace, workspaceBlocked }: ResumeBoxProps) {
  return (
    <div className={`rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group transition-all duration-300 ${workspaceBlocked ? 'bg-amber-600 dark:bg-amber-700' : 'bg-indigo-600 dark:bg-indigo-500'}`}>
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
        {workspaceBlocked ? <AlertCircle className="w-40 h-40" /> : <PlayCircle className="w-40 h-40" />}
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            {workspaceBlocked ? 'Resume Blocked' : 'Resume Context'}
          </div>
          {!workspaceBlocked && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider ml-1">Your Next Step</h3>
=======
}

export function ResumeBox({ nextStep, onResume }: ResumeBoxProps) {
  return (
    <div className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
        <PlayCircle className="w-40 h-40" />
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">Resume Context</div>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-indigo-200 uppercase tracking-wider ml-1">Your Next Step</h3>
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
          <p className="text-2xl sm:text-3xl font-bold leading-tight max-w-2xl">
            {nextStep || 'No next step defined...'}
          </p>
        </div>
<<<<<<< HEAD
        <div className="pt-4 flex flex-wrap gap-4 items-center">
=======
        <div className="pt-4">
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
          <Button 
            variant="secondary" 
            size="md" 
            onClick={onResume}
<<<<<<< HEAD
            className={`font-semibold bg-white border-0 ${workspaceBlocked ? 'text-amber-700 hover:bg-amber-50' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
          >
            Mark as Resumed
          </Button>

          {onRestoreWorkspace && (
            <Button
              variant="outline"
              size="md"
              icon={ExternalLink}
              onClick={onRestoreWorkspace}
              className={`font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 ${workspaceBlocked ? 'animate-pulse ring-2 ring-white ring-offset-2 ring-offset-amber-600' : ''}`}
            >
              {workspaceBlocked ? 'Retry Opening Tabs' : 'Open Workspace Tabs'}
            </Button>
          )}
=======
            className="bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-0"
          >
            Mark as Resumed
          </Button>
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
        </div>
      </div>
    </div>
  );
}
