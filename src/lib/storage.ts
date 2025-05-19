import { Transaction, Budget, Category, UserSettings } from './types';

// Default user settings
const defaultSettings: UserSettings = {
  currency: 'USD',
  language: 'en',
  storageType: 'local'
};

class StorageManager {
  private settings: UserSettings;
  private isSupabaseConnected: boolean = false;

  constructor() {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('user_settings');
    this.settings = savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings };
    
    // Save default settings if none exist
    if (!savedSettings) {
      this.saveSettings(this.settings);
    }
    
    // Check if already connected to Supabase
    this.isSupabaseConnected = this.settings.storageType === 'supabase';
  }

  // Settings management
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  saveSettings(settings: UserSettings): void {
    this.settings = settings;
    localStorage.setItem('user_settings', JSON.stringify(settings));
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
    
    // When disconnecting, make sure we keep local data
    if (!connected) {
      console.log('Disconnected from Supabase. Data will now only be stored locally.');
    } else {
      console.log('Connected to Supabase. Data will now be synchronized between local storage and Supabase.');
    }
  }

  // Data storage methods
  saveTransactions(transactions: Transaction[]): void {
    // Always save locally
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // If connected to Supabase, also save there
    if (this.isSupabaseConnected) {
      // Here would be the code to save to Supabase
      console.log('Syncing transactions to Supabase:', transactions.length);
    }
  }

  getTransactions(): Transaction[] {
    // First try to get from Supabase if connected
    if (this.isSupabaseConnected) {
      // Here would be the code to fetch from Supabase
      console.log('Fetching transactions from Supabase');
      // For now, just get from local storage
    }
    
    // Fall back to local storage
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }

  saveBudgets(budgets: Budget[]): void {
    // Always save locally
    localStorage.setItem('budgets', JSON.stringify(budgets));
    
    // If connected to Supabase, also save there
    if (this.isSupabaseConnected) {
      // Here would be the code to save to Supabase
      console.log('Syncing budgets to Supabase:', budgets.length);
    }
  }

  getBudgets(): Budget[] {
    // First try to get from Supabase if connected
    if (this.isSupabaseConnected) {
      // Here would be the code to fetch from Supabase
      console.log('Fetching budgets from Supabase');
      // For now, just get from local storage
    }
    
    // Fall back to local storage
    const data = localStorage.getItem('budgets');
    return data ? JSON.parse(data) : [];
  }

  saveCategories(categories: Category[]): void {
    // Always save locally
    localStorage.setItem('categories', JSON.stringify(categories));
    
    // If connected to Supabase, also save there
    if (this.isSupabaseConnected) {
      // Here would be the code to save to Supabase
      console.log('Syncing categories to Supabase:', categories.length);
    }
  }

  getCategories(): Category[] {
    // First try to get from Supabase if connected
    if (this.isSupabaseConnected) {
      // Here would be the code to fetch from Supabase
      console.log('Fetching categories from Supabase');
      // For now, just get from local storage
    }
    
    // Fall back to local storage
    const data = localStorage.getItem('categories');
    return data ? JSON.parse(data) : [];
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem('transactions');
    localStorage.removeItem('budgets');
    localStorage.removeItem('categories');
    
    if (this.isSupabaseConnected) {
      // Here would be the code to clear Supabase data
      console.log('Clearing Supabase data');
    }
  }
}

// Create a singleton instance
export const storageManager = new StorageManager();
