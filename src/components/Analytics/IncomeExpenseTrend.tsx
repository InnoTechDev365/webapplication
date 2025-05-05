
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/AppContext";
import { useState } from 'react';

interface IncomeExpenseTrendProps {
  data: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
}

export const IncomeExpenseTrend = ({ data }: IncomeExpenseTrendProps) => {
  const { formatCurrency } = useAppContext();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const currencyFormatter = (value: any): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return formatCurrency(isNaN(numValue) ? 0 : numValue);
  };

  // Calculate the net for each period
  const dataWithNet = data.map(item => ({
    ...item,
    net: item.income - item.expenses
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Income vs. Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataWithNet}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setActiveIndex(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip 
                formatter={currencyFormatter}
                labelFormatter={(label) => `Period: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '10px',
                }}
              />
              <Legend />
              
              {/* Highlight area where income > expenses with light green */}
              {dataWithNet.map((entry, index) => {
                if (entry.income > entry.expenses && index < dataWithNet.length - 1) {
                  return (
                    <ReferenceArea
                      key={`profit-area-${index}`}
                      x1={entry.name}
                      x2={dataWithNet[index + 1].name}
                      y1={0}
                      y2={Math.max(entry.income, dataWithNet[index + 1].income)}
                      fill="#10B98120"
                      fillOpacity={0.2}
                    />
                  );
                }
                return null;
              })}
              
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
              <Line 
                type="monotone" 
                dataKey="net" 
                name="Net"
                stroke="#6366F1" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
