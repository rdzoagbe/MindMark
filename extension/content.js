// Content script to bridge window.postMessage to chrome.runtime.sendMessage
window.addEventListener('message', (event) => {
  // Only accept messages from same standard origin
  if (event.source !== window) return;

  if (event.data && event.data.type === 'MINDMARK_AUTH_SYNC') {
    chrome.runtime.sendMessage({
      type: 'AUTH_SYNC',
      userId: event.data.userId
    });
  }
});
