import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { syncManager } from '@/lib/syncManager';
import { 
  exportToCSV, 
  exportToJSON, 
  exportToText,
  importFromJSON,
  importFromCSV,
  generateTextReport
} from '@/lib/exportManager';
import { useAppContext } from '@/lib/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const DataManagement = () => {
  const { formatCurrency } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const data = syncManager.exportData();
      const parsed = JSON.parse(data);
      
      exportToJSON(parsed, {
        filename: `finance_backup_${new Date().toISOString().split('T')[0]}.json`
      });
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const transactions = syncManager.getTransactions();
      const categories = syncManager.getCategories();
      
      const data = transactions.map(tx => {
        const category = categories.find(c => c.id === tx.category);
        return {
          Date: new Date(tx.date).toLocaleDateString(),
          Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
          Description: tx.description,
          Category: category?.name || 'Unknown',
          Amount: tx.amount,
          'Formatted Amount': formatCurrency(tx.amount),
          Notes: tx.notes || ''
        };
      });
      
      exportToCSV(data, {
        filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`
      });
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportText = async () => {
    setIsExporting(true);
    try {
      const transactions = syncManager.getTransactions();
      const categories = syncManager.getCategories();
      
      // Enhance transactions with category names
      const enhancedTransactions = transactions.map(tx => {
        const category = categories.find(c => c.id === tx.category);
        return { ...tx, categoryName: category?.name || 'Unknown' };
      });
      
      const report = generateTextReport(enhancedTransactions, formatCurrency);
      
      exportToText(report, {
        filename: `financial_report_${new Date().toISOString().split('T')[0]}.txt`
      });
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      let data: any;
      
      if (file.name.endsWith('.json')) {
        data = await importFromJSON(file);
      } else if (file.name.endsWith('.csv')) {
        const csvData = await importFromCSV(file);
        // Convert CSV data to transaction format
        data = {
          transactions: csvData.map((row, index) => ({
            id: `import_${Date.now()}_${index}`,
            date: row.Date || new Date().toISOString(),
            type: (row.Type?.toLowerCase() === 'income' ? 'income' : 'expense') as 'income' | 'expense',
            description: row.Description || 'Imported transaction',
            category: row.Category || 'expense-other',
            amount: parseFloat(row.Amount?.replace(/[^0-9.-]/g, '') || row['Amount (Raw)'] || '0'),
            notes: row.Notes || ''
          }))
        };
      } else {
        throw new Error('Unsupported file format. Use .json or .csv files.');
      }

      setPendingImportData(data);
      setShowImportConfirm(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to read file');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;

    try {
      const result = syncManager.importData(JSON.stringify(pendingImportData));
      
      if (result.success) {
        toast.success('Data imported successfully!');
        // Refresh the page to show new data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.error || 'Import failed');
      }
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setShowImportConfirm(false);
      setPendingImportData(null);
    }
  };

  const getImportPreview = () => {
    if (!pendingImportData) return null;
    
    const txCount = pendingImportData.transactions?.length || 0;
    const catCount = pendingImportData.categories?.length || 0;
    const budgetCount = pendingImportData.budgets?.length || 0;
    
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Transactions:</span>
          <span className="font-medium">{txCount}</span>
        </div>
        {catCount > 0 && (
          <div className="flex justify-between">
            <span>Categories:</span>
            <span className="font-medium">{catCount}</span>
          </div>
        )}
        {budgetCount > 0 && (
          <div className="flex justify-between">
            <span>Budgets:</span>
            <span className="font-medium">{budgetCount}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export your data for backup or import from a file
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Export Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Export Data</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportJSON}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileJson className="mr-2 h-4 w-4" />
                )}
                Full Backup (JSON)
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                )}
                Transactions (CSV)
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportText}
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Report (TXT)
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Import Data</h4>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleImportClick}
                disabled={isImporting}
                className="flex-1"
              >
                {isImporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Import from File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports .json (full backup) or .csv (transactions only)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Import Confirmation Dialog */}
      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Import
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  This will merge the imported data with your existing data. 
                  Duplicate entries may be created.
                </p>
                
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-2">Data to import:</h4>
                    {getImportPreview()}
                  </CardContent>
                </Card>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Import Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
