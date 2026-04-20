import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from '../config/constants';

const sanitize = (val: string | undefined | null) => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') return undefined;
  return val.replace(/['"]+/g, '').trim();
};

const LIVE_PUBLIC_KEY = "pk_live_51T9WuB1yFs6IziIVLOyzJRCq6J8Nrbt3l8d9McbNFJvGIDXttWxmcWTJNXX8V2pNqpbgLXg1tAJndUBFflZgwVMr00GzDjqAcB";
const envKey = sanitize(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const STRIPE_PUBLIC_KEY = envKey || LIVE_PUBLIC_KEY;

// Strict environment variable check for debugging in production
if (envKey === undefined) {
  console.info('[Stripe Info] VITE_STRIPE_PUBLIC_KEY not detected, falling back to LIVE_PUBLIC_KEY.');
}

// Initialize Stripe sparingly
export const stripePromise = STRIPE_PUBLIC_KEY 
  ? loadStripe(STRIPE_PUBLIC_KEY) 
  : Promise.resolve(null);

if (!STRIPE_PUBLIC_KEY) {
  console.error('[Stripe CRITICAL] Valid Stripe Public Key is utterly missing. Check your Vite configuration. The string is literally undefined.');
}

/**
 * Initiates a Stripe Checkout session by calling the backend,
 * then redirects the user to the secure Stripe checkout page.
 * 
 * @param priceId - The Stripe Price ID from the dashboard
 * @param userId - The unique identifier for the user (Firebase UID)
 */
export async function handleCheckout(priceId: string, userId: string) {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize. Please check your configuration.');
    }

    // Call your backend to create a Checkout Session
    const response = await fetch(`${API_URL}/createCheckoutSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('[Stripe Checkout Error]:', error);
    // You could use a toast notification here
    alert(`Checkout error: ${error.message}`);
    throw error;
  }
}
