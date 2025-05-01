
import { Transaction, Category, Budget } from './types';

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Housing', color: '#FF5733', type: 'expense' },
  { id: 'cat2', name: 'Food', color: '#33FF57', type: 'expense' },
  { id: 'cat3', name: 'Transportation', color: '#3357FF', type: 'expense' },
  { id: 'cat4', name: 'Entertainment', color: '#F333FF', type: 'expense' },
  { id: 'cat5', name: 'Utilities', color: '#33FFF3', type: 'expense' },
  { id: 'cat6', name: 'Salary', color: '#75FF33', type: 'income' },
  { id: 'cat7', name: 'Freelance', color: '#FF33A8', type: 'income' },
  { id: 'cat8', name: 'Investments', color: '#33A8FF', type: 'income' },
  { id: 'cat9', name: 'Gifts', color: '#FFD733', type: 'income' },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 1200,
    description: 'Monthly Rent',
    date: '2023-04-01',
    category: 'cat1',
    type: 'expense',
  },
  {
    id: 't2',
    amount: 85.33,
    description: 'Grocery Shopping',
    date: '2023-04-02',
    category: 'cat2',
    type: 'expense',
  },
  {
    id: 't3',
    amount: 45.50,
    description: 'Gas',
    date: '2023-04-03',
    category: 'cat3',
    type: 'expense',
  },
  {
    id: 't4',
    amount: 3500,
    description: 'Monthly Salary',
    date: '2023-04-01',
    category: 'cat6',
    type: 'income',
  },
  {
    id: 't5',
    amount: 500,
    description: 'Freelance Project',
    date: '2023-04-04',
    category: 'cat7',
    type: 'income',
  },
  {
    id: 't6',
    amount: 120,
    description: 'Electricity Bill',
    date: '2023-04-05',
    category: 'cat5',
    type: 'expense',
  },
  {
    id: 't7',
    amount: 65,
    description: 'Internet Bill',
    date: '2023-04-05',
    category: 'cat5',
    type: 'expense',
  },
  {
    id: 't8',
    amount: 25,
    description: 'Movie Tickets',
    date: '2023-04-06',
    category: 'cat4',
    type: 'expense',
  },
  {
    id: 't9',
    amount: 150,
    description: 'Dividend Payment',
    date: '2023-04-07',
    category: 'cat8',
    type: 'income',
  },
  {
    id: 't10',
    amount: 200,
    description: 'Birthday Gift',
    date: '2023-04-08',
    category: 'cat9',
    type: 'income',
  },
];

export const mockBudgets: Budget[] = [
  { id: 'b1', categoryId: 'cat1', amount: 1500, period: 'monthly' },
  { id: 'b2', categoryId: 'cat2', amount: 400, period: 'monthly' },
  { id: 'b3', categoryId: 'cat3', amount: 200, period: 'monthly' },
  { id: 'b4', categoryId: 'cat4', amount: 150, period: 'monthly' },
  { id: 'b5', categoryId: 'cat5', amount: 250, period: 'monthly' },
];

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find(cat => cat.id === id);
}

export function getTransactionsByType(type: 'income' | 'expense'): Transaction[] {
  return mockTransactions.filter(t => t.type === type);
}

export function getBudgetForCategory(categoryId: string): Budget | undefined {
  return mockBudgets.find(b => b.categoryId === categoryId);
}

export function getTotalIncome(): number {
  return mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(): number {
  return mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBalance(): number {
  return getTotalIncome() - getTotalExpenses();
}

export function getSpendingByCategory(): Record<string, number> {
  const spending: Record<string, number> = {};
  
  mockTransactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const category = getCategoryById(transaction.category);
      if (!category) return;
      
      const categoryName = category.name;
      if (!spending[categoryName]) {
        spending[categoryName] = 0;
      }
      
      spending[categoryName] += transaction.amount;
    });
    
  return spending;
}
