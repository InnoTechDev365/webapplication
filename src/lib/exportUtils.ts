
/**
 * Utility functions for exporting financial data
 */

/**
 * Export data to PDF format
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToPdf = (data: any, title: string) => {
  console.log('Exporting to PDF:', { data, title });
  
  // In a real application, this would use a PDF generation library like pdfmake or jspdf
  // For demonstration purposes, we'll create a download link with dummy content
  
  // Create a Blob containing dummy PDF content
  const blob = new Blob(
    [`%PDF-1.5\n1 0 obj\n<</Type /Catalog>>\nendobj\n2 0 obj\n<</Length 44>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(${title}) Tj\nET\nendstream\nendobj\nxref\n0 3\n0000000000 65535 f\n0000000015 00000 n\n0000000051 00000 n\ntrailer\n<</Size 3>>\nstartxref\n144\n%%EOF\n`],
    { type: 'application/pdf' }
  );
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}.pdf`;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Export data to Excel format
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToExcel = (data: any, title: string) => {
  console.log('Exporting to Excel:', { data, title });
  
  // In a real application, this would use a library like exceljs or xlsx
  // For demonstration purposes, we'll create a CSV file which can be opened in Excel
  
  let csvContent = "";
  
  // Convert data to CSV
  if (Array.isArray(data)) {
    // Add headers
    const headers = Object.keys(data[0] || {}).join(',');
    csvContent += headers + '\n';
    
    // Add rows
    data.forEach(item => {
      const row = Object.values(item).join(',');
      csvContent += row + '\n';
    });
  } else {
    // Multiple datasets
    for (const [key, value] of Object.entries(data)) {
      csvContent += `${key}\n`;
      
      if (Array.isArray(value)) {
        // Add headers
        const headers = Object.keys(value[0] || {}).join(',');
        csvContent += headers + '\n';
        
        // Add rows
        value.forEach((item: any) => {
          const row = Object.values(item).join(',');
          csvContent += row + '\n';
        });
      }
      
      csvContent += '\n';
    }
  }
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}.csv`;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Export data to Google Sheets format
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToSheets = (data: any, title: string) => {
  console.log('Exporting to Google Sheets:', { data, title });
  
  // Google Sheets can open CSV files, so we'll use the same method as Excel
  exportToExcel(data, title + "_sheets");
  
  // In a real application, this would use the Google Sheets API
  // to create a new sheet and populate it with the data
};
