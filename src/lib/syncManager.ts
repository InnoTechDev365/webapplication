/**
 * Unified Sync Manager with Auto-Recovery and Dual Storage
 * Provides robust synchronization between local storage and Supabase
 */

import { Transaction, Budget, Category, UserSettings } from './types';
import { getSupabaseClient, hasSupabaseCredentials, setSupabaseCredentials, clearSupabaseCredentials } from './supabaseClient';

// Sync status types
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline';

export interface SyncState {
  status: SyncStatus;
  lastSync: string | null;
  pendingChanges: number;
  error: string | null;
  isOnline: boolean;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  syncedAt?: string;
}

// Default user settings
const DEFAULT_SETTINGS: UserSettings = {
  currency: 'USD',
  language: 'en',
  storageType: 'local'
};

// Default categories (no demo transactions)
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'income-salary', name: 'Salary', color: '#10b981', type: 'income' },
  { id: 'income-freelance', name: 'Freelance', color: '#059669', type: 'income' },
  { id: 'income-investment', name: 'Investment', color: '#047857', type: 'income' },
  { id: 'income-other', name: 'Other Income', color: '#0d9488', type: 'income' },
  { id: 'expense-food', name: 'Food & Dining', color: '#ef4444', type: 'expense' },
  { id: 'expense-transport', name: 'Transportation', color: '#f97316', type: 'expense' },
  { id: 'expense-shopping', name: 'Shopping', color: '#eab308', type: 'expense' },
  { id: 'expense-entertainment', name: 'Entertainment', color: '#8b5cf6', type: 'expense' },
  { id: 'expense-utilities', name: 'Utilities', color: '#06b6d4', type: 'expense' },
  { id: 'expense-health', name: 'Health', color: '#ec4899', type: 'expense' },
  { id: 'expense-education', name: 'Education', color: '#6366f1', type: 'expense' },
  { id: 'expense-other', name: 'Other Expenses', color: '#78716c', type: 'expense' }
];

// Safe localStorage wrapper for cross-browser compatibility
const safeStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
    return null;
  },
  set: (key: string, value: string): boolean => {
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
  remove: (key: string): boolean => {
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

// Pending changes queue for offline support
interface PendingChange {
  id: string;
  type: 'transaction' | 'budget' | 'category' | 'settings';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class SyncManager {
  private userId: string;
  private settings: UserSettings;
  private syncState: SyncState;
  private pendingChanges: PendingChange[] = [];
  private memoryCache: {
    transactions: Transaction[];
    budgets: Budget[];
    categories: Category[];
  };
  private listeners: Set<(state: SyncState) => void> = new Set();
  private syncInterval: NodeJS.Timeout | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.memoryCache = {
      transactions: [],
      budgets: [],
      categories: []
    };
    this.syncState = {
      status: 'idle',
      lastSync: null,
      pendingChanges: 0,
      error: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    };
    
    this.userId = this.initializeUserId();
    this.settings = this.loadSettings();
    this.loadLocalData();
    this.loadPendingChanges();
    this.setupOnlineListener();
    
    // Auto-sync on startup if connected
    if (this.isConnected()) {
      this.autoSync();
    }
  }

  // Initialize user ID
  private initializeUserId(): string {
    let userId = safeStorage.get('expense_coin_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      safeStorage.set('expense_coin_user_id', userId);
    }
    return userId;
  }

  // Load settings from storage
  private loadSettings(): UserSettings {
    const saved = safeStorage.get(`user_settings_${this.userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse settings:', e);
      }
    }
    this.saveSettings(DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS };
  }

  // Load local data into memory cache
  private loadLocalData(): void {
    // Load transactions
    const txData = safeStorage.get(`transactions_${this.userId}`);
    if (txData) {
      try {
        this.memoryCache.transactions = JSON.parse(txData);
      } catch (e) {
        this.memoryCache.transactions = [];
      }
    }

    // Load budgets
    const budgetData = safeStorage.get(`budgets_${this.userId}`);
    if (budgetData) {
      try {
        this.memoryCache.budgets = JSON.parse(budgetData);
      } catch (e) {
        this.memoryCache.budgets = [];
      }
    }

    // Load categories (initialize defaults if none exist)
    const catData = safeStorage.get(`categories_${this.userId}`);
    if (catData) {
      try {
        this.memoryCache.categories = JSON.parse(catData);
      } catch (e) {
        this.memoryCache.categories = [];
      }
    }
    
    if (this.memoryCache.categories.length === 0) {
      this.memoryCache.categories = [...DEFAULT_CATEGORIES];
      this.saveLocalCategories();
    }
  }

  // Load pending changes from storage
  private loadPendingChanges(): void {
    const pending = safeStorage.get(`pending_changes_${this.userId}`);
    if (pending) {
      try {
        this.pendingChanges = JSON.parse(pending);
        this.updateSyncState({ pendingChanges: this.pendingChanges.length });
      } catch (e) {
        this.pendingChanges = [];
      }
    }
  }

  // Save pending changes to storage
  private savePendingChanges(): void {
    safeStorage.set(`pending_changes_${this.userId}`, JSON.stringify(this.pendingChanges));
    this.updateSyncState({ pendingChanges: this.pendingChanges.length });
  }

  // Setup online/offline listener
  private setupOnlineListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateSyncState({ isOnline: true });
        if (this.isConnected() && this.pendingChanges.length > 0) {
          this.processPendingChanges();
        }
      });
      window.addEventListener('offline', () => {
        this.updateSyncState({ isOnline: false, status: 'offline' });
      });
    }
  }

  // Update sync state and notify listeners
  private updateSyncState(updates: Partial<SyncState>): void {
    this.syncState = { ...this.syncState, ...updates };
    this.listeners.forEach(listener => listener(this.syncState));
  }

  // Subscribe to sync state changes
  subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get current sync state
  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  // Check if connected to Supabase
  isConnected(): boolean {
    return this.settings.storageType === 'supabase' && hasSupabaseCredentials();
  }

  // Get user ID
  getUserId(): string {
    return this.userId;
  }

  // Get settings
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  // Save settings
  saveSettings(settings: UserSettings): void {
    this.settings = settings;
    safeStorage.set(`user_settings_${this.userId}`, JSON.stringify(settings));
  }

  // Set currency
  setCurrency(currency: string): void {
    this.settings.currency = currency;
    this.saveSettings(this.settings);
  }

  // ==================== TRANSACTIONS ====================
  
  getTransactions(): Transaction[] {
    return [...this.memoryCache.transactions];
  }

  private saveLocalTransactions(): void {
    safeStorage.set(`transactions_${this.userId}`, JSON.stringify(this.memoryCache.transactions));
  }

  addTransaction(transaction: Transaction): void {
    this.memoryCache.transactions.unshift(transaction);
    this.saveLocalTransactions();
    
    if (this.isConnected()) {
      this.queueChange({
        id: transaction.id,
        type: 'transaction',
        action: 'create',
        data: transaction,
        timestamp: Date.now()
      });
      this.processPendingChanges();
    }
  }

  updateTransaction(updated: Transaction): void {
    const index = this.memoryCache.transactions.findIndex(t => t.id === updated.id);
    if (index !== -1) {
      this.memoryCache.transactions[index] = updated;
      this.saveLocalTransactions();
      
      if (this.isConnected()) {
        this.queueChange({
          id: updated.id,
          type: 'transaction',
          action: 'update',
          data: updated,
          timestamp: Date.now()
        });
        this.processPendingChanges();
      }
    }
  }

  deleteTransaction(id: string): void {
    this.memoryCache.transactions = this.memoryCache.transactions.filter(t => t.id !== id);
    this.saveLocalTransactions();
    
    if (this.isConnected()) {
      this.queueChange({
        id,
        type: 'transaction',
        action: 'delete',
        data: { id },
        timestamp: Date.now()
      });
      this.processPendingChanges();
    }
  }

  // ==================== BUDGETS ====================
  
  getBudgets(): Budget[] {
    return [...this.memoryCache.budgets];
  }

  private saveLocalBudgets(): void {
    safeStorage.set(`budgets_${this.userId}`, JSON.stringify(this.memoryCache.budgets));
  }

  addBudget(budget: Budget): void {
    this.memoryCache.budgets.push(budget);
    this.saveLocalBudgets();
    
    if (this.isConnected()) {
      this.queueChange({
        id: budget.id,
        type: 'budget',
        action: 'create',
        data: budget,
        timestamp: Date.now()
      });
      this.processPendingChanges();
    }
  }

  // ==================== CATEGORIES ====================
  
  getCategories(): Category[] {
    return [...this.memoryCache.categories];
  }

  private saveLocalCategories(): void {
    safeStorage.set(`categories_${this.userId}`, JSON.stringify(this.memoryCache.categories));
  }

  // ==================== SYNC OPERATIONS ====================
  
  private queueChange(change: PendingChange): void {
    // Remove any existing change for the same item
    this.pendingChanges = this.pendingChanges.filter(
      c => !(c.type === change.type && c.id === change.id)
    );
    this.pendingChanges.push(change);
    this.savePendingChanges();
  }

  private async processPendingChanges(): Promise<void> {
    if (!this.isConnected() || !this.syncState.isOnline || this.pendingChanges.length === 0) {
      return;
    }

    this.updateSyncState({ status: 'syncing' });

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client not available');

      // Process all pending changes
      const changes = [...this.pendingChanges];
      
      for (const change of changes) {
        try {
          await this.processChange(client, change);
          // Remove processed change
          this.pendingChanges = this.pendingChanges.filter(c => c.id !== change.id || c.timestamp !== change.timestamp);
        } catch (e) {
          console.warn(`Failed to process change: ${change.id}`, e);
        }
      }

      this.savePendingChanges();
      this.updateSyncState({
        status: 'success',
        lastSync: new Date().toISOString(),
        error: null
      });
      safeStorage.set('supabase_last_sync', new Date().toISOString());
      this.retryCount = 0;
      
    } catch (error: any) {
      console.error('Sync failed:', error);
      this.updateSyncState({
        status: 'error',
        error: error.message || 'Sync failed'
      });
      
      // Auto-retry with exponential backoff
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000;
        setTimeout(() => this.processPendingChanges(), delay);
      }
    }
  }

  private async processChange(client: any, change: PendingChange): Promise<void> {
    const tableName = change.type === 'transaction' ? 'transactions' : 
                      change.type === 'budget' ? 'budgets' : 
                      change.type === 'category' ? 'categories' : 'app_settings';

    if (change.action === 'delete') {
      await client.from(tableName).delete().eq('id', change.id);
    } else {
      const data = { ...change.data, app_user_id: this.userId };
      await client.from(tableName).upsert(data, { onConflict: 'id' });
    }
  }

  // Full sync with Supabase
  async fullSync(): Promise<SyncResult> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Supabase' };
    }

    if (!this.syncState.isOnline) {
      return { success: false, error: 'Device is offline' };
    }

    this.updateSyncState({ status: 'syncing' });

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client not available');

      // Push all local data
      const transactions = this.memoryCache.transactions.map(t => ({ ...t, app_user_id: this.userId }));
      const budgets = this.memoryCache.budgets.map(b => ({ ...b, app_user_id: this.userId }));
      const categories = this.memoryCache.categories.map(c => ({ ...c, app_user_id: this.userId }));

      if (transactions.length > 0) {
        await client.from('transactions').upsert(transactions, { onConflict: 'id' });
      }
      if (budgets.length > 0) {
        await client.from('budgets').upsert(budgets, { onConflict: 'id' });
      }
      if (categories.length > 0) {
        await client.from('categories').upsert(categories, { onConflict: 'id' });
      }

      // Clear pending changes after successful sync
      this.pendingChanges = [];
      this.savePendingChanges();

      const syncTime = new Date().toISOString();
      this.updateSyncState({
        status: 'success',
        lastSync: syncTime,
        error: null
      });
      safeStorage.set('supabase_last_sync', syncTime);

      return { success: true, syncedAt: syncTime };
    } catch (error: any) {
      this.updateSyncState({
        status: 'error',
        error: error.message || 'Sync failed'
      });
      return { success: false, error: error.message || 'Sync failed' };
    }
  }

  // Pull data from Supabase
  async pullFromSupabase(): Promise<SyncResult> {
    if (!this.isConnected()) {
      return { success: false, error: 'Not connected to Supabase' };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client not available');

      const [txResult, budgetResult, catResult] = await Promise.all([
        client.from('transactions').select('*').eq('app_user_id', this.userId),
        client.from('budgets').select('*').eq('app_user_id', this.userId),
        client.from('categories').select('*').eq('app_user_id', this.userId)
      ]);

      if (txResult.data) {
        this.memoryCache.transactions = txResult.data;
        this.saveLocalTransactions();
      }
      if (budgetResult.data) {
        this.memoryCache.budgets = budgetResult.data;
        this.saveLocalBudgets();
      }
      if (catResult.data && catResult.data.length > 0) {
        this.memoryCache.categories = catResult.data;
        this.saveLocalCategories();
      }

      return { success: true, syncedAt: new Date().toISOString() };
    } catch (error: any) {
      return { success: false, error: error.message || 'Pull failed' };
    }
  }

  // Auto-sync on timer
  private autoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // Sync every 5 minutes if connected
    this.syncInterval = setInterval(() => {
      if (this.isConnected() && this.syncState.isOnline) {
        this.processPendingChanges();
      }
    }, 5 * 60 * 1000);
  }

  // Connect to Supabase
  async connect(url: string, anonKey: string): Promise<SyncResult> {
    try {
      // Validate URL
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}`;
      }
      cleanUrl = cleanUrl.replace(/\/$/, '');

      if (!cleanUrl.includes('supabase.co') && !cleanUrl.includes('localhost')) {
        return { success: false, error: 'Invalid Supabase URL' };
      }

      const cleanKey = anonKey.trim();
      if (!cleanKey || cleanKey.length < 50) {
        return { success: false, error: 'Invalid anon key' };
      }

      // Save credentials
      setSupabaseCredentials(cleanUrl, cleanKey);

      // Verify tables exist
      const client = getSupabaseClient();
      if (!client) {
        clearSupabaseCredentials();
        return { success: false, error: 'Failed to create client' };
      }

      const requiredTables = ['app_settings', 'categories', 'transactions', 'budgets'];
      const missingTables: string[] = [];

      for (const table of requiredTables) {
        try {
          const { error } = await client.from(table).select('*').limit(1);
          if (error) missingTables.push(table);
        } catch {
          missingTables.push(table);
        }
      }

      if (missingTables.length > 0) {
        clearSupabaseCredentials();
        return { 
          success: false, 
          error: `Missing tables: ${missingTables.join(', ')}. Please run the setup SQL first.` 
        };
      }

      // Pull existing data from Supabase
      const [txResult, catResult] = await Promise.all([
        client.from('transactions').select('*').eq('app_user_id', this.userId),
        client.from('categories').select('*').eq('app_user_id', this.userId)
      ]);

      // Merge remote with local (prefer remote if exists)
      if (txResult.data && txResult.data.length > 0) {
        this.memoryCache.transactions = txResult.data;
        this.saveLocalTransactions();
      }
      if (catResult.data && catResult.data.length > 0) {
        this.memoryCache.categories = catResult.data;
        this.saveLocalCategories();
      }

      // Update settings
      this.settings.storageType = 'supabase';
      this.saveSettings(this.settings);

      // Push local data to Supabase
      await this.fullSync();

      // Start auto-sync
      this.autoSync();

      return { success: true, syncedAt: new Date().toISOString() };
    } catch (error: any) {
      clearSupabaseCredentials();
      return { success: false, error: error.message || 'Connection failed' };
    }
  }

  // Disconnect from Supabase
  disconnect(): void {
    clearSupabaseCredentials();
    this.settings.storageType = 'local';
    this.saveSettings(this.settings);
    this.pendingChanges = [];
    this.savePendingChanges();
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.updateSyncState({
      status: 'idle',
      lastSync: null,
      pendingChanges: 0,
      error: null
    });
  }

  // Clear all data
  clearAllData(): void {
    safeStorage.remove(`transactions_${this.userId}`);
    safeStorage.remove(`budgets_${this.userId}`);
    safeStorage.remove(`categories_${this.userId}`);
    
    this.memoryCache = {
      transactions: [],
      budgets: [],
      categories: [...DEFAULT_CATEGORIES]
    };
    
    this.saveLocalCategories();
    this.pendingChanges = [];
    this.savePendingChanges();
  }

  // Export all data as JSON
  exportData(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userId: this.userId,
      settings: this.settings,
      transactions: this.memoryCache.transactions,
      budgets: this.memoryCache.budgets,
      categories: this.memoryCache.categories
    }, null, 2);
  }

  // Import data from JSON
  importData(jsonString: string): SyncResult {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.transactions) {
        this.memoryCache.transactions = data.transactions;
        this.saveLocalTransactions();
      }
      if (data.budgets) {
        this.memoryCache.budgets = data.budgets;
        this.saveLocalBudgets();
      }
      if (data.categories && data.categories.length > 0) {
        this.memoryCache.categories = data.categories;
        this.saveLocalCategories();
      }
      if (data.settings) {
        this.settings = { ...this.settings, ...data.settings };
        this.saveSettings(this.settings);
      }

      // Sync to Supabase if connected
      if (this.isConnected()) {
        this.fullSync();
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Invalid JSON data' };
    }
  }

  // Refresh data from storage
  refresh(): void {
    this.loadLocalData();
    if (this.isConnected()) {
      this.pullFromSupabase();
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
