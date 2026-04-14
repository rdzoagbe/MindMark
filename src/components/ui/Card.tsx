import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'indigo' | 'danger' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'lg'
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 shadow-premium hover:shadow-premium-hover',
    indigo: 'bg-indigo-600 text-white shadow-indigo border-transparent',
    danger: 'bg-rose-50/30 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20',
    ghost: 'bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-700'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 sm:p-10'
  };

  return (
    <div className={`rounded-[3rem] border-2 transition-all duration-500 ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
