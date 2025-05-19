
import { Wallet, PiggyBank, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";
import { useAppContext } from "@/lib/AppContext";
import { getTotalIncome, getTotalExpenses, getBalance } from "@/lib/mockData";

export function StatCards() {
  const { formatCurrency } = useAppContext();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<PiggyBank className="h-4 w-4 text-primary" />}
        change="+12% from last month"
        changeType="positive"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<Wallet className="h-4 w-4 text-primary" />}
        change="+5% from last month"
        changeType="negative"
      />
      <StatCard
        title="Current Balance"
        value={formatCurrency(balance)}
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        change="+2.5% from last month"
        changeType="positive"
      />
    </div>
  );
}
