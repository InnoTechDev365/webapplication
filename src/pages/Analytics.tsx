
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
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { ChartPie } from "@/components/Dashboard/PieChart";
import { useAppContext } from "@/lib/AppContext";
import { getTotalExpenses, getSpendingByCategory } from "@/lib/mockData";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Gain insights from your financial data</p>
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
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
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
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
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
