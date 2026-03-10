import React, { useState } from 'react';
import { Plus, Target, Flag, Calendar, X, CheckCircle2 } from 'lucide-react';
import { Goal } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GoalsProps {
  goals: Goal[];
  onAdd: (data: any) => void;
}

export default function Goals({ goals, onAdd }: GoalsProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
          <p className="text-sm text-gray-500">Plan and track your long-term savings</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/10"
        >
          <Plus size={20} />
          Add New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {goals.map((goal) => {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          const isCompleted = progress >= 100;

          return (
            <div key={goal.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
              {isCompleted && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar size={14} />
                    <span>Target: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">Current Savings</p>
                    <p className="text-3xl font-bold text-gray-900">${goal.current_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Goal</p>
                    <p className="text-lg font-bold text-gray-900">${goal.target_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        isCompleted ? "bg-emerald-500" : "bg-blue-500"
                      )}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                  <span className="absolute -top-4 right-0 text-xs font-bold text-gray-400">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                  <Flag size={16} className="text-gray-400" />
                  <p className="text-xs text-gray-600 font-medium">
                    {isCompleted 
                      ? "Congratulations! You've reached your goal." 
                      : `You need $${(goal.target_amount - goal.current_amount).toLocaleString()} more to reach your target.`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Target size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No financial goals yet</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Set savings targets for things like a new home, travel, or an emergency fund.
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create Financial Goal</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAdd({
                title: formData.get('title') as string,
                target_amount: parseFloat(formData.get('target_amount') as string),
                current_amount: parseFloat(formData.get('current_amount') as string) || 0,
                deadline: formData.get('deadline') as string || undefined
              });
              setShowForm(false);
            }} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Goal Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g., New House, Emergency Fund"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      name="target_amount"
                      type="number"
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Savings</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      name="current_amount"
                      type="number"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Date (Optional)</label>
                <input
                  name="deadline"
                  type="date"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/10"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
