
import { useState } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToPdf, exportToExcel, exportToSheets } from "@/lib/exportUtils";
import { toast } from "sonner";

interface ExportDialogProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
}

export const ExportDialog = ({ trendData, savingsData, pieChartData }: ExportDialogProps) => {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportSection, setExportSection] = useState("all");
  const [showDialog, setShowDialog] = useState(false);

  // Function to handle export
  const handleExport = () => {
    setShowDialog(false);
    
    // Get data to export based on selected section
    let dataToExport;
    let title = "";
    
    switch(exportSection) {
      case "trends":
        dataToExport = trendData;
        title = "Income vs Expenses Trend";
        break;
      case "savings":
        dataToExport = savingsData;
        title = "Savings Trend";
        break;
      case "categories":
        dataToExport = pieChartData;
        title = "Expense Categories";
        break;
      case "all":
      default:
        dataToExport = {
          trends: trendData,
          savings: savingsData,
          categories: pieChartData
        };
        title = "Financial Reports";
    }
    
    // Export based on selected format
    try {
      switch(exportFormat) {
        case "pdf":
          exportToPdf(dataToExport, title);
          break;
        case "excel":
          exportToExcel(dataToExport, title);
          break;
        case "sheets":
          exportToSheets(dataToExport, title);
          break;
      }
      
      toast.success(`Report exported to ${exportFormat.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error(`Error exporting report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export Report</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a format to export your financial reports.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="export-format" className="text-right">Format</label>
            <div className="col-span-3">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="sheets">Google Sheets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="export-section" className="text-right">Section</label>
            <div className="col-span-3">
              <Select value={exportSection} onValueChange={setExportSection}>
                <SelectTrigger id="export-section">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="trends">Income vs Expenses</SelectItem>
                  <SelectItem value="savings">Savings Trend</SelectItem>
                  <SelectItem value="categories">Expense Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleExport}>Export</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
