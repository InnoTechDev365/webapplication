import { useState, useEffect, useCallback } from 'react';
import { Transaction, Budget, Goal } from '../types';
import toast from 'react-hot-toast';

export function useFinanceData(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      setTransactions(data.transactions || []);
      setBudgets(data.budgets || []);
      setGoals(data.goals || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, userId]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to add transaction');
      const newTrans = await response.json();
      
      setTransactions(prev => [newTrans, ...prev]);
      toast.success('Transaction added');
      return newTrans;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addBudget = async (data: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to add budget');
      const newBudget = await response.json();

      setBudgets(prev => [...prev, newBudget]);
      toast.success('Budget set');
      return newBudget;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addGoal = async (data: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to add goal');
      const newGoal = await response.json();

      setGoals(prev => [...prev, newGoal]);
      toast.success('Goal created');
      return newGoal;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    transactions,
    budgets,
    goals,
    loading,
    addTransaction,
    deleteTransaction,
    addBudget,
    addGoal,
    refresh: fetchData
  };
}
