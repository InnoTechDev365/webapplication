import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImportDialogProps {
  onImport: (data: any[]) => void;
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (content: string): any[] => {
    const lines = content.split("\n").filter(line => line.trim());
    const rows: any[] = [];
    
    // Find the header row (contains "Date,Description,Category,Income,Expense")
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Date,Description,Category,Income,Expense")) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      throw new Error("Invalid CSV format: Header row not found");
    }

    // Parse data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("TOTAL") || line.startsWith("BALANCE") || line.startsWith("Report Summary")) {
        break;
      }

      const values = parseCSVLine(line);
      if (values.length >= 5) {
        rows.push({
          date: values[0],
          description: values[1],
          category: values[2],
          income: parseFloat(values[3]) || 0,
          expense: parseFloat(values[4]) || 0,
        });
      }
    }

    return rows;
  };

  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = "";
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
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    const validTypes = ["text/csv", "application/vnd.ms-excel", "text/plain"];
    const validExtensions = [".csv", ".txt"];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast.error("Please upload a CSV or TXT file");
      return;
    }

    try {
      const content = await file.text();
      const data = parseCSV(content);
      
      if (data.length === 0) {
        toast.error("No valid data found in file");
        return;
      }

      onImport(data);
      toast.success(`Successfully imported ${data.length} transactions`);
      setOpen(false);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 sm:flex-none">
          <Upload className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Import CSV</span>
          <span className="sm:hidden">Import</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Analytics Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file previously exported from this app to import transaction data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your CSV file here
                </p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
            </Label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".csv,.txt,text/csv,text/plain,application/vnd.ms-excel"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Supported formats: CSV, TXT</p>
            <p>• File must be in the same format as exported reports</p>
            <p>• Maximum file size: 10MB</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
