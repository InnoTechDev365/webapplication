
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
import { Download, FileText, FileSpreadsheet, BarChart3 } from "lucide-react";
import { exportToPdf, exportToExcel } from "@/lib/exportUtils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/lib/AppContext";

interface ExportDialogProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
}

export const ExportDialog = ({ trendData, savingsData, pieChartData }: ExportDialogProps) => {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [showDialog, setShowDialog] = useState(false);
  const { formatCurrency } = useAppContext();

  // Function to handle export
  const handleExport = () => {
    setShowDialog(false);
    
    // Prepare comprehensive data
    const comprehensiveData = {
      trends: trendData,
      savings: savingsData,
      categories: pieChartData
    };
    
    const title = "Comprehensive Financial Analytics Report";
    
    // Export based on selected format with currency formatting
    try {
      switch(exportFormat) {
        case "pdf":
          exportToPdf(comprehensiveData, title, formatCurrency);
          break;
        case "excel":
          exportToExcel(comprehensiveData, title, formatCurrency);
          break;
      }
      
      toast.success(`Professional financial analytics report exported to ${exportFormat.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error(`Error exporting report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getFormatIcon = () => {
    switch(exportFormat) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
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
      <AlertDialogContent className="max-w-lg w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Export Comprehensive Financial Report
          </AlertDialogTitle>
          <AlertDialogDescription>
            Generate a professional, comprehensive financial analytics report with full insights, recommendations, and currency-formatted data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <label htmlFor="export-format" className="text-sm font-medium">Export Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span>Professional PDF Report</span>
                    <Badge variant="secondary" className="ml-auto">Recommended</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    <span>Detailed Excel Spreadsheet</span>
                    <Badge variant="secondary" className="ml-auto">Editable</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">📊 Comprehensive Report Includes:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Executive Summary with Financial Health Score</li>
              <li>• Monthly Income vs Expenses Trend Analysis</li>
              <li>• Detailed Category Breakdown & Risk Assessment</li>
              <li>• Savings Analysis & Target Achievement</li>
              <li>• 12-Month Financial Projections</li>
              <li>• Personalized Recommendations by Priority</li>
              <li>• Advanced Performance Metrics</li>
              <li>• Currency-Formatted Professional Layout</li>
            </ul>
          </div>

          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">✨ Professional Features:</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Multi-page structured document</li>
              <li>• Currency-specific formatting</li>
              <li>• Industry benchmark comparisons</li>
              <li>• Actionable insights with timelines</li>
              <li>• Investment readiness assessment</li>
              <li>• Full-screen document viewing</li>
            </ul>
          </div>
        </div>
        
        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleExport} className="flex items-center gap-2">
            {getFormatIcon()}
            Generate Professional Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
