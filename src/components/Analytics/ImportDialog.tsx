
import { useRef, useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const ImportDialog = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to simulate file processing and data extraction
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing steps
    const steps = [
      { message: "Reading file...", progress: 20 },
      { message: "Parsing data structure...", progress: 40 },
      { message: "Validating financial data...", progress: 60 },
      { message: "Extracting analytics...", progress: 80 },
      { message: "Preparing import preview...", progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingProgress(step.progress);
      toast.info(step.message);
    }

    // Generate mock preview data based on file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let mockData;

    if (fileExtension === 'pdf') {
      mockData = {
        type: 'PDF Bank Statement',
        transactions: 47,
        dateRange: 'Jan 2024 - Dec 2024',
        categories: ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities'],
        totalIncome: 12500,
        totalExpenses: 8300,
        preview: [
          { date: '2024-01-15', description: 'Salary Deposit', amount: 3500, type: 'income' },
          { date: '2024-01-16', description: 'Grocery Store', amount: -120, type: 'expense' },
          { date: '2024-01-18', description: 'Gas Station', amount: -45, type: 'expense' }
        ]
      };
    } else {
      mockData = {
        type: 'Excel/CSV Financial Data',
        transactions: 89,
        dateRange: 'Jan 2024 - Dec 2024',
        categories: ['Salary', 'Freelance', 'Groceries', 'Rent', 'Utilities'],
        totalIncome: 18700,
        totalExpenses: 11200,
        preview: [
          { date: '2024-01-01', description: 'Monthly Salary', amount: 4000, type: 'income' },
          { date: '2024-01-03', description: 'Rent Payment', amount: -1200, type: 'expense' },
          { date: '2024-01-05', description: 'Freelance Project', amount: 800, type: 'income' }
        ]
      };
    }

    setPreviewData(mockData);
    setIsProcessing(false);
    toast.success("File processed successfully! Review the preview below.");
  };

  // Function to handle import
  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    const fileExtension = importFile.name.split('.').pop()?.toLowerCase();
    
    if (!['pdf', 'xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      toast.error("Please select a PDF, Excel, or CSV file");
      return;
    }

    if (!previewData) {
      await processFile(importFile);
      return;
    }

    // Simulate actual import process
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(`Successfully imported ${previewData.transactions} transactions from ${importFile.name}`);
          setShowDialog(false);
          setImportFile(null);
          setPreviewData(null);
        }, 2000);
      }),
      {
        loading: `Importing ${previewData.transactions} transactions...`,
        success: (message) => message as string,
        error: 'Failed to import data'
      }
    );
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImportFile(files[0]);
      setPreviewData(null);
      setProcessingProgress(0);
    }
  };

  // Function to render file icon based on file type
  const renderFileIcon = () => {
    if (!importFile) return null;
    
    const fileExtension = importFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'pdf') {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    }
    
    return null;
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Upload className="h-4 w-4" />
          Import Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Import Financial Data</AlertDialogTitle>
          <AlertDialogDescription>
            Upload your bank statements (PDF) or financial data (Excel/CSV) to automatically import transactions and analytics.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* File Upload Section */}
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="file-upload">Choose File</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv,.pdf"
              onChange={handleFileChange}
              className="cursor-pointer file:cursor-pointer"
            />
            {importFile && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                {renderFileIcon()}
                <div className="flex-1">
                  <p className="font-medium text-sm">{importFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(importFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm">Processing file...</span>
              </div>
              <Progress value={processingProgress} className="w-full" />
            </div>
          )}

          {/* Data Preview */}
          {previewData && !isProcessing && (
            <div className="space-y-4 border rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Import Preview</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>File Type:</strong> {previewData.type}</p>
                  <p><strong>Transactions:</strong> {previewData.transactions}</p>
                  <p><strong>Date Range:</strong> {previewData.dateRange}</p>
                </div>
                <div>
                  <p><strong>Total Income:</strong> ${previewData.totalIncome.toLocaleString()}</p>
                  <p><strong>Total Expenses:</strong> ${previewData.totalExpenses.toLocaleString()}</p>
                  <p><strong>Categories:</strong> {previewData.categories.length}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Sample Transactions:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {previewData.preview.map((transaction: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-xs p-2 bg-white rounded">
                      <span>{transaction.date}</span>
                      <span className="flex-1 mx-2 truncate">{transaction.description}</span>
                      <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                        ${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogCancel onClick={() => {
            setImportFile(null);
            setPreviewData(null);
            setProcessingProgress(0);
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleImport}
            disabled={!importFile || isProcessing}
          >
            {previewData ? 'Import Data' : 'Process File'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
