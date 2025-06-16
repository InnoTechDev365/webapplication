
/**
 * Utility for downloading files in a cross-browser compatible way
 */

/**
 * Helper function to download a file in a cross-browser compatible way
 * @param blob The Blob containing file data
 * @param filename The name to save the file as
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
