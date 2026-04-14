import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { Feature } from '../types';

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
        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
      >
        <Lock className="w-2.5 h-2.5" />
        {feature === 'cloud_sync' ? 'Pro' : 'Plus'}
      </Link>
    );
  }

  const isProFeature = feature === 'cloud_sync' || feature === 'history_restore' || feature === 'analytics';
  const targetPlan = isProFeature ? 'Pro' : 'Plus';

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 p-8 text-center">
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-950/40 backdrop-blur-[2px] z-0" />
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{targetPlan} Feature</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto">
            Upgrade to {targetPlan} to unlock this feature and supercharge your productivity.
          </p>
        </div>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}
