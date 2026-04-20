import { Session } from '../types';

/**
 * Recreates the physical workspace by opening all saved URLs in the browser.
 * @param session The session to restore
 * @param onBlocked Callback to inform the UI that some tabs were blocked
 */
export async function restoreWorkspace(session: Session, onBlocked?: () => void) {
  if (!session.links || session.links.length === 0) {
    console.warn('No links found to restore in this session.');
    return;
  }

  console.log(`[Workspace] Restoring ${session.links.length} links for session: ${session.title}`);

  let blocked = false;
  
  // Try to open all links synchronously inside the user-initiated click handler
  // Browsers usually allow multiple tabs if it's the direct result of a user click.
  for (let i = 0; i < session.links.length; i++) {
    const link = session.links[i];
    if (link.url) {
      try {
        const win = window.open(link.url, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          blocked = true;
          console.warn('[Workspace] Popup blocked for URL:', link.url);
        }
      } catch (err) {
        blocked = true;
        console.error('[Workspace] Error opening tab:', err);
      }
    }
  }

  if (blocked && onBlocked) {
    onBlocked();
  }
}
