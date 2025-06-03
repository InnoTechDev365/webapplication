
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

interface ExportDialogProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
}

export const ExportDialog = ({ trendData, savingsData, pieChartData }: ExportDialogProps) => {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportSection, setExportSection] = useState("comprehensive");
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
        title = "Income vs Expenses Trend Analysis";
        break;
      case "savings":
        dataToExport = savingsData;
        title = "Savings Trend Analysis";
        break;
      case "categories":
        dataToExport = pieChartData;
        title = "Expense Categories Analysis";
        break;
      case "comprehensive":
      default:
        dataToExport = {
          trends: trendData,
          savings: savingsData,
          categories: pieChartData
        };
        title = "Comprehensive Financial Analytics Report";
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
      }
      
      toast.success(`Comprehensive analytics report exported to ${exportFormat.toUpperCase()} successfully!`);
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

  const getSectionDescription = () => {
    switch(exportSection) {
      case "comprehensive":
        return "Complete financial analysis including trends, categories, projections, and recommendations";
      case "trends":
        return "Income vs expenses trends with growth analysis and monthly comparisons";
      case "savings":
        return "Savings patterns, cumulative analysis, and target achievement tracking";
      case "categories":
        return "Expense breakdown by category with risk assessment and optimization insights";
      default:
        return "";
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
            Export Financial Analytics
          </AlertDialogTitle>
          <AlertDialogDescription>
            Generate beautifully structured reports with comprehensive analytics, insights, and recommendations.
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
                    <span>PDF Document</span>
                    <Badge variant="secondary" className="ml-auto">Beautiful</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    <span>Excel Spreadsheet</span>
                    <Badge variant="secondary" className="ml-auto">Detailed</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="export-section" className="text-sm font-medium">Report Content</label>
            <Select value={exportSection} onValueChange={setExportSection}>
              <SelectTrigger id="export-section">
                <SelectValue placeholder="Select Content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span>Comprehensive Analytics</span>
                    <Badge className="ml-auto">Recommended</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="trends">Income vs Expenses Trends</SelectItem>
                <SelectItem value="savings">Savings Analysis</SelectItem>
                <SelectItem value="categories">Category Breakdown</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Includes:</strong> {getSectionDescription()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">✨ Enhanced Analytics Features:</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Financial Health Score (0-100)</li>
              <li>• Personalized Recommendations</li>
              <li>• Risk Assessment & Projections</li>
              <li>• Month-over-month Growth Analysis</li>
              <li>• Category Optimization Insights</li>
              <li>• Professional Formatting & Charts</li>
            </ul>
          </div>
        </div>
        
        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleExport} className="flex items-center gap-2">
            {getFormatIcon()}
            Generate Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
