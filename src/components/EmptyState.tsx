import { Inbox, Plus, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

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
    <div className="text-center py-20 px-6 bg-slate-50/50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 shadow-sm">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-800 shadow-sm mb-8">
        <Icon className="h-10 w-10 text-slate-300 dark:text-slate-500" />
      </div>
      <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mb-3">
        {displayTitle}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-base font-medium max-w-sm mx-auto mb-10 leading-relaxed">
        {displayDescription}
      </p>
      
      {action ? (
        action.to ? (
          <Button
            to={action.to}
            icon={action.icon}
            size="lg"
            className="px-8"
          >
            {action.label}
          </Button>
        ) : (
          <Button
            onClick={action.onClick}
            icon={action.icon}
            size="lg"
            className="px-8"
          >
            {action.label}
          </Button>
        )
      ) : isSearch ? (
        <Button
          onClick={onClearSearch}
          variant="outline"
          size="lg"
          className="px-8"
        >
          Clear Search
        </Button>
      ) : (
        <Button
          to="/create"
          icon={Plus}
          size="lg"
          className="px-8"
        >
          Capture First Context
        </Button>
      )}
    </div>
  );
}
