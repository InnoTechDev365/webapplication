
/**
 * Utility for downloading files in a cross-browser compatible way
 */
import { createElement, insertAndCleanup, createObjectURL, revokeObjectURL } from '../browserUtils';

/**
 * Helper function to download a file in a cross-browser compatible way
 * @param blob The Blob containing file data
 * @param filename The name to save the file as
 */
export function downloadFile(blob: Blob, filename: string) {
  // Guard for non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const url = createObjectURL(blob);
  if (!url) return; // Failed to create URL
  
  const link = createElement('a') as HTMLAnchorElement;
  if (!link) return; // Failed to create element
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  insertAndCleanup(
    link,
    () => link.click(),
    100
  );
  
  // Cleanup URL after a delay
  setTimeout(() => revokeObjectURL(url), 200);
}
