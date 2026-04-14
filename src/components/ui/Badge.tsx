import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'indigo' | 'green' | 'amber' | 'rose' | 'gray';
  size?: 'xs' | 'sm' | 'md';
  icon?: LucideIcon;
  className?: string;
  key?: React.Key;
}

export function Badge({
  children,
  variant = 'gray',
  size = 'sm',
  icon: Icon,
  className = '',
  ...props
}: BadgeProps) {
  const variants = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    green: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    gray: 'text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  };

  const sizes = {
    xs: 'px-2.5 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-[11px]',
    md: 'px-4 py-1.5 text-[12px]'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-display font-bold uppercase tracking-widest rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
      {children}
    </span>
  );
}
