import { useState, useEffect, useCallback } from 'react';
import { UserPlan, PlanType, Feature } from '../types';
import { FEATURES } from '../config/constants';
import { planService } from '../services/planService';

const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [],
  plus: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters'],
  pro: ['pinned_sessions', 'templates', 'reminders', 'advanced_filters', 'cloud_sync', 'history_restore', 'analytics'],
};

export function usePlan() {
  const [plan, setPlanState] = useState<UserPlan>(planService.getCurrentPlanSync());

  useEffect(() => {
    // Validate subscription on mount
    planService.validateSubscription().then(validatedPlan => {
      setPlanState(validatedPlan);
    });
  }, []);

  const upgrade = useCallback(async (newPlan: PlanType) => {
    const updatedPlan: UserPlan = { type: newPlan };
    await planService.setPlan(updatedPlan);
    setPlanState(updatedPlan);
  }, []);

  const downgrade = useCallback(async () => {
    const updatedPlan: UserPlan = { type: 'free' };
    await planService.setPlan(updatedPlan);
    setPlanState(updatedPlan);
  }, []);

  const isFeatureEnabled = useCallback((feature: Feature): boolean => {
    // Check if feature is globally disabled via feature flags
    if (feature === 'cloud_sync' && !FEATURES.SYNC_ENABLED) {
      return false;
    }
    
    return PLAN_FEATURES[plan.type].includes(feature);
  }, [plan.type]);

  return {
    currentPlan: plan.type,
    plan,
    upgrade,
    downgrade,
    isFeatureEnabled,
    isPro: plan.type === 'pro',
    isPlus: plan.type === 'plus',
    isFree: plan.type === 'free',
    hasPlusOrBetter: plan.type === 'plus' || plan.type === 'pro',
  };
}
