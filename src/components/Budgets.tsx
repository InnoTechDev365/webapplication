import React, { useState } from 'react';
import { Plus, PieChart, AlertCircle, TrendingDown, X } from 'lucide-react';
import { Budget, Transaction } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BudgetsProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAdd: (data: any) => void;
}

export default function Budgets({ budgets, transactions, onAdd }: BudgetsProps) {
  const [showForm, setShowForm] = useState(false);

  const budgetStats = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((acc, t) => acc + t.amount, 0);
    const percentage = (spent / budget.amount) * 100;
    return { ...budget, spent, percentage };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
          <p className="text-sm text-gray-500">Track your spending by category</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/10"
        >
          <Plus size={20} />
          Set New Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetStats.map((budget) => (
          <div key={budget.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                  <PieChart size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{budget.category}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{budget.period}</p>
                </div>
              </div>
              {budget.percentage >= 90 && (
                <div className="text-rose-500 animate-pulse">
                  <AlertCircle size={24} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Spent: ${budget.spent.toLocaleString()}</span>
                <span className="text-gray-900 font-bold">${budget.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    budget.percentage > 100 ? "bg-rose-500" : 
                    budget.percentage > 80 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(100, budget.percentage)}%` }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-gray-400">{Math.round(budget.percentage)}% used</span>
                {budget.percentage > 100 && (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <TrendingDown size={12} />
                    Over budget by ${(budget.spent - budget.amount).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {budgets.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <PieChart size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No budgets set</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Set monthly spending limits for different categories to stay on track.
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Set Category Budget</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAdd({
                category: formData.get('category') as string,
                amount: parseFloat(formData.get('amount') as string),
                period: 'monthly'
              });
              setShowForm(false);
            }} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select name="category" required className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20">
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Housing">Housing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-8 pr-4 text-lg font-bold focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/10"
              >
                Create Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
