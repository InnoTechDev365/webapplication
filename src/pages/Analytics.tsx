
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnalyticsActions } from "@/components/Analytics/AnalyticsActions";
import { AnalyticsTabs } from "@/components/Analytics/AnalyticsTabs";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  const isMobile = useIsMobile();
  
  // Use real data for analytics
  const totalExpenses = dataService.getTotalExpenses();
  const spendingByCategory = dataService.getSpendingByCategory();
  const pieChartData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));

  // Mock data for trends (would be calculated from real data in a full implementation)
  const trendData = [
    { name: 'Jan', income: 0, expenses: 0 },
    { name: 'Feb', income: 0, expenses: 0 },
    { name: 'Mar', income: 0, expenses: 0 },
    { name: 'Apr', income: 0, expenses: 0 },
    { name: 'May', income: 0, expenses: 0 },
    { name: 'Jun', income: 0, expenses: 0 },
    { name: 'Jul', income: 0, expenses: 0 },
  ];

  const savingsData = [
    { name: 'Jan', amount: 0 },
    { name: 'Feb', amount: 0 },
    { name: 'Mar', amount: 0 },
    { name: 'Apr', amount: 0 },
    { name: 'May', amount: 0 },
    { name: 'Jun', amount: 0 },
    { name: 'Jul', amount: 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Gain insights from your financial data</p>
        </div>
        
        <AnalyticsActions 
          trendData={trendData}
          savingsData={savingsData}
          pieChartData={pieChartData.length > 0 ? pieChartData : []}
        />
      </div>

      <AnalyticsTabs 
        trendData={trendData}
        savingsData={savingsData}
        pieChartData={pieChartData.length > 0 ? pieChartData : []}
        totalExpenses={totalExpenses}
      />
    </div>
  );
};

export default Analytics;
