
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { ChartPie } from "@/components/Dashboard/PieChart";
import { IncomeExpenseTrend } from "@/components/Analytics/IncomeExpenseTrend";
import { SavingsTrend } from "@/components/Analytics/SavingsTrend";
import { useAppContext } from "@/lib/AppContext";

interface AnalyticsTabsProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
  totalExpenses: number;
}

export function AnalyticsTabs({ 
  trendData, 
  savingsData, 
  pieChartData, 
  totalExpenses 
}: AnalyticsTabsProps) {
  const { formatCurrency } = useAppContext();

  return (
    <Tabs defaultValue="trends" className="space-y-4">
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
        <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
        <TabsTrigger value="comparison" className="text-xs sm:text-sm">Comparison</TabsTrigger>
        <TabsTrigger value="categories" className="text-xs sm:text-sm">Categories</TabsTrigger>
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
  );
}
