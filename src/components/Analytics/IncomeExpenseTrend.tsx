
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/AppContext";

interface IncomeExpenseTrendProps {
  data: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
}

export const IncomeExpenseTrend = ({ data }: IncomeExpenseTrendProps) => {
  const { formatCurrency } = useAppContext();

  const currencyFormatter = (value: any): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return formatCurrency(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Income vs. Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip formatter={currencyFormatter} />
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
  );
};
