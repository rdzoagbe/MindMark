import { PlayCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface ResumeBoxProps {
  nextStep: string;
  onResume?: () => void;
  onRestoreWorkspace?: () => void;
  workspaceBlocked?: boolean;
}

export function ResumeBox({ nextStep, onResume, onRestoreWorkspace, workspaceBlocked }: ResumeBoxProps) {
  return (
    <div className={`rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden group transition-all duration-300 ${workspaceBlocked ? 'bg-amber-600 dark:bg-amber-700' : 'bg-indigo-600 dark:bg-indigo-500'}`}>
      <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
        {workspaceBlocked ? <AlertCircle className="w-24 h-24 sm:w-40 sm:h-40" /> : <PlayCircle className="w-24 h-24 sm:w-40 sm:h-40" />}
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            {workspaceBlocked ? 'Resume Blocked' : 'Resume Context'}
          </div>
          {!workspaceBlocked && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        </div>
        <div className="space-y-2">
          <h3 className="text-[10px] font-medium text-white/70 uppercase tracking-wider ml-1">Your Next Step</h3>
          <p className="text-xl sm:text-3xl font-bold leading-tight max-w-2xl break-words">
            {nextStep || 'No next step defined...'}
          </p>
        </div>
        <div className="pt-2 sm:pt-4 flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center">
          <Button 
            variant="secondary" 
            size="md" 
            onClick={onResume}
            className={`font-semibold bg-white border-0 w-full xs:w-auto ${workspaceBlocked ? 'text-amber-700 hover:bg-amber-50' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
          >
            Mark as Resumed
          </Button>

          {onRestoreWorkspace && (
            <Button
              variant="outline"
              size="md"
              icon={ExternalLink}
              onClick={onRestoreWorkspace}
              className={`font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 w-full xs:w-auto ${workspaceBlocked ? 'animate-pulse ring-2 ring-white ring-offset-2 ring-offset-amber-600' : ''}`}
            >
              {workspaceBlocked ? 'Retry Opening Tabs' : 'Open Workspace Tabs'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
