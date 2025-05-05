
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { ChartPie } from "@/components/Dashboard/PieChart";
import { useAppContext } from "@/lib/AppContext";
import { getTotalExpenses, getSpendingByCategory } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
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
import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, FileSpreadsheet, Upload, Download } from "lucide-react";
import { exportToPdf, exportToExcel, exportToSheets } from "@/lib/exportUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportSection, setExportSection] = useState("all");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  // Mock data for line chart
  const trendData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 2800 },
    { name: 'Mar', income: 2000, expenses: 1800 },
    { name: 'Apr', income: 2780, expenses: 2100 },
    { name: 'May', income: 1890, expenses: 1700 },
    { name: 'Jun', income: 2390, expenses: 2000 },
    { name: 'Jul', income: 3490, expenses: 2300 },
  ];

  // Prepare data for pie chart
  const totalExpenses = getTotalExpenses();
  const spendingByCategory = getSpendingByCategory();
  const pieChartData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));

  // Mock data for savings trends
  const savingsData = [
    { name: 'Jan', amount: 1600 },
    { name: 'Feb', amount: 200 },
    { name: 'Mar', amount: 200 },
    { name: 'Apr', amount: 680 },
    { name: 'May', amount: 190 },
    { name: 'Jun', amount: 390 },
    { name: 'Jul', amount: 1190 },
  ];

  // Custom formatter function to convert values to numbers before formatting
  const currencyFormatter = (value: any): string => {
    // Ensure the value is a number
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return formatCurrency(isNaN(numValue) ? 0 : numValue);
  };

  // Function to handle export
  const handleExport = () => {
    setShowExportDialog(false);
    
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

  // Function to handle import
  const handleImport = () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    // In a real application, we would parse the file and import the data
    toast.success(`Importing data from ${importFile.name}`);
    
    // Close the dialog and reset the file
    setShowImportDialog(false);
    setImportFile(null);
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImportFile(files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Gain insights from your financial data</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Export Dialog */}
          <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
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
          
          {/* Import Dialog */}
          <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Import Financial Data</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose a file to import your financial data from.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="file-upload">Upload File</Label>
                  <Input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf,.json"
                    onChange={handleFileChange}
                  />
                  {importFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected file: {importFile.name}
                    </p>
                  )}
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setImportFile(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleImport}>Import</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Income vs. Expenses Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={currencyFormatter} />
                    <Tooltip formatter={currencyFormatter} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      name="Income"
                      stroke="#10B981" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      name="Expenses"
                      stroke="#EF4444" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Savings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={savingsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={currencyFormatter} />
                    <Tooltip formatter={currencyFormatter} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      name="Savings"
                      stroke="#3B82F6" 
                      fillOpacity={1} 
                      fill="url(#colorSavings)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <ChartBar 
            data={trendData} 
            title="Income vs. Expenses by Month" 
          />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <ChartPie 
            data={pieChartData} 
            title="Expense Breakdown" 
            total={formatCurrency(totalExpenses)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
