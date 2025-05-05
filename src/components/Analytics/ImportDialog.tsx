
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
import { Upload, FilePdf, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ImportDialog = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle import
  const handleImport = () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    // Get file extension
    const fileExtension = importFile.name.split('.').pop()?.toLowerCase();
    
    // Check if the file is in the right format
    if (!['pdf', 'xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      toast.error("Please select a PDF or Excel file");
      return;
    }

    // In a real application, we would parse the file and import the data
    toast.success(`Importing data from ${importFile.name}`);
    
    // Close the dialog and reset the file
    setShowDialog(false);
    setImportFile(null);
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImportFile(files[0]);
    }
  };

  // Function to render file icon based on file type
  const renderFileIcon = () => {
    if (!importFile) return null;
    
    const fileExtension = importFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'pdf') {
      return <FilePdf className="h-6 w-6 text-red-500" />;
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
      <AlertDialogContent className="max-w-md w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Import Financial Data</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a PDF or Excel file to import your financial data from.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="file-upload">Upload File</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv,.pdf"
              onChange={handleFileChange}
              className="cursor-pointer file:cursor-pointer"
            />
            {importFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {renderFileIcon()}
                <span>Selected file: {importFile.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogCancel onClick={() => setImportFile(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleImport}>Import</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
