import { Inbox, Plus, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { motion } from 'motion/react';

interface EmptyStateProps {
  isSearch?: boolean;
  onClearSearch?: () => void;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    to?: string;
    icon?: LucideIcon;
  };
}

export function EmptyState({ 
  isSearch, 
  onClearSearch,
  icon: Icon = Inbox,
  title,
  description,
  action
}: EmptyStateProps) {
  
  const displayTitle = title || (isSearch ? "No matches found" : "Your future self will thank you");
  const displayDescription = description || (isSearch
    ? "We couldn't find any sessions matching your search. Try a different search term or clear filters."
    : "Context Saver helps you save what you were doing, why you paused, and what to do next. Capture your first context before you step away.");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-premium"
    >
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm mb-8 relative">
        <div className="absolute inset-0 bg-indigo-600/5 dark:bg-indigo-400/5 rounded-[2.5rem] blur-xl"></div>
        <Icon className="h-10 w-10 relative z-10" />
      </div>
      <h3 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
        {displayTitle}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md mx-auto mb-10 leading-relaxed">
        {displayDescription}
      </p>
      
      {action ? (
        action.to ? (
          <Button
            to={action.to}
            icon={action.icon}
            size="lg"
            className="px-8 py-4 rounded-[1.5rem] text-lg"
          >
            {action.label}
          </Button>
        ) : (
          <Button
            onClick={action.onClick}
            icon={action.icon}
            size="lg"
            className="px-8 py-4 rounded-[1.5rem] text-lg"
          >
            {action.label}
          </Button>
        )
      ) : isSearch ? (
        <Button
          onClick={onClearSearch}
          variant="outline"
          size="lg"
          className="px-8 py-4 rounded-[1.5rem] text-lg"
        >
          Clear Search
        </Button>
      ) : (
        <Button
          to="/create"
          icon={Plus}
          size="lg"
          className="px-8 py-4 rounded-[1.5rem] text-lg"
        >
          Create your first session
        </Button>
      )}
    </motion.div>
  );
}
