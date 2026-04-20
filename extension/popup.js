/**
 * MindMark Companion - Popup Script
 */

const DOMAIN = 'mindmark.tech';
// We don't use API_URL here directly anymore, background.js points to the Cloud Function

// State
let userId = null;
let activeTabs = [];

// Elements
const authView = document.getElementById('authView');
const mainView = document.getElementById('mainView');
const loginBtn = document.getElementById('loginBtn');
const saveBtn = document.getElementById('saveBtn');
const nextAction = document.getElementById('nextAction');
const tabCountEl = document.getElementById('tabCount');

// Initialize
async function init() {
  // 1. Check Auth (Prioritize chrome.storage.local)
  try {
    const storageResult = await chrome.storage.local.get('userId');
    if (storageResult.userId) {
      userId = storageResult.userId;
      showView('main');
      harvestTabs();
      return;
    }

    // Fallback to cookie
    const cookie = await chrome.cookies.get({
      url: `https://${DOMAIN}`,
      name: 'mindmark_uid'
    });

    if (cookie && cookie.value) {
      userId = cookie.value;
      // Sync it locally for next time
      chrome.storage.local.set({ userId });
      showView('main');
      harvestTabs();
    } else {
      showView('auth');
    }
  } catch (err) {
    console.error('Auth Check Error:', err);
    showView('auth');
  }
}

function showView(view) {
  if (view === 'main') {
    authView.classList.remove('active');
    mainView.classList.add('active');
  } else {
    authView.classList.add('active');
    mainView.classList.remove('active');
  }
}

async function harvestTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  activeTabs = tabs.map(t => ({
    id: crypto.randomUUID(),
    label: t.title,
    url: t.url
  })).filter(t => t.url && t.url.startsWith('http'));

  tabCountEl.textContent = activeTabs.length;
}

// Event Listeners
loginBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: `https://${DOMAIN}/#/login` });
});

nextAction.addEventListener('input', () => {
  saveBtn.disabled = !nextAction.value.trim();
});

saveBtn.addEventListener('click', async () => {
  const text = nextAction.value.trim();
  if (!text || !userId) return;

  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  // Send message to background script
  chrome.runtime.sendMessage({
    type: 'SAVE_SESSION',
    payload: {
      userId: userId,
      nextStep: text,
      links: activeTabs
    }
  }, (response) => {
    if (response && response.success) {
      saveBtn.textContent = 'Saved!';
      saveBtn.classList.add('btn-emerald');
      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      console.error('Save Error:', response ? response.error : 'Unknown error');
      saveBtn.textContent = 'Error';
      saveBtn.classList.add('btn-red');
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Action';
        saveBtn.classList.remove('btn-red');
      }, 2000);
    }
  });
});

init();
