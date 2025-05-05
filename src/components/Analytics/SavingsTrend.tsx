
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/lib/AppContext";

interface SavingsTrendProps {
  data: Array<{
    name: string;
    amount: number;
  }>;
}

export const SavingsTrend = ({ data }: SavingsTrendProps) => {
  const { formatCurrency } = useAppContext();

  const currencyFormatter = (value: any): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return formatCurrency(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Savings Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip formatter={currencyFormatter} />
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
  );
};
