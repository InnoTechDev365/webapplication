
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
  );
}
