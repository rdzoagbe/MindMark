/**
 * PRODUCTION SERVERLESS EXECUTION CONTEXT
 * 
 * NOTE: This `index.ts` file acts as the primary Firebase Cloud Functions source of truth 
 * for the production web build. 
 * 
 * IMPORTANT: Features like Stripe Webhooks, Subscriptions, and Extension sync MUST 
 * be maintained here. Do NOT rely on the local `server.ts` fallback when deployed to production.
 * 
 * Ensure all sensitive logic safely checks `process.env`.
 */
import * as functions from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import admin from "firebase-admin";
import Stripe from "stripe";
import cors from "cors";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";

admin.initializeApp();

const corsHandler = cors({ origin: true });

// Define Secrets parameters correctly for modern Firebase
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// 1. Stripe Checkout Session Creation
export const createCheckoutSession = functions.runWith({secrets: [stripeSecretKey]}).https.onRequest((req, res) => {
  const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: "2023-10-16" });
  return corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { priceId, userId } = req.body;
    if (!priceId || !userId) {
      res.status(400).send("Missing priceId or userId");
      return;
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        client_reference_id: userId,
        metadata: { userId }, // Safer backup
        success_url: `${req.headers.origin}/upgrade-success`,
        cancel_url: `${req.headers.origin}/pricing`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      functions.logger.error("Error creating session:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

// 2. Get User Plan (for Extension)
export const getUserPlan = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).send("Missing userId");
      return;
    }

    try {
      const doc = await admin.firestore()
        .collection("users")
        .doc(userId)
        .collection("billing")
        .doc("subscription")
        .get();
      
      const data = doc.data();
      res.status(200).json({ 
        plan: data?.plan || "free",
        status: data?.status || "inactive"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
});

// 3. Save Extension Session
export const saveExtensionSession = functions.runWith({secrets: [geminiApiKey]}).https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { userId, nextStep, links, summary } = req.body;
    if (!userId || !nextStep) {
      res.status(400).json({ error: "User ID and Next Step are required." });
      return;
    }

    try {
      const db = admin.firestore();
      
      // Eligibility check
      const subscriptionDoc = await db.collection("users")
        .doc(userId)
        .collection("billing")
        .doc("subscription")
        .get();
      
      const planData = subscriptionDoc.data();
      const plan = planData?.plan || "free";
      const status = planData?.status || "inactive";
      
      const hasSyncAccess = (plan === "pro" || plan === "premium") && (status === "active" || status === "trialing");

      if (!hasSyncAccess) {
        res.status(403).json({ 
          error: "Extension sync requires a Pro or Premium subscription.",
          code: "INSUFFICIENT_PLAN"
        });
        return;
      }

      const sessionId = crypto.randomUUID();
      const timestamp = Date.now();
      
      let notes = summary ? `**AI Summary of Saved Tabs:**\n${summary}` : "";

      // Background task implementation for summarization if not provided directly
      if (!summary && links && links.length > 0 && geminiApiKey.value()) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
          const linkList = links.map((l: any) => `- ${l.label} (${l.url})`).join('\n');
          const prompt = `You are a professional multilingual researcher. Analyze these tabs and provide a high-quality summary and next-step recommendation. Ensure the output uses perfect grammar. Output the summary in the user's detected language (defaulting to English if unsure) among: English, French, Spanish, Portuguese, Chinese, or German.\n\nTabs:\n${linkList}`;
          const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
          if (response.text) {
             notes = `**AI Context Summary:**\n${response.text}`;
          }
        } catch (e) {
          functions.logger.error("Gemini context enrichment failed:", e);
        }
      }

      const newSession = {
        id: sessionId,
        title: `MindMark Snapshot - ${new Date().toLocaleString()}`,
        nextStep: nextStep,
        links: links || [],
        status: "active",
        priority: "medium",
        category: "Quick Capture",
        tags: ["browser-extension"],
        userId: userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        pinned: false,
        notes: notes
      };

      await db.collection("users")
        .doc(userId)
        .collection("sessions")
        .doc(sessionId)
        .set(newSession);

      res.status(200).json({ success: true, sessionId });
    } catch (error: any) {
      functions.logger.error("Extension Save Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

// 4. Stripe Webhook
export const stripeWebhook = functions.runWith({secrets: [stripeSecretKey, stripeWebhookSecret]}).https.onRequest(async (req, res) => {
  const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: "2023-10-16" });
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    if (!sig || !stripeWebhookSecret.value()) {
      throw new Error("Missing signature or secret");
    }
    event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret.value());
  } catch (err: any) {
    functions.logger.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    const eventId = event.id;
    const eventRef = admin.firestore().collection("processed_events").doc(eventId);

    const eventDoc = await eventRef.get();
    if (eventDoc.exists) {
      functions.logger.info(`Event ${eventId} already processed. Skipping.`);
      res.json({ received: true });
      return;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        
        if (userId) {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0].price.id;
            
            const plan = mapPriceIdToPlan(priceId);

            await admin.firestore()
              .collection("users")
              .doc(userId)
              .collection("billing")
              .doc("subscription")
              .set({
                plan: plan,
                status: subscription.status,
                subscriptionStatus: "active",
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                currentPeriodEnd: subscription.current_period_end * 1000,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              }, { merge: true });

            functions.logger.info(`User ${userId} upgraded to ${plan} tier.`);
          }
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const usersRef = admin.firestore().collectionGroup("billing").where("stripeCustomerId", "==", customerId);
        const snapshot = await usersRef.get();

        if (!snapshot.empty) {
          for (const doc of snapshot.docs) {
            let plan = "free";
            if (subscription.status === "active" || subscription.status === "trialing") {
               const priceId = subscription.items.data[0].price.id;
               plan = mapPriceIdToPlan(priceId);
            }

            await doc.ref.update({
              plan: plan,
              status: subscription.status,
              subscriptionStatus: (subscription.status === "active" || subscription.status === "trialing") ? "active" : "inactive",
              stripeSubscriptionId: subscription.id,
              currentPeriodEnd: subscription.current_period_end * 1000,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
        break;
      }
      default:
        functions.logger.info(`Unhandled event type ${event.type}`);
    }

    await eventRef.set({
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      type: event.type
    });

    res.json({ received: true });
  } catch (error) {
    functions.logger.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

function mapPriceIdToPlan(priceId: string): string {
  const PRO_ID = process.env.STRIPE_PRO_PRICE_ID;
  const PREMIUM_ID = process.env.STRIPE_PREMIUM_PRICE_ID;
  const PLUS_ID = process.env.STRIPE_PLUS_PRICE_ID;

  if (priceId === PRO_ID && PRO_ID) return "pro";
  if (priceId === PREMIUM_ID && PREMIUM_ID) return "premium";
  if (priceId === PLUS_ID && PLUS_ID) return "plus";
  return "free";
}

