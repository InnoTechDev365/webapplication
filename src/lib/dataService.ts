
import { storageManager } from './storage';
import { Transaction, Category, Budget } from './types';

export class DataService {
  // Transaction methods
  getTransactions(): Transaction[] {
    return storageManager.getTransactions();
  }

  addTransaction(transaction: Transaction): void {
    storageManager.addTransaction(transaction);
  }

  // Category methods
  getCategories(): Category[] {
    return storageManager.getCategories();
  }

  getCategoryById(id: string): Category | undefined {
    const categories = this.getCategories();
    return categories.find(category => category.id === id);
  }

  getIncomeCategories(): Category[] {
    return this.getCategories().filter(cat => cat.type === 'income');
  }

  getExpenseCategories(): Category[] {
    return this.getCategories().filter(cat => cat.type === 'expense');
  }

  // Budget methods
  getBudgets(): Budget[] {
    return storageManager.getBudgets();
  }

  addBudget(budget: Budget): void {
    storageManager.addBudget(budget);
  }

  // Analytics methods
  getTotalIncome(): number {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  getSpendingByCategory(): Record<string, number> {
    const transactions = this.getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    const spending: Record<string, number> = {};

    expenses.forEach(expense => {
      const category = this.getCategoryById(expense.category);
      const categoryName = category?.name || 'Uncategorized';
      spending[categoryName] = (spending[categoryName] || 0) + expense.amount;
    });

    return spending;
  }

  getIncomeByCategory(): Record<string, number> {
    const transactions = this.getTransactions();
    const incomes = transactions.filter(t => t.type === 'income');
    const income: Record<string, number> = {};

    incomes.forEach(inc => {
      const category = this.getCategoryById(inc.category);
      const categoryName = category?.name || 'Uncategorized';
      income[categoryName] = (income[categoryName] || 0) + inc.amount;
    });

    return income;
  }

  // Get recent transactions (last 5)
  getRecentTransactions(): Transaction[] {
    const transactions = this.getTransactions();
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  // Clear all user data
  clearAllData(): void {
    storageManager.clearAllData();
  }
}

// Create a singleton instance
export const dataService = new DataService();
