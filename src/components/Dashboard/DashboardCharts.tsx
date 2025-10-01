
import { ChartPie } from "@/components/Dashboard/PieChart";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";

export function DashboardCharts() {
  const { formatCurrency } = useAppContext();
  const totalExpenses = dataService.getTotalExpenses();
  
  // Prepare data for pie chart
  const spendingByCategory = dataService.getSpendingByCategory(30);
  const pieChartData = Object.entries(spendingByCategory).map(([name, value]) => {
    return {
      name,
      value,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
    };
  });

  // Get real trend data for the last 30 days
  const trendData = dataService.getTrendData(30);
  const barChartData = trendData.length > 0 ? trendData : [
    { name: 'Week 1', income: 0, expenses: 0 },
    { name: 'Week 2', income: 0, expenses: 0 },
    { name: 'Week 3', income: 0, expenses: 0 },
    { name: 'Week 4', income: 0, expenses: 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartPie 
        data={pieChartData.length > 0 ? pieChartData : [{ name: 'No data', value: 1, color: 'hsl(var(--muted))' }]} 
        title="Expense Breakdown (Last 30 Days)" 
        total={totalExpenses > 0 ? formatCurrency(totalExpenses) : formatCurrency(0)}
      />
      <ChartBar 
        data={barChartData} 
        title="Income vs Expenses (Last 30 Days)" 
      />
    </div>
  );
}
