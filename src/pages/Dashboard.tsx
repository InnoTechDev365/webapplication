
import { Wallet, PiggyBank, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/Dashboard/StatCard";
import { RecentTransactions } from "@/components/Dashboard/RecentTransactions";
import { ChartPie } from "@/components/Dashboard/PieChart";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { 
  mockTransactions, 
  getCategoryById,
  getTotalIncome, 
  getTotalExpenses, 
  getBalance,
  getSpendingByCategory
} from "@/lib/mockData";

const Dashboard = () => {
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your personal finances at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          icon={<PiggyBank className="h-4 w-4 text-primary" />}
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          icon={<Wallet className="h-4 w-4 text-primary" />}
          change="+5% from last month"
          changeType="negative"
        />
        <StatCard
          title="Current Balance"
          value={`$${balance.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          change="+2.5% from last month"
          changeType="positive"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartPie 
              data={pieChartData} 
              title="Expense Breakdown" 
              total={`$${totalExpenses.toFixed(2)}`}
            />
            <ChartBar 
              data={barChartData} 
              title="Monthly Overview" 
            />
          </div>
          
          <RecentTransactions 
            transactions={mockTransactions}
            getCategoryById={getCategoryById}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Analytics</h3>
            <p>Detailed analytics will be available here in the next version.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Reports</h3>
            <p>Generated reports will be available here in the next version.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
