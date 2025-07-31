import { useState, useEffect, useCallback } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';

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
  
  const connectToSupabase = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Connect to Supabase and sync existing local data
      storageManager.connectToSupabase(true);
      
      // Sync all local data to Supabase
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      
      if (transactions.length > 0) storageManager.saveTransactions(transactions);
      if (budgets.length > 0) storageManager.saveBudgets(budgets);
      if (categories.length > 0) storageManager.saveCategories(categories);
      
      // Update last sync time
      const now = new Date().toISOString();
      localStorage.setItem('supabase_last_sync', now);
      
      setConnectionState({
        isConnected: true,
        isLoading: false,
        lastSyncTime: now
      });
      
      toast.success('Successfully connected to Supabase cloud storage');
    } catch (error) {
      setConnectionState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to connect to Supabase. Please try again.');
    }
  }, []);

  const disconnectFromSupabase = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      storageManager.connectToSupabase(false);
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
    if (!connectionState.isConnected) return;
    
    try {
      // Simulate sync process
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      
      // Save to simulate sync
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