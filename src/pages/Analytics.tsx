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
import { useState } from "react";
import { toast } from "sonner";
import { FileText, FileSpreadsheet } from "lucide-react";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportSection, setExportSection] = useState("all");
  
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
    // In a real application, this would generate the actual export
    let formatName = "";
    switch(exportFormat) {
      case "pdf":
        formatName = "PDF";
        break;
      case "excel":
        formatName = "Excel";
        break;
      case "sheets":
        formatName = "Google Sheets";
        break;
    }
    
    toast.success(`Report exported to ${formatName} successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Gain insights from your financial data</p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" />
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
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
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
