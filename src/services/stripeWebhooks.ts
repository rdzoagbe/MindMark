/**
 * STRIPE WEBHOOK HANDLER (Node.js / Express / Firebase Cloud Functions)
 * 
 * This module handles incoming events from Stripe to synchronize 
 * subscription state with our Firestore database.
 */

import express from 'express';
import Stripe from 'stripe';
import admin from 'firebase-admin';

// Re-initialize for visibility
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01' as any,
});

const webhookRouter = express.Router();

/**
 * PATH: /api/webhooks/stripe
 * Logic: Listens for checkout and subscription events.
 */
webhookRouter.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id; // Added during handleCheckout
      const stripeCustomerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await updateSubscriptionState(userId, stripeCustomerId, subscriptionId);
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      const userId = await findUserIdByCustomerId(stripeCustomerId);

      if (userId) {
        await syncSubscription(userId, subscription);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Updates the Firestore user document with the latest subscription data.
 * SCHEMA UPDATE PLAN:
 * - stripeCustomerId: Used for matching future webhooks.
 * - subscriptionTier: mapped from the PriceID of the line item.
 * - subscriptionStatus: 'active', 'past_due', 'canceled', etc.
 * - currentPeriodEnd: Timestamp for feature gating locally if sync fails.
 */
async function syncSubscription(userId: string, subscription: Stripe.Subscription) {
  const db = admin.firestore();
  const priceId = subscription.items.data[0].price.id;
  
  // Mapping logic PriceID -> Tier Name
  const tier = mapPriceIdToTier(priceId);

  await db.doc(`users/${userId}/billing/subscription`).set({
    subscriptionId: subscription.id,
    stripeCustomerId: subscription.customer,
    plan: tier,
    status: subscription.status,
    currentPeriodEnd: (subscription as any).current_period_end * 1000, // ms
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`[Stripe Webhook] Synced subscription for user ${userId} to tier: ${tier}`);
}

// Utility Helpers
function mapPriceIdToTier(priceId: string): string {
  if (priceId === 'price_plus_placeholder') return 'plus';
  if (priceId === 'price_pro_placeholder') return 'pro';
  if (priceId === 'price_premium_placeholder') return 'premium';
  return 'free';
}

async function findUserIdByCustomerId(customerId: string): Promise<string | null> {
  const db = admin.firestore();
  const snapshot = await db.collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();
    
  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}

async function updateSubscriptionState(userId: string, customerId: string, subId: string) {
  const db = admin.firestore();
  await db.doc(`users/${userId}`).update({
    stripeCustomerId: customerId,
  });
  
  const stripeSubscription = await stripe.subscriptions.retrieve(subId);
  await syncSubscription(userId, stripeSubscription);
}

export default webhookRouter;
