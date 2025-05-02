
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from '@/lib/AppContext';

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
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10B981" />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
