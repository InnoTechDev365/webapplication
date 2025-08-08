import { useState, useEffect, useCallback } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';
import { setSupabaseCredentials, clearSupabaseCredentials, hasSupabaseCredentials } from '../supabaseClient';
import { testConnection } from '../remoteSync';


interface SupabaseConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  lastSyncTime: string | null;
}

export const useSupabaseAlt = () => {
  const [connectionState, setConnectionState] = useState<SupabaseConnectionState>({
    isConnected: storageManager.isConnectedToSupabase(),
    isLoading: false,
    lastSyncTime: localStorage.getItem('supabase_last_sync')
  });
  
  useEffect(() => {
    const checkConnection = () => {
      const isConnected = storageManager.isConnectedToSupabase();
      const lastSync = localStorage.getItem('supabase_last_sync');
      
      setConnectionState(prev => ({
        ...prev,
        isConnected,
        lastSyncTime: lastSync
      }));
    };
    
    checkConnection();
    
    // Check connection status periodically
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const connectToSupabase = useCallback(async (url: string, anonKey: string) => {
    setConnectionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Save credentials and verify connection
      setSupabaseCredentials(url, anonKey);
      const result = await testConnection();
      if (!result.ok) {
        throw result.error || new Error('Unable to connect to Supabase');
      }
      
      // Connect to Supabase and sync existing local data
      storageManager.connectToSupabase(true);
      
      // Sync all local data to Supabase
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      const settings = storageManager.getSettings();
      
      if (transactions.length > 0) storageManager.saveTransactions(transactions);
      if (budgets.length > 0) storageManager.saveBudgets(budgets);
      if (categories.length > 0) storageManager.saveCategories(categories);
      // Also sync settings
      // Note: settings sync is handled in storage via saveSettings; invoke to ensure upsert
      localStorage.setItem('supabase_last_sync', new Date().toISOString());
      
      setConnectionState({
        isConnected: true,
        isLoading: false,
        lastSyncTime: localStorage.getItem('supabase_last_sync')
      });
      
      toast.success('Successfully connected to your Supabase');
    } catch (error) {
      clearSupabaseCredentials();
      setConnectionState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to connect to Supabase. Check URL and anon key.');
    }
  }, []);

  const disconnectFromSupabase = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 300));
      
      storageManager.connectToSupabase(false);
      clearSupabaseCredentials();
      localStorage.removeItem('supabase_last_sync');
      
      setConnectionState({
        isConnected: false,
        isLoading: false,
        lastSyncTime: null
      });
      
      toast.success('Disconnected from Supabase - using local storage only');
    } catch (error) {
      setConnectionState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to disconnect from Supabase');
    }
  }, []);

  const syncData = useCallback(async () => {
    if (!connectionState.isConnected || !hasSupabaseCredentials()) return;
    
    try {
      // Sync process: push local snapshot up
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      
      storageManager.saveTransactions(transactions);
      storageManager.saveBudgets(budgets);
      storageManager.saveCategories(categories);
      
      const now = new Date().toISOString();
      localStorage.setItem('supabase_last_sync', now);
      
      setConnectionState(prev => ({ ...prev, lastSyncTime: now }));
      toast.success('Data synchronized with Supabase');
    } catch (error) {
      toast.error('Failed to sync data with Supabase');
    }
  }, [connectionState.isConnected]);

  return {
    isSupabaseConnected: connectionState.isConnected,
    isLoading: connectionState.isLoading,
    lastSyncTime: connectionState.lastSyncTime,
    connectToSupabase,
    disconnectFromSupabase,
    syncData
  };
};