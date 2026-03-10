import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Transaction, Budget } from '../types';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAdviceClick: () => void;
}

export default function Dashboard({ transactions, budgets, onAdviceClick }: DashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
    const remainingBudget = totalBudget - expenses;

    return { income, expenses, balance: income - expenses, remainingBudget, totalBudget };
  }, [transactions, budgets]);

  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, 'MMM'),
        income: 0,
        expenses: 0,
        timestamp: date.getTime()
      };
    }).reverse();

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthStr = format(tDate, 'MMM');
      const dataPoint = last6Months.find(d => d.month === monthStr);
      if (dataPoint) {
        if (t.type === 'income') dataPoint.income += t.amount;
        else dataPoint.expenses += t.amount;
      }
    });

    return last6Months;
  }, [transactions]);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Monthly Income</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.income.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">+4.2%</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Monthly Expenses</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.expenses.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Net Balance</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.balance.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Budget Remaining</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.remainingBudget.toLocaleString()}</h3>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.expenses / stats.totalBudget) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Financial Overview</h3>
              <p className="text-sm text-gray-500">Income vs Expenses over the last 6 months</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium text-gray-600 focus:ring-0">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#f43f5e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations & Recent Activity */}
        <div className="space-y-8">
          <div className="bg-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Insights</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Smart Financial Advice</h4>
              <p className="text-emerald-100/80 text-sm mb-6 leading-relaxed">
                Get personalized recommendations based on your spending habits and financial goals.
              </p>
              <button 
                onClick={onAdviceClick}
                className="w-full bg-white text-emerald-900 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors active:scale-[0.98]"
              >
                Get Recommendations
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-800/50 rounded-full blur-3xl group-hover:bg-emerald-700/50 transition-all duration-700" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">Recent Transactions</h4>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {t.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.category}</p>
                      <p className="text-xs text-gray-500">{format(new Date(t.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
