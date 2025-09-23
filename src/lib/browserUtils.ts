/**
 * Browser compatibility utilities for GitHub Pages and various environments
 */

// Safe window access
export const safeWindow = (): Window | null => {
  if (typeof window !== 'undefined') {
    return window;
  }
  return null;
};

// Safe document access
export const safeDocument = (): Document | null => {
  if (typeof document !== 'undefined') {
    return document;
  }
  return null;
};

// Safe window width getter
export const getWindowWidth = (): number => {
  const win = safeWindow();
  return win?.innerWidth || 1024; // Default fallback
};

// Safe window height getter
export const getWindowHeight = (): number => {
  const win = safeWindow();
  return win?.innerHeight || 768; // Default fallback
};

// Safe event listener management
export const addWindowEventListener = (
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  const win = safeWindow();
  if (win) {
    win.addEventListener(event, handler, options);
    return () => win.removeEventListener(event, handler, options);
  }
  return () => {}; // No-op cleanup
};

// Safe media query matching
export const matchMedia = (query: string): MediaQueryList | null => {
  const win = safeWindow();
  return win?.matchMedia ? win.matchMedia(query) : null;
};

// Safe clipboard operations
export const writeToClipboard = async (text: string): Promise<boolean> => {
  const nav = safeWindow()?.navigator;
  if (nav?.clipboard) {
    try {
      await nav.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

// Safe URL creation for file downloads
export const createObjectURL = (object: Blob | MediaSource): string | null => {
  if (typeof window !== 'undefined' && window.URL) {
    try {
      return window.URL.createObjectURL(object);
    } catch {
      return null;
    }
  }
  return null;
};

// Safe URL revocation
export const revokeObjectURL = (url: string): void => {
  if (typeof window !== 'undefined' && window.URL) {
    try {
      window.URL.revokeObjectURL(url);
    } catch {
      // Ignore errors
    }
  }
};

// Safe page reload
export const reloadPage = (): void => {
  const win = safeWindow();
  if (win) {
    win.location.reload();
  }
};

// Safe document element creation
export const createElement = (tagName: string): HTMLElement | null => {
  const doc = safeDocument();
  return doc ? doc.createElement(tagName) : null;
};

// Safe element insertion and cleanup
export const insertAndCleanup = (
  element: HTMLElement,
  callback: () => void,
  timeout = 100
): void => {
  const doc = safeDocument();
  if (!doc || !doc.body) return;
  
  doc.body.appendChild(element);
  callback();
  
  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }, timeout);
};