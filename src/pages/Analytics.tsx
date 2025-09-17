
import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnalyticsActions } from "@/components/Analytics/AnalyticsActions";
import { SwipeableAnalytics } from "@/components/Analytics/SwipeableAnalytics";
import { PeriodSelector, PERIOD_OPTIONS, type PeriodOption } from "@/components/Analytics/PeriodSelector";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(PERIOD_OPTIONS[2]); // Default to 3 months
  
  // Use real data for analytics with period filtering
  const totalExpenses = dataService.getTotalExpenses();
  const spendingByCategory = dataService.getSpendingByCategory(selectedPeriod.days);
  const pieChartData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));

  // Use real data for trends and savings with period filtering
  const trendData = dataService.getTrendData(selectedPeriod.days);
  const savingsData = dataService.getSavingsData(selectedPeriod.days);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Gain insights from your financial data</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
          <AnalyticsActions 
            trendData={trendData}
            savingsData={savingsData}
            pieChartData={pieChartData.length > 0 ? pieChartData : []}
          />
        </div>
      </div>

      <SwipeableAnalytics 
        trendData={trendData}
        savingsData={savingsData}
        pieChartData={pieChartData.length > 0 ? pieChartData : []}
        totalExpenses={totalExpenses}
      />
    </div>
  );
};

export default Analytics;
