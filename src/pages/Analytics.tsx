
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { ChartPie } from "@/components/Dashboard/PieChart";
import { useAppContext } from "@/lib/AppContext";
import { getTotalExpenses, getSpendingByCategory } from "@/lib/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { IncomeExpenseTrend } from "@/components/Analytics/IncomeExpenseTrend";
import { SavingsTrend } from "@/components/Analytics/SavingsTrend";
import { ExportDialog } from "@/components/Analytics/ExportDialog";
import { ImportDialog } from "@/components/Analytics/ImportDialog";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Gain insights from your financial data</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <ExportDialog
            trendData={trendData}
            savingsData={savingsData}
            pieChartData={pieChartData}
          />
          <ImportDialog />
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <IncomeExpenseTrend data={trendData} />
          <SavingsTrend data={savingsData} />
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
