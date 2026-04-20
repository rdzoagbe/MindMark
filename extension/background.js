/**
 * @ts-nocheck
 * MindMark Companion - Background Script
 * This script runs in the browser background for future message passing.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Extension] MindMark Companion installed.');
});

// Listener for regular messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'AUTH_SYNC') {
    chrome.storage.local.set({ userId: request.userId }, () => {
      console.log('[Extension] User ID synced from web app via content script');
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.type === 'SAVE_SESSION') {
    saveSession(request.payload)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }
});

async function saveSession(payload) {
  // Pointing to Cloud Functions for serverless architecture (GitHub Pages)
  const API_BASE = 'https://us-central1-accessguard-v2.cloudfunctions.net';
  const { userId } = payload;

  if (!userId) {
    throw new Error('You must be logged in to sync sessions.');
  }

  // 1. Check subscription eligibility first
  console.log('[Extension] Verifying subscription for sync eligibility...');
  const planResponse = await fetch(`${API_BASE}/getUserPlan?userId=${userId}`);
  if (!planResponse.ok) {
    throw new Error('Failed to verify subscription status.');
  }

  const { plan, status } = await planResponse.json();
  const hasSyncAccess = (plan === 'pro' || plan === 'premium') && (status === 'active' || status === 'trialing');

  if (!hasSyncAccess) {
    throw new Error(`Your current plan (${plan}) does not include cloud sync. Upgrade to Pro or Premium on mindmark.tech.`);
  }

  // 2. Proceed with save
  const response = await fetch(`${API_BASE}/saveExtensionSession`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to save session via API');
  }

  return response.json();
}
