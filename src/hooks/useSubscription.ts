import { usePlan } from './usePlan';

/**
 * Custom hook for feature gating based on the user's subscription tier.
 * Positions the app's functionality according to the 4-tier billing strategy.
 */
export function useSubscription() {
  const { currentPlan } = usePlan();

  // Tier Hierarchy: free < plus < pro < premium
  
  // canSyncToCloud requires Plus or higher (Plus, Pro, Premium)
  const canSyncToCloud = ['plus', 'pro', 'premium'].includes(currentPlan);

  // canAccessHistory requires Pro or higher (Pro, Premium)
  const canAccessHistory = ['pro', 'premium'].includes(currentPlan);

  // canCollaborate requires Premium strictly (Premium)
  const canCollaborate = ['premium'].includes(currentPlan);

  return {
    subscriptionTier: currentPlan,
    canSyncToCloud,
    canAccessHistory,
    canCollaborate,
    
    // Convenience checks
    isPaid: currentPlan !== 'free',
    isPro: currentPlan === 'pro',
    isPremium: currentPlan === 'premium',
    isPlus: currentPlan === 'plus',
  };
}
