import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { Feature } from '../types';
import { Button } from './ui/Button';

interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  inline?: boolean;
}

export function FeatureGate({ feature, children, fallback, inline = false }: FeatureGateProps) {
  const { isFeatureEnabled } = usePlan();

  if (isFeatureEnabled(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (inline) {
    return (
      <Link 
        to="/pricing"
        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-display font-bold text-[10px] uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
      >
        <Lock className="w-3 h-3" />
        {feature === 'cloud_sync' ? 'Pro' : 'Plus'}
      </Link>
    );
  }

  const isProFeature = feature === 'cloud_sync' || feature === 'history_restore' || feature === 'analytics';
  const targetPlan = isProFeature ? 'Pro' : 'Plus';

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/20 p-10 text-center">
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[2px] z-0" />
      <div className="relative z-10 space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-sm font-display font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">{targetPlan} Feature</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[240px] mx-auto font-medium leading-relaxed">
            Upgrade to {targetPlan} to unlock this feature and supercharge your productivity.
          </p>
        </div>
        <Button
          to="/pricing"
          size="sm"
          className="px-6"
        >
          View Plans
        </Button>
      </div>
    </div>
  );
}
