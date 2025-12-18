import { Transaction, Budget, Category, UserSettings } from './types';
import { syncTransactions, syncBudgets, syncCategories, syncSettings } from './remoteSync';
import { hasSupabaseCredentials } from './supabaseClient';

// Default user settings
const defaultSettings: UserSettings = {
  currency: 'USD',
  language: 'en',
  storageType: 'local'
};

// Default categories for new users (no demo transactions)
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

// Safe localStorage access for SSR and privacy mode
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    return null;
  },
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    return false;
  },
  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return true;
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    return false;
  }
};

class StorageManager {
  private settings: UserSettings;
  private isSupabaseConnected: boolean = false;
  private userId: string;
  private memoryCache: {
    transactions: Transaction[];
    budgets: Budget[];
    categories: Category[];
  };

  constructor() {
    this.memoryCache = {
      transactions: [],
      budgets: [],
      categories: []
    };
    this.userId = this.initializeUserId();
    this.settings = this.loadSettings();
    this.initializeDefaultData();
    this.isSupabaseConnected = this.settings.storageType === 'supabase';
  }

  // Private initialization methods
  private initializeUserId(): string {
    let userId = safeLocalStorage.getItem('expense_coin_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      safeLocalStorage.setItem('expense_coin_user_id', userId);
      console.log('New user initialized with ID:', userId);
    }
    return userId;
  }

  private loadSettings(): UserSettings {
    const savedSettings = safeLocalStorage.getItem(`user_settings_${this.userId}`);
    let settings: UserSettings;
    
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (e) {
        console.warn('Failed to parse settings, using defaults:', e);
        settings = { ...defaultSettings };
      }
    } else {
      settings = { ...defaultSettings };
      this.saveSettings(settings);
      console.log('Default settings initialized for user:', this.userId);
    }
    
    return settings;
  }

  private initializeDefaultData(): void {
    // Load existing data into memory cache
    this.loadDataToCache();
    
    // Only initialize categories if none exist
    if (this.memoryCache.categories.length === 0) {
      this.saveCategories(defaultCategories);
      console.log('Default categories initialized for user:', this.userId);
    }
    
    // Ensure clean transaction and budget lists exist
    if (this.memoryCache.transactions.length === 0) {
      this.saveTransactions([]);
      console.log('Clean transaction history initialized for user:', this.userId);
    }
    
    if (this.memoryCache.budgets.length === 0) {
      this.saveBudgets([]);
      console.log('Clean budget list initialized for user:', this.userId);
    }
  }

  private loadDataToCache(): void {
    // Load transactions
    const transactionsData = safeLocalStorage.getItem(`transactions_${this.userId}`);
    if (transactionsData) {
      try {
        this.memoryCache.transactions = JSON.parse(transactionsData);
      } catch (e) {
        console.warn('Failed to parse transactions:', e);
        this.memoryCache.transactions = [];
      }
    }
    
    // Load budgets
    const budgetsData = safeLocalStorage.getItem(`budgets_${this.userId}`);
    if (budgetsData) {
      try {
        this.memoryCache.budgets = JSON.parse(budgetsData);
      } catch (e) {
        console.warn('Failed to parse budgets:', e);
        this.memoryCache.budgets = [];
      }
    }
    
    // Load categories
    const categoriesData = safeLocalStorage.getItem(`categories_${this.userId}`);
    if (categoriesData) {
      try {
        this.memoryCache.categories = JSON.parse(categoriesData);
      } catch (e) {
        console.warn('Failed to parse categories:', e);
        this.memoryCache.categories = [];
      }
    }
  }

  // Public API methods
  getUserId(): string {
    return this.userId;
  }

  getSettings(): UserSettings {
    return { ...this.settings };
  }

  saveSettings(settings: UserSettings): void {
    this.settings = settings;
    safeLocalStorage.setItem(`user_settings_${this.userId}`, JSON.stringify(settings));
  }

  setCurrency(currency: string): void {
    this.settings.currency = currency;
    this.saveSettings(this.settings);
  }

  // Supabase connection management
  isConnectedToSupabase(): boolean {
    return this.isSupabaseConnected;
  }

  connectToSupabase(connected: boolean): void {
    this.isSupabaseConnected = connected;
    this.settings.storageType = connected ? 'supabase' : 'local';
    this.saveSettings(this.settings);
    
    if (connected) {
      console.log(`Connected to Supabase for user ${this.userId}. Data will now be synchronized.`);
      this.syncToSupabase();
    } else {
      console.log(`Disconnected from Supabase for user ${this.userId}. Data will be stored locally only.`);
    }
  }

  private syncToSupabase(): void {
    if (!this.isSupabaseConnected) return;
    
    const transactions = this.getTransactions();
    const budgets = this.getBudgets();
    const categories = this.getCategories();
    
    console.log(`Syncing to Supabase for user ${this.userId}:`, {
      transactions: transactions.length,
      budgets: budgets.length,
      categories: categories.length,
      userId: this.userId
    });
  }

  // Transaction management
  getTransactions(): Transaction[] {
    if (this.isSupabaseConnected) {
      console.log(`Fetching transactions from Supabase for user ${this.userId}`);
    }
    
    // Return from memory cache first, then try localStorage
    if (this.memoryCache.transactions.length > 0) {
      return [...this.memoryCache.transactions];
    }
    
    const data = safeLocalStorage.getItem(`transactions_${this.userId}`);
    if (data) {
      try {
        this.memoryCache.transactions = JSON.parse(data);
        return [...this.memoryCache.transactions];
      } catch (e) {
        console.warn('Failed to parse transactions:', e);
      }
    }
    return [];
  }

  saveTransactions(transactions: Transaction[]): void {
    this.memoryCache.transactions = [...transactions];
    const saved = safeLocalStorage.setItem(`transactions_${this.userId}`, JSON.stringify(transactions));
    
    if (!saved) {
      console.warn('Failed to save transactions to localStorage, keeping in memory');
    }
    
    if (this.isSupabaseConnected && hasSupabaseCredentials()) {
      syncTransactions(this.userId, transactions)
        .then(() => {
          safeLocalStorage.setItem('supabase_last_sync', new Date().toISOString());
        })
        .catch((err) => {
          console.warn('Failed to sync transactions to Supabase:', err);
        });
    }
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
    console.log(`Transaction added for user ${this.userId}:`, transaction.description);
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      transactions[index] = updatedTransaction;
      this.saveTransactions(transactions);
      console.log(`Transaction updated for user ${this.userId}:`, updatedTransaction.description);
    }
  }

  deleteTransaction(transactionId: string): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== transactionId);
    this.saveTransactions(filtered);
    console.log(`Transaction deleted for user ${this.userId}:`, transactionId);
  }

  // Budget management
  getBudgets(): Budget[] {
    if (this.isSupabaseConnected) {
      console.log(`Fetching budgets from Supabase for user ${this.userId}`);
    }
    
    if (this.memoryCache.budgets.length > 0) {
      return [...this.memoryCache.budgets];
    }
    
    const data = safeLocalStorage.getItem(`budgets_${this.userId}`);
    if (data) {
      try {
        this.memoryCache.budgets = JSON.parse(data);
        return [...this.memoryCache.budgets];
      } catch (e) {
        console.warn('Failed to parse budgets:', e);
      }
    }
    return [];
  }

  saveBudgets(budgets: Budget[]): void {
    this.memoryCache.budgets = [...budgets];
    const saved = safeLocalStorage.setItem(`budgets_${this.userId}`, JSON.stringify(budgets));
    
    if (!saved) {
      console.warn('Failed to save budgets to localStorage, keeping in memory');
    }
    
    if (this.isSupabaseConnected && hasSupabaseCredentials()) {
      syncBudgets(this.userId, budgets)
        .then(() => {
          safeLocalStorage.setItem('supabase_last_sync', new Date().toISOString());
        })
        .catch((err) => {
          console.warn('Failed to sync budgets to Supabase:', err);
        });
    }
  }

  addBudget(budget: Budget): void {
    const budgets = this.getBudgets();
    budgets.push(budget);
    this.saveBudgets(budgets);
    console.log(`Budget added for user ${this.userId}:`, budget.id);
  }

  // Category management
  getCategories(): Category[] {
    if (this.isSupabaseConnected) {
      console.log(`Fetching categories from Supabase for user ${this.userId}`);
    }
    
    if (this.memoryCache.categories.length > 0) {
      return [...this.memoryCache.categories];
    }
    
    const data = safeLocalStorage.getItem(`categories_${this.userId}`);
    if (data) {
      try {
        this.memoryCache.categories = JSON.parse(data);
        return [...this.memoryCache.categories];
      } catch (e) {
        console.warn('Failed to parse categories:', e);
      }
    }
    return [];
  }

  saveCategories(categories: Category[]): void {
    this.memoryCache.categories = [...categories];
    const saved = safeLocalStorage.setItem(`categories_${this.userId}`, JSON.stringify(categories));
    
    if (!saved) {
      console.warn('Failed to save categories to localStorage, keeping in memory');
    }
    
    if (this.isSupabaseConnected && hasSupabaseCredentials()) {
      syncCategories(this.userId, categories)
        .then(() => {
          safeLocalStorage.setItem('supabase_last_sync', new Date().toISOString());
        })
        .catch((err) => {
          console.warn('Failed to sync categories to Supabase:', err);
        });
    }
  }

  // Data management
  clearAllData(): void {
    safeLocalStorage.removeItem(`transactions_${this.userId}`);
    safeLocalStorage.removeItem(`budgets_${this.userId}`);
    safeLocalStorage.removeItem(`categories_${this.userId}`);
    
    // Clear memory cache
    this.memoryCache = {
      transactions: [],
      budgets: [],
      categories: []
    };
    
    // Reinitialize with clean data
    this.initializeDefaultData();
    
    if (this.isSupabaseConnected) {
      console.log(`Clearing and reinitializing Supabase data for user ${this.userId}`);
      this.syncToSupabase();
    }
    
    console.log(`All data cleared and reinitialized for user ${this.userId}`);
  }

  // Force refresh from localStorage (useful after page reload)
  refreshFromStorage(): void {
    this.loadDataToCache();
  }
}

// Create a singleton instance
export const storageManager = new StorageManager();
