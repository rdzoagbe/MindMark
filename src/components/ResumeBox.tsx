import { PlayCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface ResumeBoxProps {
  nextStep: string;
}

export function ResumeBox({ nextStep }: ResumeBoxProps) {
  return (
    <div className="bg-indigo-600 dark:bg-indigo-500 rounded-[3rem] p-10 text-white shadow-premium relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
        <PlayCircle className="w-40 h-40" />
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-4 py-1.5 rounded-full text-[11px] font-display font-bold uppercase tracking-widest backdrop-blur-sm">Resume Context</div>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xs font-display font-bold text-indigo-200 uppercase tracking-widest ml-1">Your Next Step</h3>
          <p className="text-3xl sm:text-4xl font-display font-extrabold leading-tight tracking-tight max-w-2xl">
            {nextStep || 'No next step defined...'}
          </p>
        </div>
        <div className="pt-6">
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-0"
          >
            Mark as Resumed
          </Button>
        </div>
      </div>
    </div>
  );
}
