/**
 * Utility for downloading files in a cross-browser compatible way
 * Works on all modern browsers including Safari, Chrome, Firefox, Edge
 */

/**
 * Helper function to download a file in a cross-browser compatible way
 * @param blob The Blob containing file data
 * @param filename The name to save the file as
 */
export function downloadFile(blob: Blob, filename: string): boolean {
  // Guard for non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('Download not available: not in browser environment');
    return false;
  }

  try {
    // Method 1: Try using the modern download attribute approach
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // For Safari and iOS, we need to handle this differently
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isSafari || isIOS) {
      // For Safari/iOS, open in new window/tab
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    
    document.body.appendChild(link);
    
    // Use a small timeout to ensure the element is in the DOM
    setTimeout(() => {
      link.click();
      
      // Cleanup after download starts
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 150);
    }, 10);
    
    return true;
  } catch (error) {
    console.error('Download failed with primary method, trying fallback:', error);
    
    // Fallback: Try opening blob URL directly
    try {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      return false;
    }
  }
}

/**
 * Download text content as a file
 * @param content Text content to download
 * @param filename Filename including extension
 * @param mimeType MIME type (defaults to text/plain)
 */
export function downloadTextFile(content: string, filename: string, mimeType: string = 'text/plain'): boolean {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  return downloadFile(blob, filename);
}

/**
 * Download CSV content
 * @param content CSV content
 * @param filename Filename (should end with .csv)
 */
export function downloadCSV(content: string, filename: string): boolean {
  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' });
  return downloadFile(blob, filename);
}
