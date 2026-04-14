import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 ${className}`}>
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
