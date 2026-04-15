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
      className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-6">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {displayTitle}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-8">
        {displayDescription}
      </p>
      
      {action ? (
        action.to ? (
          <Button
            to={action.to}
            icon={action.icon}
          >
            {action.label}
          </Button>
        ) : (
          <Button
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.label}
          </Button>
        )
      ) : isSearch ? (
        <Button
          onClick={onClearSearch}
          variant="outline"
        >
          Clear Search
        </Button>
      ) : (
        <Button
          to="/create"
          icon={Plus}
        >
          Create your first session
        </Button>
      )}
    </motion.div>
  );
}
