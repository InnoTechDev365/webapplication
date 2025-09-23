
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from '@/lib/AppContext';
import { useState, useEffect } from 'react';
import { getWindowWidth, addWindowEventListener } from "@/lib/browserUtils";

interface IncomeExpenseData {
  name: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: IncomeExpenseData[];
  title: string;
}

export function ChartBar({ data, title }: IncomeExpenseChartProps) {
  const { formatCurrency } = useAppContext();
  const [windowWidth, setWindowWidth] = useState(1024); // Safe default

  // Update window width when resized
  useEffect(() => {
    // Set initial window width safely
    setWindowWidth(getWindowWidth());
    
    // Add resize listener with cleanup
    const cleanup = addWindowEventListener('resize', () => setWindowWidth(getWindowWidth()));
    return cleanup;
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: windowWidth < 640 ? 10 : 30,
                left: windowWidth < 640 ? 0 : 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                width={windowWidth < 640 ? 40 : 60}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: windowWidth < 640 ? '12px' : '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10, 
                  fontSize: windowWidth < 640 ? 10 : 12 
                }} 
              />
              <Bar dataKey="income" name="Income" fill="#10B981" />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
