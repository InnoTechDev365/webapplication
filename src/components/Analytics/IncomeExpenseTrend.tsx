
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
import { useState, useEffect } from 'react';

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currencyFormatter = (value: any): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return formatCurrency(isNaN(numValue) ? 0 : numValue);
  };

  // Calculate the net for each period
  const dataWithNet = data.map(item => ({
    ...item,
    net: item.income - item.expenses
  }));

  // Determine chart height based on screen size
  const getChartHeight = () => {
    if (windowWidth <= 640) return 250; // Small mobile
    if (windowWidth <= 768) return 300; // Mobile
    if (windowWidth <= 1024) return 350; // Tablet
    return 400; // Desktop
  };

  // Custom tooltip to ensure it works in all browsers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-md rounded-md">
          <p className="font-medium text-sm">{`Period: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${currencyFormatter(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Income vs. Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${getChartHeight()}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataWithNet}
              margin={{ 
                top: 20, 
                right: 30, 
                left: windowWidth < 640 ? 0 : 20, 
                bottom: 5 
              }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setActiveIndex(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                tickMargin={8}
              />
              <YAxis 
                tickFormatter={currencyFormatter} 
                tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                width={windowWidth < 640 ? 40 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: 10, 
                  fontSize: windowWidth < 640 ? 10 : 12 
                }} 
              />
              
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
                activeDot={{ r: windowWidth < 640 ? 6 : 8 }} 
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
                dot={{ r: windowWidth < 640 ? 3 : 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
