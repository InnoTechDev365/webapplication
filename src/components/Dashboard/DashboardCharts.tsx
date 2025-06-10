
import { ChartPie } from "@/components/Dashboard/PieChart";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";

export function DashboardCharts() {
  const { formatCurrency } = useAppContext();
  const totalExpenses = dataService.getTotalExpenses();
  
  // Prepare data for pie chart
  const spendingByCategory = dataService.getSpendingByCategory();
  const pieChartData = Object.entries(spendingByCategory).map(([name, value]) => {
    return {
      name,
      value,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
    };
  });

  // Prepare data for bar chart - show real data or placeholder
  const barChartData = [
    { name: 'Week 1', income: 0, expenses: 0 },
    { name: 'Week 2', income: 0, expenses: 0 },
    { name: 'Week 3', income: 0, expenses: 0 },
    { name: 'Week 4', income: 0, expenses: 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartPie 
        data={pieChartData.length > 0 ? pieChartData : [{ name: 'No data', value: 1, color: '#e5e7eb' }]} 
        title="Expense Breakdown" 
        total={totalExpenses > 0 ? formatCurrency(totalExpenses) : formatCurrency(0)}
      />
      <ChartBar 
        data={barChartData} 
        title="Monthly Overview" 
      />
    </div>
  );
}
