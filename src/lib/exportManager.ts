/**
 * Robust file export utilities with cross-browser compatibility
 * Supports CSV, JSON, and text file formats
 */

import { toast } from 'sonner';
import { createObjectURL, revokeObjectURL } from './browserUtils';

export interface ExportOptions {
  filename: string;
  mimeType?: string;
  addBOM?: boolean; // Add byte order mark for Excel UTF-8 compatibility
}

/**
 * Core file download function with cross-browser support
 */
export const downloadFile = (blob: Blob, filename: string): boolean => {
  try {
    // Create object URL
    const url = createObjectURL(blob);
    if (!url) {
      console.error('Failed to create object URL');
      return false;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Handle Safari and iOS
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isSafari || isIOS) {
      // For Safari/iOS, open in new tab
      link.target = '_blank';
    }

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      revokeObjectURL(url);
    }, 100);

    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};

/**
 * Export data as CSV file
 */
export const exportToCSV = (data: any[], options: ExportOptions): boolean => {
  if (!data || data.length === 0) {
    toast.error('No data to export');
    return false;
  }

  try {
    // Get headers from first row
    const headers = Object.keys(data[0]);
    
    // Build CSV content
    const rows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values with commas, quotes, or newlines
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ];

    let content = rows.join('\n');
    
    // Add BOM for Excel UTF-8 compatibility
    if (options.addBOM !== false) {
      content = '\ufeff' + content;
    }

    const blob = new Blob([content], { type: options.mimeType || 'text/csv;charset=utf-8;' });
    const success = downloadFile(blob, options.filename);
    
    if (success) {
      toast.success(`Exported ${data.length} records to ${options.filename}`);
    } else {
      toast.error('Export failed');
    }
    
    return success;
  } catch (error) {
    console.error('CSV export error:', error);
    toast.error('Failed to export CSV');
    return false;
  }
};

/**
 * Export data as JSON file
 */
export const exportToJSON = (data: any, options: ExportOptions): boolean => {
  try {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: options.mimeType || 'application/json' });
    const success = downloadFile(blob, options.filename);
    
    if (success) {
      toast.success(`Exported to ${options.filename}`);
    } else {
      toast.error('Export failed');
    }
    
    return success;
  } catch (error) {
    console.error('JSON export error:', error);
    toast.error('Failed to export JSON');
    return false;
  }
};

/**
 * Export text content as file
 */
export const exportToText = (content: string, options: ExportOptions): boolean => {
  try {
    const blob = new Blob([content], { type: options.mimeType || 'text/plain' });
    const success = downloadFile(blob, options.filename);
    
    if (success) {
      toast.success(`Exported to ${options.filename}`);
    } else {
      toast.error('Export failed');
    }
    
    return success;
  } catch (error) {
    console.error('Text export error:', error);
    toast.error('Failed to export');
    return false;
  }
};

/**
 * Export transactions to CSV
 */
export const exportTransactionsToCSV = (
  transactions: any[], 
  formatCurrency: (amount: number) => string
): boolean => {
  const data = transactions.map(tx => ({
    Date: new Date(tx.date).toLocaleDateString(),
    Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
    Description: tx.description,
    Category: tx.category,
    Amount: formatCurrency(tx.amount),
    'Amount (Raw)': tx.amount,
    Notes: tx.notes || ''
  }));

  return exportToCSV(data, {
    filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`
  });
};

/**
 * Export full data backup as JSON
 */
export const exportFullBackup = (data: {
  transactions: any[];
  budgets: any[];
  categories: any[];
  settings: any;
}): boolean => {
  const backup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    ...data
  };

  return exportToJSON(backup, {
    filename: `finance_backup_${new Date().toISOString().split('T')[0]}.json`
  });
};

/**
 * Import data from JSON file
 */
export const importFromJSON = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import transactions from CSV file
 */
export const importFromCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const lines = content.trim().split('\n');
        
        if (lines.length < 2) {
          reject(new Error('CSV file is empty or has no data rows'));
          return;
        }

        // Parse header
        const headers = parseCSVLine(lines[0]);
        
        // Parse data rows
        const data = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
          });
          return row;
        }).filter(row => Object.values(row).some(v => v)); // Filter empty rows

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Parse a single CSV line, handling quoted fields
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Generate financial report as text
 */
export const generateTextReport = (
  transactions: any[],
  formatCurrency: (amount: number) => string,
  dateRange?: { start: Date; end: Date }
): string => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;
  
  let report = `
========================================
       FINANCIAL REPORT
========================================
Generated: ${new Date().toLocaleString()}
${dateRange ? `Period: ${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}` : ''}

SUMMARY
----------------------------------------
Total Income:    ${formatCurrency(income)}
Total Expenses:  ${formatCurrency(expenses)}
Net Balance:     ${formatCurrency(balance)}
Savings Rate:    ${income > 0 ? ((balance / income) * 100).toFixed(1) : 0}%

TRANSACTIONS (${transactions.length})
----------------------------------------
`;

  // Group by type
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  if (incomeTransactions.length > 0) {
    report += '\nINCOME:\n';
    incomeTransactions.forEach(t => {
      report += `  ${new Date(t.date).toLocaleDateString()} - ${t.description}: ${formatCurrency(t.amount)}\n`;
    });
  }

  if (expenseTransactions.length > 0) {
    report += '\nEXPENSES:\n';
    expenseTransactions.forEach(t => {
      report += `  ${new Date(t.date).toLocaleDateString()} - ${t.description}: ${formatCurrency(t.amount)}\n`;
    });
  }

  report += `
========================================
              END OF REPORT
========================================
`;

  return report;
};
