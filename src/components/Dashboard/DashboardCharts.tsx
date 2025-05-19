
import { ChartPie } from "@/components/Dashboard/PieChart";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { useAppContext } from "@/lib/AppContext";
import { getTotalExpenses, getSpendingByCategory, getCategoryById } from "@/lib/mockData";
import { mockTransactions } from "@/lib/mockData";

export function DashboardCharts() {
  const { formatCurrency } = useAppContext();
  const totalExpenses = getTotalExpenses();
  
  // Prepare data for pie chart
  const spendingByCategory = getSpendingByCategory();
  const pieChartData = Object.entries(spendingByCategory).map(([name, value]) => {
    const categoryId = mockTransactions.find(t => {
      const category = getCategoryById(t.category);
      return category?.name === name;
    })?.category;
    
    const category = categoryId ? getCategoryById(categoryId) : undefined;
    
    return {
      name,
      value,
      color: category?.color || '#888888'
    };
  });

  // Prepare data for bar chart
  const barChartData = [
    { name: 'Week 1', income: 1200, expenses: 800 },
    { name: 'Week 2', income: 1800, expenses: 1200 },
    { name: 'Week 3', income: 1400, expenses: 1100 },
    { name: 'Week 4', income: 2000, expenses: 1500 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartPie 
        data={pieChartData} 
        title="Expense Breakdown" 
        total={formatCurrency(totalExpenses)}
      />
      <ChartBar 
        data={barChartData} 
        title="Monthly Overview" 
      />
    </div>
  );
}
