
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
  }

  // Data storage methods
  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    if (this.isSupabaseConnected) {
      // Here would be the code to save to Supabase
      console.log('Saving transactions to Supabase');
    }
  }

  getTransactions(): Transaction[] {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }

  saveBudgets(budgets: Budget[]): void {
    localStorage.setItem('budgets', JSON.stringify(budgets));
    
    if (this.isSupabaseConnected) {
      // Here would be the code to save to Supabase
      console.log('Saving budgets to Supabase');
    }
  }

  getBudgets(): Budget[] {
    const data = localStorage.getItem('budgets');
    return data ? JSON.parse(data) : [];
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem('categories', JSON.stringify(categories));
    
    if (this.isSupabaseConnected) {
      // Here would be the code to save to Supabase
      console.log('Saving categories to Supabase');
    }
  }

  getCategories(): Category[] {
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
