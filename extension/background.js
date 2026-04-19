/**
 * @ts-nocheck
<<<<<<< HEAD
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
=======
 * Context Saver Companion - Background Script
 * This script runs in the browser background to harvest tab data.
 */

chrome.action.onClicked.addListener(async (tab) => {
  // 1. Query all tabs in the current window
  const tabs = await chrome.tabs.query({ currentWindow: true });
  
  const harvestedLinks = tabs.map(t => ({
    title: t.title,
    url: t.url,
    id: crypto.randomUUID()
  })).filter(t => t.url && t.url.startsWith('http'));

  console.log(`[Extension] Harvesting ${harvestedLinks.length} tabs...`);

  // 2. Here we would send this data to our Firebase collection
  // For a production implementation, we'd use the chrome.storage to get the user's auth token
  // and then hit a Cloud Function or direct Firestore write.
  
  // Placeholder for direct integration logic:
  // await writeToFirestore('sessions', {
  //   title: `Imported from Browser: ${new Date().toLocaleString()}`,
  //   links: harvestedLinks,
  //   status: 'active',
  //   createdAt: Date.now()
  // });

  // 3. Open the web app to show the new session
  chrome.tabs.create({ url: 'https://ais-dev-bzplh22k7gwv3uvj7ikgxs-327544902703.europe-west1.run.app/#/dashboard' });
});
>>>>>>> 817c90190c11ebb70fbcd656933aee47c4526ed8
