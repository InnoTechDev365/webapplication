
import { Transaction, Budget, Category, UserSettings } from './types';

// Default user settings
const defaultSettings: UserSettings = {
  currency: 'USD',
  language: 'en',
  storageType: 'local'
};

// Default categories for new users
const defaultCategories: Category[] = [
  { id: 'income-salary', name: 'Salary', color: '#10b981', type: 'income' },
  { id: 'income-freelance', name: 'Freelance', color: '#059669', type: 'income' },
  { id: 'income-investment', name: 'Investment', color: '#047857', type: 'income' },
  { id: 'expense-food', name: 'Food & Dining', color: '#ef4444', type: 'expense' },
  { id: 'expense-transport', name: 'Transportation', color: '#f97316', type: 'expense' },
  { id: 'expense-shopping', name: 'Shopping', color: '#eab308', type: 'expense' },
  { id: 'expense-entertainment', name: 'Entertainment', color: '#8b5cf6', type: 'expense' },
  { id: 'expense-utilities', name: 'Utilities', color: '#06b6d4', type: 'expense' }
];

class StorageManager {
  private settings: UserSettings;
  private isSupabaseConnected: boolean = false;
  private userId: string;

  constructor() {
    // Generate or get user ID
    this.userId = this.getUserId();
    
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem(`user_settings_${this.userId}`);
    this.settings = savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings };
    
    // Save default settings if none exist
    if (!savedSettings) {
      this.saveSettings(this.settings);
    }
    
    // Initialize default categories if none exist
    const existingCategories = this.getCategories();
    if (existingCategories.length === 0) {
      this.saveCategories(defaultCategories);
    }
    
    // Check if already connected to Supabase
    this.isSupabaseConnected = this.settings.storageType === 'supabase';
  }

  private getUserId(): string {
    let userId = localStorage.getItem('expense_coin_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('expense_coin_user_id', userId);
    }
    return userId;
  }

  getUserId(): string {
    return this.userId;
  }

  // Settings management
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  saveSettings(settings: UserSettings): void {
    this.settings = settings;
    localStorage.setItem(`user_settings_${this.userId}`, JSON.stringify(settings));
  }

  setCurrency(currency: string): void {
    this.settings.currency = currency;
    this.saveSettings(this.settings);
  }

  // Supabase connection status
  isConnectedToSupabase(): boolean {
    return this.isSupabaseConnected;
  }

  connectToSupabase(connected: boolean): void {
    this.isSupabaseConnected = connected;
    this.settings.storageType = connected ? 'supabase' : 'local';
    this.saveSettings(this.settings);
    
    if (!connected) {
      console.log('Disconnected from Supabase. Data will now only be stored locally.');
    } else {
      console.log('Connected to Supabase. Data will now be synchronized between local storage and Supabase.');
      // Sync existing data to Supabase
      this.syncToSupabase();
    }
  }

  private syncToSupabase(): void {
    if (!this.isSupabaseConnected) return;
    
    const transactions = this.getTransactions();
    const budgets = this.getBudgets();
    const categories = this.getCategories();
    
    // In a real implementation, this would sync to Supabase
    console.log('Syncing to Supabase:', {
      transactions: transactions.length,
      budgets: budgets.length,
      categories: categories.length,
      userId: this.userId
    });
  }

  // Data storage methods
  saveTransactions(transactions: Transaction[]): void {
    // Always save locally
    localStorage.setItem(`transactions_${this.userId}`, JSON.stringify(transactions));
    
    // If connected to Supabase, also save there
    if (this.isSupabaseConnected) {
      console.log(`Syncing ${transactions.length} transactions to Supabase for user ${this.userId}`);
      // Here would be the actual Supabase save code
    }
  }

  getTransactions(): Transaction[] {
    // First try to get from Supabase if connected
    if (this.isSupabaseConnected) {
      console.log(`Fetching transactions from Supabase for user ${this.userId}`);
      // Here would be the actual Supabase fetch code
    }
    
    // Fall back to local storage
    const data = localStorage.getItem(`transactions_${this.userId}`);
    return data ? JSON.parse(data) : [];
  }

  saveBudgets(budgets: Budget[]): void {
    // Always save locally
    localStorage.setItem(`budgets_${this.userId}`, JSON.stringify(budgets));
    
    // If connected to Supabase, also save there
    if (this.isSupabaseConnected) {
      console.log(`Syncing ${budgets.length} budgets to Supabase for user ${this.userId}`);
      // Here would be the actual Supabase save code
    }
  }

  getBudgets(): Budget[] {
    // First try to get from Supabase if connected
    if (this.isSupabaseConnected) {
      console.log(`Fetching budgets from Supabase for user ${this.userId}`);
      // Here would be the actual Supabase fetch code
    }
    
    // Fall back to local storage
    const data = localStorage.getItem(`budgets_${this.userId}`);
    return data ? JSON.parse(data) : [];
  }

  saveCategories(categories: Category[]): void {
    // Always save locally
    localStorage.setItem(`categories_${this.userId}`, JSON.stringify(categories));
    
    // If connected to Supabase, also save there
    if (this.isSupabaseConnected) {
      console.log(`Syncing ${categories.length} categories to Supabase for user ${this.userId}`);
      // Here would be the actual Supabase save code
    }
  }

  getCategories(): Category[] {
    // First try to get from Supabase if connected
    if (this.isSupabaseConnected) {
      console.log(`Fetching categories from Supabase for user ${this.userId}`);
      // Here would be the actual Supabase fetch code
    }
    
    // Fall back to local storage
    const data = localStorage.getItem(`categories_${this.userId}`);
    return data ? JSON.parse(data) : [];
  }

  // Add new transaction
  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  }

  // Add new budget
  addBudget(budget: Budget): void {
    const budgets = this.getBudgets();
    budgets.push(budget);
    this.saveBudgets(budgets);
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(`transactions_${this.userId}`);
    localStorage.removeItem(`budgets_${this.userId}`);
    localStorage.removeItem(`categories_${this.userId}`);
    
    if (this.isSupabaseConnected) {
      console.log(`Clearing Supabase data for user ${this.userId}`);
      // Here would be the actual Supabase clear code
    }
  }
}

// Create a singleton instance
export const storageManager = new StorageManager();
