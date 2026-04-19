import { loadStripe } from '@stripe/stripe-js';
<<<<<<< HEAD
import { API_URL } from '../config/constants';

const sanitize = (val: string | undefined | null) => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') return undefined;
  return val.replace(/['"]+/g, '').trim();
};

const LIVE_PUBLIC_KEY = "your_stripe_publishable_key_here";
const STRIPE_PUBLIC_KEY = sanitize(import.meta.env.VITE_STRIPE_PUBLIC_KEY) || LIVE_PUBLIC_KEY;
=======

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8

// Initialize Stripe sparingly
export const stripePromise = STRIPE_PUBLIC_KEY 
  ? loadStripe(STRIPE_PUBLIC_KEY) 
  : Promise.resolve(null);

<<<<<<< HEAD
if (!STRIPE_PUBLIC_KEY) {
  console.warn('[Stripe] VITE_STRIPE_PUBLIC_KEY is not set in environment variables. Checkout redirects will fail.');
}

=======
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
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
<<<<<<< HEAD
    const response = await fetch(`${API_URL}/createCheckoutSession`, {
=======
    // We assume an endpoint at /api/create-checkout-session exists
    const response = await fetch('/api/create-checkout-session', {
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
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
