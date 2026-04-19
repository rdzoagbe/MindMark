import { PlanType, UserPlan } from '../types';

<<<<<<< HEAD
const PLAN_STORAGE_KEY = 'mindmark-plan';
=======
const PLAN_STORAGE_KEY = 'context-saver-plan';
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8

class PlanService {
  /**
   * Retrieves the current plan.
   * Currently uses local storage, but structured to support async backend fetching.
   */
  async getCurrentPlan(): Promise<UserPlan> {
    try {
      const stored = localStorage.getItem(PLAN_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserPlan;
      }
    } catch (error) {
      console.error('Failed to parse stored plan', error);
    }
    return { type: 'free' };
  }

  /**
   * Retrieves the current plan synchronously (useful for initial React state).
   */
  getCurrentPlanSync(): UserPlan {
    try {
      const stored = localStorage.getItem(PLAN_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserPlan;
      }
    } catch (error) {
      console.error('Failed to parse stored plan', error);
    }
    return { type: 'free' };
  }

  /**
   * Sets the current plan.
   * In the future, this will be handled by Stripe webhooks and backend sync.
   */
  async setPlan(plan: UserPlan): Promise<void> {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
  }

  /**
   * Validates the subscription status with the backend.
   * Currently a placeholder that returns the local plan.
   */
  async validateSubscription(): Promise<UserPlan> {
    // TODO: Implement backend validation with Firebase/Stripe
    // e.g., const response = await fetch('/api/validate-subscription');
    // return response.json();
    return this.getCurrentPlan();
  }
}

export const planService = new PlanService();
