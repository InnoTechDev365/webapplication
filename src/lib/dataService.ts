
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

  // Analytics methods - these will return 0 for new users with no transactions
  getTotalIncome(): number {
    const transactions = this.getTransactions();
    const total = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    console.log('Total income calculated:', total);
    return total;
  }

  getTotalExpenses(): number {
    const transactions = this.getTransactions();
    const total = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    console.log('Total expenses calculated:', total);
    return total;
  }

  getBalance(): number {
    const balance = this.getTotalIncome() - this.getTotalExpenses();
    console.log('Balance calculated:', balance);
    return balance;
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

    console.log('Spending by category calculated:', spending);
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

    console.log('Income by category calculated:', income);
    return income;
  }

  // Get recent transactions (last 5)
  getRecentTransactions(): Transaction[] {
    const transactions = this.getTransactions();
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    console.log('Recent transactions fetched:', recent.length);
    return recent;
  }

  // Generate trend data from transactions
  getTrendData(): Array<{ name: string; income: number; expenses: number }> {
    const transactions = this.getTransactions();
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    // Get last 7 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const trendMonths: string[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      trendMonths.push(monthName);
      monthlyData[monthName] = { income: 0, expenses: 0 };
    }
    
    // Aggregate transactions by month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthName = months[transactionDate.getMonth()];
      
      if (monthlyData[monthName]) {
        if (transaction.type === 'income') {
          monthlyData[monthName].income += transaction.amount;
        } else {
          monthlyData[monthName].expenses += transaction.amount;
        }
      }
    });
    
    return trendMonths.map(month => ({
      name: month,
      income: monthlyData[month].income,
      expenses: monthlyData[month].expenses
    }));
  }

  // Generate savings data from transactions
  getSavingsData(): Array<{ name: string; amount: number }> {
    const trendData = this.getTrendData();
    return trendData.map(month => ({
      name: month.name,
      amount: Math.max(0, month.income - month.expenses) // Savings is positive net income
    }));
  }

  // Clear all user data
  clearAllData(): void {
    storageManager.clearAllData();
    console.log('All user data cleared and reset to initial state');
  }
}

// Create a singleton instance
export const dataService = new DataService();
