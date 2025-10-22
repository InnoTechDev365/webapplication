
import { Wallet, PiggyBank } from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";

export function StatCards() {
  const { formatCurrency } = useAppContext();
  const totalIncome = dataService.getTotalIncome();
  const totalExpenses = dataService.getTotalExpenses();
  const balance = dataService.getBalance();

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        change={totalIncome > 0 ? "All time total" : "No income yet"}
        changeType={totalIncome > 0 ? "positive" : "neutral"}
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        change={totalExpenses > 0 ? "All time total" : "No expenses yet"}
        changeType={totalExpenses > 0 ? "negative" : "neutral"}
      />
      <StatCard
        title="Balance"
        value={formatCurrency(balance)}
        icon={<PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        change={balance >= 0 ? "Positive balance" : "Negative balance"}
        changeType={balance >= 0 ? "positive" : "negative"}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}
