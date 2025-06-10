
import { Wallet, PiggyBank, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";

export function StatCards() {
  const { formatCurrency } = useAppContext();
  const totalIncome = dataService.getTotalIncome();
  const totalExpenses = dataService.getTotalExpenses();
  const balance = dataService.getBalance();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<PiggyBank className="h-4 w-4 text-primary" />}
        change={totalIncome > 0 ? "+12% from last month" : "No income yet"}
        changeType={totalIncome > 0 ? "positive" : "neutral"}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<Wallet className="h-4 w-4 text-primary" />}
        change={totalExpenses > 0 ? "+5% from last month" : "No expenses yet"}
        changeType={totalExpenses > 0 ? "negative" : "neutral"}
      />
      <StatCard
        title="Current Balance"
        value={formatCurrency(balance)}
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        change={balance > 0 ? "+2.5% from last month" : balance < 0 ? "Negative balance" : "Add income to start"}
        changeType={balance > 0 ? "positive" : balance < 0 ? "negative" : "neutral"}
      />
    </div>
  );
}
