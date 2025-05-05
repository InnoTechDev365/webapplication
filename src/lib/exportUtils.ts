
/**
 * Utility functions for exporting financial data
 */
import { toast } from "sonner";

/**
 * Export data to PDF format with cross-browser compatibility
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToPdf = (data: any, title: string) => {
  console.log('Exporting to PDF:', { data, title });
  
  try {
    // In a real application, this would use a PDF generation library like pdfmake or jspdf
    // For demonstration purposes, we'll create a download link with dummy content
    
    // Create a Blob containing dummy PDF content with better formatting
    const pdfContent = `%PDF-1.5
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Kids [3 0 R] /Count 1>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 6 0 R>>
endobj
4 0 obj
<</Font <</F1 5 0 R>>>>
endobj
5 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
6 0 obj
<</Length 200>>
stream
BT
/F1 16 Tf
50 700 Td
(${title}) Tj
/F1 12 Tf
0 -40 Td
(Financial Report - Generated on ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(This is a sample financial report export) Tj
ET
endstream
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
0000000250 00000 n
0000000317 00000 n
trailer
<</Size 7 /Root 1 0 R>>
startxref
520
%%EOF
`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    downloadFile(blob, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF export completed successfully");
  } catch (error) {
    console.error("PDF Export failed:", error);
    toast.error("Failed to export PDF");
  }
};

/**
 * Export data to Excel format with cross-browser compatibility
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToExcel = (data: any, title: string) => {
  console.log('Exporting to Excel:', { data, title });
  
  try {
    // In a real application, this would use a library like exceljs or xlsx
    // For demonstration purposes, we'll create a CSV file which can be opened in Excel
    
    let csvContent = "";
    
    // Add metadata
    csvContent += `# ${title}\n`;
    csvContent += `# Generated: ${new Date().toISOString()}\n\n`;
    
    // Convert data to CSV
    if (Array.isArray(data)) {
      // Add headers
      const headers = Object.keys(data[0] || {}).join(',');
      csvContent += headers + '\n';
      
      // Add rows
      data.forEach(item => {
        const row = Object.values(item).map(value => {
          // Handle special cases for CSV formatting
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return value;
        }).join(',');
        csvContent += row + '\n';
      });
    } else if (typeof data === 'object' && data !== null) {
      // Handle multiple datasets or object structure
      for (const [key, value] of Object.entries(data)) {
        csvContent += `## ${key}\n`;
        
        if (Array.isArray(value) && value.length > 0) {
          // Add headers
          const headers = Object.keys(value[0] || {}).join(',');
          csvContent += headers + '\n';
          
          // Add rows
          value.forEach((item: any) => {
            const row = Object.values(item).map(cellValue => {
              if (cellValue === null || cellValue === undefined) return '';
              if (typeof cellValue === 'string') return `"${cellValue.replace(/"/g, '""')}"`;
              if (typeof cellValue === 'object') return `"${JSON.stringify(cellValue).replace(/"/g, '""')}"`;
              return cellValue;
            }).join(',');
            csvContent += row + '\n';
          });
        }
        
        csvContent += '\n';
      }
    }
    
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Excel export completed successfully");
  } catch (error) {
    console.error("Excel Export failed:", error);
    toast.error("Failed to export Excel file");
  }
};

/**
 * Helper function to download a file in a cross-browser compatible way
 * @param blob The Blob containing file data
 * @param filename The name to save the file as
 */
function downloadFile(blob: Blob, filename: string) {
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  // Append to the DOM, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  
  // Clean up after a short delay to ensure download starts
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
